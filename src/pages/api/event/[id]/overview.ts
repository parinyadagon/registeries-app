import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { Event, Status, User } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "required event id",
    });
  }

  const data = await prisma.event.findUnique({
    where: { id: id as string },
    include: {
      status_event: {
        include: {
          user: true,
        },
      },
    },
  });

  if (data) {
    interface Event_status extends Status {
      user: User;
    }

    const userAttend = data.status_event.filter(
      (status: Event_status) => status.status === "ATTEND"
    ).length;
    const userNotAttend = data.status_event.filter(
      (status: Event_status) => status.status === "NOT_ATTEND"
    ).length;
    const listUsers = data.status_event.map((status: Event_status) => {
      let status_thai: string;
      if (status.status === "ATTEND") {
        status_thai = "เข้าร่วม";
      } else {
        status_thai = "ยังไม่เข้าร่วม";
      }
      return {
        name: status.user.name,
        email: status.user.email,
        status: status_thai,
        code: status.code_verify,
      };
    });
    res.status(200).json({
      status: "successfully",
      message: "",
      data: {
        listUsers,
        userAttend,
        userNotAttend,
      },
    });
  }
}
