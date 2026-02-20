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
            <header className="sticky top-0 z-50 w-full bg-background/60 dark:bg-background/40 backdrop-blur-xl backdrop-saturate-150 border-b border-border/40 supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            <span className="sr-only">القائمة</span>
                        </Button>
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl group">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary text-xl group-hover:scale-110 transition-transform duration-300 shadow-sm shadow-primary/20">🌴</span>
                            <span className="hidden sm:inline-block font-heading tracking-tight text-foreground">ArabTree</span>
                        </Link>
                    </div>

                    <nav className="hidden md:flex items-center gap-1.5">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 group ${isActiveRoute(link.href)
                                    ? "text-primary bg-primary/10 shadow-sm shadow-primary/10"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                    }`}
                            >
                                {link.icon && <link.icon className="w-4 h-4 transition-transform group-hover:scale-110 duration-300" />}
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="rounded-full w-9 h-9 hover:bg-muted/80 transition-colors"
                        >
                            <Sun className="h-4 w-4 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">تبديل السمة</span>
                        </Button>

                        {session ? (
                            <div className="flex items-center gap-2">
                                <NotificationBell />
                                <Link href="/profile" className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground mr-1 hover:text-primary transition-colors px-3 py-1.5 rounded-full hover:bg-muted/50 font-medium">
                                    {session.user?.name}
                                </Link>
                                <Button variant="ghost" size="icon" onClick={() => signOut()} title="تسجيل خروج" className="rounded-full w-9 h-9 hover:bg-destructive/10 hover:text-destructive transition-colors">
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <Link href="/login">
                                <Button size="sm" className="rounded-full px-6 shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all hover:translate-y-[-1px]">
                                    تسجيل دخول
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden transition-opacity duration-300 ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={() => setIsMenuOpen(false)}
            />

            <div className={`fixed top-16 right-0 left-0 z-40 md:hidden transition-all duration-300 transform ${isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"}`}>
                <div className="mx-4 mt-2 rounded-2xl glass shadow-xl overflow-hidden border border-white/20 dark:border-white/10 bg-background/80 backdrop-blur-2xl">
                    <nav className="flex flex-col p-2 gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all active:scale-[0.98] ${isActiveRoute(link.href)
                                    ? "bg-primary/10 text-primary font-bold shadow-sm"
                                    : "hover:bg-muted/50 text-foreground font-medium"
                                    }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.icon && <link.icon className="w-5 h-5" />}
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </>
    )
}
