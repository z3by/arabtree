import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const registerSchema = z.object({
    name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(100),
    email: z.string().email('بريد إلكتروني غير صالح'),
    password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل').max(100),
})

/**
 * POST /api/auth/register
 * Create a new user with email/password credentials.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const validated = registerSchema.parse(body)

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: validated.email },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'هذا البريد الإلكتروني مسجّل بالفعل' },
                { status: 409 }
            )
        }

        // Hash password
        const passwordHash = await bcrypt.hash(validated.password, 12)

        // Create user
        const user = await prisma.user.create({
            data: {
                name: validated.name,
                email: validated.email,
                passwordHash,
                role: 'VIEWER',
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        })

        return NextResponse.json(user, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.issues[0]?.message || 'بيانات غير صالحة' },
                { status: 400 }
            )
        }
        console.error('Registration error:', error)
        return NextResponse.json(
            { error: 'فشل إنشاء الحساب' },
            { status: 500 }
        )
    }
}
