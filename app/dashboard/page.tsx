"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { TrendingUp, Activity, Zap, CheckCircle2 } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Dashboard() {
  const [report, setReport] = useState<any>(null);
  const [clientProfile, setClientProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatestReport() {
      const clientId = '550e8400-e29b-41d4-a716-446655440000';

      const { data: cData } = await supabase.from('clients').select('*').eq('id', clientId).single();
      if (cData) setClientProfile(cData);

      const { data: rData } = await supabase.from('growth_reports')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (rData) setReport(rData);
      setLoading(false);
    }
    fetchLatestReport();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="text-gradient" style={{ fontSize: '2rem', fontFamily: 'Outfit' }}>Initializing A.N.T. Interface...</div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container">
        <h1>No Growth Payload Detected</h1>
      </div>
    );
  }

  return (
    <>
      <div className="hero-glow" />
      <main className="container">
        <header className="header">
          <div className="nav-links">
            <a href="#services" className="nav-link">Services</a>
            <a href="#roi" className="nav-link">ROI Calculator</a>
            <Link href="/deck" className="nav-link" style={{ color: 'var(--accent)' }}>Pitch Deck</Link>
          </div>
          <div>
            <h1 style={{ fontSize: '3rem', margin: 0 }}>
              {clientProfile?.business_name || 'Partner'} <span className="text-gradient">Growth Matrix</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.1rem' }}>
              Period: {report.period}
            </p>
          </div>
          <div className="glass-panel" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity className="text-gradient" size={24} />
            <span style={{ fontWeight: 600 }}>A.N.T. System Active</span>
          </div>
        </header>

        <div className="dashboard-grid">
          <div className="glass-panel metric-card">
            <div className="metric-label">Estimated Value Created</div>
            <div className="metric-value positive">
              ${report.roi_analysis.estimated_value_created.toLocaleString()}
            </div>
          </div>

          <div className="glass-panel metric-card">
            <div className="metric-label">Net ROI Percentage</div>
            <div className="metric-value text-gradient">
              +{report.roi_analysis.net_roi_percentage}%
            </div>
          </div>

          <div className="glass-panel metric-card">
            <div className="metric-label">Agency Retainer</div>
            <div className="metric-value" style={{ color: 'var(--text-secondary)' }}>
              ${report.roi_analysis.agency_retainer_cost.toLocaleString()}
            </div>
          </div>

          <div className="glass-panel summary-box">
            <h2 style={{ fontSize: '1.5rem', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={24} /> Executive Summary
            </h2>
            <p className="summary-text">{report.executive_summary}</p>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', gridColumn: '1 / -1' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Deterministic Automation Wins</h2>
            <ul className="win-list">
              {report.automation_wins.map((win: any, idx: number) => (
                <li key={idx} className="win-item">
                  <CheckCircle2 className="win-icon" size={24} />
                  <div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{win.system}</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>{win.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}
