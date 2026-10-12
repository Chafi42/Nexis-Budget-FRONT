// client/types/transaction.ts

export type TransactionType = 'expense' | 'income'

export interface ApiTransaction {
  _id?: string
  id?: string
  title?: string
  merchant?: string
  description?: string
  category?: string
  paymentMethod?: string
  amount: number
  type?: TransactionType
  createdAt?: string
  date?: string
}

export interface FormattedTransaction {
  id: string
  date: string
  time: string
  merchant: string
  details: string
  category: string
  categoryColor: string
  categoryIcon: string
  paymentMethod: string
  paymentIcon: string
  amount: number
  type: TransactionType
}