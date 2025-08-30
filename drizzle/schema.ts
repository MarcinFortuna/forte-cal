import { boolean, index, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { DAYS_OF_WEEK_IN_ORDER } from "../constants";

const createdAt = timestamp("createdAt").notNull().defaultNow();
const updatedAt = timestamp("updatedAt").notNull().defaultNow().$onUpdate(() => new Date());

export const eventTable = pgTable(
    "events",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        name: text("name").notNull(),
        description: text("description"),
        durationInMinutes: integer("durationInMinutes").notNull(),
        clerkUserId: text("clerkUserId").notNull(),
        isActive: boolean("isActive").notNull().default(true),
        createdAt,
        updatedAt
    },
    table => ([
        index("clerkUserIdIndex").on(table.clerkUserId)
    ])
);

// Schedules: one per user, with timezones and timestamps

export const scheduleTable = pgTable(
    "schedules",
    {
       id: uuid("id").primaryKey().defaultRandom(),
       timezone: text("timezone").notNull(),
       clerkUserId: text("clerkUserId").notNull(),
       createdAt,
       updatedAt
    }
);

export const scheduleDayOfWeekEnum = pgEnum("day", DAYS_OF_WEEK_IN_ORDER);

export const scheduleAvailabilityTable = pgTable(
    "scheduleAvailabilities",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        scheduleId: uuid("scheduleId").notNull().references(() => scheduleTable.id, { onDelete: "cascade" }),
        startTime: text("startTime").notNull(),
        endTime: text("endTime").notNull(),
        dayOfWeek: scheduleDayOfWeekEnum("dayOfWeek").notNull()
    },
    table => ([
        index("scheduleIdIndex").on(table.scheduleId)
    ])
);

// Relationship: schedule table has a lot of availabilities
export const scheduleRelations = relations(scheduleTable, ({ many }) => ({
    availabilities: many(scheduleAvailabilityTable)
}));

// Reverse: each availability belongs to one schedule
export const scheduleAvailibilityRelations = relations(scheduleAvailabilityTable, ( {one} ) => ({
    schedule: one(scheduleTable, {
        fields: [scheduleAvailabilityTable.scheduleId],
        references: [scheduleTable.id]
    })
}));