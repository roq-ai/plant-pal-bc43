import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { reminderValidationSchema } from 'validationSchema/reminders';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.reminder
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getReminderById();
    case 'PUT':
      return updateReminderById();
    case 'DELETE':
      return deleteReminderById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getReminderById() {
    const data = await prisma.reminder.findFirst(convertQueryToPrismaUtil(req.query, 'reminder'));
    return res.status(200).json(data);
  }

  async function updateReminderById() {
    await reminderValidationSchema.validate(req.body);
    const data = await prisma.reminder.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteReminderById() {
    const data = await prisma.reminder.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
