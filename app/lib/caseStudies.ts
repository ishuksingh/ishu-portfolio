export interface CaseStudy {
  id: string;
  title: string;
  tags: string[];
  summary: string;
  problem: string;
  solution: string;
  outcomes: string[];
  stack: string[];
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "order-lifecycle",
    title: "End-to-End Order Lifecycle Automation",
    tags: ["order sync", "salesforce", "netsuite", "3pl", "cpq", "fulfillment", "cancellation", "replacement", "c&r", "order to cash", "o2c"],
    summary:
      "Designed and implemented a bi-directional integration between a CRM (Salesforce) and ERP (NetSuite) to automate order creation, fulfillment tracking, and a complex cancellation & replacement workflow — eliminating manual hand-offs across three systems.",
    problem:
      "A fast-growing enterprise had three systems — Salesforce (CRM), NetSuite (ERP), and a 3PL logistics platform — operating in silos. Order data had to be manually entered across systems, fulfillment updates were delayed, and contract cancellations triggered a multi-step replacement process that was entirely manual. The result: operational lag, revenue leakage, and a support burden on sales and ops teams.",
    solution:
      "Built a two-part integration: (1) Order Sync — when an opportunity is marked Ready to Ship in Salesforce, Workato automatically creates a Sales Order in NetSuite, routes it through the 3PL for fulfillment, then syncs the Fulfilled status back to Salesforce closing the Opportunity as Closed Won. (2) Cancellation & Replacement (C&R) — when a contract is cancelled, the system auto-generates 1 Replacement Opportunity and N Cancellation Opportunities, routes the replacement through the order sync flow, and fires CPQ Cancel Order Events for each cancellation to close entitlements downstream.",
    outcomes: [
      "Zero manual order entries across systems",
      "3x faster C&R cycle time",
      "100% audit trail from opportunity to fulfillment",
    ],
    stack: ["Salesforce", "NetSuite", "Workato", "3PL", "CPQ"],
  },
  {
    id: "credit-amount-api",
    title: "Returns Credit Amount Calculation API",
    tags: ["api", "returns", "credit", "prorated", "refund", "workato api platform", "netsuite", "salesforce cpq", "splunk", "async", "rest api"],
    summary:
      "Designed and built a Workato-hosted REST API that automates prorated credit calculation during contract cancellations — replacing manual spreadsheet-based computation with a real-time integration across CPQ, ERP, and observability systems.",
    problem:
      "When a customer cancelled a contract mid-term, the finance team needed to manually calculate the prorated credit amount owed — factoring in payment frequency, return term, stub payments, and finance partner terms across multiple contract lines. This was error-prone and created bottlenecks in the C&R process with no programmatic way for upstream systems to request a credit calculation.",
    solution:
      "Built a Workato API Platform endpoint (POST /returns/v1/credit-amount-calculation) that accepts cancellation details (customer, billing contract ID, replaced quote, and line-level contract data). The API immediately acknowledges the request (200 response) and dispatches computation to an async recipe function. The function creates Credit Amount header and detail records in NetSuite, validates each step, marks status as Success or Failed with error details, then writes the calculated prorated amount directly back to the Salesforce CPQ Quote. Every step is logged to Splunk for observability.",
    outcomes: [
      "Zero manual credit calculations by finance team",
      "Sub-2-second API acknowledgement to upstream systems",
      "100% audit trail in Splunk per API call",
    ],
    stack: ["Workato API Platform", "NetSuite", "Salesforce CPQ", "Splunk"],
  },
  {
    id: "customer-account-sync",
    title: "NetSuite-to-Salesforce Customer Account Sync",
    tags: ["account sync", "netsuite", "salesforce", "delinquency", "batch update", "scheduled", "retry", "fault-tolerant", "customers", "workato", "composite api"],
    summary:
      "Built a scheduled Workato integration that syncs NetSuite customer delinquency data — overdue days, amounts, and override reasons — into Salesforce Accounts in bulk, with a fault-tolerant individual retry layer for any batch failures.",
    problem:
      "Finance and collections teams relied on NetSuite as the system of record for customer payment status — delinquency flags, days overdue, outstanding amounts, and override reasons — but Salesforce Account records showed stale data. Without a reliable sync, sales and CS reps were making account decisions with outdated financial context, and collections workflows couldn't be triggered from Salesforce reliably.",
    solution:
      "Built a scheduled recipe that runs on a recurring cadence: (1) Queries a NetSuite saved search to pull all customer records with delinquency fields (Delinquent_Checkbox, Days_Overdue, Over_Due_Amount, Delinquency_Override_Reason). (2) Maps each NetSuite customer to its Salesforce Account using a stored Salesforce ID on the NetSuite record. (3) Submits all records in a single Salesforce Composite Batch Update for efficiency. (4) If any records fail the batch, a per-record retry loop re-attempts each failure individually — isolating errors without blocking the successful records. (5) If individual retries also fail, an error notification fires with the affected record details. Edge cases handled: empty NetSuite result sets skip all Salesforce calls cleanly, and multi-value delinquency override reasons are correctly flattened before the batch write.",
    outcomes: [
      "Real-time delinquency context available in Salesforce for all account-facing teams",
      "Batch + individual retry pattern tolerates partial API failures with zero data loss",
      "5 test cases covering happy path, partial failure, full failure, empty results, and multi-value fields",
    ],
    stack: ["Workato", "NetSuite", "Salesforce"],
  },
  {
    id: "order-creation-engine",
    title: "Multi-Type Order Creation Engine",
    tags: ["order creation", "revenue", "promo", "free trial", "opportunity", "netsuite", "salesforce", "cpq", "workato", "python", "deduplication", "idempotent"],
    summary:
      "Built a Workato-orchestrated order creation engine that routes Revenue, Promo, and Free Trial opportunities through a shared pipeline into NetSuite — with type-specific logic, CPQ validation, deduplication, Python-based data transforms, and fault-tolerant retry handling.",
    problem:
      "A single order creation workflow had to handle three fundamentally different opportunity types — standard revenue orders, promotional orders with attachments and RMA linkage, and free trial orders — each with different Salesforce data shapes, NetSuite requirements, and post-creation actions. There was also no guard against duplicate syncs or CPQ quote mismatches reaching the ERP.",
    solution:
      "Built a three-recipe function chain: (1) Get Opportunity — type-based SOQL routing (Revenue/Promo/Free Trial each get their own optimized query), duplicate sync detection (stops if NetSuite ID already stamped), and CPQ quote amount validation for revenue orders. (2) Process Sales Order — account sync, Employee/Customer/Contract Line lookups in NetSuite, Python-based field transformation and line duplication logic, RMA/Return opp linkage for Promo orders, and mandatory field validation before ERP write. (3) Create Sales Order — NetSuite upsert with timeout resilience via SuiteQL polling loop. Post-creation: NetSuite ID stamped back to Salesforce, attachments synced, errors written back to Salesforce record for ops visibility.",
    outcomes: [
      "3 opportunity types handled in one unified pipeline",
      "Zero duplicate ERP orders via deduplication guard",
      "100% of errors surfaced back to Salesforce in real time",
    ],
    stack: ["Workato", "Salesforce CPQ", "NetSuite", "Python", "Splunk"],
  },
];

export function searchCaseStudies(query: string): CaseStudy[] {
  const q = query.toLowerCase();
  const scored = CASE_STUDIES.map((cs) => {
    let score = 0;
    if (cs.title.toLowerCase().includes(q)) score += 10;
    cs.tags.forEach((tag) => { if (q.includes(tag) || tag.includes(q)) score += 5; });
    if (cs.summary.toLowerCase().includes(q)) score += 3;
    if (cs.problem.toLowerCase().includes(q)) score += 2;
    if (cs.solution.toLowerCase().includes(q)) score += 2;
    cs.stack.forEach((s) => { if (q.includes(s.toLowerCase())) score += 4; });
    // also check individual words in query against tags/title
    const words = q.split(/\s+/).filter((w) => w.length > 3);
    words.forEach((word) => {
      cs.tags.forEach((tag) => { if (tag.includes(word)) score += 2; });
      if (cs.title.toLowerCase().includes(word)) score += 3;
    });
    return { cs, score };
  });

  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ cs }) => cs);
}

export function formatCaseStudyForContext(cs: CaseStudy): string {
  return `
CASE STUDY: ${cs.title}
Stack: ${cs.stack.join(", ")}
Summary: ${cs.summary}
Problem: ${cs.problem}
Solution: ${cs.solution}
Outcomes: ${cs.outcomes.join("; ")}
`.trim();
}
