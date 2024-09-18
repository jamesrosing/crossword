import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return <div>Please sign in to view this page.</div>
  }

  return <div>Welcome, {session.user.name}!</div>
}