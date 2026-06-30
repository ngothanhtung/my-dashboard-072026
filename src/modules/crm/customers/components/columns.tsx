"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

import {
  customerPriorities,
  customerStatuses,
} from "@/modules/crm/customers/services/customer-mock-data"
import type { Customer } from "@/modules/crm/customers/services/types/customer-types"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

interface CustomerColumnActions {
  onUpdateCustomer?: (customer: Customer) => void | Promise<void>
  onDeleteCustomer?: (customerId: string) => void | Promise<void>
}

const priorityColors: Record<string, string> = {
  urgent: "border-red-700 text-red-700 dark:text-red-400",
  high: "border-orange-500 text-orange-700 dark:text-orange-400",
  normal: "border-blue-500 text-blue-700 dark:text-blue-400",
  low: "border-gray-500 text-gray-700 dark:text-gray-400",
}

export function getCustomerColumns({
  onUpdateCustomer,
  onDeleteCustomer,
}: CustomerColumnActions = {}): ColumnDef<Customer>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px] cursor-pointer"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px] cursor-pointer"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Customer" />
      ),
      cell: ({ row }) => (
        <div className="w-[100px] font-medium">{row.getValue("id")}</div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        const name = row.getValue("name") as string
        return (
          <div className="flex space-x-2">
            <span className="max-w-[260px] truncate font-medium">{name}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "notes",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Notes" />
      ),
      cell: ({ row }) => {
        const notes = (row.getValue("notes") as string) ?? ""
        return (
          <div className="max-w-[420px] truncate text-muted-foreground">
            {notes || "—"}
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = customerStatuses.find(
          (option) => option.value === row.getValue("status"),
        )

        if (!status) return null

        return (
          <div className="flex w-[140px] items-center">
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{status.label}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "priority",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Priority" />
      ),
      cell: ({ row }) => {
        const priority = customerPriorities.find(
          (option) => option.value === row.getValue("priority"),
        )

        if (!priority) return null

        return (
          <div className="flex items-center">
            <Badge
              variant="outline"
              className={cn(
                "pl-2",
                priorityColors[priority.value] ?? "",
              )}
            >
              <span className="text-sm">{priority.label}</span>
            </Badge>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "createdDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created" />
      ),
      cell: ({ row }) => {
        const raw = row.getValue("createdDate") as string | undefined
        const date = raw ? new Date(raw) : null
        return (
          <div className="text-sm text-muted-foreground whitespace-nowrap">
            {date && !Number.isNaN(date.getTime())
              ? format(date, "MMM d, yyyy")
              : "—"}
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          onUpdateCustomer={onUpdateCustomer}
          onDeleteCustomer={onDeleteCustomer}
        />
      ),
    },
  ]
}

export const columns = getCustomerColumns()
