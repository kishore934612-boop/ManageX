"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { useTaskStore } from "@/lib/task-store"
import { useNoteStore } from "@/lib/note-store"
import { exportTasksAsText, exportNotesAsText, exportTasksAsPDF, exportNotesAsPDF, downloadAsFile } from "@/lib/export"
import { format } from "date-fns"

export function DataManagement() {
  const { tasks } = useTaskStore()
  const { notes } = useNoteStore()
  const [isExporting, setIsExporting] = useState(false)

  const handleExportTasks = async (format: "text" | "pdf") => {
    setIsExporting(true)
    try {
      if (format === "pdf") {
        exportTasksAsPDF(tasks)
      } else {
        const content = exportTasksAsText(tasks)
        downloadAsFile(content, `managex-tasks-${format(new Date(), "yyyy-MM-dd")}.txt`)
      }
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportNotes = async (format: "text" | "pdf") => {
    setIsExporting(true)
    try {
      if (format === "pdf") {
        exportNotesAsPDF(notes)
      } else {
        const content = exportNotesAsText(notes)
        downloadAsFile(content, `managex-notes-${format(new Date(), "yyyy-MM-dd")}.txt`)
      }
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportAll = async () => {
    setIsExporting(true)
    try {
      const tasksContent = exportTasksAsText(tasks)
      const notesContent = exportNotesAsText(notes)
      const allContent = `${tasksContent}\n\n${notesContent}`
      downloadAsFile(allContent, `managex-backup-${format(new Date(), "yyyy-MM-dd")}.txt`)
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleClearAllData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      localStorage.removeItem("managex-tasks")
      localStorage.removeItem("managex-notes")
      localStorage.removeItem("managex-settings")
      window.location.reload()
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Icons.download className="h-4 w-4" />
            Export Data
          </CardTitle>
          <CardDescription>Download your tasks and notes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportTasks("text")}
              disabled={isExporting || tasks.length === 0}
            >
              <Icons.tasks className="h-4 w-4 mr-2" />
              Tasks (TXT)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportNotes("text")}
              disabled={isExporting || notes.length === 0}
            >
              <Icons.notes className="h-4 w-4 mr-2" />
              Notes (TXT)
            </Button>
          </div>
          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={handleExportAll}
            disabled={isExporting || (tasks.length === 0 && notes.length === 0)}
          >
            {isExporting ? (
              <Icons.spinner className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Icons.download className="h-4 w-4 mr-2" />
            )}
            Export All Data
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-destructive">
            <Icons.trash className="h-4 w-4" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" size="sm" onClick={handleClearAllData}>
            <Icons.trash className="h-4 w-4 mr-2" />
            Clear All Data
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
