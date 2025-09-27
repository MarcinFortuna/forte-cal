"use server";
import {z} from "zod";
import {eventFormSchema} from "@/schema/events";
import {auth} from "@clerk/nextjs/server";
import {db} from "@/drizzle/db";
import {eventTable} from "@/drizzle/schema";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

export async function createEvent(
    unsafeData: z.infer<typeof eventFormSchema>
): Promise<void> {
    try {
        const {userId} = await auth();
        const {success, data} = eventFormSchema.safeParse(unsafeData);
        if (!userId || !success) throw new Error("Invalid data or user not authenticated!");

        db.insert(eventTable).values({...data, clerkUserId: userId});

    } catch (err: any) {
        throw new Error(`Failed to create event: ${err.message || err}`);
    } finally {
        revalidatePath("/events");
        redirect("/events");
    }
}