"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Moon, Sun, LogOut, Menu } from "lucide-react"
import NotificationBell from "@/components/layout/NotificationBell"

export function Header() {
    const { theme, setTheme } = useTheme()
    const { data: session } = useSession()
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b glass">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xl">🌴</span>
                        <span className="hidden sm:inline-block font-heading tracking-tight">ArabTree</span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/tree" className="text-sm font-medium hover:text-primary transition-colors">
                        شجرة الأنساب
                    </Link>
                    <Link href="/search" className="text-sm font-medium hover:text-primary transition-colors">
                        البحث
                    </Link>
                    <Link href="/contribute" className="text-sm font-medium hover:text-primary transition-colors">
                        المساهمة
                    </Link>
                    <Link href="/map" className="text-sm font-medium hover:text-primary transition-colors">
                        الخريطة
                    </Link>
                </nav>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="rounded-full w-9 h-9"
                    >
                        <Sun className="h-4 w-4 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>

                    {session ? (
                        <div className="flex items-center gap-2">
                            <NotificationBell />
                            <span className="text-sm hidden lg:inline-block text-muted-foreground mr-2">
                                {session.user?.name}
                            </span>
                            <Button variant="ghost" size="icon" onClick={() => signOut()} title="تسجيل خروج">
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button size="sm" className="rounded-full px-6">
                                تسجيل دخول
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t p-4 glass animate-in slide-in-from-top-5">
                    <nav className="flex flex-col gap-4">
                        <Link href="/tree" className="flex items-center p-2 rounded-md hover:bg-muted" onClick={() => setIsMenuOpen(false)}>
                            شجرة الأنساب
                        </Link>
                        <Link href="/search" className="flex items-center p-2 rounded-md hover:bg-muted" onClick={() => setIsMenuOpen(false)}>
                            البحث
                        </Link>
                        <Link href="/contribute" className="flex items-center p-2 rounded-md hover:bg-muted" onClick={() => setIsMenuOpen(false)}>
                            المساهمة
                        </Link>
                        <Link href="/map" className="flex items-center p-2 rounded-md hover:bg-muted" onClick={() => setIsMenuOpen(false)}>
                            الخريطة
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    )
}
