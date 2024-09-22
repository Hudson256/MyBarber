import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/_lib/auth"
import { logger } from "@/app/_lib/logger"
import { db } from "@/app/_lib/prisma"

export async function getUserIdFromSession(
  request: Request,
): Promise<string | null> {
  try {
    const session = await getServerSession({ req: request, ...authOptions })
    logger.log("User session:", session)
    const email = session?.user?.email
    if (!email) {
      logger.error("User email is missing")
      return null
    }
    const user = await db.user.findUnique({
      where: { email: email },
      select: { id: true },
    })
    if (!user) {
      logger.error("User not found in the database")
      return null
    }
    return user.id
  } catch (error) {
    logger.error("Error retrieving user ID:", error)
    return null
  }
}
