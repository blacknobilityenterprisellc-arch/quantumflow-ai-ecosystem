import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { messages, model = 'gpt-3.5-turbo', temperature = 0.7, max_tokens = 1000 } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    const zai = await ZAI.create()

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant powered by QuantumFlow AI Ecosystem. You provide accurate, helpful, and thoughtful responses.'
        },
        ...messages
      ],
      temperature,
      max_tokens,
      model
    })

    const messageContent = completion.choices[0]?.message?.content

    if (!messageContent) {
      return NextResponse.json(
        { error: 'No response generated' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      response: messageContent,
      usage: completion.usage,
      model: completion.model
    })

  } catch (error: any) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate response',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'QuantumFlow AI Chat API is running',
    version: '17.0.1',
    endpoints: {
      chat: 'POST /api/ai/chat',
      models: 'GET /api/ai/models',
      image: 'POST /api/ai/image'
    }
  })
}