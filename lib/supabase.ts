import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Question = {
  id: number
  question: string
  options: Array<{
    text: string
    score: number
  }>
  created_at: string
}

export type Submission = {
  id: number
  email: string
  total_score: number
  answers: Array<{
    questionId: number
    selectedOption: number
    score: number
  }>
  created_at: string
}
