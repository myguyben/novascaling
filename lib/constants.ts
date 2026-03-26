export const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  // { label: "Case Studies", href: "/case-studies" },
  { label: "Schedule", href: "/schedule" },
];

export const SERVICES = [
  {
    id: "support",
    title: "Customer Support Triage",
    short: "Smart ticket routing and first-response automation.",
    problem: "Your team spends hours reading, categorizing, and routing support tickets manually.",
    solution: "Every incoming ticket is automatically read, categorized by urgency and topic, a contextual first response is drafted, and it's routed to the right person — in under 10 seconds.",
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
    solution: "Automatically drafts and schedules personalized follow-ups based on conversation history, deal stage, and prospect behavior.",
    metric: "3x follow-up completion rate",
    icon: "Zap",
  },
  {
    id: "knowledge",
    title: "Internal Knowledge Base",
    short: "Your team's questions answered instantly.",
    problem: "Staff constantly Slack you the same questions. You're the bottleneck.",
    solution: "A smart assistant built around your SOPs, policies, and docs. Your team gets instant answers without interrupting you.",
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
    short: "Auto-drafted emails for any business context.",
    problem: "You spend 2+ hours daily writing repetitive vendor negotiations, proposals, and client emails.",
    solution: "Automatically drafts context-aware emails using your tone, past conversations, and business rules. You review and send.",
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
      "Free custom website included",
      "2 core workflow automations",
      "Internal Knowledge Assistant",
      "Monthly Growth Report",
      "Email & chat support",
    ],
    cta: "Let's Do Lunch",
    featured: false,
    websiteBadge: true,
  },
  {
    name: "Growth Engine",
    price: 2500,
    period: "/mo",
    target: "For businesses $250k–$750k revenue",
    features: [
      "Free custom website included",
      "5 core workflow automations",
      "Custom Support Automation",
      "CRM & ecosystem integration",
      "Bi-weekly strategy sessions",
      "Dynamic ROI dashboard",
      "40-hour guarantee",
    ],
    cta: "Let's Do Lunch",
    featured: true,
    badge: "Most Popular",
    websiteBadge: true,
  },
  {
    name: "Enterprise Matrix",
    price: 5000,
    period: "+/mo",
    target: "For businesses scaling to $3M+",
    features: [
      "Free custom website included",
      "Complete operational takeover",
      "Custom system configuration",
      "Multi-system orchestration",
      "SLA deployment guarantees",
      "Dedicated Slack channel",
      "Weekly strategy sessions",
    ],
    cta: "Let's Do Lunch",
    featured: false,
    websiteBadge: true,
  },
];

export const PROCESS_STEPS = [
  {
    step: "Step 1",
    title: "Audit",
    desc: "We dig into your operations for free. Every SOP, every tool, every workflow. You get a report showing exactly where you're bleeding money and what to fix first.",
    icon: "Search",
  },
  {
    step: "Step 2",
    title: "Build",
    desc: "We build and deploy custom automations for your business. No templates. No Zapier chains. Real systems, live in weeks.",
    icon: "Zap",
  },
  {
    step: "Step 3",
    title: "Scale",
    desc: "We maintain everything, optimize monthly, and prove ROI with hard numbers in your Growth Report. You focus on growing.",
    icon: "TrendingUp",
  },
];

export const FAQ_ITEMS = [
  {
    q: "How is this different from hiring a freelancer or agency?",
    a: "Freelancers build it and leave. Agencies charge 10x and move slowly. We embed ourselves as your Fractional Operations Partner — we build, maintain, optimize, and report on every automation continuously. You get enterprise-grade results at SMB pricing.",
  },
  {
    q: "What if the system makes a mistake?",
    a: "Our A.N.T. architecture uses strict safety guardrails. Systems never execute financial transactions, destructive writes, or send external communications without validation and human-in-the-loop approval. If confidence is low, it escalates to you.",
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
    q: "Is my data safe?",
    a: "Absolutely. Your data is strictly isolated with enterprise-grade security policies. We never share client data with third parties. Your information stays in your silo. Period.",
  },
  {
    q: "What's the 40-hour guarantee?",
    a: "On our Growth Engine tier, if we don't mathematically prove we saved you at least 40 hours of manual labor in our Monthly Growth Report, your next month is free. We put our money where our mouth is.",
  },
  {
    q: "What's included in the free website?",
    a: "Every new client gets a professionally designed, mobile-optimized website built and hosted at no extra cost. It's not a template — we custom-build it for your brand. It's our way of making sure you look as sharp online as your operations run behind the scenes.",
  },
];

export const CASE_STUDIES = [
  {
    industry: "E-Commerce",
    company: "Boutique D2C Brand",
    revenue: "$320k/year",
    problem: "Founder spent 3 hours daily manually routing customer support tickets between Shopify, Zendesk, and their returns portal.",
    solution: "Deployed automated triage system that reads every ticket, categorizes by type (return, shipping, product question), drafts a contextual first response, and routes to the correct queue.",
    metrics: {
      hoursSaved: 62,
      responseTime: { before: "4.2 hours", after: "8 minutes" },
      satisfaction: { before: "3.2/5", after: "4.7/5" },
      monthlySavings: 3100,
    },
    quote: "I got my evenings back. The system handles 80% of tickets without me ever seeing them.",
  },
  {
    industry: "HVAC Services",
    company: "Regional HVAC Dispatcher",
    revenue: "$580k/year",
    problem: "Lead response time was 6+ hours. Office manager manually copied leads from website forms into their scheduling system.",
    solution: "Built automated lead capture → qualification → CRM routing pipeline. System scores leads, sends instant acknowledgment, and books the highest-priority jobs automatically.",
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
    solution: "Automated email drafting system built around agent tone and past communications. Automated listing update broadcasts and intelligent follow-up scheduling.",
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
    title: "Built-in Safety Checks",
    desc: "Our systems never execute financial transactions or destructive actions without validation and human-in-the-loop approval.",
  },
  {
    icon: "Lock",
    title: "Data Stays Yours",
    desc: "Strict enterprise-grade security. Your data is isolated. We never share client data with third parties.",
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
