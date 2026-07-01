"use client";

import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-5xl mx-auto text-center"
      >
        <h2 className="text-3xl font-bold text-foreground mb-4">Let&apos;s work together</h2>
        <p className="text-muted max-w-md mx-auto mb-10 leading-relaxed">
          Whether it&apos;s a quick question or a multi-month engagement — reach out and
          let&apos;s figure out if I can help.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://topmate.io/ishu_singh"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity shadow-lg shadow-accent/20"
          >
            Book on Topmate
          </a>
          <a
            href="https://www.linkedin.com/in/ishusingh1/"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-border text-foreground px-6 py-3 rounded-full font-medium hover:border-accent hover:text-accent transition-colors"
          >
            Connect on LinkedIn
          </a>
          <a
            href="https://mail.google.com/mail/?view=cm&to=ishu.kumar007@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-border text-foreground px-6 py-3 rounded-full font-medium hover:border-accent hover:text-accent transition-colors"
          >
            Send an email
          </a>
        </div>
      </motion.div>
    </section>
  );
}
