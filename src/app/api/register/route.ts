import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password, role } = body

    console.log("Register body:", body) 
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 409 })
    }

    const hashedPassword = await hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role, 
      }
    })

    return NextResponse.json({ success: true, id: user.id }, { status: 201 })

  } catch (err: unknown) {
    console.error("REGISTER ERROR:", err) 
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
