'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  Image as ImageIcon,
  Zap,
  TrendingUp,
  Activity,
  Clock,
  Cpu,
  Database,
  Globe
} from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalMessages: number
  totalImages: number
  apiCalls: number
  uptime: number
  responseTime: number
  errorRate: number
}

interface ActivityData {
  time: string
  messages: number
  images: number
  users: number
}

interface ModelUsage {
  model: string
  usage: number
  cost: number
  requests: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 1247,
    activeUsers: 342,
    totalMessages: 45821,
    totalImages: 3421,
    apiCalls: 52342,
    uptime: 99.9,
    responseTime: 245,
    errorRate: 0.1
  })

  const [activityData, setActivityData] = useState<ActivityData[]>([
    { time: '00:00', messages: 120, images: 15, users: 45 },
    { time: '04:00', messages: 80, images: 8, users: 32 },
    { time: '08:00', messages: 340, images: 42, users: 156 },
    { time: '12:00', messages: 520, images: 68, users: 234 },
    { time: '16:00', messages: 480, images: 55, users: 198 },
    { time: '20:00', messages: 380, images: 38, users: 167 },
    { time: '23:59', messages: 220, images: 25, users: 89 }
  ])

  const [modelUsage, setModelUsage] = useState<ModelUsage[]>([
    { model: 'gpt-3.5-turbo', usage: 65, cost: 234.50, requests: 28471 },
    { model: 'gpt-4', usage: 25, cost: 456.78, requests: 10947 },
    { model: 'claude-3', usage: 8, cost: 123.45, requests: 3502 },
    { model: 'dall-e-3', usage: 2, cost: 89.23, requests: 892 }
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10) - 5,
        totalMessages: prev.totalMessages + Math.floor(Math.random() * 5),
        apiCalls: prev.apiCalls + Math.floor(Math.random() * 8),
        responseTime: Math.max(150, prev.responseTime + Math.floor(Math.random() * 20) - 10)
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const StatCard = ({ title, value, description, icon: Icon, trend }: {
    title: string
    value: string | number
    description: string
    icon: any
    trend?: number
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {description}
          {trend !== undefined && (
            <span className={`ml-1 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? '+' : ''}{trend}%
            </span>
          )}
        </p>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">QuantumFlow Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time analytics and system performance metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          description="Registered users"
          icon={Users}
          trend={12.5}
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers.toLocaleString()}
          description="Currently online"
          icon={Activity}
          trend={8.2}
        />
        <StatCard
          title="API Calls"
          value={stats.apiCalls.toLocaleString()}
          description="Total requests"
          icon={Zap}
          trend={15.7}
        />
        <StatCard
          title="Uptime"
          value={`${stats.uptime}%`}
          description="Last 30 days"
          icon={Clock}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
          <TabsTrigger value="models">Model Performance</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Message Activity
                </CardTitle>
                <CardDescription>
                  Hourly message and user activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityData.slice(0, 4).map((data, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{data.time}</span>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-3 w-3 text-blue-600" />
                          <span className="text-sm">{data.messages}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3 text-green-600" />
                          <span className="text-sm">{data.users}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Image Generation
                </CardTitle>
                <CardDescription>
                  Daily image generation stats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{stats.totalImages.toLocaleString()}</div>
                    <p className="text-sm text-muted-foreground">Total Images Generated</p>
                  </div>
                  <div className="space-y-2">
                    {activityData.slice(0, 4).map((data, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{data.time}</span>
                        <div className="flex items-center gap-2">
                          <ImageIcon className="h-3 w-3 text-purple-600" />
                          <span className="text-sm">{data.images}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Usage Distribution</CardTitle>
                <CardDescription>
                  API call breakdown by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Chat Completions</span>
                      <span>87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Image Generation</span>
                      <span>8%</span>
                    </div>
                    <Progress value={8} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Code Analysis</span>
                      <span>3%</span>
                    </div>
                    <Progress value={3} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Other</span>
                      <span>2%</span>
                    </div>
                    <Progress value={2} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Peak Usage Times</CardTitle>
                <CardDescription>
                  Most active hours of the day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activityData
                    .sort((a, b) => b.messages - a.messages)
                    .slice(0, 5)
                    .map((data, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{index + 1}</Badge>
                          <span className="text-sm font-medium">{data.time}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {data.messages} messages
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Model Usage</CardTitle>
              <CardDescription>
                Performance and cost breakdown by model
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {modelUsage.map((model, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{model.model}</span>
                      <Badge variant="outline">{model.usage}% usage</Badge>
                    </div>
                    <Progress value={model.usage} className="h-2" />
                    <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium text-foreground">{model.requests.toLocaleString()}</span>
                        <p>requests</p>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">${model.cost.toFixed(2)}</span>
                        <p>cost</p>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">{model.usage}%</span>
                        <p>share</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Average Response Time</span>
                    <span className="text-sm font-medium">{stats.responseTime}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Error Rate</span>
                    <span className="text-sm font-medium">{stats.errorRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Success Rate</span>
                    <span className="text-sm font-medium text-green-600">
                      {(100 - stats.errorRate).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Cache Hit Rate</span>
                    <span className="text-sm font-medium">94.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  System Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>CPU Usage</span>
                      <span>42%</span>
                    </div>
                    <Progress value={42} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Memory Usage</span>
                      <span>68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Storage</span>
                      <span>35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Network I/O</span>
                      <span>28%</span>
                    </div>
                    <Progress value={28} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}