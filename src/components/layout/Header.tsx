"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Moon, Sun, LogOut, Menu, Trophy, X } from "lucide-react"
import NotificationBell from "@/components/layout/NotificationBell"

const navLinks = [
    { href: "/tree", label: "شجرة الأنساب" },
    { href: "/search", label: "البحث" },
    { href: "/contribute", label: "المساهمة" },
    { href: "/map", label: "الخريطة" },
    { href: "/leaderboard", label: "المتصدرون", icon: Trophy },
]

export function Header() {
    const { theme, setTheme } = useTheme()
    const { data: session } = useSession()
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)
    const pathname = usePathname()

    const isActiveRoute = (href: string) => pathname === href || pathname.startsWith(href + "/")

    return (
        <>
            <header className="sticky top-0 z-50 w-full bg-transparent dark:bg-background/80 backdrop-blur-xl border-b border-border/40">
                <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            <span className="sr-only">القائمة</span>
                        </Button>
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl group">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary text-xl group-hover:scale-110 transition-transform">🌴</span>
                            <span className="hidden sm:inline-block font-heading tracking-tight">ArabTree</span>
                        </Link>
                    </div>

                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative text-sm font-medium px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${isActiveRoute(link.href)
                                    ? "text-primary bg-primary/5"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                    }`}
                            >
                                {link.icon && <link.icon className="w-3.5 h-3.5" />}
                                {link.label}
                                {isActiveRoute(link.href) && (
                                    <span className="absolute -bottom-[1px] left-2 right-2 h-0.5 bg-primary rounded-full" />
                                )}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-1.5">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="rounded-full w-9 h-9"
                        >
                            <Sun className="h-4 w-4 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">تبديل السمة</span>
                        </Button>

                        {session ? (
                            <div className="flex items-center gap-1.5">
                                <NotificationBell />
                                <Link href="/profile" className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground mr-1 hover:text-primary transition-colors px-2 py-1 rounded-lg hover:bg-muted/50">
                                    {session.user?.name}
                                </Link>
                                <Button variant="ghost" size="icon" onClick={() => signOut()} title="تسجيل خروج" className="rounded-full w-9 h-9">
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

                {/* Decorative bottom border */}
                <div className="h-px bg-gradient-to-l from-transparent via-primary/20 to-transparent" />
            </header>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <>
                    <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden" onClick={() => setIsMenuOpen(false)} />
                    <div className="fixed top-16 right-0 left-0 z-40 md:hidden">
                        <div className="mx-4 mt-2 rounded-xl glass shadow-lg overflow-hidden animate-fade-in-up">
                            <nav className="flex flex-col p-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActiveRoute(link.href)
                                            ? "bg-primary/10 text-primary font-semibold"
                                            : "hover:bg-muted text-foreground"
                                            }`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {link.icon && <link.icon className="w-4 h-4" />}
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
