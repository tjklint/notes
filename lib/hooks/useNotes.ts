'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Note } from '@/types/database'

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchNotes = useCallback(async () => {
    const { data } = await supabase
      .from('notes')
      .select('*')
      .order('updated_at', { ascending: false })
    setNotes(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  async function createNote(fields: Partial<Omit<Note, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    const { data } = await supabase
      .from('notes')
      .insert({ ...fields, user_id: user.id })
      .select()
      .single()
    await fetchNotes()
    return data
  }

  async function updateNote(id: string, fields: Partial<Note>) {
    await supabase.from('notes').update({ ...fields, updated_at: new Date().toISOString() }).eq('id', id)
    await fetchNotes()
  }

  async function deleteNote(id: string) {
    await supabase.from('notes').delete().eq('id', id)
    await fetchNotes()
  }

  async function uploadImage(file: File): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    const ext = file.name.split('.').pop()
    const path = `${user.id}/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('note-images').upload(path, file)
    if (error) return null
    const { data } = supabase.storage.from('note-images').getPublicUrl(path)
    return data.publicUrl
  }

  return { notes, loading, createNote, updateNote, deleteNote, uploadImage, refresh: fetchNotes }
}

export function useNote(id: string) {
  const [note, setNote] = useState<Note | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('notes').select('*').eq('id', id).single().then(({ data }) => {
      setNote(data)
      setLoading(false)
    })
  }, [id, supabase])

  return { note, loading, setNote }
}
