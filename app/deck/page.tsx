'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, ArrowRight, Zap, Target, Shield, BarChart3 } from 'lucide-react';

const slides = [
    {
        id: 'intro',
        title: 'SMB Growth Partner',
        subtitle: 'Automating $100k-$1M Businesses',
        content: (
            <div className="flex flex-col items-center text-center space-y-16 mt-20">
                <h1 className="text-6xl md:text-[6rem] font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-10 tracking-tighter leading-tight">
                    Antigravity<br />Consultancy
                </h1>
                <p className="text-3xl text-gray-400 max-w-5xl leading-[1.8] tracking-wide font-light">
                    We don't just sell software. We sell <strong className="text-white font-semibold">Margin Expansion</strong> through autonomous AI infrastructure.
                </p>
            </div>
        ),
        icon: <Zap className="w-28 h-28 text-blue-400 mb-16 blur-[1px]" strokeWidth={1} />
    },
    {
        id: 'vision',
        title: 'The Vision',
        subtitle: 'Making Enterprise AI Accessible',
        content: (
            <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-center h-full px-12">
                <div className="space-y-12">
                    <h2 className="text-6xl font-bold text-white tracking-tight leading-tight">The Market Gap</h2>
                    <p className="text-3xl text-gray-400 leading-[1.8] font-light">
                        SMBs with $100k - $1M in revenue desperately need AI automation but cannot afford a dedicated $200k/yr Chief AI Officer.
                    </p>
                    <ul className="space-y-8 mt-16 border-t border-white/5 pt-16">
                        <li className="flex items-center text-3xl text-gray-300 font-light"><div className="w-4 h-4 rounded-full bg-red-400/80 mr-8 shadow-[0_0_12px_rgba(248,113,113,0.5)]" /> Overworked founders</li>
                        <li className="flex items-center text-3xl text-gray-300 font-light"><div className="w-4 h-4 rounded-full bg-red-400/80 mr-8 shadow-[0_0_12px_rgba(248,113,113,0.5)]" /> Messy, manual CRMs</li>
                        <li className="flex items-center text-3xl text-gray-300 font-light"><div className="w-4 h-4 rounded-full bg-red-400/80 mr-8 shadow-[0_0_12px_rgba(248,113,113,0.5)]" /> Inefficient customer support</li>
                    </ul>
                </div>
                <div className="glass-card p-16 lg:p-24 rounded-[3.5rem] border border-white/5 relative overflow-hidden group bg-white/[0.02] shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <Target className="w-24 h-24 text-blue-400 mb-16" strokeWidth={1} />
                    <h3 className="text-5xl font-bold text-white mb-10 tracking-tight">Our Solution</h3>
                    <p className="text-3xl text-gray-400 leading-[1.8] font-light">
                        A "done-for-you" operational takeover. We map processes, tune custom AI agents, and provide white-glove implementation.
                    </p>
                </div>
            </div>
        ),
        icon: null
    },
    {
        id: 'pillars',
        title: 'Core Architecture',
        subtitle: 'The A.N.T. Protocol',
        content: (
            <div className="grid lg:grid-cols-3 gap-16 lg:gap-24 mt-20 shrink-0 px-8">
                {[
                    { icon: <BarChart3 className="w-12 h-12" />, title: 'Acumen', desc: 'Strategic consulting to map existing processes & find bottlenecks.' },
                    { icon: <Zap className="w-12 h-12" />, title: 'Nuance', desc: 'Custom AI tuning & workflows, strictly tailored to your company data.' },
                    { icon: <Shield className="w-12 h-12" />, title: 'Trust', desc: 'White-glove implementation & continual proactive maintenance.' }
                ].map((item, i) => (
                    <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 + 0.3 }}
                        className="glass-card p-16 lg:p-20 rounded-[3.5rem] border border-white/5 hover:border-white/20 transition-all duration-700 hover:-translate-y-4 relative overflow-hidden bg-white/[0.02]"
                    >
                        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-70" />
                        <div className="text-blue-400 mb-12 w-24 h-24 flex items-center justify-center bg-blue-500/10 rounded-[2rem]">
                            {item.icon}
                        </div>
                        <h3 className="text-4xl font-bold text-white mb-8 tracking-tight">{item.title}</h3>
                        <p className="text-2xl text-gray-400 leading-[1.8] font-light">{item.desc}</p>
                    </motion.div>
                ))}
            </div>
        ),
        icon: null
    },
    {
        id: 'pricing',
        title: 'Pricing Tiers',
        subtitle: 'Scalable Growth Infrastructure',
        content: (
            <div className="grid lg:grid-cols-3 gap-12 lg:gap-20 mt-16 px-8">
                {[
                    { name: 'Tier 1: Foundation', price: '$850/mo', desc: 'Entry-level stabilization.', features: ['Lead Routing', 'CRM Cleanup', 'Basic AI Email'] },
                    { name: 'Tier 2: Catalyst', price: '$2,500/mo', desc: 'The Sweet Spot.', features: ['Everything in Tier 1', 'AI Support Agent', 'Zapier Integrations', 'Bi-weekly Strategy'], popular: true },
                    { name: 'Tier 3: Enterprise', price: '$5,000+/mo', desc: 'Complete operational takeover.', features: ['Everything in Tier 2', 'Custom LLM Fine-tuning', 'Multi-agent Orchestration', 'SLA Guarantees'] }
                ].map((tier) => (
                    <div key={tier.name} className={`glass-card p-14 lg:p-20 rounded-[3.5rem] border ${tier.popular ? 'border-blue-500/40 shadow-[0_0_80px_rgba(59,130,246,0.1)] bg-blue-500/[0.03]' : 'border-white/5 bg-white/[0.02]'} relative flex flex-col transition-all duration-700 hover:border-white/20 hover:-translate-y-2`}>
                        {tier.popular && <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-base font-bold px-10 py-3 rounded-full uppercase tracking-widest shadow-[0_15px_30px_rgba(59,130,246,0.3)]">Recommended</span>}
                        <h3 className="text-3xl font-bold text-white mb-6 tracking-tight pt-4">{tier.name}</h3>
                        <div className="text-[5rem] font-extrabold text-white mb-8 tracking-tighter leading-none">{tier.price}</div>
                        <p className="text-2xl text-gray-400 mb-10 pb-10 border-b border-white/10 leading-[1.8] font-light">{tier.desc}</p>
                        <ul className="space-y-8 flex-grow">
                            {tier.features.map(f => (
                                <li key={f} className="flex items-start text-xl text-gray-300 leading-relaxed font-light">
                                    <ArrowRight className="w-6 h-6 text-blue-400 mr-5 shrink-0 mt-1" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        ),
        icon: null
    },
    {
        id: 'guarantee',
        title: 'The Wedge',
        subtitle: 'Performance Guarantee',
        content: (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-[80rem] mx-auto space-y-24 shrink-0 px-12">
                <Shield className="w-40 h-40 text-blue-500/60 mx-auto" strokeWidth={0.5} />
                <blockquote className="text-[4rem] font-bold text-white leading-[1.3] tracking-tight relative">
                    <span className="absolute -left-16 -top-16 text-[10rem] text-white/10 font-serif">"</span>
                    We don't charge our setup fee until our system saves you <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">20 hours of manual labor</span> in a single week.
                    <span className="absolute -right-12 -bottom-24 text-[10rem] text-white/10 font-serif">"</span>
                </blockquote>
                <p className="text-4xl text-gray-400 max-w-5xl mx-auto leading-[1.8] font-light">
                    Radically de-risking the purchase for cautious SMB founders and shifting the focus from cost to immediate, undeniable ROI.
                </p>
            </div>
        ),
        icon: null
    }
];

export default function PresentationDeck() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState(0);

    const paginate = useCallback((newDirection: number) => {
        setDirection(newDirection);
        setCurrentSlide((prev) => {
            let next = prev + newDirection;
            if (next < 0) next = 0;
            if (next >= slides.length) next = slides.length - 1;
            return next;
        });
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === 'Space') paginate(1);
            if (e.key === 'ArrowLeft') paginate(-1);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [paginate]);

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1200 : -1200,
            opacity: 0,
            scale: 0.9,
            filter: 'blur(15px)'
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)'
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1200 : -1200,
            opacity: 0,
            scale: 0.9,
            filter: 'blur(15px)'
        })
    };

    const slide = slides[currentSlide];

    return (
        <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative font-sans flex flex-col selection:bg-blue-500/30">
            {/* Dynamic Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-600/10 blur-[200px]" />
                <div className="absolute top-[50%] -right-[10%] w-[60%] h-[70%] rounded-full bg-purple-600/10 blur-[200px]" />

                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_50%,#000_80%,transparent_100%)] opacity-60" />
            </div>

            {/* Header / Navigation Overlay */}
            <header className="absolute top-0 w-full p-12 lg:p-16 flex justify-between items-center z-50">
                <div className="flex items-center space-x-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-2xl shadow-xl">
                        A
                    </div>
                    <span className="font-semibold text-gray-300 tracking-[0.2em] text-2xl">ANT.PARTNERS</span>
                </div>

                <div className="flex space-x-4">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            title={`Go to slide ${i + 1}`}
                            aria-label={`Go to slide ${i + 1}`}
                            onClick={() => {
                                setDirection(i > currentSlide ? 1 : -1);
                                setCurrentSlide(i);
                            }}
                            className={`h-3 rounded-full transition-all duration-700 ${i === currentSlide ? 'w-20 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'w-4 bg-white/10 hover:bg-white/40'}`}
                        />
                    ))}
                </div>

                <Link href="/" className="text-xl font-medium text-gray-400 hover:text-white transition-colors tracking-widest bg-white/5 px-8 py-4 rounded-full border border-white/10 hover:bg-white/15 hover:border-white/30 backdrop-blur-md">
                    EXIT DECK
                </Link>
            </header>

            {/* Main Slide Content area */}
            <main className="flex-1 relative flex items-center justify-center p-16 md:p-24 lg:p-32 z-10 pt-40">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={currentSlide}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 250, damping: 35 },
                            opacity: { duration: 0.5 },
                            scale: { duration: 0.5 },
                            filter: { duration: 0.5 }
                        }}
                        className="w-full max-w-[120rem] mx-auto h-full flex flex-col justify-center"
                    >
                        {slide.title && slide.id !== 'intro' && (
                            <div className="mb-24 shrink-0 px-8">
                                <motion.h2
                                    initial={{ opacity: 0, y: -30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-2xl font-bold tracking-[0.3em] text-blue-500 uppercase mb-6"
                                >
                                    {slide.title}
                                </motion.h2>
                                <motion.h1
                                    initial={{ opacity: 0, y: -30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-[5rem] font-extrabold text-white tracking-tight leading-none"
                                >
                                    {slide.subtitle}
                                </motion.h1>
                            </div>
                        )}

                        {slide.icon && (
                            <div className="flex justify-center w-full shrink-0">
                                {slide.icon}
                            </div>
                        )}

                        <div className={`w-full ${slide.title && slide.id !== 'intro' ? 'h-[calc(100%-16rem)] flex items-center' : 'h-full flex items-center'}`}>
                            <div className="w-full">
                                {slide.content}
                            </div>
                        </div>

                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Navigation Controls */}
            <div className="absolute bottom-16 right-16 flex space-x-8 z-50">
                <button
                    title="Previous Slide"
                    aria-label="Previous Slide"
                    onClick={() => paginate(-1)}
                    disabled={currentSlide === 0}
                    className="p-8 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/15 hover:border-white/30 hover:scale-110 active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.5)]"
                >
                    <ChevronLeft className="w-10 h-10" strokeWidth={3} />
                </button>
                <button
                    title="Next Slide"
                    aria-label="Next Slide"
                    onClick={() => paginate(1)}
                    disabled={currentSlide === slides.length - 1}
                    className="p-8 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/15 hover:border-white/30 hover:scale-110 active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.5)]"
                >
                    <ChevronRight className="w-10 h-10" strokeWidth={3} />
                </button>
            </div>
        </div>
    );
}
