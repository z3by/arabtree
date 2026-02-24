import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'

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
        // Apply rate limiting
        const forwarded = request.headers.get('x-forwarded-for')
        const ip = request.ip || (forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1')

        const limitResult = await rateLimit(`registration_${ip}`, {
            limit: 5,
            windowMs: 15 * 60 * 1000, // 15 minutes
        })

        if (!limitResult.success) {
            return NextResponse.json(
                { error: 'لقد تجاوزت عدد محاولات التسجيل المسموح بها. يرجى المحاولة لاحقاً.' },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': limitResult.limit.toString(),
                        'X-RateLimit-Remaining': limitResult.remaining.toString(),
                        'X-RateLimit-Reset': limitResult.reset.toString(),
                    }
                }
            )
        }

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

        return NextResponse.json(user, {
            status: 201,
            headers: {
                'X-RateLimit-Limit': limitResult.limit.toString(),
                'X-RateLimit-Remaining': limitResult.remaining.toString(),
                'X-RateLimit-Reset': limitResult.reset.toString(),
            }
        })
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
