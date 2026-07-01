"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const caseStudies = [
  {
    id: "order-lifecycle",
    tag: "Integration Engineering",
    title: "End-to-End Order Lifecycle Automation",
    summary:
      "Designed and implemented a bi-directional integration between a CRM and ERP to automate order creation, fulfillment tracking, and a complex cancellation & replacement workflow — eliminating manual hand-offs across three systems.",
    stack: ["Salesforce", "NetSuite", "3PL", "CPQ"],
    problem:
      "A fast-growing enterprise had three systems — a CRM (Salesforce), an ERP (NetSuite), and a third-party logistics (3PL) platform — operating in silos. Order data had to be manually entered across systems, fulfillment updates were delayed, and contract cancellations triggered a multi-step replacement process that was entirely manual. The result: operational lag, revenue leakage, and a support burden on sales and ops teams.",
    flows: [
      {
        title: "Order Sync Process",
        steps: [
          {
            label: "Opportunity → Sales Order",
            detail:
              "When an opportunity is marked Ready to Ship in the CRM, the integration automatically creates a corresponding Sales Order in the ERP — no manual entry required.",
          },
          {
            label: "3PL Fulfillment",
            detail:
              "The ERP routes the order to the appropriate logistics partner. Once the 3PL confirms fulfillment, the Sales Order status is updated to Fulfilled.",
          },
          {
            label: "Status Sync Back to CRM",
            detail:
              "A scheduled sync pushes the fulfillment status back to the CRM, automatically closing the Opportunity as Closed Won — keeping the sales record accurate in real time.",
          },
        ],
      },
      {
        title: "Cancellation & Replacement (C&R) Process",
        steps: [
          {
            label: "Contract Cancellation Trigger",
            detail:
              "When a contract is cancelled in the CRM, the integration automatically initiates the C&R workflow — no manual kickoff needed.",
          },
          {
            label: "Opportunity Generation",
            detail:
              "For N cancelled contracts, the system creates exactly 1 Replacement/Upgrade Opportunity (consolidating the upsell) and N individual Cancellation Opportunities — each mapped to its source contract.",
          },
          {
            label: "Replacement Order Sync",
            detail:
              "The single Replacement/Upgrade Opportunity flows through the standard Order Sync process, resulting in a new Sales Order in the ERP and ultimately a Closed Won status.",
          },
          {
            label: "Cancellation Order Events",
            detail:
              "Each Cancellation Opportunity natively generates a Cancellation Order in the CRM, which triggers a CPQ Cancel Order Event — closing the loop on entitlements and billing downstream.",
          },
        ],
      },
    ],
    outcomes: [
      { metric: "0", label: "Manual order entries across systems" },
      { metric: "3×", label: "Faster C&R cycle time" },
      { metric: "100%", label: "Audit trail from opp to fulfillment" },
    ],
  },
  {
    id: "credit-amount-api",
    tag: "API Engineering · Workato",
    title: "Returns Credit Amount Calculation API",
    summary:
      "Designed and built a Workato-hosted REST API that automates prorated credit calculation during contract cancellations — replacing manual spreadsheet-based computation with a real-time integration across CPQ, ERP, and observability systems.",
    stack: ["Workato API Platform", "NetSuite", "Salesforce CPQ", "Splunk"],
    problem:
      "When a customer cancelled a contract mid-term, the finance team needed to calculate the prorated credit amount owed — factoring in payment frequency, return term, stub payments, and finance partner terms across multiple contract lines. This was done manually, was error-prone, and created bottlenecks in the C&R process. There was no programmatic way for upstream systems to request a credit calculation and get a structured result back.",
    flows: [
      {
        title: "API Request & Validation",
        steps: [
          {
            label: "Inbound API Call",
            detail:
              "Salesforce calls the Workato-hosted endpoint (POST /returns/v1/credit-amount-calculation) with the cancellation details — customer, billing contract ID, replaced quote, and a line-level array of contract details including return term, payment frequency, total amount, and stub payment flags.",
          },
          {
            label: "Request Logging & Validation",
            detail:
              "Every inbound request is logged to Splunk immediately. The recipe validates the payload and short-circuits with a structured 400 error response if required fields are missing — keeping upstream systems informed without silent failures.",
          },
          {
            label: "Async Handoff",
            detail:
              "The API returns a 200 acknowledgement immediately and dispatches the calculation to an async recipe function — decoupling the API response time from the computation and NetSuite write latency.",
          },
        ],
      },
      {
        title: "Credit Calculation & Write-Back",
        steps: [
          {
            label: "Create Credit Amount in NetSuite",
            detail:
              "The async function creates a Credit Amount header object in NetSuite, capturing the cancellation context. Each contract line is written as a Credit Amount Detail record in a batch job for efficiency.",
          },
          {
            label: "Error Handling & Status Tracking",
            detail:
              "If the batch job produces partial failures, the Credit Amount object is marked Workato Status = Failed with the error reason. A stop-with-failure prevents any partial data from flowing downstream — the Salesforce Quote is updated with the error reason for ops visibility.",
          },
          {
            label: "Prorated Amount Sync to Salesforce CPQ",
            detail:
              "On success, the Credit Amount object is marked Workato Status = Success. The recipe fetches the calculated prorated amount from NetSuite and writes it directly back to the Salesforce CPQ Quote — closing the loop without any manual data entry.",
          },
        ],
      },
    ],
    outcomes: [
      { metric: "0", label: "Manual credit calculations by finance team" },
      { metric: "<2s", label: "API acknowledgement to upstream systems" },
      { metric: "100%", label: "Audit trail in Splunk per API call" },
    ],
  },
  {
    id: "order-creation-engine",
    tag: "Integration Engineering · Workato",
    title: "Multi-Type Order Creation Engine",
    summary:
      "Built a Workato-orchestrated order creation engine that routes Revenue, Promo, and Free Trial opportunities through a shared pipeline into NetSuite — with type-specific logic, CPQ validation, deduplication, Python-based data transforms, and fault-tolerant retry handling.",
    stack: ["Workato", "Salesforce CPQ", "NetSuite", "Python", "Splunk"],
    problem:
      "A single order creation workflow had to handle three fundamentally different opportunity types — standard revenue orders, promotional orders with attachments and RMA linkage, and free trial orders — each with different Salesforce data shapes, NetSuite requirements, and post-creation actions. Handling them in separate pipelines meant duplicated logic and inconsistent error handling. Handling them in one undifferentiated flow meant brittle code and no type safety. The existing process also had no guard against duplicate syncs or CPQ quote mismatches reaching the ERP.",
    flows: [
      {
        title: "Opportunity Fetch & Validation",
        steps: [
          {
            label: "Type-Based SOQL Routing",
            detail:
              "Each opportunity type — Revenue, Promo, or Free Trial — triggers a distinct SOQL query optimized for what that type needs: Revenue queries include the linked Order and NetSuite ID; Promo queries pull attachments; Free Trial uses a lighter query. One function, three execution paths.",
          },
          {
            label: "Duplicate Sync Detection",
            detail:
              "Before processing, the recipe checks whether a NetSuite ID is already stamped on the Salesforce record. If present, the execution stops immediately — preventing double-orders from reaching the ERP.",
          },
          {
            label: "CPQ Quote Amount Validation",
            detail:
              "For Revenue opportunities, the recipe compares the Opportunity Amount against the CPQ Primary Quote Net Amount. A mismatch stops execution and writes the reason back to Salesforce — ensuring the ERP only receives quote-aligned orders.",
          },
        ],
      },
      {
        title: "Order Processing & ERP Write",
        steps: [
          {
            label: "Account Sync & Entity Lookups",
            detail:
              "Before creating the order, the recipe syncs the Account record to NetSuite, then validates that the Sales Rep (employee), Customer, and — for Billing 360 transactions — the Contract Line all exist in NetSuite. Any missing entity stops execution with a structured error.",
          },
          {
            label: "Python Data Transformation",
            detail:
              "A Python recipe function maps the Salesforce opportunity data to the NetSuite Sales Order schema — handling field additions, line duplication logic, and null-safe mapping. For Promo opportunities, the RMA/Return opportunity's NetSuite ID is resolved and linked to the order.",
          },
          {
            label: "Fault-Tolerant NetSuite Upsert",
            detail:
              "The Sales Order is upserted into NetSuite. On timeout, the recipe enters a polling loop using SuiteQL to check if the order was created server-side — avoiding duplicate creation and recovering gracefully from ERP latency spikes.",
          },
          {
            label: "Post-Creation Write-Back",
            detail:
              "On success, the NetSuite Sales Order ID is stamped back to Salesforce. Promo opportunities trigger an async update to the Opportunity record; Revenue opportunities update the Order record synchronously. Attachments and document links are also synced. On any failure, the error reason is written back to Salesforce so ops teams have immediate visibility.",
          },
        ],
      },
    ],
    outcomes: [
      { metric: "3", label: "Order types handled in one unified pipeline" },
      { metric: "0", label: "Duplicate ERP orders via deduplication guard" },
      { metric: "100%", label: "Errors surfaced back to Salesforce in real time" },
    ],
  },
];

function ProcessFlow({ flow }: { flow: (typeof caseStudies)[0]["flows"][0] }) {
  return (
    <div className="bg-surface rounded-2xl border border-border p-6">
      <h4 className="text-base font-semibold text-foreground mb-5">{flow.title}</h4>
      <ol className="space-y-4">
        {flow.steps.map((step, i) => (
          <li key={step.label} className="flex gap-4">
            <div className="flex-shrink-0 mt-0.5">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold">
                {i + 1}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-0.5">{step.label}</p>
              <p className="text-sm text-muted leading-relaxed">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function CaseStudyCard({
  study,
  active,
  onClick,
}: {
  study: (typeof caseStudies)[0];
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`flex-shrink-0 w-[300px] sm:w-[340px] bg-card rounded-2xl border overflow-hidden flex flex-col snap-start cursor-pointer transition-colors ${
        active ? "border-accent" : "border-border hover:border-accent/40"
      }`}
      onClick={onClick}
    >
      <div className="p-6 pb-4 flex-1">
        <span className="inline-block text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full mb-3">
          {study.tag}
        </span>
        <h3 className="text-base font-bold text-foreground mb-2 leading-snug">{study.title}</h3>
        <p className="text-muted text-xs leading-relaxed mb-4 line-clamp-3">{study.summary}</p>
        <div className="flex flex-wrap gap-1.5">
          {study.stack.map((s) => (
            <span key={s} className="text-xs text-muted border border-border rounded-full px-2.5 py-0.5">
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-border grid grid-cols-3 divide-x divide-border">
        {study.outcomes.map((o) => (
          <div key={o.label} className="px-3 py-3 text-center">
            <p className="text-lg font-bold text-accent">{o.metric}</p>
            <p className="text-[10px] text-muted mt-0.5 leading-tight">{o.label}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-border px-6 py-3">
        <span className={`text-xs font-medium transition-colors ${active ? "text-accent" : "text-muted"}`}>
          {active ? "Details below ↓" : "View full case study →"}
        </span>
      </div>
    </div>
  );
}

function DetailPanel({ study }: { study: (typeof caseStudies)[0] }) {
  return (
    <motion.div
      key={study.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="bg-card rounded-2xl border border-accent/30 overflow-hidden"
    >
      <div className="p-8 space-y-8">
        <div>
          <span className="inline-block text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full mb-3">
            {study.tag}
          </span>
          <h3 className="text-xl font-bold text-foreground mb-2">{study.title}</h3>
          <p className="text-muted text-sm leading-relaxed">{study.summary}</p>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">The Problem</h4>
          <p className="text-sm text-muted leading-relaxed">{study.problem}</p>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">The Solution</h4>
          <div className="grid sm:grid-cols-2 gap-4">
            {study.flows.map((flow) => (
              <ProcessFlow key={flow.title} flow={flow} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function CaseStudies() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="case-studies" className="py-24 px-6 bg-background">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Case Studies</h2>
            <p className="text-muted">Real integration problems, solved end-to-end.</p>
          </div>
          <p className="text-xs text-muted hidden sm:block">Click a card to explore →</p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: "none" }}
        >
          {caseStudies.map((study, i) => (
            <CaseStudyCard
              key={study.id}
              study={study}
              active={activeIndex === i}
              onClick={() => setActiveIndex(activeIndex === i ? null : i)}
            />
          ))}
          <div className="flex-shrink-0 w-2" />
        </motion.div>

        {/* Dot indicators */}
        <div className="flex gap-2 mt-4 mb-6 justify-center">
          {caseStudies.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${activeIndex === i ? "bg-accent" : "bg-border"}`}
            />
          ))}
        </div>

        {/* Full-width detail panel */}
        {activeIndex !== null && <DetailPanel study={caseStudies[activeIndex]} />}
      </div>
    </section>
  );
}
