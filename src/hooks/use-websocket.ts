'use client'

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  model?: string
  usage?: any
  type?: 'text' | 'image'
  image?: string
  prompt?: string
  size?: string
}

interface UseWebSocketReturn {
  messages: Message[]
  isConnected: boolean
  isTyping: boolean
  isGeneratingImage: boolean
  sendMessage: (message: string) => void
  generateImage: (prompt: string) => void
  joinConversation: (conversationId?: string) => void
  error: string | null
}

export function useWebSocket(conversationId?: string): UseWebSocketReturn {
  const [messages, setMessages] = useState<Message[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const socketRef = useRef<Socket | null>(null)
  const currentConversationId = useRef<string | null>(null)

  useEffect(() => {
    // Initialize socket connection
    const socket = io('/?XTransformPort=3003', {
      transports: ['websocket', 'polling']
    })

    socketRef.current = socket

    socket.on('connect', () => {
      console.log('Connected to WebSocket service')
      setIsConnected(true)
      setError(null)
      
      // Join conversation if provided
      if (conversationId) {
        joinConversation(conversationId)
      } else {
        // Create new conversation
        joinConversation()
      }
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket service')
      setIsConnected(false)
    })

    socket.on('conversation-joined', (data) => {
      console.log('Joined conversation:', data.conversationId)
      currentConversationId.current = data.conversationId
      setMessages(data.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })))
    })

    socket.on('message', (message: Message) => {
      setMessages(prev => [...prev, {
        ...message,
        timestamp: new Date(message.timestamp)
      }])
    })

    socket.on('typing', (data: { isTyping: boolean }) => {
      setIsTyping(data.isTyping)
    })

    socket.on('image-generating', (data: { isGenerating: boolean }) => {
      setIsGeneratingImage(data.isGenerating)
    })

    socket.on('image-generated', (imageData: Message) => {
      setMessages(prev => [...prev, {
        ...imageData,
        timestamp: new Date(imageData.timestamp)
      }])
    })

    socket.on('error', (data: { message: string; details?: string }) => {
      console.error('WebSocket Error:', data)
      setError(data.message)
    })

    return () => {
      socket.disconnect()
    }
  }, [conversationId])

  const joinConversation = (convId?: string) => {
    if (socketRef.current) {
      socketRef.current.emit('join-conversation', {
        conversationId: convId,
        userId: 'web-user'
      })
    }
  }

  const sendMessage = (message: string) => {
    if (socketRef.current && currentConversationId.current) {
      socketRef.current.emit('message', {
        message,
        conversationId: currentConversationId.current,
        model: 'gpt-3.5-turbo',
        temperature: 0.7
      })
    }
  }

  const generateImage = (prompt: string) => {
    if (socketRef.current && currentConversationId.current) {
      socketRef.current.emit('generate-image', {
        prompt,
        conversationId: currentConversationId.current,
        size: '1024x1024'
      })
    }
  }

  return {
    messages,
    isConnected,
    isTyping,
    isGeneratingImage,
    sendMessage,
    generateImage,
    joinConversation,
    error
  }
}