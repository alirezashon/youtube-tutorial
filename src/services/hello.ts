import { revalidateTag } from 'next/cache'

export const FetchingHelloAPI = async () => {
  await fetch('http://localhost:3000/api/hello', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name: 'Alireza Akbari' }),
  })
}

export const FetchProducts = async () => {
  const response = await fetch('https://dummyjson.com/products', {
    method: 'GET',
    headers: { 'content-type': 'application/json' },
  })
  const data = await response.json()
  return data.products
}
