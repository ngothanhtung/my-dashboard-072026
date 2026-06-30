import {
  CheckCircle2,
  Circle,
  Clock,
  ChevronsUp,
  ChevronUp,
  Minus,
  ChevronDown,
  type LucideIcon,
} from "lucide-react"

import { customerSchema } from "./types/customer-types"

export const customerStatuses: Array<{
  value: "todo" | "in_progress" | "done"
  label: string
  icon: LucideIcon
}> = [
  {
    value: "todo",
    label: "Todo",
    icon: Circle,
  },
  {
    value: "in_progress",
    label: "In Progress",
    icon: Clock,
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCircle2,
  },
]

export const customerPriorities: Array<{
  value: "urgent" | "high" | "normal" | "low"
  label: string
  icon: LucideIcon
}> = [
  {
    label: "Urgent",
    value: "urgent",
    icon: ChevronsUp,
  },
  {
    label: "High",
    value: "high",
    icon: ChevronUp,
  },
  {
    label: "Normal",
    value: "normal",
    icon: Minus,
  },
  {
    label: "Low",
    value: "low",
    icon: ChevronDown,
  },
]

// Seed mock-data aligned with the Firestore collection shape.
const now = new Date("2026-01-15T09:00:00.000Z")
const daysAgo = (days: number) =>
  new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString()

const customersData = [
  {
    id: "CUST-1001",
    name: "Nguyen Van A",
    notes:
      "Enterprise lead from Acme Corp — interested in upgrading to the Growth plan next quarter.",
    status: "in_progress" as const,
    priority: "urgent" as const,
    createdDate: daysAgo(2),
  },
  {
    id: "CUST-1002",
    name: "Tran Thi B",
    notes: "Submitted pricing request, awaiting follow-up call.",
    status: "todo" as const,
    priority: "high" as const,
    createdDate: daysAgo(5),
  },
  {
    id: "CUST-1003",
    name: "Le Van C",
    notes: "Renewal signed for next 12 months. Send thank-you note.",
    status: "done" as const,
    priority: "normal" as const,
    createdDate: daysAgo(10),
  },
  {
    id: "CUST-1004",
    name: "Pham Thi D",
    notes: "Trial user evaluating the analytics dashboard.",
    status: "in_progress" as const,
    priority: "normal" as const,
    createdDate: daysAgo(7),
  },
  {
    id: "CUST-1005",
    name: "Hoang Van E",
    notes: "Requested demo for the engineering team.",
    status: "todo" as const,
    priority: "low" as const,
    createdDate: daysAgo(14),
  },
  {
    id: "CUST-1006",
    name: "Vo Thi F",
    notes: "Churned customer — follow up for win-back offer.",
    status: "in_progress" as const,
    priority: "high" as const,
    createdDate: daysAgo(3),
  },
  {
    id: "CUST-1007",
    name: "Do Van G",
    notes: "Partner introduction from existing referral network.",
    status: "done" as const,
    priority: "low" as const,
    createdDate: daysAgo(20),
  },
  {
    id: "CUST-1008",
    name: "Bui Thi H",
    notes: "VIP account — quarterly business review scheduled.",
    status: "in_progress" as const,
    priority: "urgent" as const,
    createdDate: daysAgo(1),
  },
]

export const customerMockData = customerSchema.array().parse(customersData)
