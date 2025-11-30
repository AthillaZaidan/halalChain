import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  MapPin,
  Star,
  Clock,
  Phone,
  CheckCircle2,
  Shield,
  Share2,
  QrCode,
  Calendar,
  Building2,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { prisma } from "@/lib/prisma"

// Format date helper
function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Fetch from Prisma
  const restaurant = await prisma.restaurant.findUnique({
    where: { id }
  })

  if (!restaurant) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Explore
          </Link>

          {/* Hero Section */}
          <div className="glass rounded-3xl overflow-hidden mb-8">
            {/* Image */}
            <div className="relative h-64 md:h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-8xl">🍽️</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

              {/* Verification Badge */}
              <div className="absolute top-4 right-4">
                {restaurant.verified && (
                  <Badge className="bg-green-500 text-white border-0 px-4 py-2">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Blockchain Verified
                  </Badge>
                )}
              </div>
            </div>

            {/* Restaurant Info */}
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">{restaurant.name}</h1>
                    <Badge variant="secondary">{restaurant.cuisine}</Badge>
                  </div>
                  <p className="text-muted-foreground flex items-center gap-2 mb-4">
                    <MapPin className="h-4 w-4" />
                    {restaurant.address}
                  </p>
                  <p className="text-foreground/80 max-w-2xl">{restaurant.description}</p>
                </div>

                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                  <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500 text-white gap-2">
                    <Link href={`/verify/${restaurant.id}`}>
                      <QrCode className="h-4 w-4" />
                      View Certificate
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
                <div className="text-center p-4 rounded-xl bg-card/50">
                  <div className="flex items-center justify-center gap-1 text-yellow-400 mb-1">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="text-xl font-bold text-foreground">{restaurant.rating}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{restaurant.reviewCount} reviews</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-card/50">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Clock className="h-5 w-5 text-purple-400" />
                  </div>
                  <p className="text-sm font-medium text-foreground">{restaurant.openHours}</p>
                  <p className="text-xs text-muted-foreground">Open Hours</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-card/50">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Phone className="h-5 w-5 text-pink-400" />
                  </div>
                  <p className="text-sm font-medium text-foreground">{restaurant.phone}</p>
                  <p className="text-xs text-muted-foreground">Contact</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-card/50">
                  <p className="text-xl font-bold text-foreground mb-1">{restaurant.province}</p>
                  <p className="text-xs text-muted-foreground">Province</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Certification Details */}
            <div className="glass rounded-3xl p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-6">
                <FileText className="h-5 w-5 text-purple-400" />
                Halal Certification
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">Certificate ID</span>
                  <span className="text-foreground font-mono">{restaurant.certificationId}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">Certifying Authority</span>
                  <span className="text-foreground">{restaurant.issuingAuthority}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">Certified Date</span>
                  <span className="text-foreground">{formatDate(restaurant.certifiedDate)}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-muted-foreground">Valid Until</span>
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/20">{formatDate(restaurant.expiryDate)}</Badge>
                </div>
              </div>

              {/* Blockchain Record */}
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  <Shield className="h-4 w-4 text-cyan-400" />
                  Blockchain Record
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">Transaction Hash</span>
                    <code className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded block truncate">
                      {restaurant.txHash}
                    </code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Block</span>
                    <span className="text-xs font-mono text-foreground">{restaurant.blockNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Network</span>
                    <Badge variant="secondary" className="text-xs">
                      Polygon
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Supply Chain */}
            <div className="glass rounded-3xl p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-6">
                <Building2 className="h-5 w-5 text-pink-400" />
                Supply Chain Verification
              </h2>

              <div className="space-y-4">
                {/* Placeholder supply chain items since not in DB */}
                <div className="p-4 rounded-xl bg-card/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">Main Ingredients</span>
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      verified
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Verified Halal Supplier</p>
                </div>
                <div className="p-4 rounded-xl bg-card/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">Spice Supplier</span>
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      verified
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">CV Rempah Nusantara</p>
                </div>
                <div className="p-4 rounded-xl bg-card/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">Cooking Oil</span>
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      verified
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">PT Minyak Halal</p>
                </div>
              </div>

              {/* Audit History */}
              <div className="mt-6">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-4">
                  <Calendar className="h-4 w-4 text-orange-400" />
                  Audit History
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-card/50">
                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">Annual Certification</p>
                      <p className="text-xs text-muted-foreground">{formatDate(restaurant.certifiedDate)}</p>
                    </div>
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20 shrink-0">
                      Passed
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-card/50">
                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">Routine Inspection</p>
                      <p className="text-xs text-muted-foreground">6 months ago</p>
                    </div>
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20 shrink-0">
                      Passed
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code CTA */}
          <div className="mt-8 glass rounded-3xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 mb-4">
              <QrCode className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Verify This Restaurant</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Scan the QR code at the restaurant or click below to view the full blockchain verification certificate
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Link href={`/verify/${restaurant.id}`}>
                <Shield className="h-5 w-5 mr-2" />
                View Full Certificate
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
