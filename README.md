# Learning Nuxt Fetch

A small Nuxt project for learning how Nuxt loads data from an API. The examples use the public [Fake Store API](https://fakestoreapi.com/).

The project demonstrates:

- `$fetch` for a one-off HTTP request.
- `useFetch` for API data that Nuxt can load during server-side rendering (SSR).
- `useLazyFetch` for API data that should load after navigation.
- `useAsyncData` for custom and multiple async requests.
- `transform` for returning only the fields the UI needs.
- TypeScript types for API responses and smaller UI-specific objects.
- `pending`, `error`, and `refresh` states.

## Start the project

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## The API used here

```txt
GET https://fakestoreapi.com/products
GET https://fakestoreapi.com/products/categories
GET https://fakestoreapi.com/products/:id
```

A product returned by the API contains more information than a product card needs:

```ts
// types/Product.ts
export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
}
```

For a card, this project uses a smaller type:

```ts
// types/ProductPreview.ts
export interface ProductPreview {
  id: number
  title: string
  image: string
}
```

`Product` can be used where `ProductPreview` is expected because it contains `id`, `title`, and `image`, plus extra fields.

## `$fetch`

`$fetch` performs one HTTP request and returns a `Promise` with the response. It does **not** give you `pending`, `error`, cached data, or `refresh` by itself.

```ts
const products = await $fetch<Product[]>(
  'https://fakestoreapi.com/products'
)
```

Use `$fetch` inside an event handler, a composable, or a `useAsyncData` handler when you need full control of the request.

In this project, `$fetch` is used twice at once:

```ts
const [products, categories] = await Promise.all([
  $fetch<Product[]>('https://fakestoreapi.com/products'),
  $fetch<string[]>('https://fakestoreapi.com/products/categories'),
])
```

`Promise.all` starts both requests together. `products` becomes `Product[]`, while `categories` becomes `string[]`.

## `useFetch`

`useFetch` is Nuxt's data-fetching composable. It wraps `useAsyncData` and `$fetch` and provides reactive state:

```ts
const { data, pending, error, refresh } = await useFetch<Product[]>(url)
```

| Value | What it means |
| --- | --- |
| `data` | A Vue ref containing the response. In templates, Vue automatically unwraps it. |
| `pending` | `true` while the request is running. |
| `error` | Request error, or `null`/empty when successful. |
| `refresh` | A function that runs the request again. |

Example from `pages/products.vue`:

```ts
const { data: products } = await useFetch<Product[]>(
  'https://fakestoreapi.com/products'
)
```

`data: products` renames the returned `data` ref to `products`. The generic `<Product[]>` tells TypeScript that the API response is an array of full `Product` objects.

### `await useFetch`

On a page, use `await` when the page should wait for the request during SSR:

```ts
const { data: products } = await useFetch<Product[]>(url)
```

This lets Nuxt include the fetched data in the server-rendered page and avoids fetching the same initial data again in the browser.

### Client-only fetching

`pages/products-with-no-server.vue` uses:

```ts
const { pending, data: products } = useFetch<Product[]>(url, {
  server: false,
})
```

`server: false` means do not fetch during SSR. The browser fetches after the page is mounted, so a loading state is important.

## `useLazyFetch`

`useLazyFetch` is `useFetch` with `lazy: true`.

```ts
const { pending, data: products } = useLazyFetch<Product[]>(url)
```

It does not block route navigation while data is loading. The page can render immediately, then display a loading state until `pending` becomes false. See `pages/products-with-lazy.vue`.

Equivalent form:

```ts
const { pending, data: products } = useFetch<Product[]>(url, {
  lazy: true,
})
```

## `transform`: return smaller objects for the UI

The UI card needs only `id`, `title`, and `image`. `transform` can reduce the response before it is stored in `data`:

```ts
const { data: products, pending } = await useFetch<ProductPreview[]>(url, {
  transform: (products) =>
    products.map(({ id, title, image }) => ({ id, title, image })),
})
```

This is the version used in `pages/products-with-some-data.vue`.

The server still sends full product objects. The generic says that this page only uses the `ProductPreview` shape. After `transform`, `products.value` contains `ProductPreview[]`.

## `useAsyncData`

Use `useAsyncData` when the data work is more than a single URL fetch—for example, combining several requests or running custom async logic.

```ts
const { data, pending, error, refresh } = await useAsyncData(
  'unique-key',
  async () => {
    // Return the data for this key.
  }
)
```

### The key

The first argument is a cache key:

```ts
'product-info'
```

Use a stable, unique key for the data. Nuxt uses it to cache, share, hydrate, and refresh the async result.

### Fetch products and categories together

`composables/useProductsAndCategories.ts` uses `useAsyncData` to request two endpoints and returns one object:

```ts
{
  products: Product[]
  categories: string[]
}
```

That source shape is named `ProductInfo`:

```ts
export interface ProductInfo {
  products: Product[]
  categories: string[]
}
```

The UI result is named `ProductPreviewInfo`:

```ts
export interface ProductPreviewInfo {
  products: ProductPreview[]
  categories: string[]
}
```

### Transforming `useAsyncData` correctly

This project uses:

```ts
useAsyncData<ProductInfo, unknown, ProductPreviewInfo>(
  'product-info',
  async () => {
    // Returns ProductInfo
  },
  {
    transform: (productInfo: ProductInfo): ProductPreviewInfo => {
      // Receives ProductInfo and returns ProductPreviewInfo
    },
  }
)
```

The generic positions are:

| Position | Type | Purpose |
| --- | --- | --- |
| First | `ProductInfo` | The type returned by `async () => ...`; this is also the input to `transform`. |
| Second | `unknown` | The error-data type. It is a placeholder here because no custom error body is defined. |
| Third | `ProductPreviewInfo` | The type returned by `transform`; this is the final type of `productInfo.value`. |

Data flow:

```txt
Fake Store API → ProductInfo → transform → ProductPreviewInfo → components
```

Inside `transform`, each product is still a full `Product`:

```ts
transform: (productInfo: ProductInfo): ProductPreviewInfo => ({
  categories: productInfo.categories,
  products: productInfo.products.map((product: Product) => ({
    id: product.id,
    title: product.title,
    image: product.image,
  })),
})
```

After the transform, the page only receives the smaller preview products.

## Reusable composable

`useProductsAndCategories()` moves the multi-request code out of the page:

```ts
const { pending, error, productInfo, refresh } = useProductsAndCategories()
```

It returns:

| Value | Purpose |
| --- | --- |
| `pending` | Show a loading message while requests run. |
| `error` | Show an error message if either request fails. |
| `productInfo` | The final `ProductPreviewInfo` data. |
| `refresh` | Fetch both products and categories again. |

The page `pages/products-and-categories.vue` passes this data into `ProductSection` and `CategorySidebar`.

## Choosing the right tool

| Need | Use |
| --- | --- |
| One direct request in an event handler or custom function | `$fetch` |
| One endpoint with Nuxt SSR, cache, loading state, and refresh | `useFetch` |
| One endpoint that should not hold up navigation | `useLazyFetch` |
| Multiple requests or custom async logic with Nuxt state/caching | `useAsyncData` |

## Useful links

- [Nuxt data fetching documentation](https://nuxt.com/docs/getting-started/data-fetching)
- [Nuxt `useFetch` API](https://nuxt.com/docs/api/composables/use-fetch)
- [Nuxt `useAsyncData` API](https://nuxt.com/docs/api/composables/use-async-data)
