"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/ui/icons"
import { useNoteStore } from "@/lib/note-store"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { Note } from "@/lib/types"

interface NoteCardProps {
  note: Note
  onEdit: (note: Note) => void
}

const noteColors = [
  { name: "default", bg: "bg-card", border: "border-border" },
  { name: "yellow", bg: "bg-yellow-50", border: "border-yellow-200" },
  { name: "green", bg: "bg-green-50", border: "border-green-200" },
  { name: "blue", bg: "bg-blue-50", border: "border-blue-200" },
  { name: "purple", bg: "bg-purple-50", border: "border-purple-200" },
  { name: "pink", bg: "bg-pink-50", border: "border-pink-200" },
]

export function NoteCard({ note, onEdit }: NoteCardProps) {
  const { deleteNote, togglePin, updateNote } = useNoteStore()
  const [showActions, setShowActions] = useState(false)

  const getColorClasses = (colorName?: string) => {
    const color = noteColors.find((c) => c.name === colorName) || noteColors[0]
    return `${color.bg} ${color.border}`
  }

  const stripHtml = (html: string) => {
    const tmp = document.createElement("div")
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ""
  }

  const getPreview = (content: string) => {
    const text = stripHtml(content)
    return text.length > 150 ? text.substring(0, 150) + "..." : text
  }

  const changeColor = (colorName: string) => {
    updateNote(note.id, { color: colorName })
    setShowActions(false)
  }

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-md cursor-pointer relative group",
        getColorClasses(note.color),
      )}
      onClick={() => onEdit(note)}
    >
      {note.isPinned && (
        <div className="absolute top-2 right-2 z-10">
          <Icons.pin className="h-4 w-4 text-primary fill-current" />
        </div>
      )}

      <div
        className="absolute top-2 right-8 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowActions(!showActions)}>
          <Icons.more className="h-3 w-3" />
        </Button>

        {showActions && (
          <div className="absolute right-0 top-6 bg-popover border border-border rounded-lg shadow-lg p-2 min-w-[120px]">
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start h-8 text-xs"
                onClick={() => {
                  togglePin(note.id)
                  setShowActions(false)
                }}
              >
                <Icons.pin className="h-3 w-3 mr-2" />
                {note.isPinned ? "Unpin" : "Pin"}
              </Button>

              <div className="flex gap-1 p-1">
                {noteColors.map((color) => (
                  <button
                    key={color.name}
                    className={cn(
                      "w-4 h-4 rounded-full border-2",
                      color.bg,
                      color.border,
                      note.color === color.name && "ring-2 ring-primary",
                    )}
                    onClick={() => changeColor(color.name)}
                    title={`Change to ${color.name}`}
                  />
                ))}
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start h-8 text-xs text-destructive hover:text-destructive"
                onClick={() => {
                  deleteNote(note.id)
                  setShowActions(false)
                }}
              >
                <Icons.trash className="h-3 w-3 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <h3 className="font-medium text-sm leading-tight pr-8">{note.title || "Untitled"}</h3>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {note.content && <p className="text-xs text-muted-foreground line-clamp-4">{getPreview(note.content)}</p>}

          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {note.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0.5">
                  {tag}
                </Badge>
              ))}
              {note.tags.length > 3 && (
                <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                  +{note.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{format(note.updatedAt, "MMM d, yyyy")}</span>
            <span>{format(note.updatedAt, "h:mm a")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
