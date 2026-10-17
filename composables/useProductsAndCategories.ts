export default function useProductsAndCategories() {
    const { pending, error, refresh, data: productInfo } = useAsyncData<ProductInfo, unknown, ProductPreviewInfo>('product-info', async () => {
        const [products, categories] = await Promise.all([
            //  For Generating error use something like this:
            // $fetch<Product[]>('https://fakestoreapi.com/products2'),
            
            $fetch<Product[]>('https://fakestoreapi.com/products'),
            $fetch<string[]>('https://fakestoreapi.com/products/categories')
        ]);

        return {
            products,
            categories
        }
    }, {
        lazy: false,
        transform: (productInfo: ProductInfo) => {
            return {
                categories: productInfo.categories,
                products: productInfo.products.map((product: Product) => ({
                    id: product.id,
                    title: product.title,
                    image: product.image
                }))
            }
        }
    })

    return {
        pending,
        error,
        refresh,
        productInfo
    }
}