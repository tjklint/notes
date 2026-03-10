export interface Todo {
  id: string
  user_id: string
  title: string | null
  description: string | null
  due_date: string | null
  completed: boolean | null
  priority: 'low' | 'medium' | 'high' | null
  color: string | null
  tags: string[] | null
  parent_id: string | null
  position: number | null
  created_at: string
  updated_at: string
}

export interface Note {
  id: string
  user_id: string
  title: string | null
  content: string | null
  cover_image: string | null
  images: string[] | null
  created_at: string
  updated_at: string
}
