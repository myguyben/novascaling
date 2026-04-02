"use client";

import { motion, Variants } from 'framer-motion';
import { Target, TrendingUp, Cpu, ShieldCheck, Gem, Zap } from 'lucide-react';
import { useState } from 'react';

export default function BusinessPlan() {
    const [activeTab, setActiveTab] = useState<'vision' | 'market' | 'pricing' | 'gtm'>('vision');

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <div className="container plan-container">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="plan-header"
            >
                <div className="plan-header-title">
                    <Zap size={32} className="text-gradient" />
                    <h1>
                        A.N.T. <span className="text-gradient">Master Plan</span>
                    </h1>
                </div>
                <p>
                    Strategic operational blueprint for capturing the $100k-$1M SMB AI automation sector.
                </p>
            </motion.div>

            {/* Interactive Navigation */}
            <div className="plan-nav">
                {[
                    { id: 'vision', label: 'The Vision', icon: Target },
                    { id: 'market', label: 'Market & Ops', icon: TrendingUp },
                    { id: 'pricing', label: 'Pricing Model', icon: Gem },
                    { id: 'gtm', label: 'Go-to-Market', icon: ShieldCheck }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`glass-panel plan-tab`}
                        style={{
                            background: activeTab === tab.id ? 'rgba(245, 158, 11, 0.1)' : 'var(--glass-bg)',
                            border: activeTab === tab.id ? '1px solid var(--accent)' : '1px solid var(--glass-border)',
                            color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)'
                        }}
                    >
                        <tab.icon size={20} className={activeTab === tab.id ? 'text-gradient' : ''} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Dynamic Content Area */}
            <motion.div
                key={activeTab}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="plan-content"
            >
                {activeTab === 'vision' && (
                    <div className="dashboard-grid">
                        <motion.div variants={itemVariants} className="glass-panel summary-box">
                            <h2 className="plan-section-title">The North Star</h2>
                            <p className="summary-text plan-section-desc">
                                We do not sell software; we sell <strong className="text-gradient">Growth as a Service.</strong> By deploying deterministic AI automations wrapped in our A.N.T. System architecture, we pull SMBs out of operational stagnation.
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants} className="glass-panel metric-card">
                            <Cpu className="text-gradient plan-metric-icon" size={40} />
                            <h3 className="plan-metric-title">Deterministic Core</h3>
                            <p className="plan-metric-desc">
                                We govern probabilistic AI models with strict Python rules layered over Supabase schemas, guaranteeing reliability.
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants} className="glass-panel metric-card">
                            <TrendingUp className="text-gradient plan-metric-icon" size={40} />
                            <h3 className="plan-metric-title">Continuous ROI</h3>
                            <p className="plan-metric-desc">
                                Through our automated Monthly Growth Matrix, we constantly prove our value natively in the client's dashboard.
                            </p>
                        </motion.div>
                    </div>
                )}

                {activeTab === 'pricing' && (
                    <div className="dashboard-grid plan-pricing-grid">

                        <motion.div variants={itemVariants} className="glass-panel metric-card">
                            <div className="plan-tier-label">Tier 1: Foundation</div>
                            <div className="metric-value plan-tier-price">$850<span>/mo</span></div>
                            <p className="plan-tier-desc">For $100k-$250k SMBs needing to escape the mud.</p>
                            <ul className="win-list" style={{ marginTop: 'auto' }}>
                                <li className="win-item"><CheckCircle2 size={16} className="win-icon" /> 2 Core Workflows</li>
                                <li className="win-item"><CheckCircle2 size={16} className="win-icon" /> Internal Knowledge Agent</li>
                                <li className="win-item"><CheckCircle2 size={16} className="win-icon" /> Standard Monthly Reporting</li>
                            </ul>
                        </motion.div>

                        <motion.div variants={itemVariants} className="glass-panel metric-card" style={{ border: '2px solid var(--accent)', transform: 'scale(1.05)', position: 'relative' }}>
                            <div className="plan-sweet-spot-badge">THE SWEET SPOT</div>
                            <div className="plan-sweet-spot-label">Tier 2: Growth Engine</div>
                            <div className="metric-value text-gradient plan-tier-price">$2,500<span>/mo</span></div>
                            <p className="plan-tier-desc">For $250k-$750k SMBs ready to scale aggressively.</p>
                            <ul className="win-list" style={{ marginTop: 'auto' }}>
                                <li className="win-item"><CheckCircle2 size={16} className="win-icon" /> 5 Core Workflows</li>
                                <li className="win-item"><CheckCircle2 size={16} className="win-icon" /> Custom Autonomous Agent</li>
                                <li className="win-item"><CheckCircle2 size={16} className="win-icon" /> Performance Guarantee*</li>
                            </ul>
                        </motion.div>

                        <motion.div variants={itemVariants} className="glass-panel metric-card">
                            <div className="plan-tier-label">Tier 3: Enterprise</div>
                            <div className="metric-value plan-tier-price">$5k+<span>/mo</span></div>
                            <p className="plan-tier-desc">Fractional AI-COO for near $1M operations.</p>
                            <ul className="win-list" style={{ marginTop: 'auto' }}>
                                <li className="win-item"><CheckCircle2 size={16} className="win-icon" /> Unlimited Workflows</li>
                                <li className="win-item"><CheckCircle2 size={16} className="win-icon" /> Custom Agentic Sales</li>
                                <li className="win-item"><CheckCircle2 size={16} className="win-icon" /> Priority SLA Support</li>
                            </ul>
                        </motion.div>
                    </div>
                )}

                {activeTab === 'market' && (
                    <div className="dashboard-grid">
                        <motion.div variants={itemVariants} className="glass-panel summary-box">
                            <h2 className="plan-section-title">The Missing Market Segment</h2>
                            <p className="summary-text plan-market-desc">
                                $100k-$1M SMBs are trapped. They can't afford a $120k/year Data Engineer or a bespoke enterprise $10k/mo AI contract. They rely on disjointed SOPs across HubSpot, Shopify, and Zendesk.
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants} className="glass-panel metric-card">
                            <div className="metric-value text-gradient plan-market-value">85%+</div>
                            <h3 className="plan-market-value-title">Target Gross Margin</h3>
                            <p className="plan-market-value-desc">Through our deterministic A.N.T. system, we build atomic tools once and deploy across multiple clients instantly. LLM Token COGS are strictly capped under $30/mo.</p>
                        </motion.div>

                        <motion.div variants={itemVariants} className="glass-panel metric-card">
                            <div className="metric-value positive plan-market-value">&lt; 3%</div>
                            <h3 className="plan-market-value-title">Target Monthly Churn</h3>
                            <p className="plan-market-value-desc">By acting as outsourced infrastructure, ripping us out means returning to manual data entry. We form an impenetrable moat.</p>
                        </motion.div>
                    </div>
                )}

                {activeTab === 'gtm' && (
                    <div className="dashboard-grid">
                        <motion.div variants={itemVariants} className="glass-panel metric-card plan-gtm-header">
                            <div style={{ flex: 1 }}>
                                <h2 className="plan-gtm-title">The Acquisition Flow</h2>
                                <p className="summary-text">How we acquire, close, and expand accounts without a massive outbound sales team.</p>
                            </div>
                            <Target size={60} className="text-gradient" />
                        </motion.div>

                        <motion.div variants={itemVariants} className="glass-panel metric-card">
                            <h3 className="plan-gtm-step-1">1. The Audit Wedge</h3>
                            <p>We deploy an interactive lead magnet where founders input their tech stack. Our LLM instantly outlines the manual hours they are wasting per week.</p>
                        </motion.div>

                        <motion.div variants={itemVariants} className="glass-panel metric-card">
                            <h3 className="plan-gtm-step-2">2. Land & Expand</h3>
                            <p>We start with a $850 Tier 1 quick-win. In month 1, the Growth Payload proves ROI. We leverage this to upsell the custom Agentic Tier 2 package for $2,500.</p>
                        </motion.div>

                        <motion.div variants={itemVariants} className="glass-panel metric-card">
                            <h3 className="plan-gtm-step-3">3. Agency Partnerships</h3>
                            <p>We white-label our services to existing Shopify/HubSpot dev shops who need AI capabilities, splitting the retainer.</p>
                        </motion.div>
                    </div>
                )}

            </motion.div>
        </div>
    );
}

// Temporary inline component for checkboxes since we aren't importing it at top level for dynamic tabs easily without refactor
function CheckCircle2({ size, className }: { size: number, className: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
        </svg>
    );
}
