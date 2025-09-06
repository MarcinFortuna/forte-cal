import {Card, CardContent, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";
import EventForm from "@/components/forms/EventForm";


export default function NewEventPage() {
    return <div>
        <Card className="max-w-md mx-auto border-8 border-blue-200 shadow-2xl shadow-accent-foreground">
            <CardHeader>
                <CardTitle>New event</CardTitle>
            </CardHeader>
            <CardContent>
                <EventForm />
            </CardContent>
            <CardFooter>
            </CardFooter>
        </Card>
    </div>
}