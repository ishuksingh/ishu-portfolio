"use client";

import { motion } from "framer-motion";
import Avatar from "@/app/components/Avatar";

type Testimonial = {
  quote: string;
  name: string;
  position: string;
  company: string;
  image: string | null;
  initials: string;
  avatarBg: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "Ishu brings deep expertise in Workato and a solid grasp of scalable, enterprise integration architecture. He played a critical role in modernizing workflows like Order-to-Cash and Returns, and was instrumental in our MuleSoft to Workato migration. What sets him apart is his architectural mindset — driving modular, event-driven patterns and building reusable, governed integrations across Salesforce and NetSuite. A highly reliable integration professional with clear potential to grow into an architect role.",
    name: "Amar Bura",
    position: "GTM Systems & Business Applications Leader",
    company: "Samsara",
    image: null,
    initials: "AB",
    avatarBg: "bg-blue-100 text-blue-700",
  },
  {
    quote:
      "Ishu has been instrumental in helping us reduce the time-to-live for our customers by 30%. He also played a vital role in reducing churn by 7%. The average CSAT score of 9.1 out of 10 is a testament to his commitment to excellent customer service. His positive attitude and teamwork have made a big impact on our organization.",
    name: "Wilson Liao",
    position: "Customer Success | 2x President's Club",
    company: "Workato",
    image: null,
    initials: "WL",
    avatarBg: "bg-emerald-100 text-emerald-700",
  },
  {
    quote:
      "Ishu's contributions on our integration platform projects were truly exceptional. His dedication to the HCM migration project was notable — he demonstrated a deep understanding of requirements and played a pivotal role in ensuring smooth and efficient execution. I highly recommend him for any application and business platform integration projects.",
    name: "Bhargav Krishna",
    position: "Enterprise Integrations Manager",
    company: "Zscaler",
    image: null,
    initials: "BK",
    avatarBg: "bg-violet-100 text-violet-700",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-6 bg-surface">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">What people say</h2>
          <p className="text-muted mb-12">From clients and collaborators.</p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="bg-card rounded-2xl p-8 border border-border flex flex-col justify-between hover:border-accent/50 transition-colors"
            >
              <p className="text-foreground/80 text-sm leading-relaxed mb-8">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <Avatar src={t.image} name={t.name} initials={t.initials} avatarBg={t.avatarBg} />
                <div>
                  <p className="font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-muted text-xs mt-0.5">{t.position}</p>
                  <p className="text-muted/70 text-xs">{t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-muted/70 mt-8">
          5 recommendations on{" "}
          <a
            href="https://www.linkedin.com/in/ishusingh1/details/recommendations/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            LinkedIn
          </a>
          {" "}— including Kiran H J and Nirban Badu.
        </p>
      </div>
    </section>
  );
}
