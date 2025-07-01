import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const data = await prisma.funding_request.findMany({
        include: {
          purchase: {
            include: {
              user: true,
            },
          },
        },
      });
      console.dir(data, { depth: null });
      console.log(JSON.stringify(data, null, 2));
      res.status(200).json({ status: true, data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: "Failed to fetch funding requests" });
    }
  } else if (req.method === "PATCH") {
  const { confirmation_status } = req.body;
  const { id } = req.query;

  try {
    const updated = await prisma.funding_request.update({
      where: { id: id as string },
      data: { confirmation_status },
    });

    return res.status(200).json({ status: true, data: updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Failed to update" });
  }
}else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
