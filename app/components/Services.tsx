"use client";

import { motion } from "framer-motion";

const services = [
  {
    title: "Workato Consulting",
    description:
      "Architecture reviews, recipe design, and hands-on implementation help for teams building on Workato. From greenfield builds to rescuing complex integrations.",
    comingSoon: false,
  },
  {
    title: "Workato Training",
    description:
      "Structured training for individuals and teams — from Workato basics to advanced recipe patterns, error handling, and platform best practices.",
    comingSoon: false,
  },
  {
    title: "Workato One Agentic Services",
    description:
      "Design and build agentic workflows on Workato One. Copilots, multi-step AI agents, and LLM-powered automations grounded in real business logic.",
    comingSoon: false,
  },
  {
    title: "AI Consulting & Enterprise Workshops",
    description:
      "Strategic AI adoption guidance and bespoke workshops for enterprise teams. Helping organizations go from AI curiosity to AI-native operations.",
    comingSoon: true,
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 px-6 bg-surface">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Services</h2>
          <p className="text-muted mb-12">What I can help you with.</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`relative bg-card rounded-2xl p-6 sm:p-8 border border-border hover:border-accent/50 transition-colors ${
                s.comingSoon ? "opacity-60" : ""
              }`}
            >
              {s.comingSoon && (
                <span className="absolute top-5 right-5 text-xs font-semibold bg-surface text-muted px-3 py-1 rounded-full border border-border">
                  Coming soon
                </span>
              )}
              <h3 className="text-lg font-semibold text-foreground mb-3">{s.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
