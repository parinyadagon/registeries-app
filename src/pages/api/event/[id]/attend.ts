import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
// import jwt from "jsonwebtoken";

// function getToken<T>(data: T) {
//   return jwt.sign({ data }, process.env.JWT_SECRET_KEY || "", {
//     expiresIn: "1d",
//   });
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const { code } = req.body;

  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "required event id",
    });
  }

  const data = await prisma.status.findUnique({
    where: {
      code_verify: code,
    },
  });

  if (!data) {
    return res.status(401).json({
      status: "error",
      message: "รหัสไม่ถูกต้อง",
    });
  }

  await prisma.status.update({
    where: {
      id: data.id,
    },
    data: {
      verify: true,
      status: "ATTEND",
    },
  });

  res.status(200).json({
    status: "successfully",
    message: `คุณได้เข้าร่วมกิจกรรมแล้ว`,
  });
}
