export const DAYS_OF_WEEK_IN_ORDER = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday"
] as const;

export const PRIVATE_NAV_LINKS = [
    {imgUrl: "/assets/events.svg", route: "/events", label: "My events"},
    {imgUrl: "/assets/schedule.svg", route: "/schedule", label: "My schedule"},
    {imgUrl: "/assets/public.svg", route: "/book", label: "Public profile"}
] as const;