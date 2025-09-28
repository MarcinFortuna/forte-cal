import {Button} from "@/components/ui/button";
import Link from "next/link";
import {CalendarPlus} from "lucide-react";
import {auth} from "@clerk/nextjs/server";
import {getEvents} from "@/server/actions/events";

export default async function EventsPage() {

    const {userId, redirectToSignIn} = await auth();

    if (!userId) return redirectToSignIn();

    const events = await getEvents(userId);

    return <section className="flex flex-col animate-fade-in items-center gap-16">
        <div className="flex gap-4 items-baseline">
            <h1 className="text-4xl xl:text-5xl font-black mb-6">
                Events
            </h1>
            <Button asChild
                    className="bg-blue-500 hover:bg-blue-400 text-white py-6 hover:scale-110 duration-500
                    border-b-4 border-blue-700 hover:border-blue-500 rounded-2xl shadow-accent-foreground text-2xl
                    font-black">
                <Link href="/events/new">
                    <CalendarPlus className="mr-4 size-7"/> Create event
                </Link>
            </Button>
        </div>
        {
            events.length > 0 ? events.map((el) => <p key={el.id}>{el.name}</p>) : "You don't have any events yet!"
        }
    </section>
};