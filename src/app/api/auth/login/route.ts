import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { AUTH_COOKIE_NAME, signAdminToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (typeof password !== "string" || !password) {
    return NextResponse.json({ error: "Contraseña requerida" }, { status: 400 });
  }

  const hashB64 = process.env.ADMIN_PASSWORD_HASH_B64;

  if (!hashB64) {
    return NextResponse.json(
      { error: "El servidor no tiene configurada una contraseña de administrador" },
      { status: 500 }
    );
  }

  const hash = Buffer.from(hashB64, "base64").toString("utf8");
  const isValid = await bcrypt.compare(password, hash);

  if (!isValid) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  const token = await signAdminToken();
  const response = NextResponse.json({ ok: true });

  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
