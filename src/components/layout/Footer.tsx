'use client';

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github, Twitter, Mail } from "lucide-react"

const quickLinks = [
    { href: "/tree", label: "شجرة الأنساب" },
    { href: "/search", label: "البحث" },
    { href: "/contribute", label: "المساهمة" },
    { href: "/map", label: "الخريطة" },
    { href: "/leaderboard", label: "المتصدرون" },
]

const resources = [
    { href: "/docs/PRD.md", label: "عن المشروع" },
    { href: "/docs/ARCHITECTURE.md", label: "الهيكلية" },
    { href: "/docs/ROADMAP.md", label: "خارطة الطريق" },
    { href: "/blog", label: "المدونة" },
]

const legal = [
    { href: "/privacy", label: "سياسة الخصوصية" },
    { href: "/terms", label: "شروط الاستخدام" },
]

export function Footer() {
    return (
        <footer className="relative mt-auto border-t border-border/40 bg-background/50 backdrop-blur-xl">
            {/* Decorative top gradient */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            <div className="container py-12 md:py-16 px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl group w-fit">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary text-2xl group-hover:scale-110 transition-transform duration-300">🌴</span>
                            <span className="font-heading tracking-tight">ArabTree</span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                            منصة رقمية لتوثيق الأنساب العربية، تربط الأجيال الحديثة بجذورها القبلية العريقة باستخدام أحدث التقنيات.
                        </p>
                        <div className="flex gap-3">
                            <Link href="https://twitter.com" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link href="https://github.com/z3by/arabtree" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                                <Github className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </Link>
                            <Link href="mailto:contact@arabtree.com" className="text-muted-foreground hover:text-primary transition-colors">
                                <Mail className="h-5 w-5" />
                                <span className="sr-only">Email</span>
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-base">روابط سريعة</h3>
                        <nav className="flex flex-col gap-2.5">
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all w-fit"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Resources & Legal */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-base">المصادر</h3>
                        <nav className="flex flex-col gap-2.5">
                            {resources.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all w-fit"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                        <div className="pt-4 mt-4 border-t border-border/40">
                            <nav className="flex flex-col gap-2.5">
                                {legal.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="text-xs text-muted-foreground hover:text-primary hover:translate-x-1 transition-all w-fit"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-base">النشرة البريدية</h3>
                        <p className="text-sm text-muted-foreground">
                            اشترك ليصلك جديد تحديثات شجرة الأنساب والمقالات التاريخية.
                        </p>
                        <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
                            <Input
                                type="email"
                                placeholder="بريدك الإلكتروني"
                                className="bg-background/50 border-primary/20 focus-visible:ring-primary/20"
                            />
                            <Button type="submit" className="w-full">
                                اشتراك
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground text-center md:text-right">
                        &copy; {new Date().getFullYear()} <span className="font-semibold text-primary">ArabTree</span>. جميع الحقوق محفوظة.
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        صنع بـ ❤️ لحفظ التراث العربي
                    </p>
                </div>
            </div>
        </footer>
    )
}
