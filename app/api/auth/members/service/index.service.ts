import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse, NextRequest } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";

const MembersServices = () => {
  const post = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);

    // if (!session) {
    //   return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    // }

    // const cargo = (session.user as any).cargo;
    // if (cargo !== "SUPERADMIN" && cargo !== "ADMIN") {
    //   return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    // }

    const body = await req.json();
    const { email, password, tribo, ministry, name } = body;

    if (!email || !password || !tribo || !ministry || !name) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 },
      );
    }

    const existe = await prisma.user.findUnique({ where: { email } });
    if (existe) {
      return NextResponse.json(
        { error: "E-mail já cadastrado" },
        { status: 409 },
      );
    }

    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        tribo,
        cargo: "MEMBRO",
        ministry,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  };

  const get = async () => {
    const session = await getServerSession(authOptions);

    // if (!session) {
    //   return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    // }

    const members = await prisma.user.findMany();

    return NextResponse.json(members, { status: 200 });
  };

  const delUser = async (id: string) => {
    const session = await getServerSession(authOptions);

    // if (!session) {
    //   return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    // }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ message: "Membro deletado" }, { status: 200 });
  };

  return { post, get, delUser };
};

export default MembersServices;
