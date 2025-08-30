import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)

    const eventType = evt.type

    if (eventType === "user.created") {
      console.log("Processing user.created");
      
      const { id, username, image_url } = evt.data;
      console.log("User data:", { id, username, image_url });

      if (!id) {
        console.error("Missing user ID in payload");
        return new Response("Missing user ID", { status: 400 });
      }

      try {
        const newUser = await db.user.create({
          data: {
            externalUserId: id,
            username: username || `user@${id}`,
            imageUrl: image_url || "",
          }
        });
        console.log("User created successfully in database:", newUser.id);
      } 
      catch (dbError) {
        console.error("Database error during user creation:", dbError);
        return new Response("Database error", { status: 500 });
      }
    }

    if (eventType === "user.updated") {
      console.log("Processing user.updated");
      
      const { id, username, image_url } = evt.data;
      console.log("Update data:", { id, username, image_url });

      if (!id) {
        console.error("Missing user ID in update payload");
        return new Response("Missing user ID", { status: 400 });
      }

      try {
        const currentUser = await db.user.findUnique({
          where: {
            externalUserId: id
          }
        });

        if (!currentUser) {
          console.error("User not found for update:", id);
          return new Response("User not found", { status: 404 });
        }

        console.log("Current user found:", currentUser.id);

        const updatedUser = await db.user.update({
          where: {
            externalUserId: id
          },
          data: {
            username: username || currentUser.username,
            imageUrl: image_url || currentUser.imageUrl
          }
        });
  
          console.log("User updated successfully:", updatedUser.id);
      } 
      catch (dbError) {
        console.error("Database error during user update:", dbError);
        return new Response("Database error", { status: 500 });
      }
    }

    if (eventType === "user.deleted") {
      console.log("Processing user.deleted");
      
      const { id } = evt.data;
      console.log("Delete data:", { id });
  
      if (!id) {
        console.error("Missing user ID in delete payload");
        return new Response("Missing user ID", { status: 400 });
      }

      try {
        await db.user.delete({
          where: {
            externalUserId: id
          }
        });
        console.log("User deleted successfully:", id);
      } 
      catch (dbError) {
        console.error("Database error during user deletion:", dbError);
        // Don't return error for delete as user might not exist in our DB
      }
    }

    return new Response('Webhook received', { status: 200 })
  } 
  catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}