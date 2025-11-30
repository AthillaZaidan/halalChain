import {
  CheckCircle2,
  Shield,
  Calendar,
  Building2,
  FileText,
  ExternalLink,
  ArrowLeft,
  Share2,
  Download,
  QrCode,
  Link2,
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/prisma"

// Format date helper
function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function VerifyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Fetch from Prisma
  const restaurant = await prisma.restaurant.findUnique({
    where: { id }
  })

  if (!restaurant) {
    notFound()
  }

  // Calculate days until expiry
  const expiryDate = new Date(restaurant.expiryDate)
  const today = new Date()
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-8">
        {/* Back Button */}
        <Link
          href={`/restaurant/${restaurant.id}`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Restaurant
        </Link>

        {/* Header with Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-lg opacity-50" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                <Link2 className="h-6 w-6 text-white" />
              </div>
            </div>
            <span className="text-2xl font-bold text-foreground">HalalChain</span>
          </Link>
        </div>

        {/* Verification Status Card */}
        <div className="glass rounded-3xl p-8 mb-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-400" />
          </div>

          <Badge className="mb-4 bg-green-500/10 text-green-400 border-green-500/20 px-4 py-1">
            <div className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
            Blockchain Verified
          </Badge>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Halal Certification Valid</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            This restaurant&apos;s halal certification has been verified on the blockchain and is currently active.
          </p>

          {/* Expiry Countdown */}
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50">
            <Calendar className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-foreground">
              Valid for <span className="font-semibold text-green-400">{daysUntilExpiry}</span> more days
            </span>
          </div>
        </div>

        {/* Restaurant Info */}
        <div className="glass rounded-3xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">{restaurant.name}</h2>
              <p className="text-muted-foreground">{restaurant.address}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Certificate Details Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Certificate Info */}
          <div className="glass rounded-3xl p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-6">
              <FileText className="h-5 w-5 text-purple-400" />
              Certificate Details
            </h3>

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
                <span className="text-muted-foreground">Issue Date</span>
                <span className="text-foreground">{formatDate(restaurant.certifiedDate)}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-muted-foreground">Expiry Date</span>
                <span className="text-foreground">{formatDate(restaurant.expiryDate)}</span>
              </div>
            </div>
          </div>

          {/* Blockchain Info */}
          <div className="glass rounded-3xl p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-6">
              <Shield className="h-5 w-5 text-cyan-400" />
              Blockchain Record
            </h3>

            <div className="space-y-4">
              <div className="py-3 border-b border-border">
                <span className="text-sm text-muted-foreground block mb-1">Transaction Hash</span>
                <div className="flex items-center gap-2">
                  <code className="text-sm text-purple-400 bg-purple-500/10 px-2 py-1 rounded truncate flex-1">
                    {restaurant.txHash}
                  </code>
                  <Button variant="ghost" size="sm" asChild>
                    <a
                      href={`https://polygonscan.com/tx/${restaurant.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">Block Number</span>
                <span className="text-foreground font-mono">{restaurant.blockNumber}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-muted-foreground">Network</span>
                <Badge variant="secondary">Polygon</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Supply Chain */}
        <div className="glass rounded-3xl p-6 mb-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-6">
            <Building2 className="h-5 w-5 text-pink-400" />
            Supply Chain Verification
          </h3>

          <div className="grid sm:grid-cols-3 gap-4">
            {/* Placeholder supply chain items */}
            <div className="bg-card/50 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">verified</Badge>
              </div>
              <p className="font-medium text-foreground mb-1">Main Ingredients</p>
              <p className="text-sm text-muted-foreground">Verified Halal Supplier</p>
            </div>
            <div className="bg-card/50 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">verified</Badge>
              </div>
              <p className="font-medium text-foreground mb-1">Spice Supplier</p>
              <p className="text-sm text-muted-foreground">CV Rempah Nusantara</p>
            </div>
            <div className="bg-card/50 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">verified</Badge>
              </div>
              <p className="font-medium text-foreground mb-1">Cooking Oil</p>
              <p className="text-sm text-muted-foreground">PT Minyak Halal</p>
            </div>
          </div>
        </div>

        {/* Audit History */}
        <div className="glass rounded-3xl p-6 mb-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-6">
            <Calendar className="h-5 w-5 text-orange-400" />
            Audit History
          </h3>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-card/50">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Annual Certification</p>
                <p className="text-sm text-muted-foreground">{formatDate(restaurant.certifiedDate)}</p>
              </div>
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Passed</Badge>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-card/50">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Routine Inspection</p>
                <p className="text-sm text-muted-foreground">6 months ago</p>
              </div>
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Passed</Badge>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="glass rounded-3xl p-6 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-4">Verification QR Code</h3>
          <div className="inline-flex items-center justify-center bg-white rounded-2xl p-6 mb-4">
            <QrCode className="w-40 h-40 text-gray-800" />
          </div>
          <p className="text-sm text-muted-foreground mb-4">Scan this QR code to verify the halal certification</p>
          <div className="flex justify-center gap-2">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Download QR
            </Button>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white gap-2">
              <Share2 className="h-4 w-4" />
              Share Certificate
            </Button>
          </div>
        </div>

        {/* Footer Notice */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            This verification page is powered by HalalChain blockchain technology.
            <br />
            Data is immutable and cannot be tampered with.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-4 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <Link2 className="h-4 w-4" />
            Learn more about HalalChain
          </Link>
        </div>
      </div>
    </div>
  )
}
