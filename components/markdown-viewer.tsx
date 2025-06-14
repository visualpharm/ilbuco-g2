"use client"

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Edit2, Save, X, Copy, Check } from 'lucide-react'

interface MarkdownViewerProps {
  content: string
  onSave?: (content: string) => void
  className?: string
  editable?: boolean
}

interface RoomSection {
  name: string
  title: string
  fullDescription: string
}

export function MarkdownViewer({ 
  content, 
  onSave, 
  className = "", 
  editable = true 
}: MarkdownViewerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(content)
  const [isSaving, setIsSaving] = useState(false)
  const [copiedSection, setCopiedSection] = useState<string | null>(null)
  const [hoveredElement, setHoveredElement] = useState<string | null>(null)

  // Extract H2 headings for TOC with content for copying
  const extractH2Headings = (markdown: string) => {
    const lines = markdown.split('\n')
    const headings: { id: string, title: string, content: string }[] = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (line.startsWith('## ') && !line.startsWith('### ')) {
        const title = line.replace('## ', '').trim()
        const id = `h2-${title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`
        
        // Extract content for this section
        let sectionContent = ''
        for (let j = i + 1; j < lines.length; j++) {
          const nextLine = lines[j]
          if (nextLine.startsWith('## ')) break // Stop at next H2
          sectionContent += nextLine + '\n'
        }
        
        // Clean up the content - remove markdown formatting
        const cleanContent = sectionContent
          .replace(/^#{1,6}\s+/gm, '') // Remove heading markers
          .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
          .replace(/\*(.*?)\*/g, '$1') // Remove italic
          .replace(/`(.*?)`/g, '$1') // Remove inline code
          .replace(/^\s*[-*+]\s+/gm, '• ') // Convert lists to bullet points
          .replace(/\n{3,}/g, '\n\n') // Reduce multiple newlines
          .trim()
        
        headings.push({ id, title, content: cleanContent })
      }
    }
    
    return headings
  }

  const tocHeadings = extractH2Headings(content)

  // Scroll to section function
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
  
  // Get the text that will be copied for a given element
  const getTextToCopy = (elementType: string, elementContent: string) => {
    // COPY FUNCTIONALITY DISABLED
    return ''
    
    /* COMMENTED OUT - Copy functionality disabled
    const lines = content.split('\n')
    
    if (elementType === 'h2') {
      // Rule 1: Copy title without hashes - just the title text itself
      return elementContent
    }
    
    if (elementType === 'h3') {
      // Rule 2: Copy content under h3, without the h3 title
      const h3Index = lines.findIndex(line => line.includes(elementContent))
      if (h3Index === -1) return ''
      
      let contentToCopy = ''
      for (let i = h3Index + 1; i < lines.length; i++) {
        const line = lines[i]
        if (line.startsWith('##') || line.startsWith('###')) break
        if (line.trim()) contentToCopy += line + '\n'
      }
      return contentToCopy.trim()
    }
    
    if (elementType === 'h4') {
      // Rule 3: Copy h4 heading WITH its content
      const h4Index = lines.findIndex(line => line.includes(elementContent))
      if (h4Index === -1) return ''
      
      let contentToCopy = elementContent + '\n'
      for (let i = h4Index + 1; i < lines.length; i++) {
        const line = lines[i]
        if (line.startsWith('#')) break
        if (line.trim()) contentToCopy += line + '\n'
      }
      return contentToCopy.trim()
    }
    
    if (elementType === 'p') {
      // Rule 4: Paragraph behavior depends on location
      const pIndex = lines.findIndex(line => line.includes(elementContent.substring(0, 50)))
      if (pIndex === -1) return ''
      
      // Check if this paragraph is inside "Full Description" section
      let isInFullDescription = false
      for (let i = pIndex; i >= 0; i--) {
        const line = lines[i]
        if (line.startsWith('### Full Description')) {
          isInFullDescription = true
          break
        }
        if (line.startsWith('### ') && !line.includes('Full Description')) {
          break // Found another H3, not in Full Description
        }
      }
      
      if (isInFullDescription) {
        // Copy entire Full Description content
        const fullDescIndex = lines.findIndex(line => line.startsWith('### Full Description'))
        if (fullDescIndex === -1) return ''
        
        let contentToCopy = ''
        for (let i = fullDescIndex + 1; i < lines.length; i++) {
          const line = lines[i]
          if (line.startsWith('## ')) break // Stop at next H2
          contentToCopy += line + '\n'
        }
        return contentToCopy.trim()
      } else {
        // Copy only this paragraph
        return elementContent
      }
    }
    
    return ''
    */
  }

  // Function to determine if text should be highlighted based on what will be copied
  const shouldHighlight = (elementType: string, elementContent: string) => {
    // HIGHLIGHTING FUNCTIONALITY DISABLED
    return false
    
    /* COMMENTED OUT - Highlighting functionality disabled
    if (!hoveredElement) return false
    
    const [hoveredType, ...hoveredContentParts] = hoveredElement.split('-')
    const hoveredContent = hoveredContentParts.join('-')
    
    // Rule 1: H2 titles only highlight themselves
    if (elementType === 'h2' && hoveredType === 'h2') {
      return elementContent === hoveredContent
    }
    
    // Rule 2: H3 sections highlight content below (not the H3 title itself)
    if (hoveredType === 'h3') {
      if (elementType === 'h3') return false // Don't highlight the H3 title
      if (elementType === 'p' || elementType === 'h4') {
        // Check if this content comes after the hovered H3 and before next section
        const lines = content.split('\n')
        const h3Index = lines.findIndex(line => line.includes(hoveredContent))
        const elementIndex = lines.findIndex(line => 
          line.includes(elementContent.substring(0, 50)) || 
          (elementType === 'h4' && line.includes(elementContent))
        )
        
        if (h3Index === -1 || elementIndex === -1) return false
        
        // Check if element is after H3 and before next section
        let nextSectionIndex = lines.length
        for (let i = h3Index + 1; i < lines.length; i++) {
          if (lines[i].startsWith('##') || lines[i].startsWith('###')) {
            nextSectionIndex = i
            break
          }
        }
        
        return elementIndex > h3Index && elementIndex < nextSectionIndex
      }
    }
    
    // Rule 3: H4 headings highlight themselves AND content below
    if (hoveredType === 'h4') {
      if (elementType === 'h4' && elementContent === hoveredContent) {
        return true // Highlight the H4 itself
      }
      if (elementType === 'p') {
        // Check if this paragraph comes after the hovered H4
        const lines = content.split('\n')
        const h4Index = lines.findIndex(line => line.includes(hoveredContent))
        const pIndex = lines.findIndex(line => line.includes(elementContent.substring(0, 50)))
        
        if (h4Index === -1 || pIndex === -1) return false
        
        // Check if paragraph is after H4 and before next heading
        let nextHeadingIndex = lines.length
        for (let i = h4Index + 1; i < lines.length; i++) {
          if (lines[i].startsWith('#')) {
            nextHeadingIndex = i
            break
          }
        }
        
        return pIndex > h4Index && pIndex < nextHeadingIndex
      }
    }
    
    // Rule 4: Paragraph highlighting depends on location
    if (hoveredType === 'p') {
      if (elementType === 'p') {
        const lines = content.split('\n')
        const hoveredPIndex = lines.findIndex(line => line.includes(hoveredContent))
        const currentPIndex = lines.findIndex(line => line.includes(elementContent.substring(0, 50)))
        
        if (hoveredPIndex === -1 || currentPIndex === -1) return false
        
        // Check if hovered paragraph is inside "Full Description" section
        let isHoveredInFullDescription = false
        for (let i = hoveredPIndex; i >= 0; i--) {
          const line = lines[i]
          if (line.startsWith('### Full Description')) {
            isHoveredInFullDescription = true
            break
          }
          if (line.startsWith('### ') && !line.includes('Full Description')) {
            break
          }
        }
        
        if (isHoveredInFullDescription) {
          // Highlight entire Full Description content
          const fullDescIndex = lines.findIndex(line => line.startsWith('### Full Description'))
          if (fullDescIndex === -1) return false
          
          let nextH2Index = lines.length
          for (let i = fullDescIndex + 1; i < lines.length; i++) {
            if (lines[i].startsWith('## ')) {
              nextH2Index = i
              break
            }
          }
          
          return currentPIndex > fullDescIndex && currentPIndex < nextH2Index
        } else {
          // Only highlight the specific paragraph
          return currentPIndex === hoveredPIndex
        }
      }
    }
    
    return false
    */
  }

  const handleSave = async () => {
    if (!onSave) return
    
    setIsSaving(true)
    try {
      await onSave(editContent)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditContent(content)
    setIsEditing(false)
  }

  const extractRoomSections = (markdown: string): RoomSection[] => {
    const sections: RoomSection[] = []
    const lines = markdown.split('\n')
    let currentSection: Partial<RoomSection> = {}
    let currentContent: string[] = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      if (line.startsWith('## ') && !line.includes('Common Features')) {
        // Save previous section if exists
        if (currentSection.name && currentContent.length > 0) {
          currentSection.fullDescription = currentContent.join('\n').trim()
          sections.push(currentSection as RoomSection)
        }
        
        // Start new section
        currentSection = { name: line.replace('## ', '') }
        currentContent = []
      } else if (line.startsWith('### ') && currentSection.name && !currentSection.title) {
        // This is the main title for Airbnb
        currentSection.title = line.replace('### ', '')
        currentContent.push(line)
      } else if (currentSection.name && line !== '') {
        currentContent.push(line)
      }
    }
    
    // Add the last section
    if (currentSection.name && currentContent.length > 0) {
      currentSection.fullDescription = currentContent.join('\n').trim()
      sections.push(currentSection as RoomSection)
    }
    
    return sections
  }

  const copyToClipboard = async (text: string, sectionName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedSection(sectionName)
      setTimeout(() => setCopiedSection(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const formatForAirbnb = (section: RoomSection): string => {
    // Extract the short description (first paragraph after title)
    const lines = section.fullDescription.split('\n')
    let shortDesc = ''
    let fullDesc = ''
    let foundTitle = false
    
    for (const line of lines) {
      if (line.startsWith('### ') && !foundTitle) {
        foundTitle = true
        continue
      }
      if (foundTitle && line.trim() && !line.startsWith('#') && !shortDesc) {
        shortDesc = line.trim()
        break
      }
    }
    
    // Get full description starting from "### Full Description"
    const fullDescStart = section.fullDescription.indexOf('### Full Description')
    if (fullDescStart !== -1) {
      fullDesc = section.fullDescription.substring(fullDescStart)
        .replace('### Full Description', '')
        .replace(/#### /g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim()
    }
    
    return `${shortDesc}\n\n${fullDesc}`
  }

  if (isEditing) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">Edit Markdown</h3>
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              size="sm"
              className="h-8"
            >
              <Save className="w-4 h-4 mr-1" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              size="sm"
              className="h-8"
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
        <Textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="min-h-96 font-mono text-sm resize-y"
          placeholder="Enter your markdown content here..."
          autoFocus
        />
        <div className="text-xs text-gray-500">
          Tip: Use Markdown syntax for formatting. Changes will save when you click Save or lose focus.
        </div>
      </div>
    )
  }

  const roomSections = extractRoomSections(content)

  return (
    <div className={`${className}`}>
      {/* Main Layout: Sidebar + Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar: Combined TOC + Copy */}
        <div className="lg:w-80 lg:flex-shrink-0 order-1 lg:order-none">
          {tocHeadings.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm lg:fixed lg:top-6 lg:w-80 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📑 Contents & Copy</h3>
              <nav className="space-y-2">
                {tocHeadings.map((heading) => (
                  <div
                    key={heading.id}
                    className="flex items-center justify-between p-2 rounded hover:bg-gray-50 group"
                  >
                    {/* Title - clickable for navigation */}
                    <button
                      onClick={() => scrollToSection(heading.id)}
                      className="flex-1 text-left text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium"
                    >
                      {heading.title}
                    </button>
                    
                    {/* Copy icon */}
                    <button
                      onClick={() => copyToClipboard(heading.content, heading.id)}
                      className="ml-2 p-1 rounded hover:bg-blue-100 transition-colors"
                      title="Copy section content"
                    >
                      {copiedSection === heading.id ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                      )}
                    </button>
                  </div>
                ))}
              </nav>
            </div>
          )}
        </div>

        {/* Main Markdown Content */}
        <div className="flex-1 min-w-0 order-2 lg:order-none">
          <div className="relative group bg-white border border-gray-200 rounded-lg shadow-sm">
        {editable && onSave && (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            size="sm"
            className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
          >
            <Edit2 className="w-4 h-4 mr-1" />
            Edit
          </Button>
        )}
      
      <div className="prose prose-gray max-w-none rounded-lg p-4">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[
            rehypeHighlight,
            rehypeSlug
          ]}
          remarkRehypeOptions={{
            allowDangerousHtml: true
          }}
          components={{
            // Custom styling for different elements
            h1: ({ children }) => (
              <h1 className="text-3xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                {children}
              </h1>
            ),
            h2: ({ children, ...props }) => {
              const textContent = children?.toString() || ''
              const id = `h2-${textContent.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`
              
              return (
                <h2 
                  id={id}
                  className="text-2xl font-semibold mb-3 mt-8 text-gray-800"
                >
                  {children}
                </h2>
              )
            },
            h3: ({ children, ...props }) => {
              return (
                <h3 className="text-xl font-medium mb-2 mt-6 text-gray-700">
                  {children}
                </h3>
              )
            },
            h4: ({ children, ...props }) => {
              return (
                <h4 className="text-lg font-medium mb-2 mt-4 text-gray-600">
                  {children}
                </h4>
              )
            },
            p: ({ children, ...props }) => {
              const textContent = children?.toString() || ''
              
              // Check if this paragraph contains multiple emoji items
              const emojiCount = (textContent.match(/[💻🌡️📱🪑✔️🌿🏠📶🌤️🏗️📍🌲🛏️🍽️💼🎯✨]/g) || []).length
              const hasEmojiList = emojiCount > 1
              
              // Function to split emoji lists
              const splitEmojiList = (text: string) => {
                // Since the text already has line breaks, just split on them
                const parts = text.split('\n')
                  .map(item => item.trim())
                  .filter(item => item && item.length > 0)
                
                return parts
              }
              
              return (
                <div className="leading-relaxed mb-4 text-gray-600">
                  {hasEmojiList ? (
                    // Render emoji lists as separate lines
                    <div className="space-y-2">
                      {splitEmojiList(textContent).map((line, index) => (
                        <div key={index} className="flex items-start">
                          <span>{line}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="m-0">{children}</p>
                  )}
                </div>
              )
            },
            ul: ({ children }) => (
              <ul className="list-disc pl-6 mb-4 space-y-1">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-6 mb-4 space-y-1">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="text-gray-600">
                {children}
              </li>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-200 pl-4 py-2 my-4 bg-blue-50 text-gray-700 italic">
                {children}
              </blockquote>
            ),
            code: ({ inline, children }) => {
              if (inline) {
                return (
                  <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">
                    {children}
                  </code>
                )
              }
              return (
                <code className="block bg-gray-100 text-gray-800 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                  {children}
                </code>
              )
            },
            pre: ({ children }) => (
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                {children}
              </pre>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-gray-900">
                {children}
              </strong>
            ),
            em: ({ children }) => (
              <em className="italic text-gray-700">
                {children}
              </em>
            ),
            a: ({ href, children }) => (
              <a 
                href={href}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {children}
              </a>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border border-gray-200">
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className="border border-gray-200 px-4 py-2 bg-gray-50 text-left font-semibold text-gray-900">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-gray-200 px-4 py-2 text-gray-600">
                {children}
              </td>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}