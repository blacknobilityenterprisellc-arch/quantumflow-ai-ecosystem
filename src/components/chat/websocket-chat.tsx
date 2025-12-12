'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useWebSocket } from '@/hooks/use-websocket'
import { 
  Send, 
  Bot, 
  User, 
  Copy, 
  RefreshCw, 
  Image as ImageIcon,
  Sparkles,
  Loader2,
  Wifi,
  WifiOff,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'

interface WebSocketChatProps {
  className?: string
}

export function WebSocketChat({ className }: WebSocketChatProps) {
  const [input, setInput] = useState('')
  const [imagePrompt, setImagePrompt] = useState('')
  const [showImageInput, setShowImageInput] = useState(false)
  
  const {
    messages,
    isConnected,
    isTyping,
    isGeneratingImage,
    sendMessage,
    generateImage,
    error
  } = useWebSocket()

  const handleSendMessage = () => {
    if (!input.trim() || !isConnected) return
    sendMessage(input.trim())
    setInput('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleGenerateImage = () => {
    if (!imagePrompt.trim() || !isConnected) return
    generateImage(imagePrompt.trim())
    setImagePrompt('')
    setShowImageInput(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Message copied to clipboard')
  }

  return (
    <Card className={`flex flex-col h-[600px] ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            QuantumFlow AI Chat (Live)
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
              {isConnected ? (
                <>
                  <Wifi className="h-3 w-3 mr-1" />
                  Connected
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 mr-1" />
                  Disconnected
                </>
              )}
            </Badge>
            <Badge variant="outline" className="text-xs">
              WebSocket
            </Badge>
          </div>
        </div>
        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 pb-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <Bot className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <p>Start a conversation with QuantumFlow AI</p>
              </div>
            )}
            
            {messages.map((message) => (
              <div key={message.id} className="flex gap-3">
                <div className="flex-shrink-0">
                  {message.role === 'user' ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                      <User className="h-4 w-4" />
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      <Bot className="h-4 w-4" />
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
                    {message.model && (
                      <Badge variant="outline" className="text-xs">
                        {message.model}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="rounded-lg bg-muted p-3">
                    {message.type === 'image' && message.image ? (
                      <div className="space-y-2">
                        <img 
                          src={message.image} 
                          alt={message.prompt}
                          className="max-w-full rounded-lg"
                        />
                        {message.prompt && (
                          <p className="text-xs text-muted-foreground italic">
                            Prompt: {message.prompt}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </div>
                    )}
                  </div>
                  
                  {message.role === 'assistant' && message.type !== 'image' && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(message.content)}
                        className="h-6 px-2 text-xs"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
                <div className="flex-1">
                  <div className="rounded-lg bg-muted p-3">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.3s]"></div>
                      <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.15s]"></div>
                      <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {isGeneratingImage && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <ImageIcon className="h-4 w-4 animate-pulse" />
                </div>
                <div className="flex-1">
                  <div className="rounded-lg bg-muted p-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating image...
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <Separator />
        
        <div className="p-4">
          {showImageInput && (
            <div className="mb-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <div className="flex gap-2">
                <Input
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleGenerateImage()}
                  placeholder="Describe the image you want to generate..."
                  className="flex-1"
                />
                <Button 
                  onClick={handleGenerateImage}
                  disabled={!imagePrompt.trim() || isGeneratingImage}
                  size="sm"
                  variant="outline"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Generate
                </Button>
                <Button 
                  onClick={() => setShowImageInput(false)}
                  size="sm"
                  variant="ghost"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              disabled={!isConnected}
              className="flex-1"
            />
            <Button 
              onClick={() => setShowImageInput(!showImageInput)}
              disabled={!isConnected}
              size="icon"
              variant="outline"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button 
              onClick={handleSendMessage} 
              disabled={!input.trim() || !isConnected}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3 w-3 text-blue-600" />
              <span className="text-xs text-muted-foreground">
                Real-time AI responses via WebSocket
              </span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {messages.length} messages
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}