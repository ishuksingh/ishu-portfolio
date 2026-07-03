"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const caseStudies = [
  {
    id: "workato-enterprise-platform",
    tag: "Platform Engineering · AI Strategy",
    title: "Workato ONE — Enterprise Governance & AI-Native MCP Strategy",
    summary:
      "Architected Samsara's enterprise integration platform governance from scratch — designing a SCIM+SAML RBAC framework for 80+ BizTech users across 4 business units, building Workato-native MCPs as part of a 47-tool enterprise AI catalog, wiring full observability via Splunk log streaming, and co-designing an MCP Registry built on Amazon Bedrock AgentCore — using AgentCore Registry, Gateway, and Identity for governed, zero-trust AI tool discovery at enterprise scale.",
    stack: ["Workato ONE", "Okta SCIM/SAML", "AWS Bedrock AgentCore", "Claude AI"],
    problem:
      "Samsara's integration platform (Workato ONE) was scaling fast across four business units — GTMS, CorpSys, IT+PMO, and IDEA — with no unified access control model. Developers had inconsistent permissions across Dev, Test, and Prod environments, production deployments were ad-hoc with no gating, and there was no audit trail for platform activity. In parallel, the AI team needed to expose internal system data to Claude agents at enterprise scale — but there was no governed way to register, approve, or discover MCP tools, no security review layer, and no catalog for the organization to build on.",
    flows: [
      {
        title: "RBAC 2.0 — Identity-Driven Access Control",
        steps: [
          {
            label: "SCIM Provisioning via Okta",
            detail:
              "Users are auto-provisioned and deprovisioned in Workato through Okta SCIM — no manual account creation. A user assigned the Workato app in Okta is created in the platform; deactivation in Okta immediately revokes platform access. This eliminated the onboarding/offboarding gap that previously left stale accounts.",
          },
          {
            label: "SAML-Driven Environment Role Assignment",
            detail:
              "Environment roles — Samsara Manager, Samsara Developer, Samsara View Only, and Samsara Release Manager — are assigned per environment (Dev/Test/Prod) via SAML attributes pushed from Okta at login. No manual role grants in the platform; role changes take effect on next login.",
          },
          {
            label: "Collaborator Groups & Project-Level Access",
            detail:
              "Four collaborator group types were standardized across all teams: TeamAdmins (Project Admin access), Devs (Advanced Builder access), ViewOnly (read-only), and ProdOps (production deployment window only). Groups are assigned to Workato projects to grant project-scoped permissions, independent of environment role — enabling fine-grained control without environment-level over-permission.",
          },
          {
            label: "Production Deployment Model",
            detail:
              "Production access follows a time-bounded deployment window model. A designated Release Manager temporarily elevates a deployer by granting the Samsara Manager env role and adding them to the ProdOps collaborator group. After deployment, both are revoked — returning the deployer to View Only in prod. This replaces standing prod access with just-in-time privilege escalation.",
          },
        ],
      },
      {
        title: "Workato MCP Layer — Native AI Tool Surface",
        steps: [
          {
            label: "Salesforce & Stripe MCPs",
            detail:
              "Two Workato APIM-hosted MCPs expose CRM and billing data to Claude agents: Salesforce (accounts, opportunities, cases, and orders) and Stripe (billing and subscription data). Both route through Workato's API Management layer with OAuth — making Samsara's existing Workato recipes the authentication and data access boundary rather than direct system credentials.",
          },
          {
            label: "3PL Operations MCP",
            detail:
              "A Workato MCP powers the Item Receipt Bot — processing inbound 3PL API feeds and syncing received inventory into NetSuite and Salesforce in real time. This MCP also underpins returns automation, making it one of the highest-value AI tool surfaces in the supply chain org. AI agents can query 3PL receipts, trigger sync jobs, and surface return status without direct system access.",
          },
          {
            label: "Atlassian Jira & Zendesk MCPs",
            detail:
              "Atlassian Jira is available as a Workato-hosted MCP, enabling agents to create, update, and query Jira issues through the same APIM governance layer. Zendesk is also exposed via Workato, giving Claude agents access to customer support ticket data — allowing support workflows and ticket intelligence to be surfaced without direct platform access.",
          },
        ],
      },
      {
        title: "Agentic Observability — Genie Conversation Logging",
        steps: [
          {
            label: "Genie Conversation Logging to AWS S3",
            detail:
              "Databricks Genie conversation logs — every user query, agent response, and tool invocation across the MCP-connected Genie spaces — are streamed to an AWS S3 bucket. This creates a durable, queryable record of how AI agents are being used across finance, supply chain, and operations data domains.",
          },
          {
            label: "Langfuse Ingestion for LLM Observability",
            detail:
              "The S3 conversation logs are ingested into Langfuse, an open-source LLM observability platform. This gives the team full visibility into agentic traces — latency per tool call, token usage, failure rates, and query patterns — enabling continuous evaluation and improvement of agent behavior across the enterprise MCP catalog.",
          },
          {
            label: "Closing the Feedback Loop",
            detail:
              "With Langfuse traces in place, the team can identify which MCP tools are most queried, where agents fail or hallucinate, and which Genie spaces need schema or prompt tuning. This observability layer turns the MCP catalog from a static tool registry into a continuously improving AI platform.",
          },
        ],
      },
      {
        title: "MCP Registry — Governed AI Tool Discovery",
        diagramId: "mcp-registry",
        steps: [
          {
            label: "Built on Amazon Bedrock AgentCore",
            detail:
              "The registry is built on three Amazon Bedrock AgentCore primitives: AgentCore Registry — the fully managed system of record storing every tool's name, endpoint, schemas, versions, and approval state with IAM-gated writes; AgentCore Gateway — a managed AI gateway that provides a single secure entry point for agentic traffic, converting APIs and services into MCP-compatible tools and routing agent-to-tool calls through one governed endpoint; and AgentCore Identity — JWT-based identity and credential management that propagates the original user's identity across every hop in the request chain using zero-trust OAuth flows.",
          },
          {
            label: "Lifecycle Governance: Draft → Approved",
            detail:
              "Every MCP submission follows a governed lifecycle: tool owners submit a descriptor (name, endpoint, tool functions, JSON schemas) through the Admin Console, creating a Draft record in AgentCore Registry. A platform admin reviews and transitions it — Draft → Pending → Approved (or Rejected). Versioning prevents concurrent overwrites. Deprecated tools remain queryable but are excluded from active discovery.",
          },
          {
            label: "Semantic Search for Intent-Based Discovery",
            detail:
              "Approved MCPs are indexed for semantic search against their full tool descriptions — not just names. An agent or developer searching 'meeting' surfaces Granola and Google Calendar without knowing exact tool names. AgentCore Gateway then routes the agent's request to the approved tool through a single managed endpoint, with AgentCore Identity ensuring the caller's identity is preserved and scoped correctly end-to-end.",
          },
          {
            label: "47-Tool Enterprise MCP Catalog",
            detail:
              "The catalog spans ERP (NetSuite, Salesforce), Data (Genie spaces covering finance, supply chain, headcount, marketing, and people analytics), Comms (Gmail, Slack, Zoom), Productivity (Google Workspace, Granola, Airtable, Lucid, Smartsheet), and Dev (Atlassian, Figma, Webflow). Workato-hosted MCPs fill the gaps where no native vendor MCP exists — Salesforce, Stripe, 3PL Operations, Jira, and Zendesk are all served through the Workato APIM layer.",
          },
        ],
      },
    ],
    outcomes: [
      { metric: "80+", label: "BizTech users governed via SCIM+SAML across 4 teams" },
      { metric: "6", label: "Workato MCPs in enterprise AI catalog" },
      { metric: "47", label: "Total MCPs planned, 33 active in FY27 Q1" },
    ],
  },
  {
    id: "integration-observability",
    tag: "Error Handling · Observability · Platform Engineering",
    title: "Integration Error Handling & Observability",
    summary:
      "Built a two-layer error handling and observability foundation for Samsara's Workato integration platform — a centralized error handler framework using Workato Data Tables for structured runtime error capture and retry logic, paired with a Splunk log streaming pipeline for platform-wide audit visibility across all environments.",
    stack: ["Workato", "Workato Data Tables", "Splunk", "1Password / KeyVault"],
    problem:
      "With 80+ users running integration recipes across Dev, Test, and Prod, there was no standardized way to handle failures. Some recipes wrote errors back to source systems, others silently failed, and there was no centralized record of what went wrong, when, and in which environment. At the platform level, debugging required logging into each environment separately — there was no cross-environment query capability, no audit trail, and error trends were invisible to leadership until incidents escalated.",
    flows: [
      {
        title: "Common Error Handler Framework",
        steps: [
          {
            label: "Reusable Callable Error Handler",
            detail:
              "A shared callable recipe acts as the error handling entry point for all integrations on the platform. Any recipe that catches an error calls this handler with structured context — recipe name, job ID, calling job ID, error message, environment, and severity. This eliminates the need for each team to build its own error handling logic and ensures consistent error capture across all 4 business units.",
          },
          {
            label: "Workato Data Tables as Centralized Error Store",
            detail:
              "The error handler writes every failure as a structured record into a Workato Data Table — a managed, queryable store within the platform. Each record captures timestamp, recipe ID, environment, error type, affected system, and resolution status. This gives ops teams a live, filterable error log without leaving Workato and provides a single source of truth for open incidents across all integration pipelines.",
          },
          {
            label: "Retry Logic & Alerting",
            detail:
              "Based on error type and severity, the handler applies configurable retry logic — transient errors (e.g., API timeouts) are retried with exponential backoff, while data validation failures are routed to a dead-letter queue in the Data Table for manual review. Critical failures trigger Slack alerts to the responsible team's channel, ensuring no failure is silent and incidents are surfaced in real time.",
          },
        ],
      },
      {
        title: "Splunk Log Streaming — Platform-Wide Audit",
        steps: [
          {
            label: "Secure Splunk Connection per Environment",
            detail:
              "Each Workato environment (Dev, Test, Prod) has a dedicated HTTP connection to Splunk with Header auth. The Splunk HEC token is stored in 1Password and KeyVault — never in recipe code. The base URL targets the FedRAMP-compliant Splunk Cloud endpoint, meeting Samsara's compliance requirements.",
          },
          {
            label: "Structured Event Streaming",
            detail:
              "Three event classes are streamed per environment: Job Status (pass/fail per run), Full Job Details (step-level data for every action), and User Activity (all collaborator actions in the workspace). Each event carries a structured JSON payload with source, environment, workspace, and log message — enabling cross-environment Splunk queries and dashboards.",
          },
          {
            label: "Recipe-Level Splunk Logging Template",
            detail:
              "A standardized Splunk Connector Template is published for recipe developers — injecting structured log events at key steps with job ID, recipe ID, calling job ID, priority, environment, and custom content. Teams get consistent observability without building bespoke logging into every recipe, and Splunk dashboards reflect both platform-level streams and recipe-level detail in one index.",
          },
        ],
      },
    ],
    outcomes: [
      { metric: "1", label: "Shared error handler used across all integration pipelines" },
      { metric: "0", label: "Silent failures — every error captured in Data Tables or Splunk" },
      { metric: "3", label: "Environments fully instrumented with cross-env Splunk visibility" },
    ],
  },
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
    id: "contract-cancellation-rma",
    tag: "Integration Engineering · Workato",
    title: "Contract Cancellation → NetSuite RMA Engine",
    summary:
      "Built an event-driven Workato pipeline that triggers on Salesforce cancellation orders, resolves cross-system ID mappings via Python, creates batched RMAs in NetSuite via RESTlet, and stamps results back to Salesforce — with ROW_LOCK-aware retry logic, sequential fallback, and bi-directional error surfacing across a SOX-applicable workflow.",
    stack: ["Salesforce", "NetSuite", "Workato", "Python", "Splunk"],
    problem:
      "When a customer contract was cancelled, creating the corresponding Return Merchandise Authorizations in NetSuite required mapping cancellation order lines back to their original NetSuite order IDs, grouping them correctly, and writing results back to Salesforce Order Products. Salesforce ROW_LOCK errors on bulk updates caused silent partial failures, orders with missing NetSuite IDs fell through with no feedback to ops, and NetSuite RESTlet timeouts left RMA creation in an unknown state — with no audit trail linking cancellation events to their outcomes.",
    flows: [
      {
        title: "Event Intake & ID Resolution",
        steps: [
          {
            label: "Salesforce Platform Event Trigger",
            detail:
              "The recipe is triggered by a Salesforce Platform Event the moment a cancellation order is processed — fully event-driven with zero polling lag. The incoming payload is logged to Splunk immediately.",
          },
          {
            label: "Cancellation Order SOQL Lookup",
            detail:
              "A SOQL query fetches the Cancellation Order and its linked Opportunity, close date, license term, and the mapping between each Order Item and its original NetSuite Order ID — building the cross-system record map needed for RMA grouping.",
          },
          {
            label: "Python ID Consolidation & Grouping",
            detail:
              "A Python recipe function formats all original NetSuite Order IDs into a SQL IN clause for a second SOQL lookup that resolves Original Opportunity Line Item IDs to Original Quote Line IDs. A second Python step then groups the full dataset by OriginalNetsuiteOrderId — ensuring each downstream RMA call receives a correctly scoped payload.",
          },
        ],
      },
      {
        title: "RMA Creation & Salesforce Write-Back",
        steps: [
          {
            label: "NetSuite RMA via RESTlet",
            detail:
              "For each grouped batch, the process recipe calls a NetSuite RESTlet to create the RMA — with batch size and RESTlet URL both controlled by project properties, allowing tuning without touching recipe code.",
          },
          {
            label: "Composite Salesforce Stamping",
            detail:
              "After RMA creation, each batch result is written back to Salesforce Order Products via composite update — stamping the RMA ID on success or a structured error message on failure, respecting the SF 200-record batch API limit.",
          },
          {
            label: "Missing NS ID Handling",
            detail:
              "Order lines where the original NetSuite ID was absent are identified upfront, logged to Splunk, and their error messages are stamped directly onto Salesforce Order Products — giving ops teams immediate visibility without requiring Splunk access.",
          },
        ],
      },
      {
        title: "Fault-Tolerant Retry Logic",
        steps: [
          {
            label: "ROW_LOCK-Aware Retry",
            detail:
              "If a Salesforce composite batch update fails, the recipe waits a configurable number of seconds (set via project property) before retrying — specifically to avoid Salesforce ROW_LOCK contention on high-volume cancellation events where multiple records update the same parent.",
          },
          {
            label: "Sequential Record-by-Record Fallback",
            detail:
              "If the batch retry still fails, the recipe falls back to sequential one-by-one updates — trading throughput for reliability to ensure the maximum number of records are stamped before stopping.",
          },
          {
            label: "NetSuite Timeout Recovery",
            detail:
              "If the NS RESTlet call times out (NS RMA scriptlets are known to exceed Workato's timeout threshold), the recipe retries the NS call, stamps a structured error on all SF Order Lines in the batch, and stops cleanly — preventing silent partial RMA creation from reaching downstream systems.",
          },
        ],
      },
    ],
    outcomes: [
      { metric: "Real-time", label: "Event-driven trigger, zero polling lag" },
      { metric: "0", label: "Silent failures — every error stamped to Salesforce" },
      { metric: "100%", label: "Splunk audit trail per cancellation event" },
    ],
  },
  {
    id: "returns-automation-engine",
    tag: "Integration Engineering · Workato",
    title: "Multi-Type Returns Automation Engine",
    summary:
      "Built a Workato-orchestrated returns processing engine that routes three distinct RMA types — Remorse, Delinquent, and Exchange/Warranty Exchange — from NetSuite into Salesforce through type-specific pipelines, with shared common infrastructure, idempotency guards, atomic rollback, and full Splunk observability across a SOX-applicable workflow.",
    stack: ["NetSuite", "Salesforce CPQ", "Workato", "Python", "Splunk"],
    problem:
      "Processing customer returns required different Salesforce record types depending on the return reason — a remorse return needed a CPQ contract amendment, a delinquent return needed a rebate opportunity, and an exchange needed a return opportunity with line items and serial numbers. All three originated as NetSuite RMAs but landed in completely different Salesforce data shapes with different downstream actions. There was no shared infrastructure, no guard against duplicate processing, and no consistent error handling — failed records left NetSuite and Salesforce in inconsistent states with no visibility into what went wrong.",
    flows: [
      {
        title: "Shared Infrastructure & Scheduling",
        steps: [
          {
            label: "NetSuite Saved Search Polling",
            detail:
              "Each return type's main recipe runs on a schedule and queries a NetSuite Saved Search (or Invoice Saved Search for exchanges), pulling header-level RMA data for new and resent records. A guard condition ensures execution only proceeds when records are present.",
          },
          {
            label: "Idempotency Lock",
            detail:
              "Before dispatching any work, a shared batch update recipe sets 'Sync in Progress = TRUE' on all fetched RMA records in NetSuite — preventing duplicate processing if the scheduler fires again before the previous run completes.",
          },
          {
            label: "Async Per-Record Dispatch",
            detail:
              "Each RMA is handed off to a type-specific processing recipe asynchronously. Failures in one record are fully isolated — they cannot block or corrupt the rest of the batch.",
          },
          {
            label: "Shared RMA Data Retrieval",
            detail:
              "A common recipe function fetches header and item-level data from a NetSuite RESTlet, then runs SuiteQL to resolve the customer's shipping addresses — including pagination logic to handle customers with over 1,000 address records.",
          },
        ],
      },
      {
        title: "Remorse → CPQ Amendment",
        steps: [
          {
            label: "Salesforce Orders API Invocation",
            detail:
              "For each Remorse RMA, the recipe asynchronously calls Salesforce's Orders API to initiate a CPQ contract amendment — the return triggers an amendment on the existing contract rather than a new record.",
          },
          {
            label: "Amendment Callback API",
            detail:
              "Salesforce calls back into a Workato-hosted API endpoint once the amendment is created. The callback validates the payload, then asynchronously dispatches downstream to add return products and finalize the CPQ quote.",
          },
          {
            label: "Quote Finalization & Write-Back",
            detail:
              "The downstream recipe adds return products to the CPQ quote and saves it — completing the amendment loop and stamping the NetSuite RMA with the Salesforce record ID.",
          },
        ],
      },
      {
        title: "Delinquent → Rebate Opportunity",
        steps: [
          {
            label: "Python Validation",
            detail:
              "After fetching RMA data and querying Salesforce for the linked Opportunity and Account, a Python recipe function validates the logic flow — checking owner active status and field requirements before any write operations begin.",
          },
          {
            label: "Atomic Opportunity Creation",
            detail:
              "The recipe creates a Rebate Opportunity in Salesforce, then builds the opportunity product list by querying pricebook entries per line item. If any product query fails, the entire opportunity is deleted before stopping — leaving no partial records in Salesforce.",
          },
          {
            label: "Composite Product Write & NS Stamp",
            detail:
              "Opportunity products are written in a single composite create call. Partial failures trigger opportunity deletion and halt execution. On success, the NetSuite RMA is stamped with the Salesforce record ID and sync flags are cleared.",
          },
        ],
      },
      {
        title: "Exchange / Warranty Exchange → Return Opportunity",
        steps: [
          {
            label: "Return Opportunity Creation",
            detail:
              "The recipe queries Salesforce for Opportunity and Account data, maps the RMA payload to a Return Opportunity, and creates it in Salesforce. Serial numbers are then stamped in a separate update call — decoupled from creation to avoid payload size limits.",
          },
          {
            label: "Line Item Construction with Rollback",
            detail:
              "For each RMA line, the recipe queries both Opportunity Line Item details and the PricebookEntry ID. If either query fails, the Return Opportunity is immediately deleted before halting — ensuring no half-created records persist.",
          },
          {
            label: "NetSuite Write-Back",
            detail:
              "On success, the NetSuite RMA is stamped with the Salesforce Opportunity ID and the Sync in Progress flag is cleared — confirming the full round-trip between ERP and CRM.",
          },
        ],
      },
    ],
    outcomes: [
      { metric: "3", label: "Return types handled in one governed platform" },
      { metric: "0", label: "Duplicate processing via idempotency lock" },
      { metric: "100%", label: "Splunk audit trail per RMA across all flows" },
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
    id: "post-closed-won-sync",
    tag: "Integration Engineering · Workato",
    title: "Post-Close Order Sync: Salesforce → NetSuite",
    summary:
      "Built a scheduled, SOX-compliant Workato pipeline that queries Salesforce for newly Closed Won opportunities and asynchronously updates each corresponding NetSuite Sales Order with accurate license dates and contract metadata — eliminating manual post-close data entry across the revenue stack.",
    stack: ["Salesforce", "NetSuite", "Workato", "Splunk"],
    problem:
      "After a deal closed in Salesforce, the corresponding NetSuite Sales Orders still required manual updates with license start/end dates and contract metadata. This created data lags and inconsistencies between the CRM and ERP, and posed a compliance risk for SOX-governed revenue records. Finance and RevOps teams were manually reconciling these updates post-close — introducing errors, slowing time-to-entitlement for customers, and leaving no reliable audit trail for auditors.",
    flows: [
      {
        title: "Schedule & Opportunity Query",
        steps: [
          {
            label: "Cron-Driven Trigger",
            detail:
              "The recipe fires on a configurable cron expression stored as a project property — giving ops teams full control over run frequency without touching the recipe itself. A guard condition ensures execution only proceeds if a query is present, preventing empty runs.",
          },
          {
            label: "Dynamic Salesforce SOQL Fetch",
            detail:
              "The recipe runs a dynamic SOQL query (also stored as a project property) against Salesforce, fetching up to 2,000 Closed Won opportunities per run. Each record includes license start/end dates, NetSuite ID, order number, buyout adjustment flags, and stage metadata.",
          },
          {
            label: "Empty-Result Guard",
            detail:
              "If no qualifying opportunities are returned, the recipe exits cleanly with no downstream work triggered — no wasted ERP calls, no noise in logs.",
          },
        ],
      },
      {
        title: "Async Processing & Write-Back",
        steps: [
          {
            label: "Per-Opportunity Async Dispatch",
            detail:
              "Each opportunity is handed off to a child recipe asynchronously — keeping the main loop fast and fault-isolated per record. One failing record cannot block or corrupt the rest of the batch.",
          },
          {
            label: "NetSuite Sales Order Update",
            detail:
              "The child recipe locates the corresponding Sales Order via the NetSuite ID on the Salesforce record and updates it with license start date, license end date, and custom contract fields — ensuring the ERP reflects the exact commercial terms from the CRM.",
          },
          {
            label: "Salesforce Write-Back & Error Handling",
            detail:
              "After a successful NetSuite update, the Salesforce opportunity is updated to confirm the sync. If any step fails, the error is caught, logged to Splunk, and a notification is dispatched to stakeholders — ensuring no silent failures on SOX-applicable records.",
          },
        ],
      },
    ],
    outcomes: [
      { metric: "0", label: "Manual post-close data entries in NetSuite" },
      { metric: "2,000", label: "Max records synced per scheduled run" },
      { metric: "100%", label: "Audit trail on SOX-applicable order updates" },
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
  {
    id: "close-opportunity-orders",
    tag: "Integration Engineering · Workato",
    title: "Fulfilled Order Closure — CPQ Event to NetSuite",
    summary:
      "Built a Workato recipe that listens for Salesforce CPQ Fulfilled order events and automatically updates the corresponding NetSuite Sales Order with type-specific fulfillment dates — with a timing guard, per-type payload mapping, retry logic, and bidirectional error write-back.",
    stack: ["Salesforce CPQ", "NetSuite", "Workato", "Splunk"],
    problem:
      "When a CPQ order was marked Fulfilled in Salesforce, the corresponding NetSuite Sales Order had to be manually updated with contract dates, ship dates, and trial-specific body fields — with different fields required for Revenue versus Free Trial orders. There was no handling for Salesforce data consistency lag (License Start Date not yet matching Close Date at event fire time), no retry on NetSuite update failures, and no way for ops teams to see sync errors without querying Splunk logs directly.",
    flows: [
      {
        title: "Event Ingestion & Pre-Flight Validation",
        steps: [
          {
            label: "CPQ Order Event Trigger",
            detail:
              "The recipe is triggered by a Salesforce CPQ Order Event Platform Event, filtered to Fulfilled status across three order types: Revenue Opportunity, Free Trial Opportunity, and Beta Program. This keeps the integration event-driven and eliminates polling overhead.",
          },
          {
            label: "Timing Guard — 60s Data Consistency Wait",
            detail:
              "At the moment of event fire, Salesforce License Start Date can lag behind Close Date due to CPQ processing order. The recipe detects this mismatch and waits 60 seconds before re-fetching the opportunity — preventing stale dates from being written to NetSuite. If the re-fetch fails, the error is logged to Splunk and execution stops cleanly.",
          },
          {
            label: "NetSuite ID Validation & Sales Order Lookup",
            detail:
              "Before any ERP write, the recipe validates that a NetSuite ID is stamped on the Salesforce Order record. If missing, execution stops with a structured error. If present, the recipe looks up the NetSuite Sales Order by internal ID — with up to 3 automatic retries — and logs the result to Splunk.",
          },
        ],
      },
      {
        title: "Type-Specific Update & Write-Back",
        steps: [
          {
            label: "Revenue & Beta Program — Contract Line Date Mapping",
            detail:
              "For Revenue and Beta Program orders, a Workato payload mapper transforms the Salesforce fulfillment data into the NetSuite Sales Order schema — mapping transaction date, ship date, and per-line contract start/end dates (custcol_swe_contract_start_date, custcol_swe_contract_end_date) at the item-line level.",
          },
          {
            label: "Free Trial — Trial Date Body Field Mapping",
            detail:
              "Free Trial orders use a separate payload mapper that writes trial-specific fields directly to the Sales Order body — trial start date (custbody_trial_start_date) and trial end date (custbody_trial_end_date) — alongside ship date and transaction date. This separation prevents Revenue field logic from bleeding into trial records.",
          },
          {
            label: "NetSuite Update with Retry & Salesforce Write-Back",
            detail:
              "The NetSuite Sales Order update runs with up to 3 retries on transient failure. On success, sync flags are cleared on the Salesforce Order (Mulesoft_Sync_Error__c wiped, Sync_in_Progress reset to false) and the result is logged to Splunk. On failure, the error reason is written directly back to the Salesforce Order record — giving ops teams immediate visibility without log access.",
          },
        ],
      },
    ],
    outcomes: [
      { metric: "0", label: "Manual NetSuite updates on order fulfillment" },
      { metric: "60s", label: "Max recovery window from data timing lag" },
      { metric: "100%", label: "Audit trail per close event in Splunk" },
    ],
  },
];

function MCPRegistryDiagram() {
  const flowSteps = [
    { num: "1", label: "Register", who: "Tool Owner", path: "Admin Console → AgentCore" },
    { num: "2", label: "Review", who: "Platform Admin", path: "Draft → Pending → Approved" },
    { num: "3", label: "Discover", who: "Agent / Dev", path: "Semantic search by intent" },
    { num: "4", label: "Consume", who: "AI Agent", path: "Direct MCP session to tool" },
  ];

  const layers = [
    { label: "Admin", items: ["Console", "Web Gateway"] },
    { label: "Services", items: ["Registry API", "Lifecycle Engine"] },
    { label: "AWS Bedrock", items: ["AgentCore Registry", "AgentCore Gateway", "AgentCore Identity"] },
    { label: "Consumers", items: ["AI Agents", "MCP Servers"] },
  ];

  const lifecycle = [
    { label: "DRAFT", color: "bg-muted/20 text-muted" },
    { label: "PENDING", color: "bg-accent/10 text-accent" },
    { label: "APPROVED", color: "bg-green-500/10 text-green-500" },
    { label: "DEPRECATED", color: "bg-muted/10 text-muted" },
    { label: "REJECTED", color: "bg-red-500/10 text-red-400" },
  ];

  return (
    <div className="mt-6 pt-5 border-t border-border space-y-5">
      {/* 4-step journey */}
      <div>
        <p className="text-[10px] font-semibold text-muted uppercase tracking-widest mb-3">End-to-End Journey</p>
        <div className="flex items-start gap-1 overflow-x-auto pb-1">
          {flowSteps.map((step, i) => (
            <div key={step.num} className="flex items-start gap-1 flex-shrink-0">
              <div className="text-center w-[90px]">
                <div className="w-7 h-7 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center mx-auto mb-2">
                  {step.num}
                </div>
                <p className="text-xs font-semibold text-foreground leading-tight">{step.label}</p>
                <p className="text-[10px] text-accent mt-0.5">{step.who}</p>
                <p className="text-[10px] text-muted mt-0.5 leading-tight">{step.path}</p>
              </div>
              {i < flowSteps.length - 1 && (
                <span className="text-muted text-xs mt-3 flex-shrink-0 px-0.5">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Architecture layers */}
      <div>
        <p className="text-[10px] font-semibold text-muted uppercase tracking-widest mb-3">Architecture Layers</p>
        <div className="grid grid-cols-4 gap-2">
          {layers.map((layer) => (
            <div key={layer.label} className="rounded-xl border border-border bg-background p-3">
              <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-2">{layer.label}</p>
              {layer.items.map((item) => (
                <p key={item} className="text-[11px] text-foreground font-medium leading-snug">{item}</p>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Lifecycle states */}
      <div>
        <p className="text-[10px] font-semibold text-muted uppercase tracking-widest mb-2">Tool Lifecycle</p>
        <div className="flex flex-wrap items-center gap-1.5">
          {lifecycle.map((state, i) => (
            <div key={state.label} className="flex items-center gap-1.5">
              <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${state.color}`}>
                {state.label}
              </span>
              {i < lifecycle.length - 1 && i !== 2 && (
                <span className="text-muted text-[10px]">→</span>
              )}
              {i === 2 && <span className="text-muted text-[10px]">/</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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
      {"diagramId" in flow && flow.diagramId === "mcp-registry" && <MCPRegistryDiagram />}
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
      className={`flex-shrink-0 w-[275px] sm:w-[300px] md:w-[340px] bg-card rounded-2xl border overflow-hidden flex flex-col snap-start cursor-pointer transition-colors ${
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
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Case Studies</h2>
            <p className="text-muted">Real integration problems, solved end-to-end.</p>
          </div>
          <p className="text-xs text-muted hidden sm:block">Click a card to explore →</p>
          <p className="text-xs text-muted sm:hidden">Swipe & tap to explore →</p>
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
