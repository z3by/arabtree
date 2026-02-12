export function Footer() {
    return (
        <footer className="border-t py-6 md:py-8 glass mt-auto">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 md:px-6">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Built by <a href="https://github.com/z3by" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4 hover:text-primary transition-colors">z3by</a>.
                        Source code is availabe on <a href="https://github.com/z3by/arabtree" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4 hover:text-primary transition-colors">GitHub</a>.
                    </p>
                </div>
                <p className="text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} <span className="font-semibold text-primary">ArabTree</span>. All rights reserved.
                </p>
            </div>
        </footer>
    )
}
