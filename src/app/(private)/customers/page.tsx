"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { ArrowUp, CheckCircle2, Clock, Users } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DataTable } from "@/modules/crm/customers/components/data-table"
import { getCustomerColumns } from "@/modules/crm/customers/components/columns"
import {
  createCustomer,
  deleteCustomer,
  getCustomerStats,
  getCustomers,
  seedCustomersWithClient,
  updateCustomer,
} from "@/modules/crm/customers/services/customer-services"
import type { Customer } from "@/modules/crm/customers/services/types/customer-types"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [isSeedingCustomers, setIsSeedingCustomers] = useState(false)

  const refreshCustomers = useCallback(async () => {
    const list = await getCustomers()
    setCustomers(list)
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        await refreshCustomers()
      } catch (error) {
        console.error("Failed to load customers:", error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [refreshCustomers])

  const handleAddCustomer = useCallback(
    async (customer: Customer) => {
      await createCustomer(customer)
      await refreshCustomers()
    },
    [refreshCustomers],
  )

  const handleUpdateCustomer = useCallback(async (customer: Customer) => {
    await updateCustomer(customer)
    setCustomers((prev) =>
      prev.map((item) => (item.id === customer.id ? customer : item)),
    )
  }, [])

  const handleDeleteCustomer = useCallback(async (customerId: string) => {
    await deleteCustomer(customerId)
    setCustomers((prev) => prev.filter((item) => item.id !== customerId))
  }, [])

  const handleSeedCustomers = useCallback(async () => {
    try {
      setIsSeedingCustomers(true)
      const seeded = await seedCustomersWithClient()
      setCustomers(seeded)
    } catch (error) {
      console.error("Failed to seed customers:", error)
    } finally {
      setIsSeedingCustomers(false)
    }
  }, [])

  const columns = useMemo(
    () =>
      getCustomerColumns({
        onUpdateCustomer: handleUpdateCustomer,
        onDeleteCustomer: handleDeleteCustomer,
      }),
    [handleDeleteCustomer, handleUpdateCustomer],
  )

  const stats = getCustomerStats(customers)
  const getPercent = (value: number) =>
    stats.total > 0 ? Math.round((value / stats.total) * 100) : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading customers...</div>
      </div>
    )
  }

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col gap-2 px-4 md:px-6">
        <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground">
          A simple CRM list to track customer follow-ups, status, and priority.
        </p>
      </div>

      {/* Mobile view placeholder */}
      <div className="md:hidden px-4 md:px-6">
        <div className="flex items-center justify-center h-96 border rounded-lg bg-muted/20">
          <div className="text-center p-8">
            <h3 className="text-lg font-semibold mb-2">Customers Dashboard</h3>
            <p className="text-muted-foreground">
              Please use a larger screen to view the full customers interface.
            </p>
          </div>
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden h-full flex-1 flex-col space-y-6 px-4 md:px-6 md:flex">
        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Total Customers
                  </p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{stats.total}</span>
                    <span className="flex items-center gap-0.5 text-sm text-green-500">
                      <ArrowUp className="size-3.5" />
                      {getPercent(stats.done)}%
                    </span>
                  </div>
                </div>
                <div className="bg-secondary rounded-lg p-3">
                  <Users className="size-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Done
                  </p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{stats.done}</span>
                    <span className="flex items-center gap-0.5 text-sm text-green-500">
                      <ArrowUp className="size-3.5" />
                      {getPercent(stats.done)}%
                    </span>
                  </div>
                </div>
                <div className="bg-secondary rounded-lg p-3">
                  <CheckCircle2 className="size-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    In Progress
                  </p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-bold">
                      {stats.inProgress}
                    </span>
                    <span className="flex items-center gap-0.5 text-sm text-green-500">
                      <ArrowUp className="size-3.5" />
                      {getPercent(stats.inProgress)}%
                    </span>
                  </div>
                </div>
                <div className="bg-secondary rounded-lg p-3">
                  <Clock className="size-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Todo
                  </p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{stats.todo}</span>
                    <span className="flex items-center gap-0.5 text-sm text-orange-500">
                      <ArrowUp className="size-3.5" />
                      {getPercent(stats.todo)}%
                    </span>
                  </div>
                </div>
                <div className="bg-secondary rounded-lg p-3">
                  <CheckCircle2 className="size-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Management</CardTitle>
            <CardDescription>
              View, search, and manage customer records stored in Firestore.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={customers}
              columns={columns}
              onAddCustomer={handleAddCustomer}
              onSeedCustomers={handleSeedCustomers}
              isSeedingCustomers={isSeedingCustomers}
            />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
