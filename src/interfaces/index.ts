export interface MyFirstInterface {
  name: string
  lastName: string
  phone: number
  age: number
  address?: string
  score?: number
  gender?: string
  products?: []
}
export interface ProductInterface {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  tags: string | number[]
  brand: string
  sku: string
  weight: number
  dimensions: string
  warrantyInformation: string
  shippingInformation: string
  availabilityStatus: string
  reviews: string[]
  returnPolicy: string
  minimumOrderQuantity: number
  meta: string
  images: string[]
  thumbnail: string
}
