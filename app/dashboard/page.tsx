"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Link2,
  Upload,
  QrCode,
  FileCheck,
  Clock,
  TrendingUp,
  Eye,
  Download,
  Plus,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Search,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Star,
  Users,
  MapPin,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

// Restaurant type based on Prisma schema
type Restaurant = {
  id: string
  name: string
  address: string
  province: string
  cuisine: string
  phone: string
  openHours: string
  description: string
  latitude: number
  longitude: number
  certificationId: string
  issuingAuthority: string
  certifiedDate: string
  expiryDate: string
  verified: boolean
  txHash: string
  blockNumber: string
  rating: number
  reviewCount: number
  qrScanCount: number
  createdAt: string
  updatedAt: string
}

const recentScans = [
  { time: "2 mins ago", location: "Jakarta", device: "iPhone 15 Pro" },
  { time: "15 mins ago", location: "Bandung", device: "Samsung Galaxy S24" },
  { time: "1 hour ago", location: "Surabaya", device: "Android" },
  { time: "3 hours ago", location: "Yogyakarta", device: "iPhone 14" },
  { time: "5 hours ago", location: "Semarang", device: "Xiaomi 14" },
]

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeNav, setActiveNav] = useState("Dashboard")
  const [userRestaurant, setUserRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch user's restaurant from API
  useEffect(() => {
    async function fetchRestaurant() {
      try {
        const res = await fetch('/api/restaurants')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        // Get first restaurant as user's restaurant (demo purpose)
        if (data.length > 0) {
          setUserRestaurant(data[0])
        }
      } catch (err) {
        console.error('Failed to fetch restaurant:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchRestaurant()
  }, [])

  // Calculate stats based on userRestaurant
  const stats = userRestaurant ? [
    {
      title: "Total Verifications",
      value: "1,234",
      change: "+12%",
      icon: Eye,
      gradient: "from-purple-500 to-purple-600",
    },
    {
      title: "QR Scans",
      value: userRestaurant.qrScanCount?.toString() || "0",
      change: "+28%",
      icon: QrCode,
      gradient: "from-pink-500 to-pink-600",
    },
    {
      title: "Active Certificates",
      value: "1",
      change: "Valid",
      icon: FileCheck,
      gradient: "from-green-500 to-green-600",
    },
    {
      title: "Days Until Expiry",
      value: (() => {
        const expiry = new Date(userRestaurant.expiryDate)
        const today = new Date()
        return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)).toString()
      })(),
      change: "On Track",
      icon: Clock,
      gradient: "from-cyan-500 to-cyan-600",
    },
  ] : []

  const certificates = userRestaurant ? [
    {
      id: userRestaurant.certificationId,
      name: "Main Restaurant License",
      authority: userRestaurant.issuingAuthority || "LPPOM MUI",
      issuedDate: userRestaurant.certifiedDate,
      expiryDate: userRestaurant.expiryDate,
      status: "active",
      txHash: userRestaurant.txHash,
    },
  ] : []

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // No restaurant state
  if (!userRestaurant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No restaurant found. Please add a restaurant first.</p>
          <Button asChild>
            <Link href="/">Go to Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                <Link2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">HalalChain</span>
            </Link>
            <button className="lg:hidden text-muted-foreground" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {[
              { name: "Dashboard", icon: TrendingUp, href: "/dashboard" },
              { name: "Certificates", icon: FileCheck, href: "/dashboard" },
              { name: "QR Codes", icon: QrCode, href: "/dashboard" },
              { name: "Analytics", icon: Eye, href: "/dashboard" },
              { name: "Suppliers", icon: Users, href: "/dashboard" },
              { name: "Settings", icon: Settings, href: "/dashboard" },
            ].map((item) => {
              const Icon = item.icon
              const isActive = activeNav === item.name
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveNav(item.name)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
                    isActive
                      ? "bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-foreground"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "text-purple-400" : ""}`} />
                  {item.name}
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400" />}
                </button>
              )
            })}
          </nav>

          {/* Back to Home */}
          <div className="p-4 border-t border-border">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors"
            >
              <MapPin className="h-5 w-5" />
              Back to Map
            </Link>
          </div>

          {/* User */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                WP
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{userRestaurant.name}</p>
                <p className="text-xs text-muted-foreground truncate">{userRestaurant.address}</p>
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <div className="flex items-center gap-4">
              <button className="lg:hidden text-foreground" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-6 w-6" />
              </button>
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search certificates..." className="pl-10 w-64 bg-card border-border" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg hover:bg-white/5 text-muted-foreground">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full" />
              </button>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Upload Certificate</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 lg:p-8">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-1">Welcome back, {userRestaurant.name}</h1>
            <p className="text-muted-foreground">Manage your halal certifications and track verifications</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="glass rounded-2xl p-5 hover:bg-white/[0.08] transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              )
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Certificates Table */}
            <div className="lg:col-span-2 glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Your Certificates</h2>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Upload className="h-4 w-4" />
                  Upload New
                </Button>
              </div>

              <div className="space-y-4">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-card/50 hover:bg-card/80 transition-colors gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-xl ${
                          cert.status === "active" ? "bg-green-500/10" : "bg-yellow-500/10"
                        }`}
                      >
                        {cert.status === "active" ? (
                          <CheckCircle2 className="h-5 w-5 text-green-400" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-yellow-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{cert.name}</p>
                        <p className="text-sm text-muted-foreground">{cert.id}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {cert.authority}
                          </Badge>
                          <span className="text-xs text-muted-foreground">Expires: {cert.expiryDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <QrCode className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="ghost" className="w-full mt-4 text-muted-foreground">
                View All Certificates
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* QR Code Preview */}
              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-4">Your Verification QR</h3>
                <div className="bg-white rounded-xl p-6 flex items-center justify-center mb-4">
                  <QrCode className="w-32 h-32 text-gray-800" />
                </div>
                <p className="text-xs text-center text-muted-foreground mb-4">
                  Certificate: {userRestaurant.certificationId}
                </p>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white">Download</Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Share
                  </Button>
                </div>
              </div>

              {/* Recent Scans */}
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Recent Scans</h3>
                  <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">Live</Badge>
                </div>
                <div className="space-y-3">
                  {recentScans.map((scan, index) => (
                    <div key={index} className="flex items-center gap-3 py-2">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{scan.location}</p>
                        <p className="text-xs text-muted-foreground">{scan.device}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{scan.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-4">This Month</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-xl bg-card/50">
                    <Star className="h-5 w-5 text-yellow-400 mx-auto mb-2" />
                    <p className="text-xl font-bold text-foreground">{userRestaurant.rating}</p>
                    <p className="text-xs text-muted-foreground">Avg Rating</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-card/50">
                    <Users className="h-5 w-5 text-purple-400 mx-auto mb-2" />
                    <p className="text-xl font-bold text-foreground">{userRestaurant.reviewCount}</p>
                    <p className="text-xs text-muted-foreground">Reviews</p>
                  </div>
                </div>
              </div>

              {/* Supplier Status - Placeholder since ingredients not in DB */}
              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-4">Supplier Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-card/50">
                    <div>
                      <p className="text-sm font-medium text-foreground">Main Ingredients</p>
                      <p className="text-xs text-muted-foreground">Verified Supplier</p>
                    </div>
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      verified
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
