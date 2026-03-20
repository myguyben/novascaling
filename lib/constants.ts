export const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Blog", href: "/blog" },
];

export const SERVICES = [
  {
    id: "support",
    title: "Customer Support Triage",
    short: "AI-powered ticket routing and first-response automation.",
    problem: "Your team spends hours reading, categorizing, and routing support tickets manually.",
    solution: "Our AI reads every incoming ticket, categorizes by urgency and topic, drafts a contextual first response, and routes to the right person — in under 10 seconds.",
    metric: "85% faster first response time",
    icon: "Bot",
  },
  {
    id: "leads",
    title: "Lead Qualification & Routing",
    short: "Instant lead scoring synced to your CRM.",
    problem: "Leads sit in your inbox for hours while competitors respond in minutes.",
    solution: "Every new lead is instantly scored, enriched with public data, and routed into your CRM pipeline with a suggested follow-up action.",
    metric: "10-second lead response time",
    icon: "LineChart",
  },
  {
    id: "followups",
    title: "Automated Follow-ups",
    short: "Context-aware email sequences that close deals.",
    problem: "Follow-up emails fall through the cracks. Prospects go cold.",
    solution: "AI drafts and schedules personalized follow-ups based on conversation history, deal stage, and prospect behavior.",
    metric: "3x follow-up completion rate",
    icon: "Zap",
  },
  {
    id: "knowledge",
    title: "Internal Knowledge Base",
    short: "Your team's questions answered instantly by AI.",
    problem: "Staff constantly Slack you the same questions. You're the bottleneck.",
    solution: "A custom AI agent trained on your SOPs, policies, and docs. Your team gets instant answers without interrupting you.",
    metric: "40+ hours saved monthly",
    icon: "Search",
  },
  {
    id: "pipeline",
    title: "Sales Pipeline Automation",
    short: "End-to-end pipeline management on autopilot.",
    problem: "Deals stall because nobody updates the CRM or triggers the next step.",
    solution: "Automated stage transitions, task creation, notification triggers, and reporting — all connected to your existing tools.",
    metric: "2x pipeline velocity",
    icon: "Rocket",
  },
  {
    id: "email",
    title: "Vendor & Email Drafting",
    short: "AI-drafted emails for any business context.",
    problem: "You spend 2+ hours daily writing repetitive vendor negotiations, proposals, and client emails.",
    solution: "AI drafts context-aware emails using your tone, past conversations, and business rules. You review and send.",
    metric: "70% less time on email",
    icon: "Lock",
  },
];

export const PRICING_TIERS = [
  {
    name: "Core Operations",
    price: 850,
    period: "/mo",
    target: "For businesses $100k–$250k revenue",
    features: [
      "2 core workflow automations",
      "Internal Knowledge Agent",
      "Monthly Growth Report",
      "Email & chat support",
    ],
    cta: "Get Started",
    featured: false,
  },
  {
    name: "Growth Engine",
    price: 2500,
    period: "/mo",
    target: "For businesses $250k–$750k revenue",
    features: [
      "5 core workflow automations",
      "Custom AI Support Agent",
      "CRM & ecosystem integration",
      "Bi-weekly strategy sessions",
      "Dynamic ROI dashboard",
      "40-hour guarantee",
    ],
    cta: "Get Started",
    featured: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise Matrix",
    price: 5000,
    period: "+/mo",
    target: "For businesses scaling to $3M+",
    features: [
      "Complete operational takeover",
      "Custom LLM fine-tuning",
      "Multi-agent orchestration",
      "SLA deployment guarantees",
      "Dedicated Slack channel",
      "Weekly CAIO sessions",
    ],
    cta: "Contact Us",
    featured: false,
  },
];

export const PROCESS_STEPS = [
  {
    month: "Month 1",
    title: "The Diagnostic",
    desc: "We audit every SOP, tool, and workflow to find where you're bleeding time and money. You get a custom AI Roadmap.",
    icon: "Search",
  },
  {
    month: "Month 2",
    title: "Quick Wins",
    desc: "We deploy high-ROI automations immediately — internal knowledge bots, email triage, lead routing. You see results in days, not months.",
    icon: "Zap",
  },
  {
    month: "Month 3",
    title: "Core Automations",
    desc: "Full pipeline integration: your CRM, helpdesk, and comms tools connected through intelligent AI orchestration.",
    icon: "Layers",
  },
  {
    month: "Month 4+",
    title: "Continuous Growth",
    desc: "Ongoing optimization, new automation opportunities, and monthly ROI reports proving every dollar of your investment.",
    icon: "TrendingUp",
  },
];

export const FAQ_ITEMS = [
  {
    q: "How is this different from hiring a freelancer or agency?",
    a: "Freelancers build it and leave. Agencies charge 10x and move slowly. We embed ourselves as your Fractional AI Officer — we build, maintain, optimize, and report on every automation continuously. You get enterprise-grade results at SMB pricing.",
  },
  {
    q: "What if the AI makes a mistake?",
    a: "Our A.N.T. architecture uses strict deterministic guardrails. AI never executes financial transactions, destructive writes, or sends external communications without schema validation and human-in-the-loop approval. If confidence is low, it escalates to you.",
  },
  {
    q: "How quickly will I see results?",
    a: "Most clients see their first automation live within 2 weeks. By the end of Month 1, you'll have a complete diagnostic and your first Quick Win deployed. By Month 3, your core operations are transformed.",
  },
  {
    q: "What tools do you integrate with?",
    a: "HubSpot, Salesforce, Shopify, Zendesk, Slack, Stripe, Gmail, Google Sheets, Zapier, Make, and more. If it has an API, we can connect it.",
  },
  {
    q: "What happens if I want to cancel?",
    a: "No long-term contracts. Cancel anytime with 30 days notice. Everything we built stays yours. We'll even document it so your next hire can maintain it.",
  },
  {
    q: "Do you use my data to train AI models?",
    a: "Absolutely not. Your data is strictly siloed within row-level security policies. We never use client data to train foundational models. Period.",
  },
  {
    q: "What's the 40-hour guarantee?",
    a: "On our Growth Engine tier, if we don't mathematically prove we saved you at least 40 hours of manual labor in our Monthly Growth Report, your next month is free. We put our money where our mouth is.",
  },
];

export const CASE_STUDIES = [
  {
    industry: "E-Commerce",
    company: "Boutique D2C Brand",
    revenue: "$320k/year",
    problem: "Founder spent 3 hours daily manually routing customer support tickets between Shopify, Zendesk, and their returns portal.",
    solution: "Deployed AI triage agent that reads every ticket, categorizes by type (return, shipping, product question), drafts a contextual first response, and routes to the correct queue.",
    metrics: {
      hoursSaved: 62,
      responseTime: { before: "4.2 hours", after: "8 minutes" },
      satisfaction: { before: "3.2/5", after: "4.7/5" },
      monthlySavings: 3100,
    },
    quote: "I got my evenings back. The AI handles 80% of tickets without me ever seeing them.",
  },
  {
    industry: "HVAC Services",
    company: "Regional HVAC Dispatcher",
    revenue: "$580k/year",
    problem: "Lead response time was 6+ hours. Office manager manually copied leads from website forms into their scheduling system.",
    solution: "Built automated lead capture → qualification → CRM routing pipeline. AI scores leads, sends instant acknowledgment, and books the highest-priority jobs automatically.",
    metrics: {
      hoursSaved: 45,
      responseTime: { before: "6+ hours", after: "90 seconds" },
      satisfaction: { before: "72%", after: "94%" },
      monthlySavings: 4200,
    },
    quote: "We went from losing leads overnight to booking jobs before our competitors even check their email.",
  },
  {
    industry: "Real Estate",
    company: "Boutique Brokerage",
    revenue: "$890k/year",
    problem: "Agents spent 40% of their week on repetitive email drafting: listing updates, buyer follow-ups, vendor coordination.",
    solution: "AI email drafting system trained on agent tone and past communications. Automated listing update broadcasts and intelligent follow-up scheduling.",
    metrics: {
      hoursSaved: 52,
      responseTime: { before: "24 hours", after: "2 hours" },
      satisfaction: { before: "N/A", after: "4.8/5" },
      monthlySavings: 5800,
    },
    quote: "My agents close more deals because they spend their time with clients instead of typing emails.",
  },
];

export const TRUST_POINTS = [
  {
    icon: "Shield",
    title: "No Hallucination Risk",
    desc: "Our AI never executes financial transactions or destructive actions without schema validation and human-in-the-loop approval.",
  },
  {
    icon: "Lock",
    title: "Data Stays Yours",
    desc: "Strict row-level security. Your data is siloed. We never use client data to train models.",
  },
  {
    icon: "LineChart",
    title: "Provable ROI",
    desc: "Monthly Growth Payload reports show the exact hours saved and dollar value created. No vanity metrics.",
  },
  {
    icon: "Rocket",
    title: "Done For You",
    desc: "We don't hand you a tool and wish you luck. We build it, maintain it, optimize it, and report on it.",
  },
];

export const INTEGRATIONS = [
  "HubSpot", "Salesforce", "Shopify", "Zendesk",
  "Slack", "Stripe", "Gmail", "Google Sheets",
  "Zapier", "Make", "Notion", "Airtable",
];
