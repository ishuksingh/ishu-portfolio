"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import AgentCard from "@/app/components/AgentCard";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 hero-gradient opacity-60 dark:opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--accent-light)_0%,_transparent_60%)] opacity-40" />

      <div className="relative max-w-5xl mx-auto px-6 py-32 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* ── Left: Text ── */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 mb-7"
            >
              <div className="w-[52px] h-[52px] rounded-full overflow-hidden shrink-0 ring-2 ring-accent/30">
                <Image
                  src="/ishu.png"
                  alt="Ishu Singh"
                  width={52}
                  height={52}
                  className="object-cover object-top w-full h-full"
                  priority
                />
              </div>
              <div>
                <p className="font-semibold text-foreground">Hello, I am Ishu Singh!</p>
                <p className="text-xs text-accent uppercase tracking-widest font-medium">
                  I help SaaS companies automate operations
                </p>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl font-bold text-foreground leading-tight tracking-tight max-w-xl"
            >
              AI & Agentic Automation Specialist —{" "}
              <span className="text-accent">Enterprise MCP Strategy & Integration.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 text-lg text-muted max-w-lg leading-relaxed"
            >
              Workato consulting, training, and agentic platform architecture for teams
              that want production-ready automation — not just a proof of concept.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <a
                href="https://topmate.io/ishu_singh"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity shadow-lg shadow-accent/20"
              >
                Book a call
              </a>
              <a
                href="#services"
                className="border border-border text-foreground px-6 py-3 rounded-full font-medium hover:border-accent hover:text-accent transition-colors bg-card/50 backdrop-blur-sm"
              >
                See services
              </a>
            </motion.div>
          </div>

          {/* ── Right: Agent card ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="shrink-0"
          >
            <AgentCard />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
