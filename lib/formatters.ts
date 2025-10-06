export function formatEventDescription(durationInMinutes: number): string {
    const hours: number = Math.floor(durationInMinutes / 60);
    const minutes: number = durationInMinutes % 60;

    const minutesString: string = `${minutes} ${minutes > 1 ? "mins" : "min"}`;
    const hoursString: string = `${hours} ${hours > 1 ? "hours" : "hour"}`;

    if (hours === 0) return minutesString;
    if (minutes === 0) return hoursString;

    return `${hoursString} ${minutesString}`;
}