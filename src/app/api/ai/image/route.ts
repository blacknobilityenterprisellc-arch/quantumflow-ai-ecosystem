import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { prompt, size = '1024x1024', quality = 'standard' } = await request.json()

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      )
    }

    const zai = await ZAI.create()

    const response = await zai.images.generations.create({
      prompt,
      size,
      quality
    })

    const imageBase64 = response.data[0]?.base64

    if (!imageBase64) {
      return NextResponse.json(
        { error: 'No image generated' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      image: `data:image/png;base64,${imageBase64}`,
      prompt,
      size,
      quality
    })

  } catch (error: any) {
    console.error('Image Generation API Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate image',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'QuantumFlow AI Image Generation API is running',
    version: '17.0.1',
    supportedSizes: ['1024x1024', '1792x1024', '1024x1792'],
    supportedQualities: ['standard', 'hd']
  })
}