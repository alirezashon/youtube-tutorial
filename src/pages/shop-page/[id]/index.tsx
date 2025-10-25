import ProductDetailPage from '@/components/Store/Detail'
import { ProductInterface } from '@/interfaces'
import { GetServerSideProps } from 'next'

interface ProductPageProps {
  product: ProductInterface | null
}

const Index = ({ product }: ProductPageProps) => {
  return (
    <div>
      {product ? (
        <ProductDetailPage product={product} />
      ) : (
        <p>Product not found.</p>
      )}
    </div>
  )
}

export default Index

export const getServerSideProps: GetServerSideProps<ProductPageProps> = async ({
  params,
}) => {
  const id = params?.id
  if (!id) {
    return { props: { product: null } }
  }

  try {
    const response = await fetch(`https://dummyjson.com/products/${id}`)
    const data = await response.json()

    return { props: { product: data } }
  } catch (error) {
    console.error('Fetch error:', error)
    return { props: { product: null } }
  }
}
