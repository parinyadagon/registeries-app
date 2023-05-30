import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const data = await prisma.event.findUnique({
    where: {
      id: id as string,
    },
  });

  res.status(200).json({
    status: "success",
    message: "Event retrieved successfully",
    data: data,
  });
}
