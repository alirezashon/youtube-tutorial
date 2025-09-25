import { revalidateTag } from 'next/cache'

export const FetchingHelloAPI = async () => {
  await fetch('http://localhost:3000/api/hello', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name: 'Alireza Akbari' }),
    next: revalidateTag('hello') ,

  })
}
