import { MyFirstInterface } from '@/interfaces'
import { isNumberValid } from '@/lib/testNumber'
import { useEffect } from 'react'

const PropsComponent: React.JSXElementConstructor<MyFirstInterface> = ({
  name,
  lastName,
  phone,
  age,
}) => {
  useEffect(() => {
    if (name.length > 3) alert(isNumberValid({number:age}))
  }, [])
  return (
    <div className='border-b-2 border-blue-300 mb-[100px] pb-20 '>
      {name + lastName}
      <p className='font-bold text-5xl underline underline-offset-8'>
        {' '}
        {phone}
      </p>
    </div>
  )
}

export default PropsComponent
