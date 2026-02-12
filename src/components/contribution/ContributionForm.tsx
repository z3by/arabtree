'use client'

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

export function ContributionForm() {
    const router = useRouter()
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

    async function onSubmit(data: ContributionFormValues) {
        try {
            const response = await fetch('/api/contributions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to submit')
            }

            toast.success('Contribution submitted successfully!')
            form.reset()
            router.refresh()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Something went wrong')
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Contribution Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="ADD_NODE">Add New Node</SelectItem>
                                    <SelectItem value="EDIT_NODE">Edit Existing Node</SelectItem>
                                    <SelectItem value="ADD_EVENT">Add Historical Event</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {form.watch('type') === 'ADD_NODE' && (
                    <FormField
                        control={form.control}
                        name="parentId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Parent Node ID</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter parent ID (e.g., from URL or Tree)" {...field} />
                                </FormControl>
                                <FormDescription>
                                    The ID of the parent node you are adding a child to.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {(form.watch('type') === 'EDIT_NODE') && (
                    <FormField
                        control={form.control}
                        name="nodeId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Target Node ID</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter node ID to edit" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name (English)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Adnan" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="nameAr"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name (Arabic)</FormLabel>
                                <FormControl>
                                    <Input placeholder="عدنان" {...field} className="font-arabic" dir="rtl" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Summary / Justification</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Explain your changes and provide sources..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">Submit Contribution</Button>
            </form>
        </Form>
    )
}
