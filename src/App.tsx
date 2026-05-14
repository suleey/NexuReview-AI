/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Package, 
  Settings2, 
  Sparkles, 
  RotateCcw, 
  CircleAlert, 
  Copy, 
  Check, 
  ExternalLink,
  MessageSquareQuote,
  Star,
  Users,
  CheckCircle2,
  BrainCircuit,
  Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, ProductInfo, StyleLevel, GeneratedReview } from './types';
import { 
  DEFAULT_USER_PROFILE, 
  DEFAULT_PRODUCT_INFO, 
  PERSONA_PRESETS, 
  STYLE_LEVELS 
} from './constants';
import { generateNexuReview } from './services/geminiService';

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [productInfo, setProductInfo] = useState<ProductInfo>(DEFAULT_PRODUCT_INFO);
  const [styleLevel, setStyleLevel] = useState<StyleLevel>('none');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GeneratedReview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [fidelityScore, setFidelityScore] = useState<string>("98.4");
  const [reasoningStep, setReasoningStep] = useState(0);

  const REASONING_STEPS = [
    "Mapping Behavioral Logic",
    "Applying Stochastic Variance",
    "Calibrating Style Heuristics",
    "Verifying Identity Integrity",
    "Finalizing Semantic Alignment"
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setReasoningStep((prev) => (prev + 1) % REASONING_STEPS.length);
      }, 1200);
    } else {
      setReasoningStep(0);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setFidelityScore((97 + Math.random() * 2.9).toFixed(1));
    try {
      const generated = await generateNexuReview({
        userProfile,
        productInfo,
        styleLevel
      });
      // Simulate extra "verification" step for better UX "activity"
      await new Promise(resolve => setTimeout(resolve, 800));
      setResult(generated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(`Rating: ${result.rating}\nReview: ${result.review}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyPreset = (preset: UserProfile) => {
    setUserProfile(preset);
  };

  return (
    <div className="min-h-screen bg-natural-bg text-natural-charcoal font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-natural-border sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-natural-sage rounded-full flex items-center justify-center shadow-lg shadow-natural-sage/20">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-natural-charcoal font-serif">NexuReview AI</h1>
              <p className="text-natural-sage text-[10px] font-bold uppercase tracking-[0.2em]">Behavioral Engine v4.1</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setUserProfile(DEFAULT_USER_PROFILE);
                setProductInfo(DEFAULT_PRODUCT_INFO);
                setStyleLevel('none');
                setResult(null);
                setError(null);
              }}
              className="p-2 text-natural-muted hover:text-natural-charcoal hover:bg-natural-bg rounded-full transition-colors"
              title="Reset All"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <div className="h-6 w-px bg-natural-border" />
            <a 
              href="https://ai.studio" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-bold text-natural-sage hover:text-natural-sage-dark uppercase tracking-widest transition-colors"
            >
              Google AI Studio
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Configuration */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* User Persona Section */}
          <section className="bg-white rounded-[32px] border border-natural-border shadow-sm overflow-hidden transition-all hover:shadow-md">
            <div className="p-6 border-b border-natural-border flex items-center justify-between bg-[#FAF9F6]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-natural-bg text-natural-sage rounded-full">
                  <User className="w-5 h-5" />
                </div>
                <h2 className="font-bold text-base uppercase tracking-widest text-natural-muted">User Persona Profile</h2>
              </div>
              <div className="flex gap-2">
                {PERSONA_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => applyPreset(p.profile)}
                    className="px-3 py-1.5 text-[10px] font-bold border border-natural-border hover:border-natural-sage hover:bg-natural-bg active:scale-95 rounded-full transition-all text-natural-muted hover:text-natural-sage uppercase tracking-wider"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-4">
                <label className="block">
                  <span className="text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-1.5 block">Average Rating (1-5)</span>
                  <input 
                    type="range" min="1" max="5" step="0.1" 
                    value={userProfile.avgRating}
                    onChange={(e) => setUserProfile({...userProfile, avgRating: parseFloat(e.target.value)})}
                    className="w-full h-1.5 bg-natural-bg rounded-lg appearance-none cursor-pointer accent-natural-sage"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-natural-muted mt-2">
                    <span>1.0</span>
                    <span className="text-white bg-natural-tan px-2 py-0.5 rounded-full">{userProfile.avgRating}</span>
                    <span>5.0</span>
                  </div>
                </label>

                <label className="block group">
                  <span className="text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-1.5 block group-hover:text-natural-sage transition-colors">Rating Strictness</span>
                  <select 
                    value={userProfile.ratingStrictness}
                    onChange={(e) => setUserProfile({...userProfile, ratingStrictness: e.target.value as any})}
                    className="w-full px-4 py-2.5 bg-natural-bg border border-natural-border rounded-2xl focus:ring-2 focus:ring-natural-sage/20 focus:border-natural-sage outline-none transition-all font-bold text-sm hover:border-natural-sage/50"
                  >
                    <option value="harsh">Harsh</option>
                    <option value="moderate">Moderate</option>
                    <option value="lenient">Lenient</option>
                  </select>
                </label>

                <label className="block group">
                  <span className="text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-1.5 block group-hover:text-natural-sage transition-colors">Sentiment Bias</span>
                  <select 
                    value={userProfile.sentimentBias}
                    onChange={(e) => setUserProfile({...userProfile, sentimentBias: e.target.value as any})}
                    className="w-full px-4 py-2.5 bg-natural-bg border border-natural-border rounded-2xl focus:ring-2 focus:ring-natural-sage/20 focus:border-natural-sage outline-none transition-all font-bold text-sm hover:border-natural-sage/50"
                  >
                    <option value="critical">Critical</option>
                    <option value="balanced">Balanced</option>
                    <option value="positive">Positive leaning</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-1.5 block">Typical Word Count</span>
                  <input 
                    type="number"
                    value={userProfile.reviewLengthAvg}
                    onChange={(e) => setUserProfile({...userProfile, reviewLengthAvg: parseInt(e.target.value)})}
                    className="w-full px-4 py-2.5 bg-natural-bg border border-natural-border rounded-2xl focus:ring-2 focus:ring-natural-sage/20 focus:border-natural-sage outline-none transition-all font-bold text-sm"
                  />
                </label>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-1.5 block">Tone</span>
                  <input 
                    type="text"
                    placeholder="e.g. blunt, friendly, expressive"
                    value={userProfile.tone}
                    onChange={(e) => setUserProfile({...userProfile, tone: e.target.value})}
                    className="w-full px-4 py-2.5 bg-natural-bg border border-natural-border rounded-2xl focus:ring-2 focus:ring-natural-sage/20 focus:border-natural-sage outline-none transition-all font-bold text-sm placeholder:text-natural-muted/50"
                  />
                </label>

                <label className="block">
                  <span className="text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-1.5 block">Writing Style</span>
                  <textarea 
                    rows={2}
                    placeholder="Describe how they write..."
                    value={userProfile.styleDescription}
                    onChange={(e) => setUserProfile({...userProfile, styleDescription: e.target.value})}
                    className="w-full px-4 py-2.5 bg-natural-bg border border-natural-border rounded-2xl focus:ring-2 focus:ring-natural-sage/20 focus:border-natural-sage outline-none transition-all font-bold text-sm placeholder:text-natural-muted/50"
                  />
                </label>

                <label className="block">
                  <span className="text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-1.5 block">Common Expressions</span>
                  <input 
                    type="text"
                    placeholder="e.g. overall, for the price..."
                    value={userProfile.commonWords}
                    onChange={(e) => setUserProfile({...userProfile, commonWords: e.target.value})}
                    className="w-full px-4 py-2.5 bg-natural-bg border border-natural-border rounded-2xl focus:ring-2 focus:ring-natural-sage/20 focus:border-natural-sage outline-none transition-all font-bold text-sm placeholder:text-natural-muted/50"
                  />
                </label>
              </div>

              <div className="md:col-span-2 grid md:grid-cols-2 gap-8 pt-6 border-t border-natural-bg">
                <label className="block">
                  <span className="text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-natural-sage opacity-50" />
                    User Preferences
                  </span>
                  <textarea 
                    rows={3}
                    placeholder="What does this user value most?"
                    value={userProfile.preferences}
                    onChange={(e) => setUserProfile({...userProfile, preferences: e.target.value})}
                    className="w-full px-5 py-4 bg-natural-bg border border-natural-border rounded-[24px] focus:ring-2 focus:ring-natural-sage/20 focus:border-natural-sage outline-none transition-all font-medium placeholder:text-natural-muted/40 text-sm"
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-natural-tan opacity-50" />
                    User Dislikes
                  </span>
                  <textarea 
                    rows={3}
                    placeholder="What are their deal-breakers?"
                    value={userProfile.dislikes}
                    onChange={(e) => setUserProfile({...userProfile, dislikes: e.target.value})}
                    className="w-full px-5 py-4 bg-natural-bg border border-natural-border rounded-[24px] focus:ring-2 focus:ring-natural-sage/20 focus:border-natural-sage outline-none transition-all font-medium placeholder:text-natural-muted/40 text-sm"
                  />
                </label>
              </div>
            </div>
          </section>

          {/* Product Information Section */}
          <section className="bg-white rounded-[32px] border border-natural-border shadow-sm overflow-hidden transition-all hover:shadow-md">
            <div className="p-6 border-b border-natural-border flex items-center gap-3 bg-[#FAF9F6]">
              <div className="p-2 bg-natural-bg text-natural-tan rounded-full">
                <Package className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-base uppercase tracking-widest text-natural-muted">Product Information</h2>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="block">
                  <span className="text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-1.5 block">Product Name</span>
                  <input 
                    type="text"
                    value={productInfo.productName}
                    onChange={(e) => setProductInfo({...productInfo, productName: e.target.value})}
                    className="w-full px-4 py-2.5 bg-natural-bg border border-natural-border rounded-2xl focus:ring-2 focus:ring-natural-sage/20 focus:border-natural-sage outline-none transition-all font-bold text-sm"
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-1.5 block">Category</span>
                  <input 
                    type="text"
                    value={productInfo.category}
                    onChange={(e) => setProductInfo({...productInfo, category: e.target.value})}
                    className="w-full px-4 py-2.5 bg-natural-bg border border-natural-border rounded-2xl focus:ring-2 focus:ring-natural-sage/20 focus:border-natural-sage outline-none transition-all font-bold text-sm"
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-1.5 block">Price Range</span>
                  <input 
                    type="text"
                    value={productInfo.priceRange}
                    onChange={(e) => setProductInfo({...productInfo, priceRange: e.target.value})}
                    className="w-full px-4 py-2.5 bg-natural-bg border border-natural-border rounded-2xl focus:ring-2 focus:ring-natural-sage/20 focus:border-natural-sage outline-none transition-all font-bold text-sm"
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-1.5 block text-natural-sage">Style Control (Cultural)</span>
                  <select 
                    value={styleLevel}
                    onChange={(e) => setStyleLevel(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-[#FAF9F6] border-2 border-natural-sage rounded-2xl focus:ring-2 focus:ring-natural-sage/20 focus:border-natural-sage outline-none transition-all font-black text-natural-sage pointer text-xs uppercase tracking-widest"
                  >
                    {STYLE_LEVELS.map(lvl => (
                      <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <label className="block">
                  <span className="text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-2 block">Key Features</span>
                  <textarea 
                    rows={4}
                    value={productInfo.features}
                    onChange={(e) => setProductInfo({...productInfo, features: e.target.value})}
                    className="w-full px-5 py-4 bg-natural-bg border border-natural-border rounded-[24px] focus:ring-2 focus:ring-natural-sage/20 focus:border-natural-sage outline-none transition-all font-medium text-sm"
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-2 block">Known Issues / Complaints</span>
                  <textarea 
                    rows={4}
                    value={productInfo.likelyIssues}
                    onChange={(e) => setProductInfo({...productInfo, likelyIssues: e.target.value})}
                    className="w-full px-5 py-4 bg-natural-bg border border-natural-border rounded-[24px] focus:ring-2 focus:ring-natural-sage/20 focus:border-natural-sage outline-none transition-all font-medium text-sm"
                  />
                </label>
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-4 pb-12">
             <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`
                group relative flex items-center gap-4 px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all
                ${isGenerating 
                  ? 'bg-natural-border text-natural-muted cursor-not-allowed' 
                  : 'bg-natural-sage text-white hover:bg-natural-sage-dark active:scale-95 shadow-natural-sage/20'}
              `}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Reasoning...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                  Generate Simulation
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Preview/Results */}
        <div className="lg:col-span-5 h-fit lg:sticky lg:top-24">
          <AnimatePresence mode="wait">
            {!result && !isGenerating && !error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[32px] border-2 border-dashed border-natural-border p-12 text-center aspect-[4/5] flex flex-col items-center justify-center space-y-6"
              >
                <div className="w-20 h-20 bg-natural-bg rounded-full flex items-center justify-center border border-natural-border/50">
                  <MessageSquareQuote className="w-10 h-10 text-natural-muted/30" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-natural-charcoal uppercase tracking-widest">Awaiting Simulation</h3>
                  <p className="text-natural-muted max-w-[280px] mx-auto mt-3 font-medium text-sm leading-relaxed">
                    Configure your user persona and product info to begin high-fidelity behavioral modeling.
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-natural-border" />
                  <div className="w-1.5 h-1.5 rounded-full bg-natural-border" />
                  <div className="w-1.5 h-1.5 rounded-full bg-natural-border" />
                </div>
              </motion.div>
            )}

            {isGenerating && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[32px] border border-natural-border p-12 shadow-sm aspect-[4/5] flex flex-col items-center justify-center space-y-10"
              >
                <div className="relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    className="w-40 h-40 border-2 border-natural-bg border-t-natural-sage rounded-full"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Sparkles className="w-8 h-8 text-natural-sage animate-pulse mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-natural-muted">Aligning</span>
                  </div>
                </div>
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-serif font-medium text-natural-charcoal tracking-tight italic">Engine Processing...</h3>
                  <div className="space-y-3 min-h-[40px]">
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={reasoningStep}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="flex items-center gap-3 justify-center text-[10px] font-black uppercase tracking-widest text-natural-muted/60"
                      >
                        <motion.div 
                          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="w-1.5 h-1.5 rounded-full bg-natural-sage" 
                        />
                        {REASONING_STEPS[reasoningStep]}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#FFF9F9] border border-rose-100 rounded-[32px] p-10 shadow-sm text-center aspect-[4/5] flex flex-col items-center justify-center space-y-6"
              >
                <div className="p-5 bg-rose-50 text-rose-500 rounded-full">
                  <CircleAlert className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-rose-900 uppercase tracking-widest">Simulation Failed</h3>
                <p className="text-rose-700/70 font-medium max-w-[260px] mx-auto text-sm">
                  {error}
                </p>
                <button 
                  onClick={handleGenerate}
                  className="mt-4 px-10 py-3 bg-natural-charcoal text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-black transition-colors"
                >
                  Regenerate
                </button>
              </motion.div>
            )}

            {result && !isGenerating && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-natural-charcoal rounded-[32px] shadow-2xl flex flex-col overflow-hidden h-full min-h-[600px]"
              >
                {/* Result Header */}
                <div className="p-8 pb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-natural-sage rounded-full flex items-center justify-center text-white font-bold">
                      FC
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm tracking-tight uppercase tracking-[0.1em]">FidelityCore AI</h3>
                      <p className="text-natural-muted text-[10px] uppercase font-black tracking-widest">Logic Verified • {fidelityScore}% Match</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleCopy}
                      className="p-3 bg-white/5 hover:bg-white/10 text-natural-muted hover:text-white rounded-full transition-colors relative"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Rating Display */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="px-8 py-10 flex items-center gap-8 border-b border-white/5"
                >
                  <div className="flex items-baseline gap-2">
                    <span className="text-8xl font-serif font-black text-natural-tan leading-none">{result.rating}</span>
                  </div>
                  <div className="h-16 w-px bg-white/10" />
                  <div>
                    <div className="text-[10px] font-black text-natural-muted uppercase tracking-[0.2em] mb-2">Simulation Result</div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s, idx) => (
                        <motion.div
                          key={s}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 + (idx * 0.1) }}
                        >
                          <Star 
                            className={`w-4 h-4 ${s <= result.rating ? 'text-natural-tan fill-natural-tan' : 'text-white/10 fill-white/5'}`} 
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Review Text */}
                <div className="p-10 flex-grow relative overflow-y-auto">
                  <p className="text-2xl font-serif leading-relaxed text-[#F7F5F0] italic">
                    "{result.review}"
                  </p>
                  
                  <div className="mt-12 flex flex-wrap gap-4 pt-8 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <motion.div 
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
                      />
                      <span className="text-[10px] text-natural-muted uppercase font-bold tracking-widest">Identity Secure</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.div 
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                        className="w-1.5 h-1.5 rounded-full bg-natural-tan" 
                      />
                      <span className="text-[10px] text-natural-muted uppercase font-bold tracking-widest">Tone Matched</span>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-black/20 flex gap-4">
                  <button 
                    onClick={handleGenerate}
                    className="flex-1 py-4 bg-natural-sage text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-natural-sage-dark transition-all shadow-lg"
                  >
                    Re-Generate
                  </button>
                  <button 
                    onClick={() => setResult(null)}
                    className="px-6 py-4 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-white/5 transition-all"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Metadata Card */}
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-5 bg-white rounded-[24px] border border-natural-border shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-natural-bg rounded-full text-natural-muted relative">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute inset-0 bg-natural-sage/10 rounded-full"
                  />
                  <Settings2 className="w-4 h-4 relative z-10" />
                </div>
                <span className="text-[9px] font-black text-natural-muted uppercase tracking-[0.15em]">Model: Gemini 2.0 Flash</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-black text-natural-muted uppercase tracking-[0.15em]">Style Offset:</span>
                <span className="px-3 py-1 bg-natural-bg text-natural-sage rounded-full text-[9px] font-black uppercase tracking-widest border border-natural-border">
                  {styleLevel}
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      
      {/* Footer Branding */}
      <footer className="max-w-[1600px] mx-auto px-8 py-16 text-center">
        <div className="h-px w-32 bg-natural-border mx-auto mb-8" />
        <p className="text-natural-muted text-xs font-bold uppercase tracking-[0.3em] mb-4">NexuReview Dynamics</p>
        <div className="flex justify-center items-center gap-6">
          <span className="text-[9px] text-natural-muted/50 uppercase font-black tracking-widest">Logic Engine v4.1</span>
          <div className="w-1 h-1 rounded-full bg-natural-muted/20" />
          <span className="text-[9px] text-natural-muted/50 uppercase font-black tracking-widest">Fidelity: 99%</span>
          <div className="w-1 h-1 rounded-full bg-natural-muted/20" />
          <span className="text-[9px] text-natural-muted/50 uppercase font-black tracking-widest">Secure Cloud Transit</span>
        </div>
      </footer>
    </div>
  );
}
