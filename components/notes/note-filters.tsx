"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/ui/icons"
import { useNoteStore } from "@/lib/note-store"

interface NoteFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  showPinned: boolean
  onShowPinnedChange: (show: boolean) => void
  selectedTags: string[]
  onSelectedTagsChange: (tags: string[]) => void
}

export function NoteFilters({
  searchQuery,
  onSearchChange,
  showPinned,
  onShowPinnedChange,
  selectedTags,
  onSelectedTagsChange,
}: NoteFiltersProps) {
  const { getAllTags } = useNoteStore()
  const [showFilters, setShowFilters] = useState(false)
  const allTags = getAllTags()

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onSelectedTagsChange(selectedTags.filter((t) => t !== tag))
    } else {
      onSelectedTagsChange([...selectedTags, tag])
    }
  }

  const clearFilters = () => {
    onSearchChange("")
    onShowPinnedChange(false)
    onSelectedTagsChange([])
  }

  const hasActiveFilters = searchQuery || showPinned || selectedTags.length > 0

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? "bg-accent" : ""}
        >
          <Icons.filter className="h-4 w-4" />
        </Button>
      </div>

      {showFilters && (
        <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showPinned"
                checked={showPinned}
                onChange={(e) => onShowPinnedChange(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="showPinned" className="text-sm">
                Show only pinned notes
              </label>
            </div>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <Icons.x className="h-3 w-3 mr-1" />
                Clear filters
              </Button>
            )}
          </div>

          {allTags.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Filter by tags:</label>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {hasActiveFilters && (
            <div className="flex flex-wrap gap-1">
              {searchQuery && (
                <Badge variant="secondary">
                  Search: {searchQuery}
                  <Icons.x className="ml-1 h-3 w-3 cursor-pointer" onClick={() => onSearchChange("")} />
                </Badge>
              )}
              {showPinned && (
                <Badge variant="secondary">
                  Pinned only
                  <Icons.x className="ml-1 h-3 w-3 cursor-pointer" onClick={() => onShowPinnedChange(false)} />
                </Badge>
              )}
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  Tag: {tag}
                  <Icons.x className="ml-1 h-3 w-3 cursor-pointer" onClick={() => toggleTag(tag)} />
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
