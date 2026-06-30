"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

import {
  customerPriorities,
  customerStatuses,
} from "@/modules/crm/customers/services/customer-mock-data"
import type { Customer } from "@/modules/crm/customers/services/types/customer-types"

const NAME_MAX = 100
const NOTES_MAX = 500

interface AddCustomerModalProps {
  onAddCustomer?: (customer: Customer) => void | Promise<void>
  trigger?: React.ReactNode
}

const DEFAULT_FORM_STATE = {
  name: "",
  notes: "",
  status: "todo",
  priority: "normal",
}

export function AddCustomerModal({
  onAddCustomer,
  trigger,
}: AddCustomerModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState(DEFAULT_FORM_STATE)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const generateCustomerId = () => `CUST-${Date.now()}`

  const resetForm = () => {
    setFormData(DEFAULT_FORM_STATE)
    setErrors({})
  }

  const validate = (): string | null => {
    const name = formData.name.trim()
    if (!name) return "Name is required"
    if (name.length > NAME_MAX)
      return `Name must be at most ${NAME_MAX} characters`
    if (formData.notes.length > NOTES_MAX)
      return `Notes must be at most ${NOTES_MAX} characters`
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validate()
    if (validationError) {
      setErrors({ root: validationError })
      return
    }

    try {
      setIsSubmitting(true)
      setErrors({})

      const newCustomer: Customer = {
        id: generateCustomerId(),
        name: formData.name.trim(),
        notes: formData.notes,
        status: formData.status as Customer["status"],
        priority: formData.priority as Customer["priority"],
        createdDate: new Date().toISOString(),
      }

      await onAddCustomer?.(newCustomer)
      resetForm()
      setOpen(false)
    } catch (error) {
      setErrors({
        root:
          error instanceof Error ? error.message : "Failed to create customer",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    resetForm()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            type="button"
            variant="default"
            size="sm"
            className="cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Customer
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
          <DialogDescription>
            Create a new customer record. Only the name is required — status
            defaults to <strong>Todo</strong> and priority to{" "}
            <strong>Normal</strong>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.root ? (
            <p className="text-sm text-destructive">{errors.root}</p>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="customer-name">Customer Name *</Label>
            <Input
              id="customer-name"
              placeholder="Enter customer name…"
              value={formData.name}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, name: event.target.value }))
              }
              maxLength={NAME_MAX}
              className={errors.name ? "border-destructive" : undefined}
            />
            <p className="text-xs text-muted-foreground text-right">
              {formData.name.length}/{NAME_MAX}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer-notes">Notes</Label>
            <Textarea
              id="customer-notes"
              placeholder="Add notes about this customer…"
              value={formData.notes}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  notes: event.target.value,
                }))
              }
              maxLength={NOTES_MAX}
              rows={4}
            />
            <p className="text-xs text-muted-foreground text-right">
              {formData.notes.length}/{NOTES_MAX}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {customerStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      <div className="flex items-center">
                        <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                        {status.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer-priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {customerPriorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <div className="flex items-center">
                        <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                        {priority.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="cursor-pointer"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={isSubmitting}
            >
              <Plus className="w-4 h-4 mr-2" />
              {isSubmitting ? "Creating..." : "Create Customer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
