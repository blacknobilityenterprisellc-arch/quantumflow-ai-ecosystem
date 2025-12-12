import { ChatInterface } from '@/components/chat/chat-interface'
import { WebSocketChat } from '@/components/chat/websocket-chat'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Bot, MessageSquare, Image, Settings, Wifi } from 'lucide-react'

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            QuantumFlow AI Chat
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Experience the power of advanced AI conversations
          </p>
        </div>

        <Tabs defaultValue="websocket" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
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
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="websocket" className="mt-6">
            <WebSocketChat />
          </TabsContent>

          <TabsContent value="standard" className="mt-6">
            <ChatInterface />
          </TabsContent>

          <TabsContent value="features" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    Conversational AI
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Natural language understanding</li>
                    <li>• Context-aware responses</li>
                    <li>• Multi-turn conversations</li>
                    <li>• Personality customization</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5 text-purple-600" />
                    Image Generation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Text-to-image generation</li>
                    <li>• Multiple aspect ratios</li>
                    <li>• High-quality outputs</li>
                    <li>• Style customization</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-green-600" />
                    Advanced Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Code generation & analysis</li>
                    <li>• Data processing</li>
                    <li>• Translation services</li>
                    <li>• Content creation</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-orange-600" />
                    Customization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Model selection</li>
                    <li>• Temperature control</li>
                    <li>• Response length limits</li>
                    <li>• API key management</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Chat Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">AI Model</label>
                    <div className="mt-1 flex gap-2">
                      <Badge variant="outline">gpt-3.5-turbo</Badge>
                      <Badge variant="outline">gpt-4</Badge>
                      <Badge variant="outline">claude-3</Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Temperature</label>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Controls randomness: 0 = focused, 1 = creative
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Max Tokens</label>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Maximum response length (default: 1000)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}