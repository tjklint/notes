'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/layout/Toast'
import type { Todo } from '@/types/database'

export function useTodos(parentId: string | null = null) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = useRef(createClient()).current
  const { toast } = useToast()

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
      .channel(`todos-${parentId ?? 'root'}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'todos' }, fetchTodos)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchTodos, supabase, parentId])

  async function createTodo(fields: Partial<Omit<Todo, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('todos').insert({ ...fields, user_id: user.id, parent_id: parentId })
    if (error) { toast('Failed to create todo', 'error'); return }
    toast('Todo created')
    await fetchTodos()
  }

  async function updateTodo(id: string, fields: Partial<Todo>) {
    const { error } = await supabase.from('todos').update({ ...fields, updated_at: new Date().toISOString() }).eq('id', id)
    if (error) { toast('Failed to update todo', 'error'); return }
    toast('Todo updated')
    await fetchTodos()
  }

  async function deleteTodo(id: string) {
    const { error } = await supabase.from('todos').delete().eq('id', id)
    if (error) { toast('Failed to delete todo', 'error'); return }
    toast('Todo deleted')
    await fetchTodos()
  }

  async function toggleComplete(todo: Todo) {
    setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t))
    const { error } = await supabase.from('todos').update({ completed: !todo.completed, updated_at: new Date().toISOString() }).eq('id', todo.id)
    if (error) {
      toast('Failed to update todo', 'error')
      setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, completed: todo.completed } : t))
      return
    }
    toast(todo.completed ? 'Marked incomplete' : 'Completed!')
    await fetchTodos()
  }

  return { todos, loading, createTodo, updateTodo, deleteTodo, toggleComplete, refresh: fetchTodos }
}
