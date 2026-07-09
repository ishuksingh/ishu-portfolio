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
  {
    id: "workato-enterprise-platform",
    title: "Workato ONE — Enterprise Governance & AI-Native MCP Strategy",
    tags: ["workato", "workato one", "rbac", "scim", "saml", "okta", "mcp", "mcp registry", "agentcore", "aws bedrock", "enterprise governance", "access control", "collaborator groups", "platform engineering", "ai strategy", "mcp catalog", "salesforce mcp", "zendesk mcp", "jira mcp", "3pl mcp", "langfuse", "genie", "s3", "samsara"],
    summary:
      "Architected Samsara's enterprise integration platform governance from scratch — designing a SCIM+SAML RBAC framework for 80+ BizTech users across 4 business units, building Workato-native MCPs as part of a 47-tool enterprise AI catalog, wiring agentic observability via Genie conversation logging to AWS S3, and co-designing an MCP Registry built on Amazon Bedrock AgentCore — using AgentCore Registry, Gateway, and Identity for governed, zero-trust AI tool discovery at enterprise scale.",
    problem:
      "Samsara's integration platform (Workato ONE) was scaling fast across four business units — GTMS, CorpSys, IT+PMO, and IDEA — with no unified access control model. Developers had inconsistent permissions across Dev, Test, and Prod environments, production deployments were ad-hoc with no gating, and there was no audit trail for platform activity. In parallel, the AI team needed to expose internal system data to Claude agents at enterprise scale — but there was no governed way to register, approve, or discover MCP tools, no security review layer, and no catalog for the organization to build on.",
    solution:
      "Built a 4-part enterprise platform strategy: (1) RBAC 2.0 — SCIM auto-provisioning via Okta, SAML-driven per-environment role assignment (Samsara Manager/Developer/ViewOnly/Release Manager), standardized collaborator groups (TeamAdmins, Devs, ViewOnly, ProdOps) across GTMS/CorpSys/IT/IDEA teams, and a time-bounded production deployment model using ProdOps + Release Manager role escalation. (2) Workato MCP Layer — 6 Workato APIM-hosted MCPs exposing Salesforce, Stripe, 3PL Operations, Jira, and Zendesk to Claude agents via the Workato API Management governance layer. (3) Agentic Observability — Genie conversation logs (queries, agent responses, tool invocations) streamed to AWS S3 and ingested into Langfuse for LLM trace visibility and continuous agent quality improvement. (4) MCP Registry on Amazon Bedrock AgentCore — AgentCore Registry as system of record, AgentCore Gateway as the single secure entry point for agentic traffic (converting APIs/services into MCP-compatible tools), AgentCore Identity for zero-trust JWT-based auth, lifecycle governance (Draft→Pending→Approved), and semantic search across a 47-tool enterprise catalog.",
    outcomes: [
      "80+ BizTech users governed via SCIM+SAML across 4 teams with zero manual provisioning",
      "6 Workato MCPs live in enterprise AI catalog (Salesforce, Stripe, 3PL, Jira, Zendesk)",
      "47-tool MCP catalog planned, 33 active in FY27 Q1",
    ],
    stack: ["Workato ONE", "Okta SCIM/SAML", "AWS Bedrock AgentCore", "Langfuse", "Claude AI"],
  },
  {
    id: "integration-observability",
    title: "Integration Error Handling & Observability",
    tags: ["error handling", "observability", "splunk", "log streaming", "data tables", "workato data tables", "error handler", "retry", "alerting", "slack alerts", "audit", "platform engineering", "monitoring", "incident response", "logging template", "recipe logging", "splunk connector"],
    summary:
      "Built a two-layer error handling and observability foundation for Samsara's Workato integration platform — a centralized error handler framework using Workato Data Tables for structured runtime error capture and retry logic, paired with a Splunk log streaming pipeline for platform-wide audit visibility across all environments.",
    problem:
      "With 80+ users running integration recipes across Dev, Test, and Prod, there was no standardized way to handle failures. Some recipes wrote errors back to source systems, others silently failed, and there was no centralized record of what went wrong, when, and in which environment. Debugging required logging into each environment separately with no cross-environment query capability, and error trends were invisible to leadership until incidents escalated.",
    solution:
      "Built two complementary layers: (1) Common Error Handler Framework — a shared callable recipe that acts as the error handling entry point for all integrations. Any recipe catches an error and calls this handler with structured context (recipe name, job ID, calling job ID, error message, environment, severity). The handler writes every failure as a structured record into a Workato Data Table (timestamp, recipe ID, environment, error type, affected system, resolution status) — giving ops teams a live filterable error log without leaving Workato. Configurable retry logic handles transient errors with exponential backoff; critical failures trigger Slack alerts to the responsible team's channel. (2) Splunk Log Streaming — each Workato environment (Dev/Test/Prod) streams three event classes to Splunk via a Header-auth HTTP connection (HEC token in 1Password/KeyVault): Job Status, Full Job Details, and User Activity. A standardized Splunk Connector Template is published for developers to inject structured log events at key recipe steps with job ID, recipe ID, calling job ID, priority, environment, and custom content.",
    outcomes: [
      "1 shared error handler used across all integration pipelines — zero ad-hoc error handling",
      "Zero silent failures — every error captured in Workato Data Tables or Splunk",
      "3 environments (Dev/Test/Prod) fully instrumented with cross-environment Splunk visibility",
    ],
    stack: ["Workato", "Workato Data Tables", "Splunk", "1Password", "KeyVault"],
  },
  {
    id: "workato-solution-consulting",
    title: "Enterprise Customer Onboarding — Workato Solution Consulting",
    tags: ["workato", "solution consulting", "customer success", "onboarding", "platform enablement", "poc", "proof of concept", "go-live", "task optimization", "csat", "mid-market", "enterprise", "post-sales", "integration consulting", "discovery", "recipe builds", "time to value"],
    summary:
      "Led end-to-end post-sales onboarding for 18 mid-market and enterprise customers in 12 months — from discovery through go-live — achieving a 9.5 CSAT score through structured platform enablement, POC recipe builds, task optimization, and hands-on go-live support.",
    problem:
      "Mid-market and enterprise customers purchasing Workato faced a steep ramp to production value. Without structured onboarding, customers struggled to translate integration requirements into working recipes, platform capabilities were underutilized, and time-to-value stretched from weeks into months. Post-sales support was reactive — customers lacked the enablement to become self-sufficient on the platform.",
    solution:
      "Delivered a 4-phase onboarding model across 18 customers: (1) Discovery & Solution Design — structured sessions to map integration landscapes, identify pain points, and prioritize use cases before any build begins. (2) POC Recipe Builds — hands-on recipe development in the customer's Workato environment covering priority use cases, with an architecture review and handoff designed for customer independence. (3) Platform Enablement — tailored training sessions on Workato fundamentals, recipe design patterns, error handling, and task optimization — reducing platform costs by right-sizing task consumption. (4) Go-Live Support — UAT validation, production readiness review, and post-launch stabilization to ensure customers went live confidently and issues were resolved before the support window closed.",
    outcomes: [
      "18 customers onboarded across mid-market and enterprise segments in 12 months",
      "9.5 CSAT score across all onboardings",
      "Faster time-to-value — customers went live ahead of expected timelines through structured enablement",
    ],
    stack: ["Workato", "Salesforce", "NetSuite", "REST APIs", "Slack"],
  },
  {
    id: "close-opportunity-orders",
    title: "Fulfilled Order Closure — CPQ Event to NetSuite",
    tags: ["order closure", "cpq order event", "salesforce", "netsuite", "workato", "fulfillment", "revenue order", "free trial", "beta program", "platform event", "splunk", "sync", "payload mapper"],
    summary:
      "Built a Workato recipe that listens for Salesforce CPQ Fulfilled order events and automatically updates the corresponding NetSuite Sales Order with type-specific fulfillment dates — with a timing guard, retry logic, and bidirectional error write-back.",
    problem:
      "When a CPQ order was marked Fulfilled in Salesforce, the NetSuite Sales Order had to be manually updated with contract dates, ship dates, and trial dates — with different fields required for Revenue versus Free Trial orders. There was no handling for Salesforce data consistency lag, no retry on NetSuite failures, and no way for ops teams to see sync errors without querying logs directly.",
    solution:
      "Built a Workato recipe triggered by CPQ Order Events filtered for Fulfilled status across Revenue, Free Trial, and Beta Program order types. The recipe validates that the NetSuite ID exists on the Salesforce Order, applies a 60-second timing guard when License Start Date doesn't yet match Close Date, looks up the Sales Order in NetSuite (3 retries), and routes by type — Revenue/Beta use a payload mapper for contract line dates and ship date; Free Trial uses a separate mapper for trial-specific body fields. On NetSuite update success, sync error flags are cleared on the Salesforce Order. On failure, the error reason is written back to the Salesforce Order record. Every step is logged to Splunk.",
    outcomes: [
      "Zero manual NetSuite updates on order fulfillment",
      "100% audit trail per close event in Splunk",
      "60s max recovery window from Salesforce data timing inconsistencies",
    ],
    stack: ["Salesforce CPQ", "NetSuite", "Workato", "Splunk"],
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
