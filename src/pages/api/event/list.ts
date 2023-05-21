import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const email: string = req.body.email as string;

    if (!email) {
      res.status(400).json({
        status: "error",
        message: "Email is required",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      res.status(400).json({
        status: "error",
        message: "User not found",
      });
      return;
    }

    try {
      const events = await prisma.event.findMany({
        where: {
          user_id: user.id,
        },
      });

      res.status(200).json({
        status: "success",
        message: "Events retrieved successfully",
        data: events,
      });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
}
