import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  if (req.method === "GET") {
    const data = await prisma.event.findUnique({
      where: {
        id: id as string,
      },
    });

    res.status(200).json({
      status: "success",
      message: "สร้างกิจกรรมสำเร็จ",
      data: data,
    });
  }

  if (req.method === "DELETE") {
    await prisma.event.delete({ where: { id: id as string } });

    res.status(200).json({
      status: "success",
      message: "กิจกรรมถูกลบเรียบร้อยแล้ว",
    });
  }
}
