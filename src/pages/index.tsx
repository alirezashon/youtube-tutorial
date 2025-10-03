import { ProductInterface } from '@/interfaces'
import { FetchProducts } from '@/services/hello'
import { useEffect, useState } from 'react'

const index = () => {
  const [products, setProducts] = useState<ProductInterface[]>([])

  useEffect(() => {
    const fetchMyData = async () => {
      await FetchProducts().then((result) => {
        if (result as ProductInterface[]) setProducts(result)
      })
    }
    fetchMyData()
  }, [])
  return (
    <div>
      {products?.map((product) => (
        <div className=''>{product.title}</div>
      ))}
    </div>
  )
}

export default index
