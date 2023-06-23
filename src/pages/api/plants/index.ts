import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { plantValidationSchema } from 'validationSchema/plants';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getPlants();
    case 'POST':
      return createPlant();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPlants() {
    const data = await prisma.plant
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'plant'));
    return res.status(200).json(data);
  }

  async function createPlant() {
    await plantValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.care_instruction?.length > 0) {
      const create_care_instruction = body.care_instruction;
      body.care_instruction = {
        create: create_care_instruction,
      };
    } else {
      delete body.care_instruction;
    }
    if (body?.reminder?.length > 0) {
      const create_reminder = body.reminder;
      body.reminder = {
        create: create_reminder,
      };
    } else {
      delete body.reminder;
    }
    const data = await prisma.plant.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
