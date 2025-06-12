import { NextRequest, NextResponse } from 'next/server'
import { writeFileSync, readFileSync } from 'fs'
import { join } from 'path'

interface Section {
  id: string
  title: string
  content: string
  type: 'title' | 'subtitle' | 'description' | 'list' | 'text'
}

export async function POST(request: NextRequest) {
  try {
    const { sections }: { sections: Section[] } = await request.json()
    
    // Convert sections back to markdown format
    let markdownContent = ''
    
    for (const section of sections) {
      if (section.title) {
        if (section.type === 'title') {
          markdownContent += `# ${section.title}\n\n`
        } else if (section.type === 'subtitle') {
          markdownContent += `## ${section.title}\n\n`
        } else if (section.type === 'description') {
          markdownContent += `### ${section.title}\n\n`
        }
      }
      
      if (section.content) {
        markdownContent += `${section.content}\n\n`
      }
    }
    
    const filePath = join(process.cwd(), 'channel-descriptions.md')
    writeFileSync(filePath, markdownContent.trim())
    
    return NextResponse.json({
      success: true,
      message: 'Content saved successfully'
    })
  } catch (error) {
    console.error('Error saving file:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save file' },
      { status: 500 }
    )
  }
}