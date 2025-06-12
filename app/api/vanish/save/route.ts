import { NextRequest, NextResponse } from 'next/server'
import { writeFileSync } from 'fs'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const { content }: { content: string } = await request.json()
    
    const filePath = join(process.cwd(), 'channel-descriptions.md')
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