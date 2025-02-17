import { db } from '../../../../utils/database';

async function findTypes() {
  return await db.selectFrom('types').selectAll().executeTakeFirst();
}

export async function GET() {
  const types = await findTypes();
  return Response.json(types);
}
