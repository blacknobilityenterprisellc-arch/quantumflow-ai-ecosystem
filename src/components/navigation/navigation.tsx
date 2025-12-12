'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  MessageSquare, 
  Sparkles, 
  ArrowRight,
  Brain,
  Zap,
  BarChart3,
  LogIn,
  LogOut,
  User
} from 'lucide-react'

export function Navigation() {
  const { data: session, status } = useSession()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold">QuantumFlow</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/chat" className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <MessageSquare className="h-4 w-4" />
                AI Chat
              </Link>
              <Link href="/dashboard" className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="hidden sm:flex items-center gap-1">
              <Zap className="h-3 w-3" />
              v17.0
            </Badge>
            
            {status === 'loading' ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            ) : session ? (
              <div className="flex items-center gap-3">
                <Link href="/chat">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Try AI Chat
                  </Button>
                </Link>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {session.user?.name?.charAt(0) || <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium">
                    {session.user?.name || 'User'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut()}
                    className="h-8 w-8 p-0"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/chat">
                  <Button variant="outline" className="hidden sm:flex">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Try AI Chat
                  </Button>
                </Link>
                <Link href="/auth/signin">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}