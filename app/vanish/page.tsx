"use client"

import { useState, useEffect } from "react"

interface Section {
  id: string
  title: string
  content: string
  type: 'title' | 'subtitle' | 'description' | 'list' | 'text'
}

export default function VanishPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [tocItems, setTocItems] = useState<{id: string, title: string}[]>([])

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
        setSections(parseMarkdownToSections(data.content))
      }
    } catch (error) {
      console.error('Failed to load content:', error)
    } finally {
      setLoading(false)
    }
  }

  const parseMarkdownToSections = (markdown: string): Section[] => {
    const lines = markdown.split('\n')
    const sections: Section[] = []
    const toc: {id: string, title: string}[] = []
    let currentSection: Partial<Section> = {}
    let sectionCounter = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      if (line.startsWith('# ')) {
        if (currentSection.content || currentSection.title) {
          sections.push(currentSection as Section)
        }
        currentSection = {
          id: `section-${sectionCounter++}`,
          title: line.replace('# ', ''),
          content: '',
          type: 'title'
        }
      } else if (line.startsWith('## ')) {
        if (currentSection.content || currentSection.title) {
          sections.push(currentSection as Section)
        }
        const sectionId = `section-${sectionCounter++}`
        const title = line.replace('## ', '')
        currentSection = {
          id: sectionId,
          title: title,
          content: '',
          type: 'subtitle'
        }
        // Add to TOC
        toc.push({ id: sectionId, title: title })
      } else if (line.startsWith('### ')) {
        if (currentSection.content || currentSection.title) {
          sections.push(currentSection as Section)
        }
        currentSection = {
          id: `section-${sectionCounter++}`,
          title: line.replace('### ', ''),
          content: '',
          type: 'description'
        }
      } else if (line) {
        currentSection.content += (currentSection.content ? '\n' : '') + line
      }
    }

    if (currentSection.content || currentSection.title) {
      sections.push(currentSection as Section)
    }

    // Update TOC state
    setTocItems(toc)

    return sections
  }

  const saveSection = async (sectionId: string, newContent: string) => {
    try {
      // Update local state first
      setSections(prev => prev.map(section => 
        section.id === sectionId 
          ? { ...section, content: newContent }
          : section
      ))

      // Save to file
      const response = await fetch('/api/vanish/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sections: sections.map(section => 
            section.id === sectionId 
              ? { ...section, content: newContent }
              : section
          )
        })
      })

      if (!response.ok) {
        console.error('Failed to save content')
      }
    } catch (error) {
      console.error('Save error:', error)
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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl flex">
        {/* Table of Contents */}
        <div className="w-64 mr-8 sticky top-8 h-fit">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h2>
            <nav className="space-y-2">
              {tocItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block text-left w-full px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  {item.title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Channel Descriptions Editor</h1>
            <p className="text-gray-600">Click on any section to edit. Changes save automatically when you click outside.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              Refresh Content
            </button>
          </div>

          <div className="space-y-6">
            {sections.map((section) => (
              <EditableSection
                key={section.id}
                section={section}
                onSave={(content) => saveSection(section.id, content)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface EditableSectionProps {
  section: Section
  onSave: (content: string) => void
}

function EditableSection({ section, onSave }: EditableSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(section.content)
  const [isSaving, setIsSaving] = useState(false)

  const handleBlur = async () => {
    setIsEditing(false)
    if (content !== section.content) {
      setIsSaving(true)
      await onSave(content)
      setIsSaving(false)
    }
  }

  // Convert **text** to HTML bold and handle line breaks
  const formatContent = (text: string) => {
    return text
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-current">$1</strong>') // Convert **text** to bold (same size)
      .replace(/\n/g, '<br>') // Convert line breaks to <br>
  }

  const getClassName = () => {
    switch (section.type) {
      case 'title':
        return "text-3xl font-bold text-gray-900 mb-4"
      case 'subtitle':
        return "text-2xl font-semibold text-gray-800 mb-3"
      case 'description':
        return "text-xl font-medium text-gray-700 mb-2"
      default:
        return "text-gray-600 leading-relaxed"
    }
  }

  return (
    <div 
      id={section.type === 'subtitle' ? section.id : undefined}
      className={`border-l-4 pl-4 transition-colors relative ${isEditing ? 'border-blue-500' : 'border-blue-200 hover:border-blue-400'}`}
    >
      {section.title && (
        <h2 className={getClassName()}>
          {section.title}
        </h2>
      )}
      
      <div
        className={`${getClassName()} ${isEditing ? 'bg-blue-50 border border-blue-300 rounded p-2' : 'hover:bg-gray-50 rounded p-2 cursor-pointer'} transition-all duration-200 whitespace-pre-wrap`}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onFocus={() => setIsEditing(true)}
        onBlur={handleBlur}
        onInput={(e) => setContent(e.currentTarget.textContent || '')}
        dangerouslySetInnerHTML={{ __html: formatContent(content) }}
      />
      
      {isSaving && (
        <div className="absolute top-0 right-0 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
          Saving...
        </div>
      )}
    </div>
  )
}