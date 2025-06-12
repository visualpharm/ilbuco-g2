import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'channel-descriptions.md')
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