'use client'
import { useEffect, useState } from 'react' 
import { ProductInterface } from '@/interfaces'
import { FetchProducts } from '@/services/hello'
import { BsBasketFill } from 'react-icons/bs'
import HoverReveal from '@/components/HoverReveal'

const ProductGrid = () => {
  const [products, setProducts] = useState<ProductInterface[]>([])
  useEffect(() => {
    const fetchMyData = async () => {
      const result = await FetchProducts()
      if (result) setProducts(result)
    }
    fetchMyData()
  }, [])

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#0099A8] to-[#8a0099] p-6 flex flex-wrap justify-center gap-6'>
      {products.map((product, index) => (
        <div
          key={index}
          className='relative group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300 w-[280px] sm:w-[320px]'
        >
          {/* تخفیف */}
          {product.discountPercentage > 0 && (
            <div className='absolute top-3 left-3 bg-gradient-to-r from-pink-600 to-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md'>
              -{Math.round(product.discountPercentage)}%
            </div>
          )}

          {/* عکس */}
          <div className='relative w-full h-[280px] sm:h-[320px]'>
            <HoverReveal
              imageFront={`${product.images[1]}`}
              imageBack={`${product.thumbnail}`}
              slices={50}
              width='280px'
              height='320px'
            />
          </div>

          {/* توضیحات */}
          <div className='p-4 text-white'>
            <h3 className='font-semibold text-lg mb-2 line-clamp-1'>
              {product.title}
            </h3>
            <p className='text-sm text-gray-200 line-clamp-3 min-h-[40px] mb-3'>
              {product.description}
            </p>
            <div className='flex items-center justify-between'>
              <span className='text-xl font-bold text-yellow-300'>
                ${product.price}
              </span>
              <BsBasketFill
                className='text-2xl white'
                onClick={() => alert(product.price)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductGrid
