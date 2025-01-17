// /* eslint-disable camelcase */
// import { clerkClient } from "@clerk/nextjs/server";
// import { WebhookEvent } from "@clerk/nextjs/server";
// import { headers } from "next/headers";
// import { NextResponse } from "next/server";
// import { Webhook } from "svix";

import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";

// export async function POST(req: Request) {
//     // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
//     const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

//     if (!WEBHOOK_SECRET) {
//         throw new Error(
//             "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
//         );
//     }

//     // Get the headers
//     const headerPayload = await headers();
//     const svix_id = headerPayload.get("svix-id");
//     const svix_timestamp = headerPayload.get("svix-timestamp");
//     const svix_signature = headerPayload.get("svix-signature");
//     console.log("svix id is ", svix_id);
//     console.log("svix timestamp is ", svix_timestamp);
//     console.log("svix signature is ", svix_signature);
//     // If there are no headers, error out
//     if (!svix_id || !svix_timestamp || !svix_signature) {
//         return new Response("Error occured -- no svix headers", {
//             status: 400,
//         });
//     }

//     // Get the body
//     const payload = await req.json();
//     const body = JSON.stringify(payload);

//     // Create a new Svix instance with your secret.
//     const wh = new Webhook(WEBHOOK_SECRET);

//     let evt: WebhookEvent;

//     // Verify the payload with the headers
//     try {
//         evt = wh.verify(body, {
//             "svix-id": svix_id,
//             "svix-timestamp": svix_timestamp,
//             "svix-signature": svix_signature,
//         }) as WebhookEvent;
//     } catch (err) {
//         console.error("Error verifying webhook:", err);
//         return new Response("Error occured", {
//             status: 400,
//         });
//     }

//     // Get the ID and type
//     const { id } = evt.data;
//     const eventType = evt.type;
//     console.log(
//         `Received webhook with ID ${id} and event type of ${eventType}`
//     );
//     console.log("Webhook payload:", body);

import { clerkClient } from "@clerk/nextjs/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error(
            "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
        );
    }

    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    console.log("Headers received:", {
        svix_id,
        svix_timestamp,
        svix_signature,
    });

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Missing Svix headers", { status: 400 });
    }

    const body = await req.text(); // Read the raw body

    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return new Response("Error verifying webhook", { status: 400 });
    }

    const { id } = evt.data;
    const eventType = evt.type;

    console.log(
        `Received webhook with ID ${id} and event type of ${eventType}`
    );
    console.log("Webhook payload:", evt);

    // return new Response("Webhook received", { status: 200 });
    // }

    //     // CREATE
    if (eventType === "user.created") {
        const {
            id,
            email_addresses,
            image_url,
            first_name,
            last_name,
            username,
        } = evt.data;

        const user = {
            clerkId: id,
            email: email_addresses[0].email_address,
            username: username!,
            firstName: first_name ?? "",
            lastName: last_name ?? "",
            photo: image_url,
        };

        const newUser = await createUser(user);

        // Set public metadata
        if (newUser) {
            const client = await clerkClient();
            await client.users.updateUserMetadata(id, {
                publicMetadata: {
                    userId: newUser._id,
                },
            });
        }

        return NextResponse.json({ message: "OK", user: newUser });
    }

    // UPDATE
    if (eventType === "user.updated") {
        const { id, image_url, first_name, last_name, username } = evt.data;

        const user = {
            firstName: first_name ?? "",
            lastName: last_name ?? "",
            username: username!,
            photo: image_url,
        };

        const updatedUser = await updateUser(id, user);

        return NextResponse.json({ message: "OK", user: updatedUser });
    }

    // DELETE
    if (eventType === "user.deleted") {
        const { id } = evt.data;

        const deletedUser = await deleteUser(id!);

        return NextResponse.json({ message: "OK", user: deletedUser });
    }

    console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
    console.log("Webhook body:", body);

    return new Response("", { status: 200 });
}

// import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
// import { headers } from "next/headers";
// import { NextResponse } from "next/server";
// import { Webhook } from "svix";
// import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";

// export async function POST(req: Request) {
//     const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

//     if (!WEBHOOK_SECRET) {
//         throw new Error(
//             "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
//         );
//     }

//     // Get headers for webhook verification
//     const headerPayload = await headers();
//     const svix_id = headerPayload.get("svix-id");
//     const svix_timestamp = headerPayload.get("svix-timestamp");
//     const svix_signature = headerPayload.get("svix-signature");

//     if (!svix_id || !svix_timestamp || !svix_signature) {
//         return new Response("Error: Missing required Svix headers", {
//             status: 400,
//         });
//     }

//     // Parse the request payload
//     const payload = await req.json();
//     const body = JSON.stringify(payload);

//     const wh = new Webhook(WEBHOOK_SECRET);

//     let evt: WebhookEvent;

//     try {
//         evt = wh.verify(body, {
//             "svix-id": svix_id,
//             "svix-timestamp": svix_timestamp,
//             "svix-signature": svix_signature,
//         }) as WebhookEvent;
//     } catch (err) {
//         console.error("Error verifying webhook:", err);
//         return new Response("Error verifying webhook", {
//             status: 400,
//         });
//     }

//     const { id } = evt.data;
//     const eventType = evt.type;

//     switch (eventType) {
//         case "user.created": {
//             const {
//                 id,
//                 email_addresses,
//                 image_url,
//                 first_name,
//                 last_name,
//                 username,
//             } = evt.data;

//             const user = {
//                 clerkId: id,
//                 email: email_addresses[0].email_address,
//                 username: username!,
//                 firstName: first_name ?? "", // Default to empty string if null
//                 lastName: last_name ?? "", // Default to empty string if null
//                 photo: image_url,
//             };

//             const newUser = await createUser(user);
//             if(newUser)
//             {
//                 await clerkClient.users.updateUserMetadata(id, {
//                     publicMetadata: {
//                         userId: newUser._id,
//                     },
//                 });
//             }
//             return NextResponse.json({
//                 message: "User created",
//                 user: newUser,
//             });
//         }

//         case "user.updated": {
//             const { id, image_url, first_name, last_name, username } = evt.data;

//             const user = {
//                 firstName: first_name ?? "", // Default to empty string if null
//                 lastName: last_name ?? "", // Default to empty string if null
//                 username: username!,
//                 photo: image_url,
//             };

//             const updatedUser = await updateUser(id, user);
//             return NextResponse.json({
//                 message: "User updated",
//                 user: updatedUser,
//             });
//         }

//         case "user.deleted": {
//             const deletedUser = await deleteUser(id!);
//             return NextResponse.json({
//                 message: "User deleted",
//                 user: deletedUser,
//             });
//         }

//         default:
//             console.log(`Unhandled event type: ${eventType}`);
//             return NextResponse.json({ message: "Unhandled event type" });
//     }
// }
