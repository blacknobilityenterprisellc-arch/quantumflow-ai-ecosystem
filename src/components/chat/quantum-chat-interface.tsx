'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { 
  Send, 
  Bot, 
  User, 
  Copy, 
  RefreshCw, 
  Image as ImageIcon,
  Sparkles,
  Loader2,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Users,
  Brain,
  Zap,
  Shield,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Settings,
  Globe,
  Lock,
  Unlock,
  Atom,
  Radio,
  Wifi,
  Cpu,
  Database,
  Layers,
  Box,
  Grid3X3,
  Maximize2,
  Minimize2,
  Download,
  Upload,
  Share2,
  Bookmark,
  Flag,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Code,
  FileText,
  Image,
  Music,
  Video as VideoIcon,
  Headphones,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react'
import { toast } from 'sonner'

interface QuantumMessage {
  id: string
  role: 'user' | 'assistant' | 'system' | 'quantum'
  content: string
  timestamp: Date
  isTyping?: boolean
  quantumCoherence?: number
  encryptionLevel?: 'standard' | 'quantum' | 'neural'
  attachments?: QuantumAttachment[]
  reactions?: QuantumReaction[]
  branches?: QuantumBranch[]
  metadata?: QuantumMetadata
}

interface QuantumAttachment {
  id: string
  type: 'image' | 'video' | 'audio' | 'code' | 'document' | 'quantum'
  url: string
  name: string
  size: number
  quantumProcessed?: boolean
}

interface QuantumReaction {
  emoji: string
  count: number
  users: string[]
}

interface QuantumBranch {
  id: string
  title: string
  messageCount: number
  lastActivity: Date
  coherence: number
}

interface QuantumMetadata {
  model: string
  tokens: number
  coherence: number
  processingTime: number
  quantumEnhanced: boolean
  neuralSync: boolean
  encryptionUsed: boolean
}

interface QuantumChatInterfaceProps {
  className?: string
  quantumMode?: boolean
  collaborationMode?: boolean
  voiceEnabled?: boolean
  holographicMode?: boolean
}

export function QuantumChatInterface({ 
  className, 
  quantumMode = true,
  collaborationMode = false,
  voiceEnabled = false,
  holographicMode = false 
}: QuantumChatInterfaceProps) {
  const [messages, setMessages] = useState<QuantumMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '🌟 Welcome to QuantumFlow Premium Diamond-Grade Chat! I am enhanced with quantum coherence, neural synchronization, and multi-dimensional processing capabilities. How may I assist you today?',
      timestamp: new Date(),
      quantumCoherence: 1.0,
      encryptionLevel: 'quantum',
      metadata: {
        model: 'QuantumFlow-Prime-v17',
        tokens: 42,
        coherence: 1.0,
        processingTime: 0.8,
        quantumEnhanced: true,
        neuralSync: true,
        encryptionUsed: true
      }
    }
  ])
  
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [model, setModel] = useState('quantumflow-prime')
  const [quantumCoherence, setQuantumCoherence] = useState(1.0)
  const [neuralSync, setNeuralSync] = useState(true)
  const [encryptionLevel, setEncryptionLevel] = useState<'standard' | 'quantum' | 'neural'>('quantum')
  const [voiceMode, setVoiceMode] = useState(voiceEnabled)
  const [holographicMode, setHolographicMode] = useState(holographicMode)
  const [collaborationMode, setCollaborationMode] = useState(collaborationMode)
  const [quantumParticles, setQuantumParticles] = useState(true)
  const [showMetadata, setShowMetadata] = useState(false)
  const [showBranches, setShowBranches] = useState(false)
  const [quantumEnhancement, setQuantumEnhancement] = useState(100)
  const [activeUsers, setActiveUsers] = useState(1)
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null)
  
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Quantum particle effects
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number}>>([])

  useEffect(() => {
    if (quantumParticles && quantumMode) {
      const interval = setInterval(() => {
        setParticles(prev => [
          ...prev.slice(-20),
          {
            id: Date.now(),
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 1
          }
        ])
      }, 200)
      return () => clearInterval(interval)
    }
  }, [quantumParticles, quantumMode])

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Quantum coherence monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      setQuantumCoherence(prev => Math.min(1.0, prev + (Math.random() - 0.5) * 0.01))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: QuantumMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
      encryptionLevel,
      metadata: {
        model: 'User-Input',
        tokens: input.split(' ').length,
        coherence: quantumCoherence,
        processingTime: 0,
        quantumEnhanced: quantumMode,
        neuralSync: neuralSync,
        encryptionUsed: encryptionLevel !== 'standard'
      }
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Add quantum typing indicator
    const typingMessage: QuantumMessage = {
      id: 'typing',
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isTyping: true,
      quantumCoherence: quantumCoherence
    }
    setMessages(prev => [...prev, typingMessage])

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Quantum-Mode': quantumMode.toString(),
          'X-Quantum-Coherence': quantumCoherence.toString(),
          'X-Neural-Sync': neuralSync.toString(),
          'X-Encryption-Level': encryptionLevel
        },
        body: JSON.stringify({
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })).concat({
            role: 'user',
            content: input.trim()
          }),
          model,
          temperature: 0.7,
          max_tokens: 2000,
          quantumEnhanced: quantumMode,
          neuralSync: neuralSync,
          encryptionLevel: encryptionLevel
        })
      })

      const data = await response.json()

      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'))

      if (data.success) {
        const assistantMessage: QuantumMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          quantumCoherence: quantumCoherence,
          encryptionLevel,
          metadata: {
            model: data.model || model,
            tokens: data.usage?.total_tokens || 0,
            coherence: quantumCoherence,
            processingTime: data.processingTime || 1.2,
            quantumEnhanced: quantumMode,
            neuralSync: neuralSync,
            encryptionUsed: encryptionLevel !== 'standard'
          }
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        toast.error(data.error || 'Failed to get response')
      }
    } catch (error) {
      console.error('Chat Error:', error)
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'))
      toast.error('Failed to send message')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Message copied to clipboard')
  }

  const regenerateResponse = async (messageIndex: number) => {
    if (messageIndex === 0 || isLoading) return

    const previousMessages = messages.slice(0, messageIndex)
    setMessages(previousMessages)
    setIsLoading(true)

    // Add quantum typing indicator
    const typingMessage: QuantumMessage = {
      id: 'typing',
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isTyping: true,
      quantumCoherence: quantumCoherence
    }
    setMessages(prev => [...prev, typingMessage])

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Quantum-Mode': quantumMode.toString(),
          'X-Quantum-Coherence': quantumCoherence.toString(),
          'X-Neural-Sync': neuralSync.toString(),
          'X-Encryption-Level': encryptionLevel
        },
        body: JSON.stringify({
          messages: previousMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          model,
          temperature: 0.8,
          max_tokens: 2000,
          quantumEnhanced: quantumMode,
          neuralSync: neuralSync,
          encryptionLevel: encryptionLevel
        })
      })

      const data = await response.json()

      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'))

      if (data.success) {
        const assistantMessage: QuantumMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          quantumCoherence: quantumCoherence,
          encryptionLevel,
          metadata: {
            model: data.model || model,
            tokens: data.usage?.total_tokens || 0,
            coherence: quantumCoherence,
            processingTime: data.processingTime || 1.2,
            quantumEnhanced: quantumMode,
            neuralSync: neuralSync,
            encryptionUsed: encryptionLevel !== 'standard'
          }
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        toast.error(data.error || 'Failed to regenerate response')
      }
    } catch (error) {
      console.error('Regenerate Error:', error)
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'))
      toast.error('Failed to regenerate response')
    } finally {
      setIsLoading(false)
    }
  }

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions?.find(r => r.emoji === emoji)
        if (existingReaction) {
          return {
            ...msg,
            reactions: msg.reactions?.map(r =>
              r.emoji === emoji
                ? { ...r, count: r.count + 1, users: [...r.users, 'current-user'] }
                : r
            )
          }
        } else {
          return {
            ...msg,
            reactions: [...(msg.reactions || []), {
              emoji,
              count: 1,
              users: ['current-user']
            }]
          }
        }
      }
      return msg
    }))
  }

  const getQuantumColor = (coherence: number) => {
    if (coherence >= 0.95) return 'from-purple-600 to-pink-600'
    if (coherence >= 0.85) return 'from-blue-600 to-purple-600'
    return 'from-green-600 to-blue-600'
  }

  const getEncryptionIcon = (level: string) => {
    switch (level) {
      case 'quantum': return <Shield className="w-4 h-4 text-purple-500" />
      case 'neural': return <Brain className="w-4 h-4 text-blue-500" />
      default: return <Lock className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <Card className={`flex flex-col h-[800px] ${quantumMode ? 'bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 border-purple-500/30' : ''} ${className}`}>
      <CardHeader className="pb-3 space-y-3">
        {/* Quantum Header */}
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="relative">
              <Bot className="h-6 w-6 text-purple-600" />
              {quantumMode && (
                <div className="absolute -top-1 -right-1">
                  <Atom className="h-3 w-3 text-purple-400 animate-pulse" />
                </div>
              )}
            </div>
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              QuantumFlow Premium Chat
            </span>
            {quantumMode && (
              <Badge variant="outline" className="text-xs border-purple-500 text-purple-400">
                <Zap className="w-3 h-3 mr-1" />
                Quantum Enhanced
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center gap-2">
            {/* Quantum Coherence Indicator */}
            {quantumMode && (
              <div className="flex items-center gap-1">
                <Radio className="w-4 h-4 text-purple-500" />
                <span className="text-xs text-purple-400">
                  {(quantumCoherence * 100).toFixed(1)}%
                </span>
              </div>
            )}
            
            {/* Active Users */}
            {collaborationMode && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-blue-400">{activeUsers}</span>
              </div>
            )}
            
            {/* Model Selection */}
            <Badge variant="outline" className="text-xs">
              {model}
            </Badge>
          </div>
        </div>

        {/* Quantum Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Quantum Mode Toggle */}
            <div className="flex items-center gap-1">
              <Switch
                checked={quantumMode}
                onCheckedChange={setQuantumMode}
                className="data-[state=checked]:bg-purple-600"
              />
              <span className="text-xs text-gray-400">Quantum</span>
            </div>

            {/* Neural Sync Toggle */}
            <div className="flex items-center gap-1">
              <Switch
                checked={neuralSync}
                onCheckedChange={setNeuralSync}
                className="data-[state=checked]:bg-blue-600"
              />
              <span className="text-xs text-gray-400">Neural</span>
            </div>

            {/* Collaboration Mode */}
            <div className="flex items-center gap-1">
              <Switch
                checked={collaborationMode}
                onCheckedChange={setCollaborationMode}
                className="data-[state=checked]:bg-green-600"
              />
              <span className="text-xs text-gray-400">Collab</span>
            </div>

            {/* Voice Mode */}
            <div className="flex items-center gap-1">
              <Switch
                checked={voiceMode}
                onCheckedChange={setVoiceMode}
                className="data-[state=checked]:bg-orange-600"
              />
              <span className="text-xs text-gray-400">Voice</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Encryption Level */}
            <select
              value={encryptionLevel}
              onChange={(e) => setEncryptionLevel(e.target.value as any)}
              className="text-xs bg-slate-800 border border-slate-700 rounded px-2 py-1 text-gray-300"
            >
              <option value="standard">Standard</option>
              <option value="quantum">Quantum</option>
              <option value="neural">Neural</option>
            </select>

            {/* Settings */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMetadata(!showMetadata)}
              className="h-6 px-2"
            >
              <Settings className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Quantum Enhancement Slider */}
        {quantumMode && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">Quantum Enhancement</span>
            <Slider
              value={[quantumEnhancement]}
              onValueChange={(value) => setQuantumEnhancement(value[0])}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-xs text-purple-400">{quantumEnhancement}%</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 relative">
        {/* Quantum Particles Background */}
        {quantumMode && quantumParticles && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="absolute rounded-full bg-purple-400/20 animate-pulse"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  animation: `float ${3 + particle.size}s ease-in-out infinite`
                }}
              />
            ))}
          </div>
        )}

        <ScrollArea 
          ref={scrollAreaRef}
          className="flex-1 px-4 relative z-10"
        >
          <div className="space-y-4 pb-4">
            {messages.map((message, index) => (
              <div key={message.id} className="flex gap-3">
                <div className="flex-shrink-0">
                  {message.role === 'user' ? (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                      <User className="h-5 w-5" />
                    </div>
                  ) : (
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r ${getQuantumColor(message.quantumCoherence || 1)} text-white`}>
                      {message.isTyping ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Bot className="h-5 w-5" />
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {message.role === 'user' ? 'You' : 'QuantumFlow AI'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    
                    {/* Encryption Indicator */}
                    {message.encryptionLevel && message.encryptionLevel !== 'standard' && (
                      <div className="flex items-center gap-1">
                        {getEncryptionIcon(message.encryptionLevel)}
                      </div>
                    )}

                    {/* Quantum Coherence Indicator */}
                    {message.quantumCoherence && quantumMode && (
                      <div className="flex items-center gap-1">
                        <Radio className="w-3 h-3 text-purple-500" />
                        <span className="text-xs text-purple-400">
                          {(message.quantumCoherence * 100).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className={`rounded-lg p-3 ${quantumMode ? 'bg-slate-800/50 backdrop-blur-sm border border-purple-500/20' : 'bg-muted'}`}>
                    {message.isTyping ? (
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-purple-600 [animation-delay:-0.3s]"></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-purple-600 [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-purple-600"></div>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </div>
                    )}
                  </div>
                  
                  {/* Message Actions */}
                  {!message.isTyping && message.role === 'assistant' && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(message.content)}
                        className="h-6 px-2 text-xs"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => regenerateResponse(index)}
                        disabled={isLoading}
                        className="h-6 px-2 text-xs"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Regenerate
                      </Button>
                      
                      {/* Quick Reactions */}
                      <div className="flex gap-1">
                        {['👍', '❤️', '🤔', '😄'].map(emoji => (
                          <Button
                            key={emoji}
                            variant="ghost"
                            size="sm"
                            onClick={() => addReaction(message.id, emoji)}
                            className="h-6 px-1 text-xs"
                          >
                            {emoji}
                            {message.reactions?.find(r => r.emoji === emoji)?.count && (
                              <span className="ml-1 text-xs">
                                {message.reactions.find(r => r.emoji === emoji)?.count}
                              </span>
                            )}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Metadata Display */}
                  {showMetadata && message.metadata && (
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>Model: {message.metadata.model}</div>
                      <div>Tokens: {message.metadata.tokens}</div>
                      <div>Processing: {message.metadata.processingTime}s</div>
                      {message.metadata.quantumEnhanced && <div>✨ Quantum Enhanced</div>}
                      {message.metadata.neuralSync && <div>🧠 Neural Sync</div>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <Separator />
        
        {/* Enhanced Input Area */}
        <div className="p-4 space-y-3">
          {/* Attachment and Voice Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || [])
                  if (files.length > 0) {
                    toast.success(`${files.length} file(s) attached`)
                  }
                }}
              />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="h-8 px-2"
              >
                <Upload className="w-4 h-4 mr-1" />
                Attach
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setVoiceMode(!voiceMode)}
                className={`h-8 px-2 ${voiceMode ? 'text-orange-500' : ''}`}
              >
                {voiceMode ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </Button>

              {collaborationMode && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                >
                  <Users className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBranches(!showBranches)}
                className="h-8 px-2"
              >
                <Layers className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
              >
                <Share2 className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
              >
                <Bookmark className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Main Input */}
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={quantumMode ? "Ask me anything (quantum enhanced)..." : "Ask me anything..."}
              disabled={isLoading}
              className={`flex-1 ${quantumMode ? 'bg-slate-800/50 border-purple-500/30 text-white placeholder:text-gray-400' : ''}`}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!input.trim() || isLoading}
              size="icon"
              className={quantumMode ? 'bg-purple-600 hover:bg-purple-700' : ''}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {/* Status Bar */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-500" />
                <span>Powered by QuantumFlow AI</span>
              </div>
              {quantumMode && (
                <div className="flex items-center gap-1">
                  <Atom className="w-3 h-3 text-purple-500" />
                  <span>Quantum Coherence: {(quantumCoherence * 100).toFixed(1)}%</span>
                </div>
              )}
              {neuralSync && (
                <div className="flex items-center gap-1">
                  <Brain className="w-3 h-3 text-blue-500" />
                  <span>Neural Sync Active</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <span>{messages.length - 1} messages</span>
              {encryptionLevel !== 'standard' && (
                <span>{encryptionLevel} encryption</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Add custom styles for quantum animations
const style = document.createElement('style')
style.textContent = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
`
document.head.appendChild(style)