export const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  // { label: "Case Studies", href: "/case-studies" },
  { label: "Schedule", href: "/schedule" },
];

export const SERVICES = [
  {
    id: "leads",
    title: "Lead Capture & Instant Response",
    short: "24/7 instant response to every lead — before your competitor even checks their phone.",
    problem: "A lead comes in at 8pm. You see it at 7am. They already called your competitor and booked. You lost $3,000 in revenue while you slept.",
    solution: "Every lead from your website, Google, or ads gets an instant text and email response, automatic qualification, and a booking link — 24/7, even nights and weekends.",
    metric: "10-second response time",
    icon: "Phone",
  },
  {
    id: "followups",
    title: "Estimate Follow-Up Engine",
    short: "Automated follow-ups that turn sent quotes into signed jobs.",
    problem: "You send the estimate. Then... nothing. No follow-up. The homeowner goes with whoever calls back first. 60% of your quotes die in silence.",
    solution: "Automated, personalized follow-up sequences after every estimate — texts, emails, and reminders on a smart schedule until they book or say no.",
    metric: "3x quote close rate",
    icon: "Zap",
  },
  {
    id: "scheduling",
    title: "Smart Scheduling & Dispatch",
    short: "Automated booking, reminders, and dispatch — no more phone tag.",
    problem: "Your office manager spends 2+ hours a day on phone tag, rescheduling, and coordinating crews. That's $15,000/year in wasted salary.",
    solution: "Automated online booking, rescheduling, appointment reminders, and route-optimized dispatch — all synced to your calendar and crew schedules.",
    metric: "15+ hours saved weekly",
    icon: "Calendar",
  },
  {
    id: "reviews",
    title: "Review & Reputation Autopilot",
    short: "5-star reviews on autopilot after every completed job.",
    problem: "You finish the job, shake hands, and leave. Nobody asks for a review. Your competitor has 200+ Google reviews and you have 12.",
    solution: "Automated review request after every completed job. Filters unhappy customers to private feedback first, routes happy ones straight to Google.",
    metric: "5x review volume",
    icon: "Star",
  },
  {
    id: "pipeline",
    title: "CRM & Pipeline Automation",
    short: "Every lead, estimate, and job tracked in one place — automatically.",
    problem: "Customer info in your phone, quotes in email, schedule on a whiteboard. Nothing talks to anything. You're the bottleneck.",
    solution: "Unified pipeline: lead → estimate → job → invoice → follow-up, all automated and tracked in one place. No more manual data entry.",
    metric: "Zero leads lost",
    icon: "LineChart",
  },
  {
    id: "custom",
    title: "Custom Workflow Builder",
    short: "We find the task eating your week and automate it.",
    problem: "Every business has that one repetitive task eating 5+ hours a week — vendor emails, invoicing, reporting, inventory updates.",
    solution: "We identify your biggest time sinks and build custom automations tailored to your business. Invoicing, reporting, vendor coordination — whatever's eating your week.",
    metric: "40+ hours saved monthly",
    icon: "Wrench",
  },
];

export const PRICING_TIERS = [
  {
    name: "Starter",
    price: 497,
    period: "/mo",
    target: "For solo operators, $100k–$300k revenue",
    features: [
      "Free custom website included",
      "2 workflow automations",
      "Lead capture & instant response",
      "Estimate follow-up engine",
      "Monthly performance report",
      "Email & text support",
    ],
    cta: "Tell Us Your Problems",
    featured: false,
    websiteBadge: true,
  },
  {
    name: "Growth",
    price: 1497,
    period: "/mo",
    target: "For growing teams, $300k–$1M revenue",
    features: [
      "Free custom website included",
      "5 workflow automations",
      "Everything in Starter",
      "Smart scheduling & dispatch",
      "Review & reputation autopilot",
      "CRM & pipeline setup",
      "Bi-weekly strategy calls",
      "40-hour guarantee",
    ],
    cta: "Tell Us Your Problems",
    featured: true,
    badge: "Most Popular",
    websiteBadge: true,
  },
  {
    name: "Partner",
    price: 2997,
    period: "+/mo",
    target: "For businesses scaling to $1M–$5M+",
    features: [
      "Free custom website included",
      "Unlimited automations",
      "Everything in Growth",
      "Full operational takeover",
      "Multi-location support",
      "Custom integrations",
      "Weekly strategy calls",
      "Dedicated Slack channel",
      "SLA guarantees",
    ],
    cta: "Tell Us Your Problems",
    featured: false,
    websiteBadge: true,
  },
];

export const PROCESS_STEPS = [
  {
    step: "Step 1",
    title: "Audit",
    desc: "We dig into your operations for free. Every call flow, every follow-up, every scheduling headache. You get a report showing exactly where you're bleeding money and what to fix first.",
    icon: "Search",
  },
  {
    step: "Step 2",
    title: "Build",
    desc: "We build and deploy custom automations for your business. No templates. No generic software. Real systems, live in weeks — built around how you actually work.",
    icon: "Zap",
  },
  {
    step: "Step 3",
    title: "Scale",
    desc: "We maintain everything, optimize monthly, and prove ROI with hard numbers in your Performance Report. You focus on running crews and closing jobs.",
    icon: "TrendingUp",
  },
];

export const FAQ_ITEMS = [
  {
    q: "How is this different from ServiceTitan / Jobber / Housecall Pro?",
    a: "We don't replace your field service software — we supercharge it. Those tools are great for managing jobs, but they don't respond to leads at 2am, follow up on unsold estimates, or get you more Google reviews. We plug into whatever you already use and automate the gaps.",
  },
  {
    q: "What if the system makes a mistake?",
    a: "Our systems use strict safety guardrails. They never send a message, book a job, or take action without following your rules. If something falls outside the norm, it escalates to you or your office manager for approval. You stay in control.",
  },
  {
    q: "How quickly will I see results?",
    a: "Most clients see their first automation live within 2 weeks. By the end of Month 1, you'll have a complete diagnostic and your first systems deployed. By Month 3, your core operations are running tighter than you thought possible.",
  },
  {
    q: "What tools do you integrate with?",
    a: "ServiceTitan, Jobber, Housecall Pro, QuickBooks, Google Business Profile, Google Calendar, Stripe, Angi, Thumbtack, Yelp, Facebook, and more. If it has an API, we can connect it.",
  },
  {
    q: "What happens if I want to cancel?",
    a: "No long-term contracts. Cancel anytime with 30 days notice. Everything we built stays yours. We'll document it so your next hire or office manager can maintain it.",
  },
  {
    q: "Is my data safe?",
    a: "Absolutely. Your data is strictly isolated with enterprise-grade security. We never share client data with third parties. Your customer info, job data, and business operations stay in your silo. Period.",
  },
  {
    q: "What's the 40-hour guarantee?",
    a: "On our Growth and Partner tiers, if we don't prove we saved you at least 40 hours of manual labor in our Monthly Performance Report, your next month is free. We put our money where our mouth is.",
  },
  {
    q: "What's included in the free website?",
    a: "Every new client gets a professionally designed, mobile-optimized website built and hosted at no extra cost. It's not a template — we custom-build it for your brand, optimized for local SEO and lead capture. It's our way of making sure you look as sharp online as your operations run behind the scenes.",
  },
];

export const CASE_STUDIES = [
  {
    industry: "HVAC Services",
    company: "Regional HVAC Company",
    revenue: "$580k/year",
    problem: "Lead response time was 6+ hours. Office manager manually copied leads from website forms into their scheduling system. Lost 3-4 jobs per week to faster competitors.",
    solution: "Built automated lead capture → instant response → qualification → booking pipeline. Every lead gets a text in under 10 seconds with availability and a booking link.",
    metrics: {
      hoursSaved: 45,
      responseTime: { before: "6+ hours", after: "10 seconds" },
      satisfaction: { before: "72%", after: "94%" },
      monthlySavings: 4200,
    },
    quote: "We went from losing leads overnight to booking jobs before our competitors even check their email.",
  },
  {
    industry: "Plumbing",
    company: "Family Plumbing Company",
    revenue: "$420k/year",
    problem: "Sent 30+ estimates per month but never followed up. Owner estimated 60% of quotes died in silence because nobody called back.",
    solution: "Deployed automated estimate follow-up sequences — personalized texts and emails at day 1, 3, 7, and 14 after every quote. Smart escalation for high-value jobs.",
    metrics: {
      hoursSaved: 38,
      responseTime: { before: "Never", after: "Same day" },
      satisfaction: { before: "3.2/5", after: "4.8/5" },
      monthlySavings: 5200,
    },
    quote: "We were leaving $60k a year on the table just from not following up. Now it happens automatically.",
  },
  {
    industry: "Landscaping",
    company: "Growing Landscape Company",
    revenue: "$340k/year",
    problem: "Only had 14 Google reviews after 8 years in business. Competitors with 200+ reviews were winning all the search traffic and homeowner trust.",
    solution: "Automated review request system triggered after every completed job. Happy customers get a direct Google review link. Unhappy customers get routed to private feedback first.",
    metrics: {
      hoursSaved: 12,
      responseTime: { before: "N/A", after: "Same day" },
      satisfaction: { before: "14 reviews", after: "120+ reviews" },
      monthlySavings: 3800,
    },
    quote: "We went from 14 reviews to over 120 in four months. Now we show up first on Google and the phone rings itself.",
  },
];

export const TRUST_POINTS = [
  {
    icon: "Shield",
    title: "Built-in Safety Checks",
    desc: "Our systems never send a message, book a job, or take action without following your rules. When something's unusual, it escalates to you.",
  },
  {
    icon: "Lock",
    title: "Your Data Stays Yours",
    desc: "Strict enterprise-grade security. Your customer data and business info is isolated. We never share client data with third parties.",
  },
  {
    icon: "LineChart",
    title: "Provable ROI",
    desc: "Monthly Performance Reports show the exact hours saved and dollars returned. No vanity metrics — just real numbers.",
  },
  {
    icon: "Rocket",
    title: "Done For You",
    desc: "We don't hand you software and wish you luck. We build it, run it, maintain it, and prove it works — every month.",
  },
];

export const INTEGRATIONS = [
  "ServiceTitan", "Jobber", "Housecall Pro", "QuickBooks",
  "Google Business", "Google Calendar", "Stripe", "Angi",
  "Thumbtack", "Yelp", "Facebook", "Zapier",
];
