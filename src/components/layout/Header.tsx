"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Moon, Sun, User, LogOut } from "lucide-react"

export function Header() {
    const { theme, setTheme } = useTheme()
    const { data: session } = useSession()

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                    <span className="text-primary text-2xl">🌴</span>
                    <span className="hidden sm:inline-block">ArabTree</span>
                    <span className="sm:hidden">AT</span>
                </Link>
                <nav className="flex items-center gap-4">
                    <Link href="/tree" className="text-sm font-medium hover:text-primary transition-colors">
                        شجرة الأنساب
                    </Link>
                    <Link href="/search" className="text-sm font-medium hover:text-primary transition-colors">
                        البحث
                    </Link>
                    <Link href="/contribute" className="text-sm font-medium hover:text-primary transition-colors">
                        المساهمة
                    </Link>
                    <Link href="/verify" className="text-sm font-medium hover:text-primary transition-colors hidden md:inline-block">
                        المراجعة
                    </Link>
                    <Link href="/map" className="text-sm font-medium hover:text-primary transition-colors hidden md:inline-block">
                        الخريطة
                    </Link>
                </nav>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="rounded-full"
                    >
                        <Sun className="h-5 w-5 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>

                    {session ? (
                        <div className="flex items-center gap-2">
                            <span className="text-sm hidden md:inline-block text-muted-foreground mr-2">
                                {session.user?.name || session.user?.email}
                            </span>
                            <Button variant="outline" size="sm" onClick={() => signOut()}>
                                <LogOut className="h-4 w-4 ml-2" />
                                تسجيل خروج
                            </Button>
                        </div>
                    ) : (
                        <Button size="sm" onClick={() => signIn()}>
                            <User className="h-4 w-4 ml-2" />
                            تسجيل دخول
                        </Button>
                    )}
                </div>
            </div>
        </header>
    )
}
