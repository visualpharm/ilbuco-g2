"use client"

import { useState, useEffect } from "react"
import { MarkdownViewer } from "@/components/markdown-viewer"

const VANISH_PASSWORD_HEADER = "x-vanish-password"

export default function VanishPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [markdownContent, setMarkdownContent] = useState("")
  const [loading, setLoading] = useState(true)

  // Check authentication on mount — re-validate the stored password against
  // the server on every load. The server is the only source of truth for
  // whether a password is correct; nothing is trusted client-side.
  useEffect(() => {
    const storedPassword = sessionStorage.getItem('vanish-password')
    if (storedPassword) {
      loadContent(storedPassword)
    } else {
      setLoading(false)
    }
  }, [])

  const handleLogin = async () => {
    const ok = await loadContent(password)
    if (ok) {
      setIsAuthenticated(true)
      sessionStorage.setItem('vanish-password', password)
    } else {
      alert('Incorrect password')
    }
  }

  // Returns true if the password was accepted by the server.
  const loadContent = async (candidatePassword: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/vanish/content', {
        headers: { [VANISH_PASSWORD_HEADER]: candidatePassword }
      })
      if (response.status === 401) {
        sessionStorage.removeItem('vanish-password')
        setIsAuthenticated(false)
        return false
      }
      const data = await response.json()
      if (data.success) {
        setMarkdownContent(data.content)
        setIsAuthenticated(true)
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to load content:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const saveMarkdown = async (content: string) => {
    try {
      const storedPassword = sessionStorage.getItem('vanish-password') || ''
      const response = await fetch('/api/vanish/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          [VANISH_PASSWORD_HEADER]: storedPassword
        },
        body: JSON.stringify({ content })
      })

      if (!response.ok) {
        console.error('Failed to save content')
        throw new Error('Failed to save content')
      }

      // Update local state
      setMarkdownContent(content)
    } catch (error) {
      console.error('Save error:', error)
      throw error
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center">Access Required</h1>
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Enter password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Access
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <MarkdownViewer
          content={markdownContent}
          onSave={saveMarkdown}
          editable={true}
        />
      </div>
    </div>
  )
}
