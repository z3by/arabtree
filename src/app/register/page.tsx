"use client"

import * as React from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2, Mail, User } from "lucide-react"

export default function RegisterPage() {
    const router = useRouter()

    const [name, setName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [confirmPassword, setConfirmPassword] = React.useState("")
    const [error, setError] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError("")

        if (password !== confirmPassword) {
            setError("كلمات المرور غير متطابقة")
            return
        }

        if (password.length < 6) {
            setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل")
            return
        }

        setIsLoading(true)

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "فشل إنشاء الحساب")
                return
            }

            // Auto sign-in after successful registration
            const signInResult = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (signInResult?.error) {
                // Registration succeeded but sign-in failed, redirect to login
                router.push("/login")
            } else {
                router.push("/")
                router.refresh()
            }
        } catch {
            setError("حدث خطأ غير متوقع. حاول مرة أخرى.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
            <Card className="w-full max-w-md glass-card border-none shadow-xl">
                <CardHeader className="text-center space-y-2">
                    <div className="flex justify-center mb-2">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-3xl">🌴</span>
                    </div>
                    <CardTitle className="text-2xl font-bold">إنشاء حساب</CardTitle>
                    <CardDescription>أنشئ حسابك للمساهمة في توثيق الأنساب العربية</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="name">الاسم</Label>
                            <div className="relative">
                                <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="أحمد محمد"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    minLength={2}
                                    className="pr-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">البريد الإلكتروني</Label>
                            <div className="relative">
                                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="user@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    dir="ltr"
                                    className="pr-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">كلمة المرور</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                dir="ltr"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                                dir="ltr"
                            />
                        </div>

                        <Button type="submit" className="w-full h-11" disabled={isLoading}>
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "إنشاء الحساب"
                            )}
                        </Button>
                    </form>

                    <div className="text-center text-sm text-muted-foreground mt-6">
                        لديك حساب بالفعل؟{" "}
                        <Link href="/login" className="text-primary hover:underline font-medium">
                            تسجيل الدخول
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
