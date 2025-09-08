"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/ui/icons"
import { RichTextEditor } from "./rich-text-editor"
import { useNoteStore } from "@/lib/note-store"
import type { Note } from "@/lib/types"

interface NoteFormProps {
  note?: Note
  onClose: () => void
}

export function NoteForm({ note, onClose }: NoteFormProps) {
  const { addNote, updateNote } = useNoteStore()
  const [title, setTitle] = useState(note?.title || "")
  const [content, setContent] = useState(note?.content || "")
  const [tags, setTags] = useState<string[]>(note?.tags || [])
  const [tagInput, setTagInput] = useState("")
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null)

  // Auto-save functionality
  useEffect(() => {
    if (
      note &&
      (title !== note.title || content !== note.content || JSON.stringify(tags) !== JSON.stringify(note.tags))
    ) {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout)
      }

      const timeout = setTimeout(() => {
        updateNote(note.id, { title, content, tags })
      }, 1000) // Auto-save after 1 second of inactivity

      setAutoSaveTimeout(timeout)
    }

    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout)
      }
    }
  }, [title, content, tags, note, updateNote, autoSaveTimeout])

  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      return
    }

    const noteData = {
      title: title.trim() || "Untitled",
      content,
      tags,
      isPinned: note?.isPinned || false,
      color: note?.color,
    }

    if (note) {
      updateNote(note.id, noteData)
    } else {
      addNote(noteData)
    }

    onClose()
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icons.x className="h-4 w-4 mr-2" />
            Close
          </Button>
          <div className="flex items-center gap-2">
            {note && <span className="text-xs text-muted-foreground">Auto-saving...</span>}
            <Button onClick={handleSave}>
              <Icons.download className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* Title */}
        <div className="mb-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="text-xl font-semibold border-none shadow-none px-0 focus-visible:ring-0"
          />
        </div>

        {/* Tags */}
        <div className="mb-4">
          <div className="flex gap-2 mb-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag..."
              className="flex-1"
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            />
            <Button type="button" onClick={addTag} size="sm">
              Add Tag
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                {tag}
                <Icons.x className="ml-1 h-3 w-3" />
              </Badge>
            ))}
          </div>
        </div>

        {/* Rich Text Editor */}
        <RichTextEditor content={content} onChange={setContent} placeholder="Start writing your note..." />
      </div>
    </div>
  )
}
