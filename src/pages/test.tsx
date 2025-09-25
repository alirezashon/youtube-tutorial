import PropsFC from '@/components/PropsComponent'
import { FetchingHelloAPI } from '@/services/hello'
import { useEffect } from 'react'

const test = () => {
  const myData = Array.from({ length: 50 }, () => {
    return { key: 'number1', value: 'test1' }
  })
  useEffect(() => {
    FetchingHelloAPI()
  }, [])

  return (
    <>
      <PropsFC
        age={4}
        name='Alireza Akbari'
        lastName=''
        phone={930}
        address='tehranpars'
      />
      <div className='bg-[rgba(192,222,56,0.75)] text-4xl text-blue-700 flex justify-around  items-center'>
        <div onClick={() => window.open('/')} className='text-red-500'>
          آموزش فرانت
        </div>
        <div
          className='bg-blue-400'
          onMouseEnter={() => (location.hash = '4fgd456')}
        >
          test next
        </div>
      </div>
      <div className='flex flex-col bg-yellow-100 text-orange-700'>
        {myData.map((item, index) =>
          index > 3 ? (
            <div key={index} className='hover:bg-yellow-200'>
              {index === 4 ? item.value : 'reza'}
            </div>
          ) : (
            'ali'
          )
        )}
      </div>
    </>
  )
}

export default test
