"use client"

import { Upload, ShieldCheck, QrCode, Smartphone } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const steps = [
  {
    step: "01",
    icon: Upload,
    title: "Upload Certification",
    description:
      "Restaurant owners upload their halal certification documents from LPPOM MUI or other authorized bodies.",
  },
  {
    step: "02",
    icon: ShieldCheck,
    title: "Blockchain Verification",
    description:
      "Our smart contracts verify and store the certification on the Polygon blockchain, creating an immutable record.",
  },
  {
    step: "03",
    icon: QrCode,
    title: "Generate QR Code",
    description: "A unique QR code is generated linking directly to the blockchain verification record.",
  },
  {
    step: "04",
    icon: Smartphone,
    title: "Consumer Verification",
    description: "Customers scan the QR code to instantly verify the halal status and view certification details.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20">Process</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            How
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {" "}
              HalalChain{" "}
            </span>
            Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A simple four-step process to bring transparency and trust to halal verification
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative group">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-purple-500/50 to-transparent z-0" />
                )}

                <div className="glass rounded-3xl p-6 h-full hover:bg-white/[0.08] transition-all duration-300 relative z-10">
                  {/* Step number */}
                  <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 w-fit">
                    <Icon className="h-8 w-8 text-purple-400" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Visual Demo */}
        <div className="mt-20 glass rounded-3xl p-8 overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left: QR Demo */}
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-foreground mb-4">Try it yourself</h3>
              <p className="text-muted-foreground mb-6">
                Scan this demo QR code to see how the verification process works. You will be able to view the
                blockchain record and certification details.
              </p>

              {/* Demo QR */}
              <div className="inline-block p-6 bg-white rounded-2xl">
                <div className="w-48 h-48 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                  <QrCode className="w-32 h-32 text-gray-800" />
                </div>
              </div>
            </div>

            {/* Right: Verification Result */}
            <div className="glass-strong rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <span className="text-green-400 font-medium">Verification Successful</span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">Restaurant</span>
                  <span className="text-foreground font-medium">Warung Padang Sederhana</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">Certificate ID</span>
                  <span className="text-foreground font-mono text-sm">MUI-2025-001234</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">Certifying Body</span>
                  <span className="text-foreground font-medium">LPPOM MUI</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">Valid Until</span>
                  <span className="text-foreground font-medium">Dec 31, 2026</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-muted-foreground">Blockchain TX</span>
                  <span className="text-purple-400 font-mono text-sm">0x7f9e...a3b8</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
