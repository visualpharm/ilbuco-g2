import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'
import { verifyVanishPassword, VANISH_PASSWORD_HEADER } from '@/lib/vanish-auth'

export async function GET(request: NextRequest) {
  if (!verifyVanishPassword(request.headers.get(VANISH_PASSWORD_HEADER))) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

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
