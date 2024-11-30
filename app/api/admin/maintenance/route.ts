import { NextRequest, NextResponse } from "next/server";
import redis from "@/config/redis";
import { MaintenanceSchema } from "@/app/api/admin/maintenance/schema";

const MAINTENANCE_KEY = "admin:maintenance";

export const GET = async () => {
  const maintenance = await redis.get(MAINTENANCE_KEY);
  return NextResponse.json({ maintenance }, { status: 200 });
};

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { enabled } = MaintenanceSchema.parse(body);

    await redis.set(MAINTENANCE_KEY, enabled);

    return NextResponse.json({ maintenance: enabled }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
};
