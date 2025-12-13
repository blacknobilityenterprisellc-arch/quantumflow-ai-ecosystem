'use client'

import { ChatInterface } from '@/components/chat/chat-interface'
import { QuantumChatInterface } from '@/components/chat/quantum-chat-interface'
import { WebSocketChat } from '@/components/chat/websocket-chat'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Bot, MessageSquare, Image, Settings, Wifi, Sparkles, Atom, Brain, Shield } from 'lucide-react'

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              🌟 QuantumFlow Premium Chat
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            World's most advanced AI chat interface with quantum coherence, neural synchronization, and multi-dimensional processing
          </p>
          <div className="flex justify-center items-center gap-4 mt-4">
            <Badge variant="outline" className="border-purple-500 text-purple-400">
              <Sparkles className="w-3 h-3 mr-1" />
              Quantum Enhanced
            </Badge>
            <Badge variant="outline" className="border-blue-500 text-blue-400">
              <Brain className="w-3 h-3 mr-1" />
              Neural Sync
            </Badge>
            <Badge variant="outline" className="border-green-500 text-green-400">
              <Shield className="w-3 h-3 mr-1" />
              Quantum Encryption
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="quantum" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="quantum" className="flex items-center gap-2">
              <Atom className="h-4 w-4" />
              Quantum
            </TabsTrigger>
            <TabsTrigger value="websocket" className="flex items-center gap-2">
              <Wifi className="h-4 w-4" />
              Live Chat
            </TabsTrigger>
            <TabsTrigger value="standard" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Standard
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Features
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quantum" className="mt-6">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold mb-2 text-purple-400">🌟 Quantum Premium Interface</h2>
              <p className="text-gray-400">
                Experience the future of AI chat with quantum coherence monitoring, neural synchronization, and multi-dimensional processing
              </p>
            </div>
            <QuantumChatInterface 
              quantumMode={true}
              collaborationMode={false}
              voiceEnabled={false}
              holographicMode={true}
              className="mx-auto"
            />
          </TabsContent>

          <TabsContent value="websocket" className="mt-6">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold mb-2 text-blue-400">📡 Real-time WebSocket Chat</h2>
              <p className="text-gray-400">
                Connect with real-time messaging and instant responses
              </p>
            </div>
            <WebSocketChat />
          </TabsContent>

          <TabsContent value="standard" className="mt-6">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold mb-2 text-green-400">💬 Standard Chat Interface</h2>
              <p className="text-gray-400">
                Classic AI chat experience with reliable responses
              </p>
            </div>
            <ChatInterface />
          </TabsContent>

          <TabsContent value="features" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Quantum Features */}
              <Card className="border-purple-500/30 bg-purple-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-400">
                    <Atom className="h-5 w-5" />
                    Quantum Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Quantum coherence monitoring</li>
                    <li>• Neural synchronization</li>
                    <li>• Quantum encryption</li>
                    <li>• Multi-dimensional processing</li>
                    <li>• Quantum-enhanced responses</li>
                    <li>• Real-time coherence optimization</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Advanced AI */}
              <Card className="border-blue-500/30 bg-blue-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-400">
                    <Brain className="h-5 w-5" />
                    Advanced AI
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Natural language understanding</li>
                    <li>• Context-aware responses</li>
                    <li>• Multi-turn conversations</li>
                    <li>• Code generation & analysis</li>
                    <li>• Data processing</li>
                    <li>• Translation services</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Security */}
              <Card className="border-green-500/30 bg-green-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-400">
                    <Shield className="h-5 w-5" />
                    Security & Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• End-to-end encryption</li>
                    <li>• Quantum-resistant security</li>
                    <li>• Neural-level encryption</li>
                    <li>• Secure data handling</li>
                    <li>• Privacy protection</li>
                    <li>• Audit logging</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Collaboration */}
              <Card className="border-orange-500/30 bg-orange-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-400">
                    <Wifi className="h-5 w-5" />
                    Collaboration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Real-time collaboration</li>
                    <li>• Multi-user support</li>
                    <li>• Live synchronization</li>
                    <li>• Shared workspaces</li>
                    <li>• Team messaging</li>
                    <li>• Voice synthesis</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Media */}
              <Card className="border-pink-500/30 bg-pink-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-pink-400">
                    <Image className="h-5 w-5" />
                    Media & Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Image generation</li>
                    <li>• Video processing</li>
                    <li>• Audio synthesis</li>
                    <li>• File attachments</li>
                    <li>• Content creation</li>
                    <li>• Media analysis</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Customization */}
              <Card className="border-indigo-500/30 bg-indigo-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-indigo-400">
                    <Settings className="h-5 w-5" />
                    Customization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Model selection</li>
                    <li>• Temperature control</li>
                    <li>• Response length limits</li>
                    <li>• Personality settings</li>
                    <li>• Theme customization</li>
                    <li>• API key management</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}