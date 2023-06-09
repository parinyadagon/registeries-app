import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

import type { RegisterData } from "@/hooks/types/Event";

import sender from "@/lib/nodemailer";

const generateConfirmationCode = (): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  return code;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const { name, email } = req.body as RegisterData;

  const user = await prisma.user.findUnique({
    where: {
      email: email as string,
    },
    include: {
      status: true,
    },
  });

  const registered = user?.status.find((status) => status.event_id === id);

  if (registered) {
    return res.status(400).json({
      status: "error",
      message: "อีเมลนี้ลงทะเบียนเข้าร่วมกิจกรรมนี้แล้ว",
    });
  }

  const code = generateConfirmationCode();

  if (!user) {
    await prisma.user.create({
      data: {
        name,
        email,
        type: "USER",
        status: {
          create: {
            event_id: id as string,
            code_verify: code,
          },
        },
      },
    });

    sender(code, email);
  } else {
    await prisma.status.create({
      data: {
        event_id: id as string,
        code_verify: code,
        user_id: user.id,
      },
    });
  }

  res.status(200).json({
    status: "success",
    message: "ลงทะเบียนสำเร็จ ระบบได้ส่งรหัสสำหรับเข้าร่วมกิจกรรมที่อีเมล",
  });
}
