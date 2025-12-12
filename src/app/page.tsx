'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Navigation } from '@/components/navigation/navigation'
import { 
  Brain, 
  Zap, 
  Shield, 
  Globe, 
  Code, 
  MessageSquare, 
  Image, 
  BarChart3,
  Users,
  Cpu,
  Lock,
  Sparkles,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

export default function Home() {
  const [activeTab, setActiveTab] = useState('features')

  const features = [
    {
      icon: Brain,
      title: 'Advanced AI Models',
      description: 'Access cutting-edge AI models including GPT-4, Claude, and more for intelligent conversations.',
      badge: 'Powered by QuantumFlow AI'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance with sub-second response times and real-time streaming.',
      badge: '99.9% Uptime'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade encryption, SOC2 compliance, and advanced threat protection.',
      badge: 'GDPR Compliant'
    },
    {
      icon: Globe,
      title: 'Global Scale',
      description: 'Distributed infrastructure across multiple regions for optimal performance.',
      badge: 'Auto-scaling'
    },
    {
      icon: Code,
      title: 'Developer Friendly',
      description: 'Comprehensive APIs, SDKs, and documentation for seamless integration.',
      badge: 'REST & GraphQL'
    },
    {
      icon: MessageSquare,
      title: 'Multi-Modal',
      description: 'Text, image, and voice capabilities in a unified platform.',
      badge: 'All-in-One'
    }
  ]

  const capabilities = [
    {
      icon: MessageSquare,
      title: 'Conversational AI',
      description: 'Natural language processing with context awareness and personality.',
      features: ['Context Memory', 'Multi-turn Dialog', 'Sentiment Analysis', 'Language Detection']
    },
    {
      icon: Image,
      title: 'Image Generation',
      description: 'Create stunning visuals from text descriptions using advanced diffusion models.',
      features: ['DALL-E Integration', 'Style Transfer', 'Image Editing', 'Batch Processing']
    },
    {
      icon: Code,
      title: 'Code Intelligence',
      description: 'AI-powered code generation, analysis, and optimization.',
      features: ['Code Completion', 'Bug Detection', 'Refactoring', 'Documentation']
    },
    {
      icon: BarChart3,
      title: 'Analytics & Insights',
      description: 'Comprehensive analytics for usage patterns and performance metrics.',
      features: ['Real-time Stats', 'Usage Analytics', 'Performance Monitoring', 'Custom Reports']
    }
  ]

  const stats = [
    { label: 'API Calls', value: '1B+', description: 'Processed monthly' },
    { label: 'Uptime', value: '99.9%', description: 'Reliability guarantee' },
    { label: 'Response Time', value: '<200ms', description: 'Average latency' },
    { label: 'Models', value: '50+', description: 'AI models available' }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'CTO at TechCorp',
      content: 'QuantumFlow AI has revolutionized our development workflow. The integration was seamless and the performance is outstanding.',
      avatar: 'SC'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Lead Developer',
      content: 'The most comprehensive AI platform we\'ve used. The multi-modal capabilities and enterprise security are game-changers.',
      avatar: 'MR'
    },
    {
      name: 'Emily Watson',
      role: 'Product Manager',
      content: 'Incredible power and flexibility. We\'ve reduced our AI development time by 80% with QuantumFlow.',
      avatar: 'EW'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="container mx-auto px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <Sparkles className="mr-2 h-4 w-4" />
              QuantumFlow AI Ecosystem v17.0
            </Badge>
            
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              The Future of{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Intelligence
              </span>
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              Experience the next generation of AI-powered applications with our comprehensive ecosystem. 
              Build, scale, and deploy intelligent solutions with unprecedented speed and reliability.
            </p>
            
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                View Documentation
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                  <div className="text-xs text-muted-foreground">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Powerful Features for Modern AI
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to build world-class AI applications
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="relative overflow-hidden border-0 bg-white/50 backdrop-blur-sm dark:bg-slate-800/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-20 sm:py-24 bg-white/50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Comprehensive AI Capabilities
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Explore our full range of AI-powered features
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="conversational">Chat</TabsTrigger>
              <TabsTrigger value="image">Images</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <div className="mt-8">
              {capabilities.map((capability, index) => (
                <TabsContent key={index} value={capability.title.toLowerCase().split(' ')[0]}>
                  <Card className="border-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <capability.icon className="h-12 w-12 text-blue-600" />
                        <div>
                          <CardTitle className="text-2xl">{capability.title}</CardTitle>
                          <CardDescription className="text-lg mt-2">
                            {capability.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {capability.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Trusted by Industry Leaders
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              See what our customers are saying about QuantumFlow AI
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 bg-white/50 backdrop-blur-sm dark:bg-slate-800/50">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <CardDescription>{testimonial.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-20 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Transform Your AI Strategy?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
              Join thousands of developers and companies building the future with QuantumFlow AI.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}