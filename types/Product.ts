/**
 * Single Product type from Fake Store API
 * 
 * url: https://fakestoreapi.com/products
 */

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}