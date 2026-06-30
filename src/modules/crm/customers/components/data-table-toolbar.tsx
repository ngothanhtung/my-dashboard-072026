"use client"

import type { Table } from "@tanstack/react-table"
import { Database, RefreshCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  customerPriorities,
  customerStatuses,
} from "@/modules/crm/customers/services/customer-mock-data"
import type { Customer } from "@/modules/crm/customers/services/types/customer-types"
import { AddCustomerModal } from "./add-customer-modal"
import { DataTableViewOptions } from "./data-table-view-options"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  onAddCustomer?: (customer: Customer) => void | Promise<void>
  onSeedCustomers?: () => void | Promise<void>
  isSeedingCustomers?: boolean
}

export function DataTableToolbar<TData>({
  table,
  onAddCustomer,
  onSeedCustomers,
  isSeedingCustomers,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const handleStatusChange = (value: string) => {
    const column = table.getColumn("status")
    if (value === "all") {
      column?.setFilterValue(undefined)
    } else {
      column?.setFilterValue(value)
    }
  }

  const handlePriorityChange = (value: string) => {
    const column = table.getColumn("priority")
    if (value === "all") {
      column?.setFilterValue(undefined)
    } else {
      column?.setFilterValue(value)
    }
  }

  const statusFilter = table.getColumn("status")?.getFilterValue() as
    | string
    | undefined
  const priorityFilter = table.getColumn("priority")?.getFilterValue() as
    | string
    | undefined

  return (
    <div className="space-y-4">
      {/* Filter Section */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Select
            value={statusFilter || "all"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-full cursor-pointer">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="cursor-pointer">
                All Status
              </SelectItem>
              {customerStatuses.map((status) => (
                <SelectItem
                  key={status.value}
                  value={status.value}
                  className="cursor-pointer"
                >
                  <div className="flex items-center">
                    <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    {status.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={priorityFilter || "all"}
            onValueChange={handlePriorityChange}
          >
            <SelectTrigger className="w-full cursor-pointer">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="cursor-pointer">
                All Priorities
              </SelectItem>
              {customerPriorities.map((priority) => (
                <SelectItem
                  key={priority.value}
                  value={priority.value}
                  className="cursor-pointer"
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

      {/* Search and Actions Section */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Search customer name…"
            value={
              (table.getColumn("name")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="w-[200px] lg:w-[300px] cursor-text"
          />
          <Button
            variant="outline"
            onClick={() => table.resetColumnFilters()}
            className="px-3 cursor-pointer"
            disabled={!isFiltered}
          >
            <RefreshCcw className="h-4 w-4" />
            <span className="hidden lg:block">Reset Filters</span>
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={onSeedCustomers}
            disabled={!onSeedCustomers || isSeedingCustomers}
          >
            <Database className="h-4 w-4" />
            <span className="hidden lg:block">
              {isSeedingCustomers ? "Seeding..." : "Seed Data"}
            </span>
          </Button>
          <DataTableViewOptions table={table} />
          <AddCustomerModal onAddCustomer={onAddCustomer} />
        </div>
      </div>
    </div>
  )
}
