<<<<<<< HEAD
import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
=======
import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
>>>>>>> parent of 496d3c0 (good layout of vanish)
import { join } from 'path'

export async function GET(request: NextRequest) {
  try {
<<<<<<< HEAD
    const { searchParams } = new URL(request.url)
    const lang = searchParams.get('lang') || 'es'
    
    // Use data directory for persistent storage with language suffix
    const dataPath = join(process.cwd(), 'data', `channel-descriptions-${lang}.md`)
    const fallbackPath = join(process.cwd(), `channel-descriptions-${lang}.md`)
    const defaultDataPath = join(process.cwd(), 'data', 'channel-descriptions.md')
    const defaultFallbackPath = join(process.cwd(), 'channel-descriptions.md')
    
    // Try language-specific file first, then fall back to default
    let filePath = ''
    if (existsSync(dataPath)) {
      filePath = dataPath
    } else if (existsSync(fallbackPath)) {
      filePath = fallbackPath
    } else if (existsSync(defaultDataPath)) {
      filePath = defaultDataPath
    } else {
      filePath = defaultFallbackPath
    }
    
=======
    const filePath = join(process.cwd(), 'channel-descriptions.md')
>>>>>>> parent of 496d3c0 (good layout of vanish)
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