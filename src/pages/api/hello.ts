import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name?: string
  message?: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    console.warn(req.headers)
    if (req.headers['content-type']) {
      if (req.body['name']) res.status(200).json({ name: req.body.name })
      else res.status(200).json({ name: 'John Doe' })
    } else res.status(401).json({ message: 'headers not completed' })
  } else res.status(400).json({ message: 'method is not allowd' })
}
