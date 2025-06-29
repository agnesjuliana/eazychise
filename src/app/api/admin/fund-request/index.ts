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
      res.status(200).json({ status: true, data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: "Failed to fetch funding requests" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
