import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/_lib/auth"
import { logger } from "@/app/_lib/logger"

export async function getUserIdFromSession(
  request: Request,
): Promise<string | null> {
  try {
    const session = await getServerSession({ req: request, ...authOptions })
    logger.log("User session:", session)
    const userId = session?.user?.id

    if (!userId) {
      logger.error("User ID is missing")
      return null
    }

    return userId
  } catch (error) {
    logger.error("Error retrieving user ID:", error)
    return null
  }
}
