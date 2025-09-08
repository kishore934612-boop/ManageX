"use client"

import { useState, useMemo } from "react"
import { BottomNavigation } from "@/components/layout/bottom-navigation"
import { NoteCard } from "@/components/notes/note-card"
import { NoteForm } from "@/components/notes/note-form"
import { NoteFilters } from "@/components/notes/note-filters"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { useNoteStore } from "@/lib/note-store"
import type { Note } from "@/lib/types"

export default function NotesPage() {
  const { notes } = useNoteStore()
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | undefined>()
  const [searchQuery, setSearchQuery] = useState("")
  const [showPinned, setShowPinned] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        const stripHtml = (html: string) => {
          const tmp = document.createElement("div")
          tmp.innerHTML = html
          return tmp.textContent || tmp.innerText || ""
        }

        const matchesSearch =
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stripHtml(note.content).toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

        const matchesPinned = !showPinned || note.isPinned

        const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => note.tags.includes(tag))

        return matchesSearch && matchesPinned && matchesTags
      })
      .sort((a, b) => {
        // Sort by pinned first, then by updated date
        if (a.isPinned && !b.isPinned) return -1
        if (!a.isPinned && b.isPinned) return 1
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      })
  }, [notes, searchQuery, showPinned, selectedTags])

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setShowNoteForm(true)
  }

  const handleCloseForm = () => {
    setShowNoteForm(false)
    setEditingNote(undefined)
  }

  const pinnedCount = notes.filter((note) => note.isPinned).length
  const totalCount = notes.length

  if (showNoteForm) {
    return <NoteForm note={editingNote} onClose={handleCloseForm} />
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notes</h1>
            <p className="text-sm text-muted-foreground">
              {totalCount} notes{pinnedCount > 0 && `, ${pinnedCount} pinned`}
            </p>
          </div>
          <Button size="icon" className="rounded-full" onClick={() => setShowNoteForm(true)}>
            <Icons.plus className="h-5 w-5" />
          </Button>
        </header>

        <div className="space-y-4">
          <NoteFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            showPinned={showPinned}
            onShowPinnedChange={setShowPinned}
            selectedTags={selectedTags}
            onSelectedTagsChange={setSelectedTags}
          />

          {filteredNotes.length === 0 ? (
            <div className="text-center py-12">
              <Icons.notes className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No notes found</h3>
              <p className="text-muted-foreground mb-4">
                {notes.length === 0
                  ? "Create your first note to get started"
                  : "Try adjusting your filters or search query"}
              </p>
              {notes.length === 0 && (
                <Button onClick={() => setShowNoteForm(true)}>
                  <Icons.plus className="h-4 w-4 mr-2" />
                  Create Note
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredNotes.map((note) => (
                <NoteCard key={note.id} note={note} onEdit={handleEditNote} />
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
