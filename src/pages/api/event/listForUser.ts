import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "GET") {
    try {
      const events = await prisma.event.findMany();
      res.status(200).json({
        status: "success",
        message: "Events retrieved successfully",
        data: events,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Something went wrong",
      });
    }
  }
}
