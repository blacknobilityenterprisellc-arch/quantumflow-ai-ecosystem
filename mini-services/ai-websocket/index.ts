import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid'
import ZAI from 'z-ai-web-dev-sdk'

const PORT = 3003
const httpServer = createServer()

// Enable CORS
httpServer.on('request', cors())

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

// Store active conversations
const conversations = new Map()

// AI Model instances
const zaiInstances = new Map()

async function getZAIInstance() {
  if (!zaiInstances.has('default')) {
    const zai = await ZAI.create()
    zaiInstances.set('default', zai)
  }
  return zaiInstances.get('default')
}

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`)

  // Join or create a conversation
  socket.on('join-conversation', async (data) => {
    const { conversationId, userId } = data
    
    let conversation = conversations.get(conversationId)
    
    if (!conversation) {
      conversation = {
        id: conversationId || uuidv4(),
        userId: userId || 'anonymous',
        messages: [],
        createdAt: new Date(),
        lastActivity: new Date()
      }
      conversations.set(conversation.id, conversation)
    }
    
    socket.join(conversation.id)
    socket.currentConversationId = conversation.id
    
    // Send conversation history
    socket.emit('conversation-joined', {
      conversationId: conversation.id,
      messages: conversation.messages
    })
    
    console.log(`User ${userId} joined conversation: ${conversation.id}`)
  })

  // Handle new message
  socket.on('message', async (data) => {
    const { message, conversationId, model = 'gpt-3.5-turbo', temperature = 0.7 } = data
    
    const conversation = conversations.get(conversationId)
    if (!conversation) {
      socket.emit('error', { message: 'Conversation not found' })
      return
    }

    // Add user message to conversation
    const userMessage = {
      id: uuidv4(),
      role: 'user',
      content: message,
      timestamp: new Date()
    }
    
    conversation.messages.push(userMessage)
    conversation.lastActivity = new Date()
    
    // Broadcast user message to all clients in conversation
    io.to(conversationId).emit('message', userMessage)
    
    try {
      // Send typing indicator
      io.to(conversationId).emit('typing', { isTyping: true })
      
      // Get AI response
      const zai = await getZAIInstance()
      
      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant powered by QuantumFlow AI Ecosystem. You provide accurate, helpful, and thoughtful responses.'
          },
          ...conversation.messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        ],
        temperature,
        max_tokens: 1000,
        model
      })

      const responseContent = completion.choices[0]?.message?.content
      
      if (responseContent) {
        // Add AI response to conversation
        const aiMessage = {
          id: uuidv4(),
          role: 'assistant',
          content: responseContent,
          timestamp: new Date(),
          model: completion.model,
          usage: completion.usage
        }
        
        conversation.messages.push(aiMessage)
        conversation.lastActivity = new Date()
        
        // Send typing indicator off
        io.to(conversationId).emit('typing', { isTyping: false })
        
        // Broadcast AI response
        io.to(conversationId).emit('message', aiMessage)
        
        console.log(`AI response sent for conversation: ${conversationId}`)
      } else {
        io.to(conversationId).emit('typing', { isTyping: false })
        socket.emit('error', { message: 'No response generated' })
      }
      
    } catch (error) {
      console.error('AI Response Error:', error)
      io.to(conversationId).emit('typing', { isTyping: false })
      socket.emit('error', { 
        message: 'Failed to generate AI response',
        details: error.message 
      })
    }
  })

  // Handle image generation
  socket.on('generate-image', async (data) => {
    const { prompt, conversationId, size = '1024x1024' } = data
    
    try {
      // Send processing indicator
      socket.emit('image-generating', { isGenerating: true })
      
      const zai = await getZAIInstance()
      const response = await zai.images.generations.create({
        prompt,
        size,
        quality: 'standard'
      })

      const imageBase64 = response.data[0]?.base64
      
      if (imageBase64) {
        const imageData = {
          id: uuidv4(),
          type: 'image',
          prompt,
          image: `data:image/png;base64,${imageBase64}`,
          size,
          timestamp: new Date()
        }
        
        // Add image to conversation
        const conversation = conversations.get(conversationId)
        if (conversation) {
          conversation.messages.push(imageData)
          conversation.lastActivity = new Date()
        }
        
        socket.emit('image-generating', { isGenerating: false })
        socket.emit('image-generated', imageData)
        
        // Broadcast to conversation
        io.to(conversationId).emit('message', imageData)
        
      } else {
        socket.emit('image-generating', { isGenerating: false })
        socket.emit('error', { message: 'No image generated' })
      }
      
    } catch (error) {
      console.error('Image Generation Error:', error)
      socket.emit('image-generating', { isGenerating: false })
      socket.emit('error', { 
        message: 'Failed to generate image',
        details: error.message 
      })
    }
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`)
    
    // Clean up old conversations (older than 1 hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    for (const [id, conversation] of conversations.entries()) {
      if (conversation.lastActivity < oneHourAgo) {
        conversations.delete(id)
        console.log(`Cleaned up old conversation: ${id}`)
      }
    }
  })

  // Get conversation list
  socket.on('get-conversations', () => {
    const conversationList = Array.from(conversations.values()).map(conv => ({
      id: conv.id,
      userId: conv.userId,
      messageCount: conv.messages.length,
      createdAt: conv.createdAt,
      lastActivity: conv.lastActivity
    }))
    
    socket.emit('conversations-list', conversationList)
  })
})

// Health check endpoint
httpServer.on('request', (req, res) => {
  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      status: 'healthy',
      service: 'ai-websocket-service',
      version: '1.0.0',
      activeConversations: conversations.size,
      connectedClients: io.engine.clientsCount,
      timestamp: new Date().toISOString()
    }))
  }
})

httpServer.listen(PORT, () => {
  console.log(`🚀 AI WebSocket Service running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`🔌 WebSocket endpoint: ws://localhost:${PORT}`)
})