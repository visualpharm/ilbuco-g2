import { NextRequest, NextResponse } from 'next/server'
import { writeFileSync } from 'fs'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const { content, lang }: { content: string; lang?: string } = await request.json()
    const language = lang || 'es'
    
<<<<<<< HEAD
    // Always save to data directory for persistence with language suffix
    const filePath = join(process.cwd(), 'data', `channel-descriptions-${language}.md`)
    
    // Ensure data directory exists
    const dir = dirname(filePath)
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
    
=======
    const filePath = join(process.cwd(), 'channel-descriptions.md')
>>>>>>> parent of 496d3c0 (good layout of vanish)
    writeFileSync(filePath, content)
    
    return NextResponse.json({
      success: true,
      message: `Content saved successfully for ${language}`
    })
  } catch (error) {
    console.error('Error saving file:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save file' },
      { status: 500 }
    )
  }
}