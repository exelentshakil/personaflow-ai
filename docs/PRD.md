# Product Requirements Document (PRD)
## PersonaFlow AI — Consumer AI Personalization & Automated PDF Report Platform

### 1. Executive Summary & Defensibility Hook
- **Project**: PersonaFlow AI (Turnkey Full-Stack Consumer Personalization Architecture)
- **Target Audience**: Enterprise client (Albemarle, NC) looking to launch a consumer-facing AI-powered platform from scratch with subscriptions, payments, custom profile-driven prompts, polished PDF delivery, dynamic CMS product catalog, and a profile-aware conversational AI assistant.
- **Client Fear / Defensibility Hook**:
  > *"The platform will connect to existing AI/data endpoints, generate personalized results from predefined prompts and customer profile data, and automatically create and deliver polished PDF reports... Personalization is important, including profile-based content, pronoun handling, and dynamic text/images based on user selections."*
  
  Most freelancers propose standard ChatGPT wrappers that fail at basic grammatical agreement (e.g. awkward pronoun mismatches), cannot generate production-grade multi-page PDFs, force hardcoded product code changes whenever new services are launched, and lack enterprise security (2FA, reliable webhook delivery, multi-provider failover). PersonaFlow AI solves this with a decoupled 3-tier architecture:
  1. **Strict Deterministic Grammar & Pronoun Engine** (`they/them`, `she/her`, `he/him`, custom agreement) guaranteed before prompt injection.
  2. **Dual-Provider AI Orchestrator** (OpenAI GPT-4o-mini + Google Gemini 2.0 Flash fallback) with sub-second latency telemetry.
  3. **Zero-Code Headless CMS & Product Catalog** allowing non-technical admins to launch new products, dynamic services, predefined prompts, and promo codes without redeploying code.

---

### 2. The 100-Person Virtual Studio Multidisciplinary Discovery

#### 2.1 Lead Product Designer
- **Aesthetic Direction**: Apple/Stripe Consumer Archetype — warm, human-centric, crisp white surfaces (`#ffffff`), warm subtle card containers (`#f8fafc`), hairline slate borders (`#e2e8f0`), deep sapphire/indigo primary accents (`#2563eb`).
- **Typography Scale**: Strict adherence to the `12 / 14 / 16 / 20 / 24 / 32` scale. Zero sub-12px text. Tabular mono numbers for all metrics.
- **Light Mode Default**: Defaults to clean Light Mode for immediate credibility in business settings, with seamless Dark Mode support via `next-themes`.

#### 2.2 Systems Architect
- **Pipeline Topology**: Event-driven decoupled flow: Customer Profile Intake ➔ Deterministic Pronoun & Grammar Normalizer ➔ Dual AI Inference ➔ Serverless PDF Rendering Engine ➔ Multi-Channel Dispatch (Download + Resend SMTP + Twilio SMS webhook).
- **Resilience**: Zero-drop guarantee with circuit breaker failover: if primary OpenAI endpoint returns 429/500, system falls back to Gemini 2.0 Flash in <400ms without user-perceptible error.

#### 2.3 Full-Stack Programmer
- **Tech Stack**: Next.js 15.5.4 App Router, TypeScript 5.7, Tailwind CSS v4, React 19, Zod schemas, Supabase persistence layer.
- **Defensive Typing**: All inputs sanitized; array guards for multi-selects; safe number formatting; local storage state persistence across browser refreshes.

#### 2.4 AI Research Specialist
- **Dual-Model Inference Matrix**:
  - Primary: OpenAI `gpt-4o-mini` (temperature 0.3, structured JSON mode).
  - Fallback: Google Gemini `gemini-2.0-flash` (deterministic formatting).
  - Rule-Based Engine: Deterministic offline mode when all networks fail.
- **Prompt Interpolation Engine**: Predefined admin prompts inject customer variables (`{{name}}`, `{{pronouns.subject}}`, `{{pronouns.possessive}}`, `{{goals}}`, `{{traits}}`, `{{service_tier}}`).

#### 2.5 Motion / Animation Designer
- **Interactive SVG Workflow Canvas**: Living animated pipeline featuring continuous ambient data packet streams, node state transitions (`ARMED` ➔ `RUNNING` ➔ `VERIFIED`), and laser pulses traveling between ingestion, AI reasoning, and PDF generation.

#### 2.6 Product Marketer / Deal Closer
- **Zero-Slop Standard**: No generic marketing landing page. Direct entry into the active operational workspace cockpit.
- **Four Agency Overdelivery Weapons**:
  1. One-Click Blueprint Exporter (n8n, Make.com, Inngest, Docker).
  2. Operational ROI & Token Burn Calculator (measuring sub-penny runs vs manual labor).
  3. Chaos Outage Simulator (demonstrating sub-500ms failover).
  4. Client BYOK / Endpoint Settings.

#### 2.7 End-User / Client QA
- **Interactive Simulation**: Full "Test With Your Own Data" drawer. Instant downloadable PDF generation with live visual preview. Profile-aware chatbot that immediately acknowledges customer context.

---

### 3. Core Functional Requirements

| Module | Requirement | Implementation |
|---|---|---|
| **Personalization Engine** | Collect profile, pronouns, goals, lifestyle data | `PersonaStudio.tsx` with dynamic field binding |
| **Pronoun Handling** | Seamless grammar synthesis (`they/them`, `she/her`, `he/him`) | `src/lib/pronouns.ts` with subject/object/possessive rules |
| **AI Generation** | Connect to endpoints, inject prompts, generate personalized reports | `src/app/api/generate-report/route.ts` & `src/lib/ai.ts` |
| **PDF Generation** | Generate polished, branded multi-page downloadable PDF dossier | `src/components/PdfReportPreview.tsx` + `/api/pdf` |
| **AI Chatbot** | Conversational assistant aware of customer profile & report | `src/components/ProfileAwareChatbot.tsx` + `/api/chat` |
| **Dynamic CMS** | Add/edit services, products, prompt templates, promo codes | `src/components/CmsCatalogWorkbench.tsx` + `/api/cms` |
| **Accounts & 2FA** | User account management, simulated 2FA verification, SMS alerts | `src/components/AccountSecurityCenter.tsx` |
| **Telemetry & Logs** | Real-time event log, latency, token burn, and JSON inspector | `src/components/ExecutionLogDrawer.tsx` |

---

### 4. Non-Functional Requirements
- **First-Paint Time**: < 1.0s on standard mobile/desktop viewports.
- **API Latency**: < 800ms for live AI personalization inference.
- **Security**: Strict sanitized inputs, no hardcoded API keys in client bundles, zero-leak environment variables.
- **Accessibility**: WCAG 2.2 AA contrast compliance across all text and controls.
