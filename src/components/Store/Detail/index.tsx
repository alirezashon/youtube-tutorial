import { ProductInterface } from '@/interfaces'
import { useEffect, useRef, useState } from 'react'

interface ProductPageProps {
  product: ProductInterface
}

const ProductDetailPage = ({ product }: ProductPageProps) => {
  const testRef = useRef<HTMLInputElement | null>(null)
  const objRef = useRef<{ test: string }>({ test: 'testestring' })
  const [myStyle, setMyStyle] = useState<string>('bg-red-300')
  useEffect(() => {
    addEventListener('click', () => {
      setMyStyle('bg-blue-700')
    })
    addEventListener('resize', () => {
      setMyStyle('bg-yellow-200')
      console.warn(window.innerWidth)
    })
  })
  return (
    <div
      id='tesrefiiiii'
      className={`${myStyle} min-h-screen py-10 px-5 md:px-20`}
    >
      <input type='text' ref={testRef} />
      <div className='max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden'>
        <div className='grid md:grid-cols-2'>
          {/* تصاویر */}
          <div className='p-6 flex flex-col gap-4'>
            <img
              src={product.thumbnail}
              alt={product.title}
              className='w-full h-80 object-cover rounded-lg shadow-md'
            />
            <div className='flex gap-2 overflow-x-auto'>
              {product.images?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${product.title}-${i}`}
                  className='w-20 h-20 object-cover rounded-md hover:scale-110 transition-transform'
                />
              ))}
            </div>
          </div>

          {/* جزئیات محصول */}
          <div className='p-6 flex flex-col justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                {product.title}
              </h1>
              <p className='text-gray-600 mb-4'>{product.description}</p>

              <div className='space-y-2 text-sm'>
                <p>
                  <span className='font-semibold'>Category:</span>{' '}
                  {product.category}
                </p>
                <p>
                  <span className='font-semibold'>Brand:</span> {product.brand}
                </p>
                <p>
                  <span className='font-semibold'>SKU:</span> {product.sku}
                </p>
                <p>
                  <span className='font-semibold'>Weight:</span>{' '}
                  {product.weight}g
                </p>
                <p>
                  <span className='font-semibold'>Warranty:</span>{' '}
                  {product.warrantyInformation}
                </p>
                <p>
                  <span className='font-semibold'>Shipping:</span>{' '}
                  {product.shippingInformation}
                </p>
                <p>
                  <span className='font-semibold'>Availability:</span>{' '}
                  {product.availabilityStatus}
                </p>
                <p>
                  <span className='font-semibold'>Return Policy:</span>{' '}
                  {product.returnPolicy}
                </p>
              </div>
            </div>

            <div className='mt-6'>
              <p className='text-2xl font-bold text-green-600'>
                ${product.price}
              </p>
              <p className='text-sm text-gray-500 mb-2'>
                Discount: {product.discountPercentage}%
              </p>
              <button className='w-full mt-3 bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition'>
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Reviews */}
        {/* Reviews */}
        <div className='p-6 border-t mt-4'>
          <h2 className='text-xl font-semibold mb-2'>User Reviews</h2>
          {product.reviews?.length ? (
            <ul className='space-y-3'>
              {product.reviews.map((r: any, i: number) => (
                <li
                  key={i}
                  className='p-3 rounded-lg bg-gray-50 border border-gray-200 hover:shadow-sm transition'
                >
                  <p className='text-yellow-600 font-semibold'>
                    ⭐ {r.rating}/5
                  </p>
                  <p className='text-gray-800 mt-1'>{r.comment}</p>
                  <p className='text-sm text-gray-500 mt-1'>
                    — {r.reviewerName} ({new Date(r.date).toLocaleDateString()})
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-gray-500'>No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
