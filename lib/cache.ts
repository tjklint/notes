import type { Todo } from '@/types/database'

const todoCache = new Map<string, Todo>()

export function cacheTodos(todos: Todo[]) {
  for (const t of todos) todoCache.set(t.id, t)
}

export function getCachedTodo(id: string): Todo | null {
  return todoCache.get(id) ?? null
}
