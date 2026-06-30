"use client"

import * as React from "react"
import type { Row } from "@tanstack/react-table"
import { MoreHorizontal, Trash2 } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import {
  customerSchema,
  type Customer,
} from "@/modules/crm/customers/services/types/customer-types"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  onUpdateCustomer?: (customer: Customer) => void | Promise<void>
  onDeleteCustomer?: (customerId: string) => void | Promise<void>
}

const NAME_MAX = 100
const NOTES_MAX = 500

export function DataTableRowActions<TData>({
  row,
  onUpdateCustomer,
  onDeleteCustomer,
}: DataTableRowActionsProps<TData>) {
  const parsed = customerSchema.safeParse(row.original)

  const [editOpen, setEditOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [draft, setDraft] = React.useState<Customer | null>(null)
  const [isSaving, setIsSaving] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  if (!parsed.success) {
    return null
  }

  const customer = parsed.data

  function openEditDialog() {
    setDraft(customer)
    setError(null)
    setEditOpen(true)
  }

  function openDeleteDialog() {
    setError(null)
    setDeleteOpen(true)
  }

  async function handleSaveEdit() {
    if (!draft) return

    const trimmedName = draft.name.trim()

    if (!trimmedName) {
      setError("Name is required")
      return
    }

    if (trimmedName.length > NAME_MAX) {
      setError(`Name must be at most ${NAME_MAX} characters`)
      return
    }

    if (draft.notes.length > NOTES_MAX) {
      setError(`Notes must be at most ${NOTES_MAX} characters`)
      return
    }

    try {
      setIsSaving(true)
      setError(null)
      const next: Customer = {
        ...draft,
        name: trimmedName,
        notes: draft.notes,
      }
      await onUpdateCustomer?.(next)
      setEditOpen(false)
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Failed to update customer",
      )
    } finally {
      setIsSaving(false)
    }
  }

  async function handleConfirmDelete() {
    try {
      setIsDeleting(true)
      setError(null)
      await onDeleteCustomer?.(customer.id)
      setDeleteOpen(false)
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete customer",
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted cursor-pointer"
          >
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={openEditDialog}
          >
            Edit Customer
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive"
            onClick={openDeleteDialog}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
            <DropdownMenuShortcut className="text-destructive">
              ⌘⌫
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Customer Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update the customer details and save them to Firestore.
            </DialogDescription>
          </DialogHeader>

          {draft ? (
            <div className="space-y-5">
              {error ? (
                <p className="text-sm text-destructive">{error}</p>
              ) : null}
              <div className="space-y-2">
                <Label htmlFor={`customer-name-${customer.id}`}>
                  Customer Name *
                </Label>
                <Input
                  id={`customer-name-${customer.id}`}
                  value={draft.name}
                  onChange={(event) =>
                    setDraft((current) =>
                      current
                        ? { ...current, name: event.target.value }
                        : current,
                    )
                  }
                  maxLength={NAME_MAX}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {draft.name.length}/{NAME_MAX}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`customer-notes-${customer.id}`}>Notes</Label>
                <Textarea
                  id={`customer-notes-${customer.id}`}
                  value={draft.notes}
                  onChange={(event) =>
                    setDraft((current) =>
                      current
                        ? { ...current, notes: event.target.value }
                        : current,
                    )
                  }
                  maxLength={NOTES_MAX}
                  rows={4}
                  placeholder="Add customer notes…"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {draft.notes.length}/{NOTES_MAX}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={draft.status}
                    onValueChange={(value) =>
                      setDraft((current) =>
                        current
                          ? {
                              ...current,
                              status: value as Customer["status"],
                            }
                          : current,
                      )
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
                  <Label>Priority</Label>
                  <Select
                    value={draft.priority}
                    onValueChange={(value) =>
                      setDraft((current) =>
                        current
                          ? {
                              ...current,
                              priority: value as Customer["priority"],
                            }
                          : current,
                      )
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {customerPriorities.map((priority) => (
                        <SelectItem
                          key={priority.value}
                          value={priority.value}
                        >
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
            </div>
          ) : null}

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setEditOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveEdit}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this customer?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <strong>{customer.name}</strong>{" "}
              from the customers collection. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : null}
          <AlertDialogFooter>
            <AlertDialogCancel
              className="cursor-pointer"
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
