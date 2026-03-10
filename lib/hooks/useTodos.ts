'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Todo } from '@/types/database'

export function useTodos(parentId: string | null = null) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchTodos = useCallback(async () => {
    const query = supabase
      .from('todos')
      .select('*')
      .order('position', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false })

    if (parentId) {
      query.eq('parent_id', parentId)
    } else {
      query.is('parent_id', null)
    }

    const { data } = await query
    setTodos(data ?? [])
    setLoading(false)
  }, [parentId, supabase])

  useEffect(() => {
    fetchTodos()

    const channel = supabase
      .channel('todos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'todos' }, fetchTodos)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchTodos, supabase])

  async function createTodo(fields: Partial<Omit<Todo, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('todos').insert({ ...fields, user_id: user.id, parent_id: parentId })
  }

  async function updateTodo(id: string, fields: Partial<Todo>) {
    await supabase.from('todos').update({ ...fields, updated_at: new Date().toISOString() }).eq('id', id)
  }

  async function deleteTodo(id: string) {
    await supabase.from('todos').delete().eq('id', id)
  }

  async function toggleComplete(todo: Todo) {
    await updateTodo(todo.id, { completed: !todo.completed })
  }

  return { todos, loading, createTodo, updateTodo, deleteTodo, toggleComplete, refresh: fetchTodos }
}
