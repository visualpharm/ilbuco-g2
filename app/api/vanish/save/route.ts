import { NextRequest, NextResponse } from 'next/server'
import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'

export async function POST(request: NextRequest) {
  try {
    const { content }: { content: string } = await request.json()
    
    // Always save to data directory for persistence
    const filePath = join(process.cwd(), 'data', 'channel-descriptions.md')
    
    // Ensure data directory exists
    const dir = dirname(filePath)
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
    
    writeFileSync(filePath, content)
    
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