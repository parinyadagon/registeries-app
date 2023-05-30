import type { NextApiRequest, NextApiResponse } from "next";
import type { Event } from "@/hooks/types/Event";

import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const event: Event = req.body;
    try {
      if (!event.email) {
        res.status(400).json({
          status: "error",
          message: "Email is required",
        });
        return;
      }

      const user = await prisma.user.findUnique({
        where: {
          email: event.email,
        },
      });

      if (!user) {
        res.status(400).json({
          status: "error",
          message: "User not found",
        });
        return;
      }

      if (!event.id) {
        await prisma.event.create({
          data: {
            name: event.name,
            description: event.description,
            limit_user: event.limit_user,
            period_start: event.period_start,
            period_end: event.period_end,
            status: event.status,
            user_id: user.id,
            image: event.image || "",
          },
        });
      } else {
        await prisma.event.update({
          where: {
            id: event.id,
          },
          data: {
            name: event.name,
            description: event.description,
            limit_user: event.limit_user,
            period_start: event.period_start,
            period_end: event.period_end,
            status: event.status,
            image: event.image || "",
          },
        });
      }

      res.status(200).json({
        status: "success",
        message: "Event created successfully",
      });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: error.message,
      });
      return;
    }
  }
}
