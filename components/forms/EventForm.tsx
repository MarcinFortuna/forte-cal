"use client";

import {useForm} from "react-hook-form";
import {z} from "zod";
import {eventFormSchema} from "@/schema/events";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Switch} from "@/components/ui/switch";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useTransition} from "react";
import {createEvent, deleteEvent, updateEvent} from "@/server/actions/events";
import {useRouter} from "next/navigation";

type TEvent = {
    id: string;
    name: string;
    description?: string;
    durationInMinutes: number;
    isActive: boolean;
}

interface EventFormProps {
    event?: TEvent;
}

export default function EventForm(props: EventFormProps) {
    const {event} = props;

    const router = useRouter();

    const defaultEvent: Partial<TEvent> = {
        isActive: true,
        description: "",
        name: "",
        durationInMinutes: 30
    }

    const form = useForm<z.infer<typeof eventFormSchema>>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: event ? {...event} : {...defaultEvent}
    });

    const [isDeletePending, startDeleteTransition] = useTransition();

    async function onSubmit(values: z.infer<typeof eventFormSchema>) {
        const action = event == null ? createEvent : updateEvent.bind(null, event.id);
        try {
            await action(values);
            router.push("/events");
        } catch (err: any) {
            form.setError("root", {
                message: `There was an error saving your event: ${err.message}`
            });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-6 flex-col">
                {form.formState.errors.root && <div className="text-destructive text-sm">
                    {form.formState.errors.root.message}
                </div>}
                <FormField control={form.control} name="name" render={({field}) => {
                    return <FormItem>
                        <FormLabel>Event Name</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormDescription>
                            The name users will see when booking
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>
                }}/>
                <FormField control={form.control} name="durationInMinutes" render={({field}) => {
                    return <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                            In minutes
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>
                }}/>
                <FormField control={form.control} name="description" render={({field}) => {
                    return <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea className="resize-none h-32" {...field} />
                        </FormControl>
                        <FormDescription>
                            Optional description of the event
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>
                }}/>
                <FormField control={form.control} name="isActive" render={({field}) => {
                    return <FormItem>
                        <FormLabel>Is active</FormLabel>
                        <div className="flex items-center gap-2">
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange}/>
                            </FormControl>
                            <FormLabel>Active</FormLabel>
                        </div>
                        <FormDescription>
                            Inactive events will not be visible for users to book
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>
                }}/>
                <div className="flex gap-2 justify-end">
                    {event && <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="cursor-pointer hover:scale-105" variant="destructive"
                                    disabled={isDeletePending || form.formState.isSubmitting}
                            >
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this event.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction disabled={isDeletePending || form.formState.isSubmitting}
                                                   className="bg-red-500 hover:bg-red-700 cursor-pointer"
                                                   onClick={() => {
                                                       startDeleteTransition(async () => {
                                                           try {
                                                               await deleteEvent(event.id);
                                                           } catch (err: any) {
                                                               form.setError("root", {
                                                                   message: `There was an error deleting your event: ${err.message}`
                                                               });
                                                           }
                                                       })
                                                   }}
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    }
                    <Button type="button" asChild variant="outline"
                            disabled={isDeletePending || form.formState.isSubmitting}
                    >
                        <Link href="/events">Cancel</Link>
                    </Button>
                    <Button disabled={isDeletePending || form.formState.isSubmitting} type="submit"
                            className="cursor-pointer hover:scale-105 bg-blue-400 hover:bg-blue-600"
                    >Save</Button>
                </div>
            </form>
        </Form>
    );
};