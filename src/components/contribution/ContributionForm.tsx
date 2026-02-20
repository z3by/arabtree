'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contributionSchema, type ContributionFormValues } from '@/lib/validations/contribution'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Check, ChevronLeft, ChevronRight, Loader2, Send } from 'lucide-react'

// ── Step definitions ──
const STEPS = [
    { id: 'type', title: 'نوع المساهمة', titleEn: 'Contribution Type' },
    { id: 'data', title: 'البيانات', titleEn: 'Data' },
    { id: 'review', title: 'المراجعة والإرسال', titleEn: 'Review & Submit' },
] as const

const contributionTypeLabels: Record<string, { ar: string; en: string; desc: string }> = {
    ADD_NODE: { ar: 'إضافة شخصية جديدة', en: 'Add New Node', desc: 'أضف شخصية أو فرع جديد إلى الشجرة' },
    EDIT_NODE: { ar: 'تعديل بيانات موجودة', en: 'Edit Existing Node', desc: 'صحّح أو أضف معلومات لشخصية موجودة' },
    ADD_EVENT: { ar: 'إضافة حدث تاريخي', en: 'Add Historical Event', desc: 'وثّق حدثاً تاريخياً مرتبطاً بالنسب' },
}

const nodeTypeLabels: Record<string, { ar: string; en: string }> = {
    ROOT: { ar: 'جذر', en: 'Root' },
    TRIBE: { ar: 'قبيلة', en: 'Tribe' },
    CLAN: { ar: 'عشيرة / بطن', en: 'Clan' },
    FAMILY: { ar: 'عائلة / فخذ', en: 'Family' },
    INDIVIDUAL: { ar: 'فرد', en: 'Individual' },
}

export function ContributionForm() {
    const router = useRouter()
    const [step, setStep] = useState(0)
    const [submitting, setSubmitting] = useState(false)

    const form = useForm<ContributionFormValues>({
        resolver: zodResolver(contributionSchema),
        defaultValues: {
            type: 'ADD_NODE',
            summary: '',
            name: '',
            nameAr: '',
            nodeType: 'INDIVIDUAL',
        },
    })

    const currentType = form.watch('type')

    async function onSubmit(data: ContributionFormValues) {
        setSubmitting(true)
        try {
            const response = await fetch('/api/contributions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'فشل إرسال المساهمة')
            }

            toast.success('تم إرسال مساهمتك بنجاح! ستتم مراجعتها قريباً.')
            form.reset()
            setStep(0)
            router.refresh()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'حدث خطأ ما')
        } finally {
            setSubmitting(false)
        }
    }

    const nextStep = async () => {
        // Validate current step fields before moving on
        if (step === 0) {
            const valid = await form.trigger(['type'])
            if (!valid) return
        }
        if (step === 1) {
            const valid = await form.trigger(['name', 'nameAr'])
            if (!valid) return
        }
        setStep((s) => Math.min(s + 1, STEPS.length - 1))
    }

    const prevStep = () => setStep((s) => Math.max(s - 1, 0))

    return (
        <div className="space-y-6">
            {/* ── Step Progress ── */}
            <div className="flex items-center justify-between mb-8">
                {STEPS.map((s, i) => (
                    <div key={s.id} className="flex items-center flex-1">
                        <div className="flex flex-col items-center flex-1">
                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
                                ${i < step ? 'bg-primary text-primary-foreground border-primary' : ''}
                                ${i === step ? 'border-primary text-primary bg-primary/10' : ''}
                                ${i > step ? 'border-muted text-muted-foreground' : ''}
                            `}>
                                {i < step ? <Check className="w-5 h-5" /> : i + 1}
                            </div>
                            <span className={`text-xs mt-1.5 font-medium ${i <= step ? 'text-primary' : 'text-muted-foreground'}`}>
                                {s.title}
                            </span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div className={`h-0.5 flex-1 mx-2 mt-[-20px] rounded ${i < step ? 'bg-primary' : 'bg-muted'}`} />
                        )}
                    </div>
                ))}
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* ──────── STEP 1: Contribution Type ──────── */}
                    {step === 0 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">نوع المساهمة</FormLabel>
                                        <div className="grid gap-3 pt-2">
                                            {Object.entries(contributionTypeLabels).map(([value, label]) => (
                                                <label
                                                    key={value}
                                                    className={`
                                                        flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all
                                                        ${field.value === value
                                                            ? 'border-primary bg-primary/5'
                                                            : 'border-muted hover:border-primary/30 hover:bg-muted/30'
                                                        }
                                                    `}
                                                >
                                                    <input
                                                        type="radio"
                                                        className="mt-1"
                                                        checked={field.value === value}
                                                        onChange={() => field.onChange(value)}
                                                    />
                                                    <div>
                                                        <div className="font-semibold">{label.ar}</div>
                                                        <div className="text-xs text-muted-foreground">{label.en}</div>
                                                        <div className="text-sm text-muted-foreground mt-1">{label.desc}</div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Target node selectors */}
                            {currentType === 'ADD_NODE' && (
                                <FormField
                                    control={form.control}
                                    name="parentId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>معرّف العقدة الأم</FormLabel>
                                            <FormControl>
                                                <Input placeholder="أدخل معرّف العقدة الأم" {...field} dir="ltr" />
                                            </FormControl>
                                            <FormDescription>
                                                يمكنك الحصول عليه من صفحة الشجرة أو البحث
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {currentType === 'EDIT_NODE' && (
                                <FormField
                                    control={form.control}
                                    name="nodeId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>معرّف العقدة المراد تعديلها</FormLabel>
                                            <FormControl>
                                                <Input placeholder="أدخل معرّف العقدة" {...field} dir="ltr" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>
                    )}

                    {/* ──────── STEP 2: Node Data ──────── */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* Node type selector */}
                            <FormField
                                control={form.control}
                                name="nodeType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>نوع العقدة</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="اختر نوع العقدة" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.entries(nodeTypeLabels).map(([value, label]) => (
                                                    <SelectItem key={value} value={value}>
                                                        {label.ar} — {label.en}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Names */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="nameAr"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>الاسم بالعربية *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="عدنان" {...field} dir="rtl" className="text-lg" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>الاسم بالإنجليزية *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Adnan" {...field} dir="ltr" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Birth / Death years */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="birthYear"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>سنة الميلاد (ميلادي)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="مثال: 1200"
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                                    dir="ltr"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="deathYear"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>سنة الوفاة (ميلادي)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="مثال: 1280"
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                                    dir="ltr"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Biography */}
                            <FormField
                                control={form.control}
                                name="biography"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>السيرة الذاتية</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="اكتب نبذة عن هذه الشخصية أو القبيلة..."
                                                className="min-h-[100px]"
                                                dir="rtl"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}

                    {/* ──────── STEP 3: Review & Submit ──────── */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* Summary */}
                            <FormField
                                control={form.control}
                                name="summary"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>ملخص المساهمة وتبريرها *</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="اشرح مساهمتك واذكر المصادر المرجعية..."
                                                className="min-h-[120px]"
                                                dir="rtl"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            اذكر المصادر التي تعتمد عليها (كتب، مخطوطات، روايات شفهية، فحوصات حمض نووي، إلخ)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Review Summary Card */}
                            <div className="p-4 rounded-lg border bg-muted/30 space-y-3">
                                <h3 className="font-semibold text-sm text-muted-foreground">ملخص المساهمة</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="text-muted-foreground">نوع المساهمة:</div>
                                    <div className="font-medium">{contributionTypeLabels[currentType]?.ar}</div>

                                    {form.watch('nameAr') && (
                                        <>
                                            <div className="text-muted-foreground">الاسم بالعربية:</div>
                                            <div className="font-medium">{form.watch('nameAr')}</div>
                                        </>
                                    )}
                                    {form.watch('name') && (
                                        <>
                                            <div className="text-muted-foreground">الاسم بالإنجليزية:</div>
                                            <div className="font-medium">{form.watch('name')}</div>
                                        </>
                                    )}
                                    {form.watch('nodeType') && (
                                        <>
                                            <div className="text-muted-foreground">نوع العقدة:</div>
                                            <div className="font-medium">{nodeTypeLabels[form.watch('nodeType') || '']?.ar}</div>
                                        </>
                                    )}
                                    {form.watch('birthYear') && (
                                        <>
                                            <div className="text-muted-foreground">سنة الميلاد:</div>
                                            <div className="font-medium">{form.watch('birthYear')} م</div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Navigation Buttons ── */}
                    <div className="flex items-center justify-between pt-4 border-t">
                        {step > 0 ? (
                            <Button type="button" variant="outline" onClick={prevStep} className="gap-2">
                                <ChevronRight className="w-4 h-4" />
                                السابق
                            </Button>
                        ) : <div />}

                        {step < STEPS.length - 1 ? (
                            <Button type="button" onClick={nextStep} className="gap-2">
                                التالي
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                        ) : (
                            <Button type="submit" disabled={submitting} className="gap-2">
                                {submitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                                إرسال المساهمة
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
        </div>
    )
}
