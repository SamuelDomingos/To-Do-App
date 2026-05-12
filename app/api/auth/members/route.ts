import { NextRequest } from "next/server";
import MembersServices from "./service/index.service";

export async function POST(req: NextRequest) {
  return MembersServices().post(req);
}

export async function GET() {
  return MembersServices().get();
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  return MembersServices().delUser(body.id);
}
