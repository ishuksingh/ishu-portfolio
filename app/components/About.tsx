"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "8+", label: "Years in enterprise integration" },
  { value: "80+", label: "Platform users enabled (CoE at Samsara)" },
  { value: "5+", label: "Workato certifications" },
];

export default function About() {
  return (
    <section id="about" className="py-24 px-6 bg-background">
      <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-3xl font-bold text-foreground mb-6">About me</h2>
          <p className="text-muted leading-relaxed mb-4">
            I&apos;m Ishu Singh — a Workato-certified Integration and Automation
            Consultant with 8+ years of experience designing enterprise integration
            architecture, iPaaS platforms, and AI-driven automation ecosystems. I
            currently lead the Centre of Excellence for the Workato ONE Agentic
            Platform at Samsara, driving enterprise MCP strategy and multi-agent
            orchestration across BizTech.
          </p>
          <p className="text-muted leading-relaxed">
            I&apos;ve led platform migrations from MuleSoft to Workato, architected
            Order-to-Cash automations for Fortune-scale SaaS companies, and built
            HRIS integrations across Workday, Okta, and SuccessFactors. Previously
            a Solutions Consultant at Workato itself — I know the platform from
            both sides.
          </p>
          <a
            href="https://www.linkedin.com/in/ishusingh1/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-8 text-sm font-medium text-foreground underline underline-offset-4 hover:text-accent transition-colors"
          >
            Connect on LinkedIn →
          </a>
        </motion.div>

        <div className="flex flex-col gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="border-l-4 border-accent pl-6"
            >
              <p className="text-4xl font-bold text-foreground">{s.value}</p>
              <p className="text-muted mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
