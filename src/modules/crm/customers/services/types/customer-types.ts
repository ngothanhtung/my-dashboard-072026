import { z } from "zod"

export const CUSTOMER_STATUSES = ["todo", "in_progress", "done"] as const
export const CUSTOMER_PRIORITIES = ["urgent", "high", "normal", "low"] as const

export const customerSchema = z.object({
  id: z.string(),
  name: z.string().max(100, "Name must be at most 100 characters"),
  notes: z.string().max(500, "Notes must be at most 500 characters"),
  status: z.enum(CUSTOMER_STATUSES),
  priority: z.enum(CUSTOMER_PRIORITIES),
  // Stored as ISO string so it can pass through Firestore round-tripping and zod validation.
  createdDate: z.string(),
})

export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number]
export type CustomerPriority = (typeof CUSTOMER_PRIORITIES)[number]

export type Customer = z.infer<typeof customerSchema>
