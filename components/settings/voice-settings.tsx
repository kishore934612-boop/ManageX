"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Icons } from "@/components/ui/icons"
import { useSettingsStore } from "@/lib/settings-store"

export function VoiceSettings() {
  const { settings, updateSettings } = useSettingsStore()
  const [isSupported, setIsSupported] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")

  useEffect(() => {
    setIsSupported("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
  }, [])

  const startListening = () => {
    if (!isSupported) return

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = "en-US"

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setTranscript(transcript)
    }

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Icons.mic className="h-4 w-4" />
          Voice to Text
        </CardTitle>
        <CardDescription>
          {isSupported ? "Use voice input for tasks and notes" : "Voice input not supported in this browser"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="font-medium">Enable Voice Input</div>
            <div className="text-sm text-muted-foreground">Allow microphone access for voice commands</div>
          </div>
          <Switch
            checked={settings.voiceToText && isSupported}
            onCheckedChange={(checked) => updateSettings({ voiceToText: checked })}
            disabled={!isSupported}
          />
        </div>

        {isSupported && settings.voiceToText && (
          <div className="space-y-3">
            <Button variant="outline" onClick={startListening} disabled={isListening} className="w-full bg-transparent">
              {isListening ? (
                <>
                  <Icons.mic className="h-4 w-4 mr-2 animate-pulse text-red-500" />
                  Listening...
                </>
              ) : (
                <>
                  <Icons.mic className="h-4 w-4 mr-2" />
                  Test Voice Input
                </>
              )}
            </Button>

            {transcript && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm font-medium mb-1">Transcript:</div>
                <div className="text-sm">{transcript}</div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
