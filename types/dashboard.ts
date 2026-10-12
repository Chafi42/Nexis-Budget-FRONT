// client/types/dashboard.ts

export interface Transaction {
  _id: string
  title: string
  category: string
  amount: number
  type: string
  createdAt?: string
}

export interface Budget {
  _id: string
  category: string
  amount?: number
  limit?: number
}

export interface AuditLog {
  _id: string
  action?: string
  description?: string
  details?: string
  event?: string
  createdAt?: string
  timestamp?: string
  [key: string]: any
}