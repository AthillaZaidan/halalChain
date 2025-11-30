"use client"

import { Shield, QrCode, MapPin, Users, Clock, Database, ArrowUpRight, Link2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const features = [
  {
    icon: Shield,
    title: "Blockchain Verified",
    description: "Immutable certification records that cannot be forged or tampered with",
    gradient: "from-purple-500 to-purple-600",
    size: "large",
  },
  {
    icon: QrCode,
    title: "QR Verification",
    description: "Instant scan to verify halal status",
    gradient: "from-pink-500 to-pink-600",
    size: "small",
  },
  {
    icon: MapPin,
    title: "Interactive Map",
    description: "Find restaurants across Indonesia",
    gradient: "from-cyan-500 to-cyan-600",
    size: "small",
  },
  {
    icon: Database,
    title: "Smart Contracts",
    description: "Automated certification checks and expiry alerts powered by Polygon blockchain",
    gradient: "from-emerald-500 to-emerald-600",
    size: "large",
  },
  {
    icon: Users,
    title: "Community Reviews",
    description: "Crowdsourced verification and ratings",
    gradient: "from-orange-500 to-orange-600",
    size: "small",
  },
  {
    icon: Clock,
    title: "Real-time Updates",
    description: "Live certification status changes",
    gradient: "from-blue-500 to-blue-600",
    size: "small",
  },
]

const stats = [
  { value: "231M+", label: "Muslim Population" },
  { value: "$178B", label: "Global Halal Market" },
  { value: "99.9%", label: "Uptime Guarantee" },
  { value: "24/7", label: "Support Available" },
]

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-pink-500/10 text-pink-400 border-pink-500/20 hover:bg-pink-500/20">
            Core Features
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Powered by
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {" "}
              Blockchain{" "}
            </span>
            Technology
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform combines cutting-edge blockchain technology with intuitive design to deliver transparent and
            trustworthy halal verification.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isLarge = feature.size === "large"

            return (
              <div
                key={index}
                className={`group glass rounded-3xl p-6 hover:bg-white/[0.08] transition-all duration-300 cursor-pointer ${
                  isLarge ? "lg:col-span-2" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${feature.gradient}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>

                {isLarge && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-background"
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">+10K verifications</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Stats Banner */}
        <div className="glass-strong rounded-3xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Card */}
        <div className="mt-16 relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 animate-gradient" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]" />

          <div className="relative glass p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Ready to verify your restaurant?</h3>
              <p className="text-muted-foreground max-w-xl">
                Join thousands of halal-certified restaurants on the blockchain. Get your unique QR code and build trust
                with your customers.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500">
                <Link2 className="h-8 w-8 text-white" />
              </div>
              <button className="px-8 py-4 rounded-xl bg-foreground text-background font-semibold hover:bg-foreground/90 transition-colors">
                Register Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
