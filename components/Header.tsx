'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MoonIcon, SunIcon, LaptopIcon, Menu, Search, ChevronDown, UserCircle, X } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  // This should be fetched from your backend in a real application
  const userRank = 42

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <span className="text-primary-foreground font-bold">GW</span>
          </div>
        </Link>
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                {theme === 'light' ? <SunIcon className="h-5 w-5" /> : theme === 'dark' ? <MoonIcon className="h-5 w-5" /> : <LaptopIcon className="h-5 w-5" />}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <SunIcon className="mr-2 h-4 w-4" />
                <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <MoonIcon className="mr-2 h-4 w-4" />
                <span>Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <LaptopIcon className="mr-2 h-4 w-4" />
                <span>System</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 w-9 px-0"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search puzzles</span>
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <UserCircle className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href="/login">Log In</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/signup">Create Account</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
              <ScrollArea className="h-full w-full rounded-md">
                <div className="p-6">
                  <div className="py-4">
                    <h2 className="font-semibold">crossworduser</h2>
                    <p className="text-sm text-muted-foreground">user@example.com</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-medium">Rank Status</p>
                    <Link href="/ranking">
                      <Button variant="outline" className="mt-2 w-full justify-center">
                        {userRank}
                      </Button>
                    </Link>
                  </div>
                  <nav className="space-y-2">
                    <Link href="/dashboard" className="flex items-center py-2 px-3 rounded-md hover:bg-accent hover:text-accent-foreground">
                      Dashboard
                    </Link>
                    <Link href="/account" className="flex items-center py-2 px-3 rounded-md hover:bg-accent hover:text-accent-foreground">
                      Account Settings
                    </Link>
                    <Link href="/create-team" className="flex items-center py-2 px-3 rounded-md hover:bg-accent hover:text-accent-foreground">
                      Create Team
                    </Link>
                    <Button variant="ghost" className="w-full justify-start px-3 py-2 hover:bg-accent hover:text-accent-foreground">Log Out</Button>
                  </nav>
                  <div className="my-4 h-[1px] bg-border" />
                  <nav className="space-y-2">
                    <Collapsible>
                      <CollapsibleTrigger className="flex w-full items-center justify-between py-2 px-3 rounded-md hover:bg-accent hover:text-accent-foreground">
                        <span>Puzzles</span>
                        <ChevronDown className="h-4 w-4" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-4 space-y-2">
                        <Link href="/puzzles/solved" className="block py-2 px-3 rounded-md hover:bg-accent hover:text-accent-foreground">Solved</Link>
                        <Link href="/puzzles/working" className="block py-2 px-3 rounded-md hover:bg-accent hover:text-accent-foreground">Working</Link>
                        <Link href="/puzzles/liked" className="block py-2 px-3 rounded-md hover:bg-accent hover:text-accent-foreground">Liked</Link>
                      </CollapsibleContent>
                    </Collapsible>
                    <Collapsible>
                      <CollapsibleTrigger className="flex w-full items-center justify-between py-2 px-3 rounded-md hover:bg-accent hover:text-accent-foreground">
                        <span>Ranking</span>
                        <ChevronDown className="h-4 w-4" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-4 space-y-2">
                        <Link href="/dashboard" className="block py-2 px-3 rounded-md hover:bg-accent hover:text-accent-foreground">My Rank</Link>
                        <Link href="/ranking/how-it-works" className="block py-2 px-3 rounded-md hover:bg-accent hover:text-accent-foreground">How Ranking Works</Link>
                      </CollapsibleContent>
                    </Collapsible>
                    <Link href="/about" className="flex items-center py-2 px-3 rounded-md hover:bg-accent hover:text-accent-foreground">
                      About
                    </Link>
                  </nav>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {isSearchOpen && (
        <div className="container py-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search puzzles..." className="pl-8" />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 top-2 h-5 w-5"
              onClick={() => setIsSearchOpen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close search</span>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}