import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { careInstructionValidationSchema } from 'validationSchema/care-instructions';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.care_instruction
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getCareInstructionById();
    case 'PUT':
      return updateCareInstructionById();
    case 'DELETE':
      return deleteCareInstructionById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCareInstructionById() {
    const data = await prisma.care_instruction.findFirst(convertQueryToPrismaUtil(req.query, 'care_instruction'));
    return res.status(200).json(data);
  }

  async function updateCareInstructionById() {
    await careInstructionValidationSchema.validate(req.body);
    const data = await prisma.care_instruction.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteCareInstructionById() {
    const data = await prisma.care_instruction.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
