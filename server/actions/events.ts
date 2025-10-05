"use server";
import {z} from "zod";
import {eventFormSchema} from "@/schema/events";
import {auth} from "@clerk/nextjs/server";
import {db} from "@/drizzle/db";
import {eventTable} from "@/drizzle/schema";
import {revalidatePath} from "next/cache";
// import {redirect} from "next/navigation";
import {and, eq} from "drizzle-orm";

export async function createEvent(
    unsafeData: z.infer<typeof eventFormSchema>
): Promise<void> {
    try {
        const {userId} = await auth();
        const {success, data} = eventFormSchema.safeParse(unsafeData);
        if (!userId || !success) throw new Error("Invalid data or user not authenticated!");

        await db.insert(eventTable).values({...data, clerkUserId: userId});

    } catch (err: any) {
        throw new Error(`Failed to create event: ${err.message || err}`);
    } finally {
        revalidatePath("/events");
        // redirect("/events");
    }
}

export async function updateEvent(
    id: string,
    unsafeData: z.infer<typeof eventFormSchema>
): Promise<void> {
    try {
        const {userId} = await auth();
        const {success, data} = eventFormSchema.safeParse(unsafeData);
        if (!userId || !success) throw new Error("Invalid data or user not authenticated!");

        const {rowCount} = await db
            .update(eventTable)
            .set({...data})
            .where(and(eq(eventTable.id, id), eq(eventTable.clerkUserId, userId)));

        if (rowCount === 0) {
            throw new Error("Event not found or user not authorized to perform this action");
        }

    } catch (err: any) {
        throw new Error(`Failed to update event: ${err.message || err}`);
    } finally {
        revalidatePath("/events");
        // redirect("/events");
    }
}

export async function deleteEvent(id: string): Promise<void> {
    try {
        const {userId} = await auth();
        if (!userId) throw new Error("User not authenticated!");

        const {rowCount} = await db
            .delete(eventTable)
            .where(and(eq(eventTable.id, id), eq(eventTable.clerkUserId, userId)));

        if (rowCount === 0) {
            throw new Error("Event not found or user not authorized to perform this action");
        }

    } catch (err: any) {
        throw new Error(`Failed to update event: ${err.message || err}`);
    } finally {
        revalidatePath("/events");
        // redirect("/events");
    }
}

type EventRow = typeof eventTable.$inferSelect;

export async function getEvents(clerkUserId: string): Promise<EventRow[]> {
    const events = db.query.eventTable.findMany({
        where: ({ clerkUserId: userIdCol }, {eq}) => eq(userIdCol, clerkUserId),
        orderBy: ({name}, {asc, sql}) => asc(sql`lower(${name})`),
    });

    return events;
}

export async function getEvent(userId: string, eventId: string): Promise<EventRow | undefined> {
    const event = db.query.eventTable.findFirst({
        where: ({ id, clerkUserId }, { and, eq }) => and(eq(clerkUserId, userId), eq(id, eventId))
    });

    return event || undefined;
}