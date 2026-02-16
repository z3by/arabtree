import Link from "next/link"

const quickLinks = [
    { href: "/tree", label: "شجرة الأنساب" },
    { href: "/search", label: "البحث" },
    { href: "/contribute", label: "المساهمة" },
    { href: "/map", label: "الخريطة" },
    { href: "/leaderboard", label: "المتصدرون" },
]

export function Footer() {
    return (
        <footer className="relative mt-auto">
            {/* Decorative top gradient */}
            <div className="h-px bg-gradient-to-l from-transparent via-primary/20 to-transparent" />

            <div className="glass border-t-0 py-8 md:py-10">
                <div className="container px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                        {/* Brand */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 font-bold text-lg">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xl">🌴</span>
                                ArabTree
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                                منصة رقمية لتوثيق الأنساب العربية وربط الأجيال بجذورها التاريخية.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-sm">روابط سريعة</h3>
                            <nav className="flex flex-col gap-1.5">
                                {quickLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {/* Info */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-sm">المشروع</h3>
                            <div className="space-y-1.5 text-sm text-muted-foreground">
                                <p>
                                    بناء{" "}
                                    <a href="https://github.com/z3by" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4 hover:text-primary transition-colors">
                                        z3by
                                    </a>
                                </p>
                                <p>
                                    الكود متاح على{" "}
                                    <a href="https://github.com/z3by/arabtree" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4 hover:text-primary transition-colors">
                                        GitHub
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-2">
                        <p className="text-xs text-muted-foreground">
                            &copy; {new Date().getFullYear()} <span className="font-semibold text-primary">ArabTree</span>. All rights reserved.
                        </p>
                        <p className="text-xs text-muted-foreground">
                            حفظ التراث العربي للأجيال القادمة 🌿
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
