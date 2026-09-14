import os
import base64
import subprocess
import re

current_dir = os.path.dirname(os.path.abspath(__file__))
project_dir = os.path.abspath(os.path.join(current_dir, ".."))
docs_dir = os.path.join(project_dir, "docs")
html_path = os.path.join(docs_dir, "ESTIMATE.html")
pdf_path = os.path.join(docs_dir, "ESTIMATE.pdf")

with open(os.path.join(docs_dir, "headshot.jpeg"), "rb") as f:
    headshot_b64 = base64.b64encode(f.read()).decode("utf-8")

with open(os.path.join(docs_dir, "logo.png"), "rb") as f:
    logo_b64 = base64.b64encode(f.read()).decode("utf-8")

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Production Scope & Formal Estimate - PersonaFlow AI Consumer Platform</title>
  <style>
    @page {{
      size: letter portrait;
      margin: 8mm 9mm 8mm 9mm;
    }}
    * {{
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }}
    html, body {{
      margin: 0;
      padding: 0;
      height: 100%;
      background: #ffffff;
      overflow: hidden;
    }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      line-height: 1.36;
      font-size: 9.8px;
    }}

    /* The 6 Direct Flex Children Architecture - Uniform Natural Spacing */
    .page-container {{
      display: flex;
      flex-direction: column;
      gap: 8px;
      height: 100%;
      box-sizing: border-box;
    }}

    /* 1. Executive Header */
    .header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      border-bottom: 2px solid #2563eb;
      padding-bottom: 6px;
    }}
    .header-left {{
      flex: 1;
      min-width: 0;
    }}
    .brand-title {{
      font-size: 8.5px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #2563eb;
      margin-bottom: 2px;
      white-space: nowrap;
    }}
    h1 {{
      font-size: 15px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 2px 0;
      letter-spacing: -0.02em;
      line-height: 1.15;
      white-space: nowrap;
    }}
    .subtitle {{
      font-size: 8.8px;
      color: #475569;
      margin: 0;
      line-height: 1.25;
      white-space: nowrap;
    }}
    .meta-card {{
      flex-shrink: 0;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 6px 10px;
      font-size: 8.4px;
      text-align: right;
      line-height: 1.38;
      box-shadow: 0 1px 2px rgba(0,0,0,0.02);
      white-space: nowrap;
    }}
    .meta-card strong {{
      color: #0f172a;
    }}
    .live-badge {{
      display: inline-block;
      background: #ecfdf5;
      color: #059669;
      border: 1px solid #a7f3d0;
      font-weight: 700;
      padding: 1.5px 5.5px;
      border-radius: 9999px;
      font-size: 7.8px;
      text-transform: uppercase;
      margin-left: 3px;
    }}

    /* 2. Executive Problem & Principle Callout */
    .exec-summary {{
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-left: 3.5px solid #2563eb;
      padding: 7px 10px;
      border-radius: 4px;
      font-size: 8.6px;
      color: #1e3a8a;
      line-height: 1.36;
    }}
    .exec-summary strong {{
      color: #1d4ed8;
    }}

    /* 3. Scope Table */
    .section-header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3.5px;
    }}
    .section-title {{
      font-size: 9.8px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #1e293b;
      border-left: 3px solid #2563eb;
      padding-left: 6px;
      margin: 0;
    }}
    .section-meta {{
      font-size: 8.4px;
      color: #64748b;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    }}
    table {{
      width: 100%;
      border-collapse: collapse;
    }}
    th {{
      background: #f1f5f9;
      color: #334155;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 8.4px;
      letter-spacing: 0.04em;
      border: 1px solid #cbd5e1;
      padding: 5px 7px;
      text-align: left;
    }}
    td {{
      border: 1px solid #e2e8f0;
      padding: 6.8px 7px;
      font-size: 8.8px;
      vertical-align: top;
    }}
    .phase-num {{
      font-weight: 800;
      color: #1e293b;
      font-size: 8.8px;
      white-space: nowrap;
    }}
    .phase-name {{
      font-weight: 700;
      color: #0f172a;
      font-size: 9.3px;
    }}
    .phase-desc {{
      color: #475569;
      font-size: 8.3px;
      margin-top: 2.2px;
      line-height: 1.3;
    }}
    .phase-0-row {{
      background: #f0fdf4;
    }}
    .phase-0-badge {{
      color: #15803d;
      font-weight: 800;
    }}
    .total-row {{
      background: #0f172a;
      color: #ffffff;
      font-weight: 800;
      border: 1px solid #0f172a;
    }}
    .total-row td {{
      border: 1px solid #0f172a;
      padding: 6.5px 7px;
      font-size: 9.2px;
    }}

    /* 4. 2-Column Grid */
    .grid-2col {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }}
    .card-box {{
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      background: #f8fafc;
      padding: 8px 11px;
    }}
    .card-box-title {{
      font-size: 8.9px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #1e293b;
      margin: 0 0 4.5px 0;
      display: flex;
      align-items: center;
      gap: 4px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 3px;
    }}
    .milestone-item {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 6px;
      border-bottom: 1px dotted #cbd5e1;
      padding: 3.6px 0;
      font-size: 8.3px;
    }}
    .milestone-item:last-child {{
      border-bottom: none;
      padding-bottom: 0;
    }}
    .milestone-name {{
      color: #334155;
    }}
    .milestone-val {{
      font-weight: 800;
      color: #0f172a;
      font-family: ui-monospace, monospace;
      white-space: nowrap;
    }}
    .guardrail-item {{
      font-size: 8.2px;
      color: #334155;
      margin-bottom: 3.5px;
      padding-left: 11px;
      position: relative;
      line-height: 1.28;
    }}
    .guardrail-item:last-child {{
      margin-bottom: 0;
    }}
    .guardrail-item::before {{
      content: "✓";
      position: absolute;
      left: 0;
      color: #16a34a;
      font-weight: 800;
      font-size: 7.5px;
    }}

    /* 5. Commercial Terms Section */
    .terms-box {{
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      background: #ffffff;
      padding: 8px 11px;
    }}
    .terms-grid {{
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }}
    .term-col {{
      font-size: 8px;
      line-height: 1.28;
    }}
    .term-title {{
      font-weight: 800;
      color: #2563eb;
      text-transform: uppercase;
      font-size: 7.9px;
      margin-bottom: 2.5px;
    }}
    .term-body {{
      color: #475569;
    }}

    /* 6. Executive Signature Footer */
    .footer-container {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      border-top: 1.5px solid #cbd5e1;
      padding-top: 6px;
      margin-top: auto;
    }}
    .footer-founder {{
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
    }}
    .founder-avatar {{
      width: 38px;
      height: 38px;
      border-radius: 50%;
      object-fit: cover;
      border: 1.5px solid #2563eb;
      flex-shrink: 0;
    }}
    .founder-info {{
      display: flex;
      flex-direction: column;
      gap: 1.2px;
    }}
    .founder-name {{
      font-size: 9.6px;
      color: #0f172a;
    }}
    .founder-company {{
      font-size: 8.6px;
      color: #2563eb;
    }}
    .founder-sub {{
      font-size: 7.8px;
      color: #64748b;
      line-height: 1.2;
    }}
    .footer-brand {{
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 3px;
      flex-shrink: 0;
    }}
    .business-logo {{
      height: 18px;
      width: auto;
      object-fit: contain;
    }}
    .demo-badge {{
      font-size: 7.8px;
      font-weight: 700;
      color: #2563eb;
      text-decoration: none;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      padding: 1.5px 6px;
      border-radius: 4px;
    }}
  </style>
</head>
<body>
<div class="page-container">

  <!-- 1. Executive Header -->
  <div class="header">
    <div class="header-left">
      <div class="brand-title">Production Scope &amp; Formal Milestone Estimate</div>
      <h1>PersonaFlow AI — Consumer Personalization Platform</h1>
      <p class="subtitle">Autonomous Profile Intake • Strict Pronoun Matrix • PDF Generation • Zero-Code CMS Workbench</p>
    </div>
    <div class="meta-card">
      <div>Client: <strong>Private Consumer AI Founder (Albemarle, NC)</strong></div>
      <div>Date: <strong>September 15, 2026</strong> • Delivery: <strong>12 Calendar Days</strong></div>
      <div>Turnkey Investment: <strong>$1,500.00 Fixed Price</strong> <span class="live-badge">Proof-of-Concept Live</span></div>
    </div>
  </div>

  <!-- 2. Executive Architectural Guarantee -->
  <div class="exec-summary">
    <strong>Architectural Defensibility Guarantee:</strong> Generic consumer AI apps fail on awkward pronoun hallucinations and rigid codebases that require developer deployment for simple catalog updates. Our decoupled architecture enforces <strong>100% deterministic pronoun and verb agreement</strong> across third-person dossier generation and second-person direct concierge chat, pairs an <strong>automated vector PDF compilation engine</strong> with simulated multi-channel dispatch (Resend SMTP + Twilio SMS), and provides operators with a <strong>zero-code CMS workbench</strong> to publish products, pricing intervals, and promo codes without writing a line of code.
  </div>

  <!-- 3. Scope Table (Phase 0 + Milestones 1-4) -->
  <div>
    <div class="section-header">
      <h3 class="section-title">Turnkey Production Milestones &amp; Fixed-Price Scope</h3>
      <span class="section-meta">TOTAL: $1,500.00 FIXED • 12 CALENDAR DAYS</span>
    </div>
    <table>
      <thead>
        <tr>
          <th style="width: 14%;">Milestone</th>
          <th style="width: 61%;">Deliverables &amp; Technical Architecture</th>
          <th style="width: 12%;">Timeline</th>
          <th style="width: 13%; text-align: right;">Escrow</th>
        </tr>
      </thead>
      <tbody>
        <tr class="phase-0-row">
          <td class="phase-num phase-0-badge">Milestone 1<br><span style="font-size: 7.6px; font-weight: normal; color: #166534;">Intake &amp; Schema</span></td>
          <td>
            <div class="phase-name">Intake Engine &amp; Deterministic Pronoun Matrix</div>
            <div class="phase-desc">Interactive profile studio, Zod validation schema, deterministic pronoun resolver (they/them, she/her, he/him, custom ze/zir) with strict subject-verb agreement (is/are, has/have, does/do), prompt template interpolation engine, and encrypted localStorage persistence.</div>
          </td>
          <td style="font-family: ui-monospace, monospace; font-size: 8.2px; color: #166534;">Days 1–3</td>
          <td style="font-family: ui-monospace, monospace; font-weight: 800; color: #166534; text-align: right;">$375.00</td>
        </tr>
        <tr>
          <td class="phase-num">Milestone 2<br><span style="font-size: 7.6px; font-weight: normal; color: #64748b;">Dual-Model AI</span></td>
          <td>
            <div class="phase-name">Dual-Model AI Orchestrator &amp; Conversational Concierge</div>
            <div class="phase-desc">Zero-SDK native HTTP inference pipeline calling OpenAI gpt-4o-mini (structured JSON mode), sub-second circuit-breaker failover to Google Gemini 2.5 Flash, offline deterministic rule engine fallback, and profile-aware conversational AI chatbot.</div>
          </td>
          <td style="font-family: ui-monospace, monospace; font-size: 8.2px;">Days 4–6</td>
          <td style="font-family: ui-monospace, monospace; font-weight: 800; text-align: right;">$375.00</td>
        </tr>
        <tr>
          <td class="phase-num">Milestone 3<br><span style="font-size: 7.6px; font-weight: normal; color: #64748b;">PDF &amp; Delivery</span></td>
          <td>
            <div class="phase-name">Automated Vector PDF Dossier &amp; Multi-Channel Dispatch</div>
            <div class="phase-desc">High-density executive PDF layout (summary, 3 core insights, 3-phase roadmap, risk matrix) with print-ready vector styling and zero middle void. Resend SMTP email and Twilio SMS notification triggers, plus user security center with 2FA TOTP setup.</div>
          </td>
          <td style="font-family: ui-monospace, monospace; font-size: 8.2px;">Days 7–9</td>
          <td style="font-family: ui-monospace, monospace; font-weight: 800; text-align: right;">$375.00</td>
        </tr>
        <tr>
          <td class="phase-num">Milestone 4<br><span style="font-size: 7.6px; font-weight: normal; color: #64748b;">CMS &amp; Deploy</span></td>
          <td>
            <div class="phase-name">Zero-Code CMS Workbench, Promo Codes &amp; Production Handover</div>
            <div class="phase-desc">Operator workbench for publishing dynamic services, prices, and features without code changes. Promo code validation engine with discount calculation. Production Vercel deployment, CI/CD pipeline, turnkey blueprints (n8n, Make, Inngest, Docker), and 30-day warranty.</div>
          </td>
          <td style="font-family: ui-monospace, monospace; font-size: 8.2px;">Days 10–12</td>
          <td style="font-family: ui-monospace, monospace; font-weight: 800; text-align: right;">$375.00</td>
        </tr>
        <tr class="total-row">
          <td colspan="2" style="text-transform: uppercase; letter-spacing: 0.05em; font-size: 8.8px;">Total Turnkey Production Commitment (4 Phased Milestones)</td>
          <td style="font-family: ui-monospace, monospace; font-size: 8.8px;">12 Days</td>
          <td style="font-family: ui-monospace, monospace; font-size: 9.8px; text-align: right; color: #93c5fd;">$1,500.00</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 4. 2-Column Grid: Escrow Schedule & Systems Guardrails -->
  <div class="grid-2col">
    <div class="card-box">
      <div class="card-box-title">
        <span>Phased Escrow Release Gates</span>
      </div>
      <div class="milestone-item">
        <span class="milestone-name">Milestone 1: Intake &amp; Pronoun Matrix Complete</span>
        <span class="milestone-val">$375.00 (25%)</span>
      </div>
      <div class="milestone-item">
        <span class="milestone-name">Milestone 2: Dual-Model LLM &amp; Concierge Live</span>
        <span class="milestone-val">$375.00 (25%)</span>
      </div>
      <div class="milestone-item">
        <span class="milestone-name">Milestone 3: PDF Vector Engine &amp; 2FA Armed</span>
        <span class="milestone-val">$375.00 (25%)</span>
      </div>
      <div class="milestone-item">
        <span class="milestone-name">Milestone 4: CMS Workbench &amp; Final Production Release</span>
        <span class="milestone-val">$375.00 (25%)</span>
      </div>
    </div>

    <div class="card-box">
      <div class="card-box-title">
        <span>Systems Engineering Guardrails &amp; SLAs</span>
      </div>
      <div class="guardrail-item"><strong>Grammar Guard:</strong> 100.0% deterministic pronoun agreement before and after prompt generation.</div>
      <div class="guardrail-item"><strong>Dual-Model Failover:</strong> Sub-second circuit-breaker between OpenAI and Gemini with 99.99% SLA.</div>
      <div class="guardrail-item"><strong>Zero Code Overhead:</strong> Operators add new products, pricing tiers, and promo codes in seconds.</div>
      <div class="guardrail-item"><strong>Vector PDF Guarantee:</strong> Publication-grade styling with 1-click client-side download and print.</div>
    </div>
  </div>

  <!-- 5. Commercial Terms Section -->
  <div class="terms-box">
    <div class="terms-grid">
      <div class="term-col">
        <div class="term-title">100% IP Ownership</div>
        <div class="term-body">All code, prompts, and documentation belong exclusively to the client upon milestone settlement. Zero vendor lock-in.</div>
      </div>
      <div class="term-col">
        <div class="term-title">Guaranteed Turnaround</div>
        <div class="term-body">Full 12 calendar day delivery schedule with daily async progress updates and staging deployments.</div>
      </div>
      <div class="term-col">
        <div class="term-title">30-Day Post-Launch Warranty</div>
        <div class="term-body">Includes bug fixes, prompt fine-tuning, and zero-charge platform support for 30 calendar days following launch.</div>
      </div>
      <div class="term-col">
        <div class="term-title">Turnkey Portability</div>
        <div class="term-body">Includes complete self-hosting blueprints for Docker, Inngest durable workflows, Make.com, and n8n nodes.</div>
      </div>
    </div>
  </div>

  <!-- 6. Executive Signature Footer -->
  <div class="footer-container">
    <div class="footer-founder">
      <img src="data:image/jpeg;base64,{headshot_b64}" alt="Shakil Ahmed" class="founder-avatar" />
      <div class="founder-info">
        <div class="founder-name"><strong>Md Shakil A.</strong> • Principal Systems Architect &amp; Founder (12+ Yrs Exp)</div>
        <div class="founder-company"><strong>BarakahSoft LLC</strong> • Enterprise Full-Stack &amp; AI Systems Partner</div>
        <div class="founder-sub">Former Lead Engineer at Legiit ($1M ARR Command Center) • Verified Upwork Partner</div>
      </div>
    </div>
    <div class="footer-brand">
      <img src="data:image/png;base64,{logo_b64}" alt="BarakahSoft" class="business-logo" />
      <a href="https://personaflow-ai-phi.vercel.app" target="_blank" class="demo-badge">personaflow-ai-phi.vercel.app</a>
    </div>
  </div>

</div>
</body>
</html>
"""

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print("Saved ESTIMATE.html to:", html_path)

chrome_cmd = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_path}",
    f"file://{os.path.abspath(html_path)}"
]

res = subprocess.run(chrome_cmd, capture_output=True, text=True)
if res.returncode == 0:
    print("Successfully compiled ESTIMATE.pdf at:", pdf_path)
else:
    print("Chrome print-to-pdf error:", res.stderr)

with open(pdf_path, "rb") as f:
    pdf_bytes = f.read()

pages = re.findall(rb"/Type\s*/Page[^s]", pdf_bytes)
print(f"Verified PDF page count: {len(pages)} page(s)")
