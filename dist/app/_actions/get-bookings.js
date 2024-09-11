"use server";
import { endOfDay, startOfDay } from "date-fns";
import { db } from "../_lib/prisma";
export const getBookings = ({ date }) => {
    return db.booking.findMany({
        where: {
            date: {
                lte: endOfDay(date),
                gte: startOfDay(date),
            },
        },
    });
};
