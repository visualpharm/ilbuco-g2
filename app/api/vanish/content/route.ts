import { NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    // Use data directory for persistent storage
    const dataPath = join(process.cwd(), 'data', 'channel-descriptions.md')
    const fallbackPath = join(process.cwd(), 'channel-descriptions.md')
    
    // Try data directory first, fall back to root if not exists
    const filePath = existsSync(dataPath) ? dataPath : fallbackPath
    const content = readFileSync(filePath, 'utf8')
    
    return NextResponse.json({
      success: true,
      content
    })
  } catch (error) {
    console.error('Error reading file:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to read file' },
      { status: 500 }
    )
  }
}