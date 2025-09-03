import { db } from "./db"

export const getRecommendedUsers = async () => {
    const users = await db.user.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });

    return users;
}