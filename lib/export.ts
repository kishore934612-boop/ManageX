import type { Task, Note } from "./types"
import { format } from "date-fns"

export function exportTasksAsText(tasks: Task[]): string {
  let content = "# Managex Tasks Export\n\n"
  content += `Exported on: ${format(new Date(), "PPP")}\n\n`

  const categories = [...new Set(tasks.map((task) => task.category))]

  categories.forEach((category) => {
    const categoryTasks = tasks.filter((task) => task.category === category)
    content += `## ${category}\n\n`

    categoryTasks.forEach((task) => {
      content += `### ${task.title}\n`
      if (task.description) content += `${task.description}\n`
      content += `- Status: ${task.completed ? "✅ Completed" : "⏳ Pending"}\n`
      content += `- Priority: ${task.priority.toUpperCase()}\n`
      if (task.dueDate) content += `- Due: ${format(new Date(task.dueDate), "PPP")}\n`
      if (task.tags.length > 0) content += `- Tags: ${task.tags.join(", ")}\n`
      if (task.progress > 0) content += `- Progress: ${task.progress}%\n`
      if (task.recurring) content += `- Recurring: ${task.recurring.type} (every ${task.recurring.interval})\n`
      content += `- Created: ${format(new Date(task.createdAt), "PPP")}\n\n`
    })
  })

  return content
}

export function exportNotesAsText(notes: Note[]): string {
  let content = "# Managex Notes Export\n\n"
  content += `Exported on: ${format(new Date(), "PPP")}\n\n`

  notes.forEach((note, index) => {
    content += `## ${note.title || `Note ${index + 1}`}\n\n`

    // Strip HTML from content
    const tmp = document.createElement("div")
    tmp.innerHTML = note.content
    const textContent = tmp.textContent || tmp.innerText || ""

    content += `${textContent}\n\n`

    if (note.tags.length > 0) {
      content += `**Tags:** ${note.tags.join(", ")}\n`
    }

    if (note.isPinned) {
      content += `**Pinned:** Yes\n`
    }

    content += `**Created:** ${format(new Date(note.createdAt), "PPP")}\n`
    content += `**Updated:** ${format(new Date(note.updatedAt), "PPP")}\n\n`
    content += "---\n\n"
  })

  return content
}

export function downloadAsFile(content: string, filename: string, type = "text/plain") {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function exportTasksAsPDF(tasks: Task[]): void {
  // For a real implementation, you'd use a library like jsPDF
  // For now, we'll export as formatted text that can be converted to PDF
  const content = exportTasksAsText(tasks)
  downloadAsFile(content, `managex-tasks-${format(new Date(), "yyyy-MM-dd")}.txt`, "text/plain")
}

export function exportNotesAsPDF(notes: Note[]): void {
  // For a real implementation, you'd use a library like jsPDF
  // For now, we'll export as formatted text that can be converted to PDF
  const content = exportNotesAsText(notes)
  downloadAsFile(content, `managex-notes-${format(new Date(), "yyyy-MM-dd")}.txt`, "text/plain")
}
