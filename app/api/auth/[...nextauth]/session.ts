import { getSession } from "next-auth/react"
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  res.send(JSON.stringify(session, null, 2))
}