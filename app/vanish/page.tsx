"use client"

import { useState, useEffect } from "react"
import { MarkdownViewer } from "@/components/markdown-viewer"

export default function VanishPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [markdownContent, setMarkdownContent] = useState("")
  const [loading, setLoading] = useState(true)

  // Check authentication on mount
  useEffect(() => {
    const auth = sessionStorage.getItem('vanish-auth')
    if (auth === 'spotless') {
      setIsAuthenticated(true)
      loadContent()
    } else {
      setLoading(false)
    }
  }, [])

  const handleLogin = () => {
    if (password === 'spotless') {
      setIsAuthenticated(true)
      sessionStorage.setItem('vanish-auth', 'spotless')
      loadContent()
    } else {
      alert('Incorrect password')
    }
  }

  const loadContent = async () => {
    try {
      const response = await fetch('/api/vanish/content')
      const data = await response.json()
      if (data.success) {
        setMarkdownContent(data.content)
      }
    } catch (error) {
      console.error('Failed to load content:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveMarkdown = async (content: string) => {
    try {
      const response = await fetch('/api/vanish/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Markdown Editor</h1>
          <p className="text-gray-600">Beautiful markdown rendering with inline editing capabilities. Click Edit to modify the content.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Refresh Content
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <MarkdownViewer
            content={markdownContent}
            onSave={saveMarkdown}
            editable={true}
          />
        </div>
      </div>
    </div>
  )
}

