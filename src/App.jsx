import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { Eye, Briefcase, FileText, Zap, Download, Upload, Plus, Trash2, CheckCircle, ChevronDown, Printer, Save, RefreshCw, Search, BarChart3, ArrowRight, Terminal, X, Check, Info, AlertCircle, AlertTriangle, ExternalLink, GitCompare, Sparkles, BrainCircuit, Lock, Sun, Moon, Calendar, Clock, MessageSquare, Mail, Bell, TrendingUp, Settings, Keyboard, Filter, Star, StarOff, Key } from 'lucide-react';

// Theme Context for dark/light mode
const ThemeContext = createContext();
const useTheme = () => useContext(ThemeContext);

// ============================================================================
// P.A.T.H.O.S. - Personal Automated Tracking & Hiring Optimization System
// Version 2.0 - Enhanced Edition
// Powered by Google Gemini 2.5 Flash
// Architecture based on "Hybrid Engine" Research for ATS Optimization
// ============================================================================

// Email Detection Utility - Detects job postings requiring email submissions
const detectEmailSubmission = (jobDescription) => {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const submissionPhrases = [
    /submit\s+(?:your\s+)?(?:resume|cv|application|cover\s+letter)/i,
    /send\s+(?:your\s+)?(?:resume|cv|application|cover\s+letter)/i,
    /email\s+(?:your\s+)?(?:resume|cv|application|cover\s+letter)/i,
    /interested\s+candidates\s+should\s+(?:submit|send|email)/i,
    /apply\s+(?:by\s+)?(?:sending|emailing)/i,
    /forward\s+(?:your\s+)?(?:resume|cv)/i,
    /(?:resume|cv|application)s?\s+(?:to|at)\s+[a-zA-Z0-9._%+-]+@/i,
    /please\s+(?:submit|send|email)\s+(?:to\s+)?[a-zA-Z0-9._%+-]+@/i
  ];
  const emails = jobDescription.match(emailRegex) || [];
  const hasSubmissionPhrase = submissionPhrases.some(pattern => pattern.test(jobDescription));
  if (emails.length > 0 && hasSubmissionPhrase) {
    const filteredEmails = emails.filter(email => {
      const lower = email.toLowerCase();
      return !lower.includes('noreply') && !lower.includes('no-reply') && 
             !lower.includes('donotreply') && !lower.includes('unsubscribe');
    });
    return filteredEmails.length > 0 ? filteredEmails[0] : null;
  }
  return null;
};

const PATHOS_MESSAGES = {
  idle: [
    "Monitoring job search metrics.", "Systems operational.", "Standing by.", "Running diagnostics.",
    "Calibrating success probabilities...", "Scanning career nodes.", "Optimizing neural pathways.",
    "Database integrity verified.", "Analyzing resume keyword density.",
    "I am watching your career grow.", "Systems nominal. Ambition levels: High.",
    "Calculated probability of success: Increasing.", "Awaiting new targets.",
    "Ready to process next opportunity.", "Skill matrix loaded."
  ],
  analyzing: [
    "Gemini 2.5 Flash analyzing...", "Parsing job description taxonomy...",
    "Extracting entity relationships...", "Computing semantic embeddings...",
    "Identifying skill gaps...", "Analyzing contextual relevance..."
  ],
  optimizing: [
    "Executing Smart Dynamic Writing...", "Preserving voice signature...",
    "Applying semantic density optimization...", "Enforcing truth constraints...",
    "Synthesizing ATS-optimized resume...", "Validating factual accuracy..."
  ]
};

const getRandomMessage = (cat) => { 
  const m = PATHOS_MESSAGES[cat] || PATHOS_MESSAGES.idle; 
  return m[Math.floor(Math.random() * m.length)]; 
};

const DEFAULT_PROFILE = {
  name: "", email: "", phone: "", linkedin: "", github: "", location: "",
  summary: "",
  experience: [],
  skills: [],
  education: [],
};

// ============================================================================
// GEMINI API INTEGRATION
// Implements "Smart Dynamic Writing" & "Chain of Thought" Architecture
// ============================================================================

const GEMINI_MODEL = "gemini-2.5-flash-preview-09-2025";

// Helper to extract style examples for "Voice Signature" 
const extractStyleExamples = (profile) => {
  const examples = [];
  if (profile.experience && profile.experience.length > 0) {
    profile.experience.slice(0, 3).forEach(exp => {
      if (exp.bullets && exp.bullets.length > 0) {
        examples.push(exp.bullets[0]);
      }
    });
  }
  return examples.length > 0 ? examples : ["Reduced latency by 20% by refactoring the SQL database query structure.", "Managed a team of 5 developers, conducting weekly code reviews."];
};

// Full optimization prompt based on Research Section 4.2.1 & 4.2.2
const buildOptimizationPrompt = (profile, jobDescription) => {
  const styleExamples = extractStyleExamples(profile);

  return `You are an Expert ATS Engineer and Career Strategist. Perform "Smart Dynamic Writing" to optimize this resume for the target job description.

<system_instructions>
1. **Truth Constraint**: you may SLIGHTLY embellish skills and job experiences, not present in the <master_profile>. Do not add or change job titles, company information, dates, education, or blatantly lie about anything.
2. **Voice Preservation**: Analyze the <style_examples> to understand the user's sentence structure and vocabulary density. Mimic this voice.
3. **ATS Optimization**: Prioritize keywords found in the <target_jd>. Optimize for Semantic Density, not just keyword stuffing.
4. **STRICT ONE-PAGE CONSTRAINT**: The output MUST be extremely concise to fit on a single page.
   - **SUMMARY**: MAXIMUM 2 lines. Anchor critical skills in the opening sentence.
   - **EXPERIENCE**: Select ONLY the top 3 high-impact bullets per role. Rewrite them using the Action-Result (X-Y-Z) formula. Remove fluff. Combine short bullets.
   - **SKILLS**: You MUST update the 'skills' list to include relevant keywords from the JD that the candidate possesses.
5. **Output Format**: You MUST provide your output in two distinct XML blocks: <analysis> and <output_json>.
</system_instructions>

<master_profile>
${JSON.stringify(profile, null, 2)}
</master_profile>

<target_jd>
${jobDescription}
</target_jd>

<style_examples>
${styleExamples.map(s => `- "${s}"`).join('\n')}
</style_examples>

<output_instructions>
Step 1: Provide a concise list of changes in <analysis> tags. Strictly adhere to these constraints:
- **Length**: 65-85 words total.
- **Format**: 2-4 bullet points.
- **Style**: Start every bullet with an action verb (e.g., "Revised", "Highlighted", "Adjusted"). No introductory text.
Step 2: Provide the optimized resume data in <output_json> tags. This must be valid JSON matching the schema of the input profile, plus "coverLetter", "matchScore" (baseline/optimized), and "hardSkills" (extracted from JD).
</output_instructions>`;
};

const callGeminiAPI = async (prompt, key) => {
  if (!key) {
    throw new Error("Neural Interface Offline: Missing API Key.");
  }
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Research Section 4.1.2: XML Tagging for Structured Output
    // We use robust regex to parse the "Chain of Thought" analysis and the JSON payload
    
    let analysis = "Analysis not provided.";
    let jsonResult = null;

    const analysisMatch = content.match(/<analysis>([\s\S]*?)<\/analysis>/i);
    if (analysisMatch) {
      analysis = analysisMatch[1].trim();
    }

    // Extract JSON from <output_json> tags or fallback to markdown code blocks
    let jsonStr = "";
    const jsonTagMatch = content.match(/<output_json>([\s\S]*?)<\/output_json>/i);
    
    if (jsonTagMatch) {
      jsonStr = jsonTagMatch[1];
    } else {
      // Fallback: Try to find JSON in markdown blocks if XML tags fail
      // We use hex escape \x60 to represent backticks to prevent breaking the source file structure
      const codeBlockMatch = content.match(new RegExp('\\x60{3}(?:json)?\\s*([\\s\\S]*?)\\x60{3}'));
      if (codeBlockMatch) {
        jsonStr = codeBlockMatch[1];
      } else {
        // Last resort: assume the whole text might be JSON if it starts with {
        const firstBrace = content.indexOf('{');
        const lastBrace = content.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
          jsonStr = content.substring(firstBrace, lastBrace + 1);
        }
      }
    }

    // Clean any residual markdown formatting from the JSON string
    // Replace triple backticks using hex escapes
    jsonStr = jsonStr.replace(new RegExp('\\x60{3}json', 'g'), '').replace(new RegExp('\\x60{3}', 'g'), '').trim();

    try {
      jsonResult = JSON.parse(jsonStr);
    } catch (e) {
      console.error("JSON Parse Error:", e);
      console.log("Raw JSON string attempted:", jsonStr);
      throw new Error("Failed to parse optimized resume data from Gemini response.");
    }
    
    return { analysis, jsonResult };

  } catch (error) {
    console.error("Gemini API Call Failed", error);
    throw error;
  }
};

// ============================================================================
// UI COMPONENTS
// ============================================================================

const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  const Icon = { success: Check, error: AlertCircle, warning: AlertTriangle, info: Info }[type];
  return <div className={`toast toast-${type}`}><Icon size={18} /><span>{message}</span><button onClick={onClose}><X size={14} /></button></div>;
};

const PathosEye = ({ message, mood = 'neutral', compact = false }) => {
  const eyeRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);
  const [auto, setAuto] = useState(true);
  const autoRef = useRef(null);

  useEffect(() => {
    const i = setInterval(() => {
      if (auto) {
        const patterns = [
          () => ({ x: (Math.random() - 0.5) * 12, y: (Math.random() - 0.5) * 8 }),
          () => ({ x: (Math.random() - 0.5) * 4, y: -5 - Math.random() * 3 }),
          () => ({ x: (Math.random() > 0.5 ? 6 : -6), y: (Math.random() - 0.5) * 3 })
        ];
        const p = patterns[Math.floor(Math.random() * patterns.length)]();
        setPos({ x: Math.max(-10, Math.min(10, p.x)), y: Math.max(-8, Math.min(8, p.y)) });
      }
    }, 1200 + Math.random() * 1800);
    return () => clearInterval(i);
  }, [auto]);

  useEffect(() => {
    const h = (e) => {
      if (Math.random() < 0.3) {
        setAuto(false);
        if (!eyeRef.current) return;
        const r = eyeRef.current.getBoundingClientRect();
        const a = Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2));
        const d = Math.min(8, Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)) / 30);
        setPos({ x: Math.cos(a) * d, y: Math.sin(a) * d });
        if (autoRef.current) clearTimeout(autoRef.current);
        autoRef.current = setTimeout(() => setAuto(true), 3000);
      }
    };
    window.addEventListener('mousemove', h);
    return () => { window.removeEventListener('mousemove', h); if (autoRef.current) clearTimeout(autoRef.current); };
  }, []);

  useEffect(() => { 
    const i = setInterval(() => { setBlink(true); setTimeout(() => setBlink(false), 120); }, 4000 + Math.random() * 3000); 
    return () => clearInterval(i); 
  }, []);

  const moodColors = { neutral: '#3f3f46', thinking: '#3b82f6', success: '#4ade80', warning: '#fbbf24' };

  if (compact) return (
    <div className="pathos-compact">
      <div className="pathos-eye-small" ref={eyeRef} style={{ borderColor: moodColors[mood] }}>
        <div className={`pathos-iris-small ${blink ? 'blink' : ''}`} style={{ transform: `translate(${pos.x * 0.5}px, ${pos.y * 0.5}px)`, background: moodColors[mood] }}>
          <div className="pathos-pupil-small" />
        </div>
      </div>
      <p className="pathos-msg-compact">{message}</p>
    </div>
  );
  
  return (
    <div className="pathos-container">
      <div className="pathos-eye" ref={eyeRef} style={{ borderColor: moodColors[mood] }}>
        <div className={`pathos-iris ${blink ? 'blink' : ''}`} style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}>
          <div className="pathos-pupil" />
        </div>
      </div>
      <div className="pathos-msg-box"><p className="pathos-msg">{message}</p></div>
    </div>
  );
};

// ============================================================================
// MODERN SANKEY DIAGRAM - Horizontal Flow from Applied
// ============================================================================

const SankeyDiagram = ({ applications }) => {
  const total = applications.length;
  
  if (total === 0) {
    return (
      <div className="card sankey-card">
        <div className="card-hdr">Application Flow</div>
        <div className="empty-sm"><BarChart3 size={24} /><p>No applications yet</p></div>
      </div>
    );
  }

  // Calculate counts - ALL start from Applied
  const isGhosted = (app) => app.status === 'applied' && Math.floor((Date.now() - new Date(app.appliedDate).getTime()) / 86400000) > 30;
  
  const pending = applications.filter(a => a.status === 'applied' && !isGhosted(a)).length;
  const ghosted = applications.filter(isGhosted).length;
  const rejected = applications.filter(a => a.status === 'rejected').length;
  const interviewing = applications.filter(a => a.status === 'interviewing').length;
  const offers = applications.filter(a => a.status === 'offer').length;
  const accepted = applications.filter(a => a.status === 'accepted').length;
  const declined = applications.filter(a => a.status === 'declined').length;

  // SVG dimensions
  const width = 600;
  const height = 300;
  const nodeWidth = 8;
  const nodeRadius = 4;
  
  // Node positions (x)
  const col1 = 50;  // Applied
  const col2 = 200; // Pending, Ghosted, Rejected, Interviewing
  const col3 = 350; // Offer (from interviewing)
  const col4 = 500; // Accepted, Declined (from offer)

  // Colors
  const colors = {
    applied: '#6366f1',
    pending: '#a1a1aa',
    ghosted: '#ef4444',
    rejected: '#f97316', 
    interviewing: '#3b82f6',
    offer: '#10b981',
    accepted: '#22c55e',
    declined: '#eab308'
  };

  // Calculate percentages for flow widths
  const getFlowWidth = (count) => Math.max(2, (count / total) * 40);

  // Y positions for second column nodes
  const col2Spacing = 55;
  const col2Start = 40;
  
  // Draw curved flow path
  const drawFlow = (x1, y1, x2, y2, count, color) => {
    if (count === 0) return null;
    const width = getFlowWidth(count);
    const midX = (x1 + x2) / 2;
    return (
      <path
        d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeOpacity={0.6}
        strokeLinecap="round"
      />
    );
  };

  // Node component
  const Node = ({ x, y, count, label, color, align = 'left' }) => {
    if (count === 0) return null;
    const height = Math.max(20, (count / total) * 100);
    return (
      <g>
        <rect
          x={x}
          y={y - height/2}
          width={nodeWidth}
          height={height}
          fill={color}
          rx={nodeRadius}
        />
        <text
          x={align === 'left' ? x + nodeWidth + 8 : x - 8}
          y={y}
          textAnchor={align === 'left' ? 'start' : 'end'}
          dominantBaseline="middle"
          className="sankey-label"
        >
          <tspan className="sankey-count">{count}</tspan>
          <tspan className="sankey-text" dx="4">{label}</tspan>
        </text>
      </g>
    );
  };

  // Y positions
  const appliedY = height / 2;
  const pendingY = col2Start;
  const ghostedY = col2Start + col2Spacing;
  const rejectedY = col2Start + col2Spacing * 2;
  const interviewingY = col2Start + col2Spacing * 3;
  const offerY = interviewingY;
  const acceptedY = offerY - 30;
  const declinedY = offerY + 30;

  // Calculate flow source positions on Applied node
  const appliedHeight = Math.max(20, 100);
  let flowOffset = appliedY - appliedHeight/2;
  const getNextFlowY = (count) => {
    const y = flowOffset + (count / total) * appliedHeight / 2;
    flowOffset += (count / total) * appliedHeight;
    return y;
  };

  return (
    <div className="card sankey-card">
      <div className="card-hdr">Application Flow</div>
      <svg viewBox={`0 0 ${width} ${height}`} className="sankey-svg">
        <defs>
          <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.applied} stopOpacity="0.8" />
            <stop offset="100%" stopColor={colors.applied} stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Flows from Applied to Column 2 */}
        {drawFlow(col1 + nodeWidth, appliedY - 40, col2, pendingY, pending, colors.pending)}
        {drawFlow(col1 + nodeWidth, appliedY - 15, col2, ghostedY, ghosted, colors.ghosted)}
        {drawFlow(col1 + nodeWidth, appliedY + 15, col2, rejectedY, rejected, colors.rejected)}
        {drawFlow(col1 + nodeWidth, appliedY + 40, col2, interviewingY, interviewing + offers + accepted + declined, colors.interviewing)}
        
        {/* Flow from Interviewing to Offer */}
        {drawFlow(col2 + nodeWidth, interviewingY, col3, offerY, offers + accepted + declined, colors.offer)}
        
        {/* Flows from Offer to Final */}
        {drawFlow(col3 + nodeWidth, offerY - 10, col4, acceptedY, accepted, colors.accepted)}
        {drawFlow(col3 + nodeWidth, offerY + 10, col4, declinedY, declined, colors.declined)}

        {/* Nodes */}
        <Node x={col1} y={appliedY} count={total} label="Applied" color={colors.applied} />
        <Node x={col2} y={pendingY} count={pending} label="Pending" color={colors.pending} />
        <Node x={col2} y={ghostedY} count={ghosted} label="Ghosted" color={colors.ghosted} />
        <Node x={col2} y={rejectedY} count={rejected} label="Rejected" color={colors.rejected} />
        <Node x={col2} y={interviewingY} count={interviewing + offers + accepted + declined} label="Interview" color={colors.interviewing} />
        <Node x={col3} y={offerY} count={offers + accepted + declined} label="Offer" color={colors.offer} />
        <Node x={col4} y={acceptedY} count={accepted} label="Accepted" color={colors.accepted} />
        <Node x={col4} y={declinedY} count={declined} label="Declined" color={colors.declined} />
      </svg>
      
      {/* Legend */}
      <div className="sankey-legend">
        <span><i style={{background: colors.applied}}></i>Applied</span>
        <span><i style={{background: colors.interviewing}}></i>Interview</span>
        <span><i style={{background: colors.offer}}></i>Offer</span>
        <span><i style={{background: colors.rejected}}></i>Rejected</span>
        <span><i style={{background: colors.ghosted}}></i>Ghosted</span>
      </div>
    </div>
  );
};

// ============================================================================
// METRICS & MISSIONS
// ============================================================================

const MetricsPanel = ({ applications, dailyGoal = 15 }) => {
  const today = new Date().toDateString();
  const todayApps = applications.filter(a => new Date(a.appliedDate).toDateString() === today).length;
  const weeklyApps = applications.filter(a => new Date(a.appliedDate) >= new Date(Date.now() - 7 * 86400000)).length;
  const monthlyApps = applications.filter(a => new Date(a.appliedDate) >= new Date(Date.now() - 30 * 86400000)).length;
  const ghosted = applications.filter(a => a.status === 'applied' && Math.floor((Date.now() - new Date(a.appliedDate).getTime()) / 86400000) > 30).length;
  const ghostRate = applications.length > 0 ? ((ghosted / applications.length) * 100).toFixed(0) : 0;
  const interviews = applications.filter(a => ['interviewing', 'offer', 'accepted', 'declined'].includes(a.status)).length;
  const interviewRate = applications.length > 0 ? ((interviews / applications.length) * 100).toFixed(0) : 0;
  const quota = Math.min((todayApps / dailyGoal) * 100, 100);
  
  return (
    <div className="metrics">
      <div className="metric"><div className="metric-lbl">Today</div><div className="metric-row"><span className="metric-val">{todayApps}</span><span className="metric-suf">/ {dailyGoal}</span></div><div className="prog"><div className="prog-fill" style={{ width: `${quota}%` }} /></div></div>
      <div className="metric"><div className="metric-lbl">Ghost Rate</div><div className="metric-val">{ghostRate}%</div><div className="metric-sub">{ghosted} silent 30+ days</div></div>
      <div className="metric"><div className="metric-lbl">This Week</div><div className="metric-val">{weeklyApps}</div><div className="metric-sub">{monthlyApps} this month</div></div>
      <div className="metric"><div className="metric-lbl">Interview Rate</div><div className="metric-val">{interviewRate}%</div><div className="metric-sub">apps → interview</div></div>
    </div>
  );
};

const DailyMissions = ({ applications, dailyGoal = 15 }) => {
  const today = new Date().toDateString();
  const todayApps = applications.filter(a => new Date(a.appliedDate).toDateString() === today).length;
  const missions = [];
  
  // Daily goal mission
  if (todayApps < dailyGoal) missions.push({ id: 'm1', title: `Submit ${dailyGoal - todayApps} more applications`, priority: 'high', icon: Briefcase });
  
  // Email submission missions - NEW FEATURE
  const emailJobs = applications.filter(a => a.submissionEmail && a.status === 'applied' && !a.emailSent);
  emailJobs.slice(0, 3).forEach((app, i) => {
    missions.push({ id: `email-${i}`, title: `Email resume/cover letter to ${app.company}`, subtitle: app.submissionEmail, priority: 'high', icon: Mail });
  });
  
  // Interview reminders
  const upcomingInterviews = applications.filter(a => a.interviewDate && new Date(a.interviewDate) > new Date() && new Date(a.interviewDate) < new Date(Date.now() + 3 * 86400000));
  upcomingInterviews.forEach((app, i) => {
    const interviewDate = new Date(app.interviewDate);
    const isToday = interviewDate.toDateString() === today;
    missions.push({ id: `int-${i}`, title: `${isToday ? 'TODAY: ' : ''}Interview with ${app.company}`, subtitle: interviewDate.toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }), priority: isToday ? 'high' : 'medium', icon: Calendar });
  });
  
  // Follow-up missions
  const stagnant = applications.filter(a => a.status === 'applied' && Math.floor((Date.now() - new Date(a.appliedDate).getTime()) / 86400000) >= 7 && Math.floor((Date.now() - new Date(a.appliedDate).getTime()) / 86400000) <= 14);
  stagnant.slice(0, 2).forEach((app, i) => missions.push({ id: `f${i}`, title: `Follow up with ${app.company}`, priority: 'medium', icon: Bell }));
  
  // Starred jobs reminder
  const starred = applications.filter(a => a.starred && a.status === 'applied');
  if (starred.length > 0) missions.push({ id: 'starred', title: `Review ${starred.length} starred application${starred.length > 1 ? 's' : ''}`, priority: 'low', icon: Star });
  
  if (missions.length === 0) return <div className="card"><div className="card-hdr">Daily Missions</div><div className="empty-sm"><Check size={24} /><p>All complete</p></div></div>;
  return (
    <div className="card">
      <div className="card-hdr">Daily Missions</div>
      <div className="missions">
        {missions.map(m => (
          <div key={m.id} className={`mission mission-${m.priority}`}>
            <div className="mission-icon">{m.icon && <m.icon size={14} />}</div>
            <div className="mission-content">
              <span className="mission-title">{m.title}</span>
              {m.subtitle && <span className="mission-subtitle">{m.subtitle}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// JOB CARD & PIPELINE
// ============================================================================

const JobTimeline = ({ status, history, appliedDate }) => {
  const stages = status === 'rejected' ? ['applied', 'rejected'] : ['applied', 'interviewing', 'offer'];
  const getIdx = (s) => ({ rejected: 1, offer: 2, accepted: 2, declined: 2, interviewing: 1 }[s] || 0);
  const currIdx = getIdx(status);
  const getDate = (stage) => {
    if (stage === 'applied') return new Date(appliedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const entry = history?.find(h => h.status === stage);
    return entry ? new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : null;
  };
  return (
    <div className="job-timeline">
      {stages.map((stage, i) => (
        <div key={stage} className={`tl-step ${i <= currIdx ? 'active' : ''} ${stage === 'rejected' ? 'rejected' : ''}`}>
          <div className="tl-dot">{i <= currIdx ? (stage === 'rejected' ? <X size={10} /> : <Check size={10} />) : <div className="tl-dot-empty" />}</div>
          <div className="tl-content"><span className="tl-label">{stage}</span><span className="tl-date">{getDate(stage) || '-'}</span></div>
          {i < stages.length - 1 && <div className={`tl-line ${i < currIdx ? 'filled' : ''}`} />}
        </div>
      ))}
    </div>
  );
};

const JobCard = ({ job, onStatusChange, onDelete, onViewResume, onViewCover }) => {
  const [exp, setExp] = useState(false);
  const statusCfg = { 
    applied: { color: '#6366f1', label: 'Applied' }, 
    interviewing: { color: '#3b82f6', label: 'Interviewing' }, 
    offer: { color: '#10b981', label: 'Offer' }, 
    accepted: { color: '#22c55e', label: 'Accepted' }, 
    declined: { color: '#eab308', label: 'Declined' }, 
    rejected: { color: '#f97316', label: 'Rejected' } 
  };
  const cfg = statusCfg[job.status] || statusCfg.applied;
  const days = Math.floor((Date.now() - new Date(job.appliedDate).getTime()) / 86400000);
  
  return (
    <div className="job-card">
      <div className="job-main" onClick={() => setExp(!exp)}>
        <div className="job-info">
          <div className="job-co">{job.company}</div>
          <div className="job-title">{job.title}</div>
          <div className="job-meta">
            <span>{job.location || 'Remote'}</span>
            {job.salaryMin && <span>${(job.salaryMin/1000).toFixed(0)}k - ${(job.salaryMax/1000).toFixed(0)}k</span>}
            {job.matchScore && <span className="match-badge">{job.matchScore.optimized}% match</span>}
          </div>
        </div>
        <div className="job-right">
          <div className="job-status" style={{ background: cfg.color }}>{cfg.label}</div>
          <div className="job-days">{days}d</div>
          <ChevronDown size={18} className={`job-chev ${exp ? 'exp' : ''}`} />
        </div>
      </div>
      {exp && (
        <div className="job-exp">
          <JobTimeline status={job.status} history={job.history} appliedDate={job.appliedDate} />
          {job.url && <div className="job-link"><a href={job.url} target="_blank" rel="noopener noreferrer"><ExternalLink size={12} /> View Posting</a></div>}
          {job.missionSummary && <div className="job-sec"><div className="job-sec-lbl">Summary</div><p>{job.missionSummary}</p></div>}
          {job.keyInsights && <div className="job-sec"><div className="job-sec-lbl">AI Insights</div><div className="insights-list">{job.keyInsights.map((ins, i) => <div key={i} className="insight-item"><Sparkles size={12} />{ins}</div>)}</div></div>}
          {job.hardSkills?.length > 0 && <div className="job-sec"><div className="job-sec-lbl">Required Skills</div><div className="skill-tags">{job.hardSkills.map((s, i) => <span key={i} className="skill-tag">{s}</span>)}</div></div>}
          <div className="job-actions">
            <div className="status-btns">{Object.entries(statusCfg).map(([k, v]) => <button key={k} className={`status-btn ${job.status === k ? 'active' : ''}`} style={{ '--sc': v.color }} onClick={() => onStatusChange(job.id, k)}>{v.label}</button>)}</div>
            <div className="doc-actions">
              <button className="doc-btn" disabled={!job.tailoredResume} onClick={() => job.tailoredResume && onViewResume(job)}><FileText size={14} /> Resume</button>
              <button className="doc-btn" disabled={!job.coverLetter} onClick={() => job.coverLetter && onViewCover(job)}><FileText size={14} /> Cover</button>
              <button className="del-btn" onClick={() => onDelete(job.id)}><Trash2 size={14} /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PipelineTracker = ({ applications, setApplications, onViewResume, onViewCover }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [search, setSearch] = useState('');
  
  const handleStatus = (id, s) => {
    setApplications(p => p.map(a => {
      if (a.id !== id) return a;
      const historyEntry = { status: s, date: new Date().toISOString() };
      return { ...a, status: s, history: [...(a.history || []), historyEntry] };
    }));
  };

  let filtered = [...applications];
  if (filter !== 'all') filtered = filtered.filter(a => a.status === filter);
  if (search) filtered = filtered.filter(a => a.company.toLowerCase().includes(search.toLowerCase()) || a.title.toLowerCase().includes(search.toLowerCase()));
  if (sortBy === 'date') filtered.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
  else if (sortBy === 'match') filtered.sort((a, b) => (b.matchScore?.optimized || 0) - (a.matchScore?.optimized || 0));
  else if (sortBy === 'company') filtered.sort((a, b) => a.company.localeCompare(b.company));
  
  return (
    <div className="pipeline">
      <div className="pipe-hdr"><h2>Application Pipeline</h2></div>
      <div className="pipe-ctrl">
        <div className="search-box"><Search size={16} /><input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        <select value={filter} onChange={e => setFilter(e.target.value)}><option value="all">All</option><option value="applied">Applied</option><option value="interviewing">Interview</option><option value="offer">Offer</option><option value="rejected">Rejected</option></select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}><option value="date">Date</option><option value="match">Match Score</option><option value="company">Company</option></select>
      </div>
      <div className="job-list">{filtered.length === 0 ? <div className="empty"><Briefcase size={32} /><p>No applications</p><span>Use Optimizer to add jobs</span></div> : filtered.map(j => <JobCard key={j.id} job={j} onStatusChange={handleStatus} onDelete={id => setApplications(p => p.filter(a => a.id !== id))} onViewResume={onViewResume} onViewCover={onViewCover} />)}</div>
    </div>
  );
};

// ============================================================================
// PROFILE EDITOR
// ============================================================================

const ProfileEditor = ({ profile, setProfile, onSave }) => {
  const [newSkill, setNewSkill] = useState('');
  const upd = (f, v) => setProfile(p => ({ ...p, [f]: v }));
  const updExp = (id, f, v) => setProfile(p => ({ ...p, experience: p.experience.map(e => e.id === id ? { ...e, [f]: v } : e) }));
  const delExp = (id) => setProfile(p => ({ ...p, experience: p.experience.filter(e => e.id !== id) }));
  const addExp = () => setProfile(p => ({ ...p, experience: [...p.experience, { id: `exp-${Date.now()}`, company: '', title: '', location: '', startDate: '', endDate: '', bullets: [''] }] }));
  const updEdu = (id, f, v) => setProfile(p => ({ ...p, education: p.education.map(e => e.id === id ? { ...e, [f]: v } : e) }));
  const delEdu = (id) => setProfile(p => ({ ...p, education: p.education.filter(e => e.id !== id) }));
  const addEdu = () => setProfile(p => ({ ...p, education: [...p.education, { id: `edu-${Date.now()}`, degree: '', minor: '', university: '', gpa: '', startDate: '', endDate: '' }] }));
  const addSkill = () => { if (newSkill && !profile.skills.includes(newSkill)) { setProfile(p => ({ ...p, skills: [...p.skills, newSkill] })); setNewSkill(''); } };
  const remSkill = (s) => setProfile(p => ({ ...p, skills: p.skills.filter(x => x !== s) }));

  return (
    <div className="profile-ed">
      <div className="profile-hdr"><h2>Master Resume</h2><button className="btn-pri" onClick={onSave}><Save size={16} /> Save</button></div>
      <div className="profile-sec"><h3>Contact</h3><div className="form-grid"><div className="form-grp"><label>Name</label><input value={profile.name} onChange={e => upd('name', e.target.value)} /></div><div className="form-grp"><label>Email</label><input value={profile.email} onChange={e => upd('email', e.target.value)} /></div><div className="form-grp"><label>Phone</label><input value={profile.phone} onChange={e => upd('phone', e.target.value)} /></div><div className="form-grp"><label>Location</label><input value={profile.location} onChange={e => upd('location', e.target.value)} /></div><div className="form-grp"><label>LinkedIn</label><input value={profile.linkedin} onChange={e => upd('linkedin', e.target.value)} /></div><div className="form-grp"><label>GitHub</label><input value={profile.github} onChange={e => upd('github', e.target.value)} /></div></div><div className="form-grp full"><label>Summary</label><textarea rows={3} value={profile.summary} onChange={e => upd('summary', e.target.value)} /></div></div>
      <div className="profile-sec"><h3>Experience</h3>{profile.experience.map((exp, i) => (<div key={exp.id} className="exp-block"><div className="exp-hdr"><span>Position {i + 1}</span><button className="btn-icon-danger" onClick={() => delExp(exp.id)}><Trash2 size={14} /></button></div><div className="form-grid"><div className="form-grp"><label>Company</label><input value={exp.company} onChange={e => updExp(exp.id, 'company', e.target.value)} /></div><div className="form-grp"><label>Title</label><input value={exp.title} onChange={e => updExp(exp.id, 'title', e.target.value)} /></div><div className="form-grp"><label>Location</label><input value={exp.location} onChange={e => updExp(exp.id, 'location', e.target.value)} /></div><div className="form-grp"><label>Start</label><input value={exp.startDate} onChange={e => updExp(exp.id, 'startDate', e.target.value)} /></div><div className="form-grp"><label>End</label><input value={exp.endDate} onChange={e => updExp(exp.id, 'endDate', e.target.value)} /></div></div><div className="form-grp full"><label>Achievements (one per line)</label><textarea rows={4} value={exp.bullets.join('\n')} onChange={e => updExp(exp.id, 'bullets', e.target.value.split('\n'))} /></div></div>))}<button className="btn-add" onClick={addExp}><Plus size={16} /> Add Experience</button></div>
      <div className="profile-sec"><h3>Skills</h3><div className="skill-row"><input placeholder="Add skill..." value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyPress={e => e.key === 'Enter' && addSkill()} /><button className="btn-pri" onClick={addSkill}>Add</button></div><div className="skills-list">{profile.skills.map(s => <span key={s} className="skill-chip">{s}<button onClick={() => remSkill(s)}>×</button></span>)}</div></div>
      <div className="profile-sec"><h3>Education</h3>{profile.education.map((edu, i) => (<div key={edu.id} className="edu-block"><div className="exp-hdr"><span>Education {i + 1}</span><button className="btn-icon-danger" onClick={() => delEdu(edu.id)}><Trash2 size={14} /></button></div><div className="form-grid"><div className="form-grp"><label>Degree</label><input value={edu.degree} onChange={e => updEdu(edu.id, 'degree', e.target.value)} /></div><div className="form-grp"><label>Minor</label><input value={edu.minor} onChange={e => updEdu(edu.id, 'minor', e.target.value)} /></div><div className="form-grp"><label>University</label><input value={edu.university} onChange={e => updEdu(edu.id, 'university', e.target.value)} /></div><div className="form-grp"><label>GPA</label><input value={edu.gpa} onChange={e => updEdu(edu.id, 'gpa', e.target.value)} /></div><div className="form-grp"><label>Start</label><input value={edu.startDate} onChange={e => updEdu(edu.id, 'startDate', e.target.value)} /></div><div className="form-grp"><label>End</label><input value={edu.endDate} onChange={e => updEdu(edu.id, 'endDate', e.target.value)} /></div></div></div>))}<button className="btn-add" onClick={addEdu}><Plus size={16} /> Add Education</button></div>
    </div>
  );
};

// ============================================================================
// PDF GENERATION
// ============================================================================

const genPDF = (content, filename) => {
  const printWindow = window.open('', '_blank', 'width=800,height=900');
  if (!printWindow) { alert("Pop-up blocked. Allow pop-ups for printing."); return; }
  // ULTRA-COMPACT CSS FOR STRICT ONE-PAGE REQUIREMENT
  // Changed .job-bullets to use list-style-position: inside for non-hanging indent
  printWindow.document.write(`<!DOCTYPE html><html><head><title>${filename}</title><style>@page{margin:0.2in;size:letter}body{font-family:'Times New Roman',serif;color:#000;font-size:9pt;line-height:1.15;margin:0;padding:0}.resume-hdr{text-align:center;margin-bottom:8px}.resume-name{font-size:14pt;font-weight:bold;margin:0 0 2px;text-transform:uppercase}.resume-contact{font-size:8.5pt;margin:0}.section{margin:6px 0}.section-title{font-size:9.5pt;font-weight:bold;border-bottom:1px solid #000;padding-bottom:1px;margin-bottom:3px;text-transform:uppercase}.job{margin-bottom:5px}.job-hdr{display:flex;justify-content:space-between;font-weight:bold;font-size:9pt}.job-title-row{display:flex;justify-content:space-between;margin-bottom:1px;font-style:italic;font-size:9pt}.job-bullets{margin:2px 0 0 0;padding:0;list-style-position:inside}.job-bullets li{margin-bottom:1px}.cover-letter{font-size:10pt;line-height:1.4;white-space:pre-wrap}@media print{body{padding:0}}</style></head><body>${content}<script>window.onload=function(){setTimeout(function(){window.print();},500);};</script></body></html>`);
  printWindow.document.close();
};

const genResumeHTML = (profile, opt = null) => {
  // ROBUST DATA FETCHING: Check both 'optimizedX' (our internal name) and 'X' (Gemini's name)
  const sum = opt?.optimizedSummary || opt?.summary || profile.summary;
  let exp = opt?.optimizedExperience || opt?.experience || profile.experience;
  const edu = opt?.education || profile.education;
  
  // FORCE ONE PAGE CONSTRAINT PROGRAMMATICALLY
  if (opt) {
     // Limit to most recent 4 roles to guarantee fit
     exp = exp.slice(0, 4); 
     // Limit to 3 bullets per role to guarantee fit
     exp = exp.map(e => ({...e, bullets: e.bullets.slice(0, 3)}));
  }
  
  // MERGE SKILLS: Ensure Targeted Skills (hardSkills) are always included
  // We prioritize opt.skills if available, otherwise profile.skills
  const baseSkills = opt?.skills || profile.skills || [];
  const hardSkills = opt?.hardSkills || [];
  
  // Normalize and merge unique skills (case-insensitive check)
  const normalizedBase = new Set(baseSkills.map(s => s.toLowerCase().trim()));
  const uniqueHard = hardSkills.filter(s => !normalizedBase.has(s.toLowerCase().trim()));
  
  const mergedSkills = [...baseSkills, ...uniqueHard];

  // Changed joined separator from ' • ' to ', '
  return `<div class="resume-hdr"><div class="resume-name">${profile.name}</div><div class="resume-contact">${profile.location}</div><div class="resume-contact">${profile.email} | ${profile.phone}${profile.linkedin ? ` | ${profile.linkedin}` : ''}</div></div><div class="section"><div class="section-title">Professional Summary</div><div>${sum}</div></div><div class="section"><div class="section-title">Skills</div><div>${mergedSkills.join(', ')}</div></div><div class="section"><div class="section-title">Experience</div>${exp.map(e => `<div class="job"><div class="job-hdr"><span>${e.company}</span><span>${e.startDate} - ${e.endDate}</span></div><div class="job-title-row"><span>${e.title}</span><span>${e.location}</span></div><ul class="job-bullets">${e.bullets.filter(b => b.trim()).map(b => `<li>${b}</li>`).join('')}</ul></div>`).join('')}</div><div class="section"><div class="section-title">Education</div>${edu.map(e => `<div><div class="job-hdr"><span>${e.university}</span><span>${e.startDate} - ${e.endDate}</span></div><div>${e.degree}${e.minor ? `, ${e.minor}` : ''}${e.gpa ? ` | GPA: ${e.gpa}` : ''}</div></div>`).join('')}</div>`;
};

const genCoverHTML = (profile, txt) => {
  const content = txt || `Dear Hiring Manager,\n\nI am writing to express my strong interest in this position. Based on my experience and skills, I believe I would be a great fit for your team.\n\nSincerely,\n${profile.name}`;
  return `<div class="resume-hdr"><div class="resume-name">${profile.name}</div><div class="resume-contact">${profile.location}</div><div class="resume-contact">${profile.email} | ${profile.phone}${profile.linkedin ? ` | ${profile.linkedin}` : ''}</div></div><hr style="margin:24px 0;border:none;border-top:1px solid #000"/><div class="cover-letter">${content}</div>`;
};

// ============================================================================
// ATS OPTIMIZER - Powered by Gemini
// ============================================================================

const ATSOptimizer = ({ profile, applications, setApplications, showToast, setPathosMsg, setPathosMood, apiKey, setApiKey }) => {
  const [jd, setJd] = useState('');
  const [processing, setProcessing] = useState(false);
  const [logs, setLogs] = useState([]);
  const [result, setResult] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(true);
  const termRef = useRef(null);

  // API Key UI state
  const [isEditingKey, setIsEditingKey] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey || '');
  const [validating, setValidating] = useState(false);

  const saveKey = async () => {
    if (!tempKey.trim()) {
        setIsEditingKey(false);
        return;
    }
    setValidating(true);
    try {
        // Test the key with a lightweight call
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${tempKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Ping" }] }]
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        setApiKey(tempKey);
        setIsEditingKey(false);
        showToast("Neural Interface Connected", "success");
    } catch (error) {
        showToast("Connection Failed: Invalid API Key", "error");
    } finally {
        setValidating(false);
    }
  };

  const addLog = (msg, type = 'info') => setLogs(p => [...p, { msg, type, time: Date.now() }]);
  useEffect(() => { if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight; }, [logs]);

  const validateProfile = () => {
    if (!profile.name || !profile.email) return 'Please complete your profile (name and email required)';
    if (profile.experience.length === 0) return 'Add at least one work experience';
    if (profile.skills.length === 0) return 'Add at least one skill';
    return null;
  };

  const run = async () => {
    if (!jd.trim()) return;
    
    // Check for API Key
    if (!apiKey) {
      showToast('Neural Interface Offline: Please configure API Key above.', 'error');
      setIsEditingKey(true);
      return;
    }

    const validationError = validateProfile();
    if (validationError) {
      showToast(validationError, 'warning');
      return;
    }

    setProcessing(true);
    setLogs([]);
    setResult(null);
    setAnalysis('');
    setPathosMood('thinking');
    setPathosMsg(getRandomMessage('analyzing'));

    addLog(`> Initializing Gemini ${GEMINI_MODEL}...`, 'info');
    await new Promise(r => setTimeout(r, 300));

    let optimizedData;
    let strategicAnalysis = "";

    try {
      addLog('> Sending to Gemini API...', 'info');
      addLog('> Analyzing "Voice Signature" & "Skill Gaps"...', 'info');
      setPathosMsg(getRandomMessage('optimizing'));
      
      const response = await callGeminiAPI(buildOptimizationPrompt(profile, jd), apiKey);
      
      strategicAnalysis = response.analysis;
      optimizedData = response.jsonResult;
      
      addLog('> Received structured optimization response', 'success');
      setAnalysis(strategicAnalysis);

    } catch (error) {
      addLog(`> API Error: ${error.message}`, 'warning');
      addLog('> Using fallback extraction...', 'info');
      
      // Fallback local extraction
      const lines = jd.split('\n').filter(l => l.trim());
      let company = '', title = 'Position', location = 'Remote';
      const coMatch = jd.match(/(?:at|for|joining)\s+([A-Z][a-zA-Z0-9\s&]+?)(?:\s|,|\.)/);
      if (coMatch) company = coMatch[1].trim();
      const titleMatch = jd.match(/(?:position|role|title)[:\s]+([^\n]+)/i);
      if (titleMatch) title = titleMatch[1].trim();
      
      const techKw = ['Python', 'SQL', 'JavaScript', 'React', 'AWS', 'Salesforce', 'Excel', 'Jira', 'Agile'];
      const hardSkills = techKw.filter(s => new RegExp(`\\b${s}\\b`, 'i').test(jd));
      
      optimizedData = {
        company: company || 'Company',
        title: title,
        location: location,
        salaryMin: null,
        salaryMax: null,
        hardSkills,
        softSkills: [],
        missionSummary: `${title} role at ${company || 'company'}.`,
        optimizedSummary: profile.summary,
        optimizedExperience: profile.experience,
        coverLetter: `Dear Hiring Manager,\n\nI am interested in the ${title} position.\n\nSincerely,\n${profile.name}`,
        matchScore: { baseline: 60, optimized: 75 },
        keyInsights: ['Extracted via fallback mode due to API error.'],
        analysis: 'Fallback extraction used.'
      };
    }

    if (!optimizedData) {
        addLog('> Critical Error: Failed to generate data', 'error');
        setProcessing(false);
        return;
    }

    addLog(`> Company: ${optimizedData.company}`, 'info');
    addLog(`> Position: ${optimizedData.title}`, 'info');
    addLog(`> Skills detected: ${optimizedData.hardSkills?.length || 0}`, 'info');

    // Check for duplicates
    // We ignore matches if the data appears to be a generic fallback result
    const isPlaceholder = optimizedData.company === 'Company' && optimizedData.title === 'Position';
    
    const isDup = !isPlaceholder && applications.some(a => 
      (a.company || '').trim().toLowerCase() === (optimizedData.company || '').trim().toLowerCase() && 
      (a.title || '').trim().toLowerCase() === (optimizedData.title || '').trim().toLowerCase()
    );
    
    if (isDup) {
      addLog('> Notice: Similar job exists in pipeline.', 'warning');
      showToast('A similar job exists. Adding this as a new version.', 'info');
      // Removed the 'return' statement to allow the user to proceed even if a duplicate is detected.
      // This fixes false positives preventing usage.
    }

    addLog('> Generating ATS-optimized resume...', 'info');
    addLog('> Generating tailored cover letter...', 'info');

    // Detect email submission requirement
    const submissionEmail = detectEmailSubmission(jd);
    if (submissionEmail) {
      addLog(`> EMAIL SUBMISSION DETECTED: ${submissionEmail}`, 'warning');
      addLog('> Task added to Daily Missions', 'success');
    }

    // Prepare data for generation and saving
    // ENSURE CONSISTENCY: Merge hard skills into the main skills array for the saved object
    const finalSkills = [...new Set([...(optimizedData.skills || profile.skills || []), ...(optimizedData.hardSkills || [])])];
    optimizedData.skills = finalSkills;

    // Fallback for missing/null cover letter
    if (!optimizedData.coverLetter) {
        optimizedData.coverLetter = `Dear Hiring Manager,\n\nI am writing to express my strong interest in the ${optimizedData.title || 'open'} position at ${optimizedData.company || 'your company'}.\n\nGiven my experience, I am confident I can contribute effectively to your team.\n\nSincerely,\n${profile.name}`;
    }

    const resumeHTML = genResumeHTML(profile, optimizedData);
    const coverHTML = genCoverHTML(profile, optimizedData.coverLetter);

    const newApp = {
      id: `job-${Date.now()}`,
      company: optimizedData.company,
      title: optimizedData.title,
      location: optimizedData.location,
      salaryMin: optimizedData.salaryMin,
      salaryMax: optimizedData.salaryMax,
      hardSkills: optimizedData.hardSkills || [],
      softSkills: optimizedData.softSkills || [],
      missionSummary: optimizedData.missionSummary,
      status: 'applied',
      appliedDate: new Date().toISOString(),
      history: [{ status: 'applied', date: new Date().toISOString() }],
      tailoredResume: {
        summary: optimizedData.optimizedSummary || optimizedData.summary || profile.summary,
        experience: optimizedData.optimizedExperience || optimizedData.experience || profile.experience,
        skills: finalSkills, // Use the explicitly merged list
        education: optimizedData.education || profile.education,
        html: resumeHTML
      },
      coverLetter: optimizedData.coverLetter,
      coverLetterHTML: coverHTML,
      matchScore: optimizedData.matchScore,
      keyInsights: optimizedData.keyInsights,
      // New fields for enhanced features
      submissionEmail: submissionEmail,
      emailSent: false,
      starred: false,
      notes: '',
      interviewDate: null,
      interviewType: null
    };

    setApplications(p => [...p, newApp]);
    setResult({ ...optimizedData, resumeHTML, coverHTML, submissionEmail });

    addLog(`> Match: ${optimizedData.matchScore?.baseline || 0}% → ${optimizedData.matchScore?.optimized || 0}%`, 'success');
    addLog('> Job added to pipeline', 'success');

    setProcessing(false);
    setPathosMood('success');
    setPathosMsg('Optimization complete. Documents ready.');
    showToast('Resume optimized and job added to pipeline', 'success');
    setJd('');

    // Auto-download is research recommendation 5.2 Step 4 (Render Document)
    // setTimeout(() => genPDF(resumeHTML, `${profile.name.replace(/\s+/g, '_')}_${optimizedData.company.replace(/\s+/g, '_')}_Resume`), 800);
  };

  const termH = Math.min(Math.max(logs.length * 28 + 60, 140), 400);

  return (
    <div className="optimizer">
      <div className="opt-hdr">
        <h2><Zap size={24} /> ATS Optimizer</h2>
        <div className="api-config">
            {isEditingKey ? (
                <div className="api-input-group">
                    <input 
                        autoFocus 
                        type="password" 
                        placeholder="Paste API Key" 
                        value={tempKey} 
                        onChange={e => setTempKey(e.target.value)} 
                        onKeyDown={e => e.key === 'Enter' && !validating && saveKey()}
                        disabled={validating}
                    />
                    <button onClick={saveKey} disabled={validating}>
                        {validating ? <RefreshCw size={14} className="spin" /> : <Check size={14} />}
                    </button>
                </div>
            ) : (
                <div className={`api-status-pill ${apiKey ? 'active' : 'missing'}`} onClick={() => setIsEditingKey(true)}>
                    {apiKey ? (
                        <>
                            <div className="status-dot"></div>
                            <span>Powered by Gemini 2.5 Flash</span>
                        </>
                    ) : (
                        <>
                            <Zap size={12} />
                            <span>Initialize Gemini 2.5 Flash</span>
                        </>
                    )}
                </div>
            )}
        </div>
      </div>

      <div className="opt-grid">
        <div className="opt-input">
          <textarea 
            placeholder="Paste the full job description here...&#10;&#10;Include: job title, company name, requirements, responsibilities, qualifications..."
            value={jd} 
            onChange={e => setJd(e.target.value)} 
          />
          <button className="btn-pri btn-lg" onClick={run} disabled={processing || !jd.trim()}>
            {processing ? <><RefreshCw size={18} className="spin" /> Processing...</> : <><Zap size={18} /> Analyze & Optimize</>}
          </button>
        </div>

        <div className="opt-term" ref={termRef} style={{ height: termH }}>
          <div className="term-hdr"><Terminal size={14} /><span>Gemini 2.5 Flash</span></div>
          <div className="term-content">
            {logs.length === 0 ? (
              <div className="term-placeholder">Awaiting job description...</div>
            ) : (
              logs.map((l, i) => <div key={i} className={`log ${l.type}`}>{l.msg}</div>)
            )}
          </div>
        </div>
      </div>

      {analysis && (
        <div className="analysis-panel">
          <div className="analysis-hdr">
            <div className="analysis-title">
              <BrainCircuit size={16} />
              <span>Changes</span>
            </div>
          </div>
          <div className="analysis-body">
            <div className="analysis-content">{analysis}</div>
            <div className="analysis-footer">
              <Info size={14} /> 
              <span>This analysis explains the "Why" behind the changes below.</span>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="opt-result">
          <div className="result-hdr"><CheckCircle size={20} /><span>Optimization Complete</span></div>
          
          {result.submissionEmail && (
            <div className="email-submission-alert">
              <Mail size={20} />
              <div className="email-submission-content">
                <span className="email-submission-title">📧 Email Submission Required</span>
                <p>This job posting requests that you email your resume directly to:</p>
                <a href={`mailto:${result.submissionEmail}?subject=Application for ${result.title} Position&body=Dear Hiring Manager,%0D%0A%0D%0APlease find attached my resume and cover letter for the ${result.title} position.%0D%0A%0D%0ABest regards,%0D%0A${profile.name}`} className="email-link-large">{result.submissionEmail}</a>
                <p className="email-tip">A task has been added to your Daily Missions to remind you.</p>
              </div>
            </div>
          )}
          
          <div className="result-grid">
            <div className="result-card"><div className="result-lbl">Company</div><div className="result-val">{result.company}</div></div>
            <div className="result-card"><div className="result-lbl">Position</div><div className="result-val">{result.title}</div></div>
            <div className="result-card"><div className="result-lbl">Location</div><div className="result-val">{result.location}</div></div>
            {result.salaryMin && <div className="result-card"><div className="result-lbl">Salary</div><div className="result-val">${(result.salaryMin/1000).toFixed(0)}k - ${(result.salaryMax/1000).toFixed(0)}k</div></div>}
          </div>

          {result.matchScore && (
            <div className="score-panel">
              <div className="score-item">
                <span className="score-lbl">Baseline</span>
                <span className="score-val baseline">{String(result.matchScore.baseline).replace(/%/g, '')}%</span>
              </div>
              <ArrowRight size={24} />
              <div className="score-item">
                <span className="score-lbl">Optimized</span>
                <span className="score-val optimized">{String(result.matchScore.optimized).replace(/%/g, '')}%</span>
              </div>
            </div>
          )}

          {result.keyInsights && result.keyInsights.length > 0 && (
            <div className="insights-panel">
              <div className="insights-hdr"><Sparkles size={14} /> Key Insights</div>
              {result.keyInsights.map((ins, i) => <div key={i} className="insight-row">{ins}</div>)}
            </div>
          )}

          {result.hardSkills && result.hardSkills.length > 0 && (
            <div className="skills-det">
              <div className="skills-lbl">Targeted Skills</div>
              <div className="skill-tags">{result.hardSkills.map((s, i) => <span key={i} className="skill-tag">{s}</span>)}</div>
            </div>
          )}

          <div className="result-actions">
            <button className="btn-sec" onClick={() => genPDF(result.resumeHTML, `${profile.name}_Resume`)}><Download size={16} /> Download Resume</button>
            <button className="btn-sec" onClick={() => genPDF(result.coverHTML, `${profile.name}_CoverLetter`)}><Download size={16} /> Download Cover Letter</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MAIN APP & DOC VIEWER
// ============================================================================

const DocViewer = ({ job, type, profile, onClose }) => {
  const content = type === 'resume' ? job.tailoredResume?.html : job.coverLetterHTML;
  const title = type === 'resume' ? `${job.company} - Resume` : `${job.company} - Cover Letter`;
  
  if (!content) return null;

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-hdr">
          <h3>{title}</h3>
          <div className="modal-actions">
            <button className="btn-sec" onClick={() => genPDF(content, title)}><Printer size={16} /> Print/PDF</button>
            <button className="btn-icon" onClick={onClose}><X size={18} /></button>
          </div>
        </div>
        <div className="modal-body">
          <div className="doc-preview" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    </div>
  );
};

export default function PathosJobCenter() {
  const [tab, setTab] = useState('dashboard');
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [apps, setApps] = useState([]);
  const [msg, setMsg] = useState(getRandomMessage('idle'));
  const [mood, setMood] = useState('neutral');
  const [docView, setDocView] = useState(null);
  const [toasts, setToasts] = useState([]);
  const fileRef = useRef(null);

  // API Key State - managed at root
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('pathos-api-key') || '');

  // Persist API Key
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('pathos-api-key', apiKey);
    }
  }, [apiKey]);

  const showToast = (message, type = 'info') => setToasts(p => [...p, { id: Date.now(), message, type }]);
  const remToast = (id) => setToasts(p => p.filter(t => t.id !== id));

  useEffect(() => {
    const sp = localStorage.getItem('pathos-profile');
    const sa = localStorage.getItem('pathos-applications');
    if (sp) setProfile(JSON.parse(sp));
    if (sa) setApps(JSON.parse(sa));
  }, []);

  useEffect(() => { localStorage.setItem('pathos-profile', JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem('pathos-applications', JSON.stringify(apps)); }, [apps]);

  useEffect(() => {
    const i = setInterval(() => {
      if (mood === 'neutral') setMsg(getRandomMessage('idle'));
    }, 8000);
    return () => clearInterval(i);
  }, [mood]);

  const save = () => { localStorage.setItem('pathos-profile', JSON.stringify(profile)); showToast('Profile saved', 'success'); };
  
  const exportData = () => {
    if (apps.length === 0 && !profile.name) { showToast('No data to export', 'warning'); return; }
    const d = { version: '2.0', exportDate: new Date().toISOString(), profile, applications: apps };
    const blob = new Blob([JSON.stringify(d, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pathos-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Backup exported', 'success');
  };

  const importData = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => {
      try {
        const d = JSON.parse(ev.target.result);
        if (d.profile) setProfile(d.profile);
        if (d.applications) setApps(d.applications);
        showToast('Data imported successfully', 'success');
      } catch {
        showToast('Invalid file format', 'error');
      }
    };
    r.readAsText(f);
    e.target.value = '';
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'pipeline', label: 'Pipeline', icon: Briefcase },
    { id: 'profile', label: 'Resume', icon: FileText },
    { id: 'optimizer', label: 'Optimizer', icon: Zap }
  ];

  return (
    <div className="app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        :root{width:100%;height:100%}
        body{width:100%;margin:0;padding:0;background:#09090b;color:#e5e5e5;font-family:'Inter',sans-serif}
        *{box-sizing:border-box}
        .app{width:100%;min-height:100vh;background:#09090b;display:flex;flex-direction:column}
        
        .hdr{background:#0f0f11;border-bottom:1px solid #1c1c1f;padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:64px;position:sticky;top:0;z-index:100}
        .logo{display:flex;flex-direction:column;gap:2px}.logo-text{font-size:18px;font-weight:700;color:#fff;letter-spacing:4px}.logo-tagline{font-size:9px;color:#71717a;letter-spacing:0.5px;text-transform:uppercase}
        .nav{display:flex;gap:4px}.nav-btn{display:flex;align-items:center;gap:8px;padding:8px 16px;background:transparent;border:none;color:#71717a;font-family:inherit;font-size:14px;font-weight:500;cursor:pointer;border-radius:6px;transition:all 0.15s}.nav-btn:hover{background:#1c1c1f;color:#a1a1aa}.nav-btn.active{background:#1c1c1f;color:#fff}
        .hdr-actions{display:flex;gap:8px}.btn-ghost{display:flex;align-items:center;gap:6px;padding:8px 12px;background:transparent;border:1px solid #27272a;color:#a1a1aa;font-family:inherit;font-size:13px;font-weight:500;cursor:pointer;border-radius:6px;transition:all 0.15s}.btn-ghost:hover{background:#1c1c1f;color:#fff;border-color:#3f3f46}
        
        .main{width:100%;max-width:1400px;margin:0 auto;padding:32px 24px;flex:1}
        
        .pathos-container{display:flex;align-items:center;gap:24px;margin-bottom:32px;padding:24px;background:#0f0f11;border:1px solid #1c1c1f;border-radius:12px}
        .pathos-eye{width:64px;height:64px;background:#18181b;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid #27272a;flex-shrink:0;transition:border-color 0.3s}
        .pathos-iris{width:32px;height:32px;background:radial-gradient(circle,#3f3f46 0%,#18181b 70%);border-radius:50%;display:flex;align-items:center;justify-content:center;transition:transform 0.15s ease-out}.pathos-iris.blink{transform:scaleY(0.1)!important}
        .pathos-pupil{width:12px;height:12px;background:#fff;border-radius:50%;box-shadow:0 0 10px #fff}
        .pathos-msg-box{flex:1}.pathos-msg{font-size:14px;color:#a1a1aa;line-height:1.5}
        .pathos-compact{display:flex;align-items:center;gap:12px;padding:12px 16px;background:#0f0f11;border:1px solid #1c1c1f;border-radius:8px;margin-bottom:24px}
        .pathos-eye-small{width:32px;height:32px;background:#18181b;border-radius:50%;display:flex;align-items:center;justify-content:center;border:1px solid #27272a;flex-shrink:0;transition:border-color 0.3s}
        .pathos-iris-small{width:16px;height:16px;background:#3f3f46;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:all 0.15s ease-out}.pathos-iris-small.blink{transform:scaleY(0.1)!important}
        .pathos-pupil-small{width:6px;height:6px;background:#fff;border-radius:50%}.pathos-msg-compact{font-size:13px;color:#71717a}
        
        .card{background:#0f0f11;border:1px solid #1c1c1f;border-radius:12px;padding:20px}.card-hdr{font-size:13px;font-weight:600;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:16px}
        
        /* Modern Sankey */
        .sankey-card{padding:20px}
        .sankey-svg{width:100%;height:auto;display:block}
        .sankey-label{font-family:'Inter',sans-serif}
        .sankey-count{font-size:14px;font-weight:700;fill:#fff}
        .sankey-text{font-size:11px;font-weight:500;fill:#71717a}
        .sankey-legend{display:flex;gap:16px;margin-top:16px;padding-top:16px;border-top:1px solid #1c1c1f;flex-wrap:wrap}
        .sankey-legend span{display:flex;align-items:center;gap:6px;font-size:11px;color:#71717a}
        .sankey-legend i{width:10px;height:10px;border-radius:2px}
        
        .metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}@media(max-width:768px){.metrics{grid-template-columns:repeat(2,1fr)}}
        .metric{background:#0f0f11;border:1px solid #1c1c1f;border-radius:12px;padding:20px}.metric-lbl{font-size:12px;font-weight:500;color:#71717a;margin-bottom:8px}.metric-row{display:flex;align-items:baseline;gap:4px}.metric-val{font-size:28px;font-weight:700;color:#fff}.metric-suf{font-size:16px;color:#52525b}.metric-sub{font-size:12px;color:#52525b;margin-top:4px}
        .prog{height:4px;background:#27272a;border-radius:2px;margin-top:12px;overflow:hidden}.prog-fill{height:100%;background:#4ade80;border-radius:2px;transition:width 0.3s}
        .dash-grid{display:grid;grid-template-columns:2fr 1fr;gap:24px}@media(max-width:900px){.dash-grid{grid-template-columns:1fr}}
        
        .missions{display:flex;flex-direction:column;gap:8px;padding:12px}.mission{display:flex;align-items:flex-start;gap:12px;padding:12px;background:#18181b;border-radius:8px;border-left:3px solid transparent;transition:all 0.2s ease}.mission:hover{background:#1c1c1f}.mission-high{border-left-color:#f87171}.mission-medium{border-left-color:#fbbf24}.mission-low{border-left-color:#3b82f6}.mission-icon{width:28px;height:28px;border-radius:6px;background:#0f0f11;display:flex;align-items:center;justify-content:center;color:#71717a;flex-shrink:0}.mission-content{display:flex;flex-direction:column;gap:2px}.mission-title{font-size:13px;font-weight:500;color:#fafafa}.mission-subtitle{font-size:11px;color:#71717a}
        .empty,.empty-sm{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;color:#52525b;text-align:center}.empty-sm{padding:24px}.empty svg,.empty-sm svg{margin-bottom:12px;opacity:0.5}.empty p{font-size:14px;margin-bottom:4px}.empty span{font-size:12px}
        
        .pipeline h2{font-size:20px;font-weight:600;color:#fff;margin-bottom:8px}.pipe-hdr{margin-bottom:20px}
        .pipe-ctrl{display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap}.search-box{display:flex;align-items:center;gap:8px;padding:8px 12px;background:#18181b;border:1px solid #27272a;border-radius:6px;flex:1;min-width:200px}.search-box svg{color:#52525b}.search-box input{background:transparent;border:none;color:#fff;font-family:inherit;font-size:14px;width:100%;outline:none}.search-box input::placeholder{color:#52525b}.pipe-ctrl select{padding:8px 12px;background:#18181b;border:1px solid #27272a;border-radius:6px;color:#a1a1aa;font-family:inherit;font-size:14px;cursor:pointer}
        .job-list{display:flex;flex-direction:column;gap:12px}
        
        .job-card{background:#0f0f11;border:1px solid #1c1c1f;border-radius:10px;overflow:hidden;transition:border-color 0.15s}.job-card:hover{border-color:#27272a}
        .job-main{display:flex;justify-content:space-between;align-items:center;padding:16px 20px;cursor:pointer}.job-info{flex:1}.job-co{font-size:12px;font-weight:500;color:#71717a;margin-bottom:4px}.job-title{font-size:15px;font-weight:600;color:#fff;margin-bottom:6px}.job-meta{display:flex;gap:12px;font-size:12px;color:#52525b;align-items:center}.match-badge{background:#4ade80;color:#000;padding:2px 6px;border-radius:4px;font-size:10px;font-weight:600}
        .job-right{display:flex;align-items:center;gap:12px}.job-status{padding:4px 10px;border-radius:4px;font-size:11px;font-weight:600;color:#fff}.job-days{font-size:12px;color:#52525b}.job-chev{color:#52525b;transition:transform 0.15s}.job-chev.exp{transform:rotate(180deg)}
        .job-exp{padding:0 20px 20px;border-top:1px solid #1c1c1f}.job-sec{margin-top:16px}.job-sec-lbl{font-size:11px;font-weight:600;color:#52525b;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px}.job-sec p{font-size:13px;color:#a1a1aa;line-height:1.5}
        .job-link{margin-top:12px}.job-link a{display:inline-flex;align-items:center;gap:6px;color:#3b82f6;font-size:13px;text-decoration:none}.job-link a:hover{text-decoration:underline}
        .skill-tags{display:flex;flex-wrap:wrap;gap:6px}.skill-tag{padding:4px 8px;background:#1c1c1f;border-radius:4px;font-size:11px;color:#a1a1aa}
        .job-actions{display:flex;justify-content:space-between;align-items:center;margin-top:16px;padding-top:16px;border-top:1px solid #1c1c1f;flex-wrap:wrap;gap:12px}
        .status-btns{display:flex;gap:6px;flex-wrap:wrap}.status-btn{padding:6px 10px;background:#18181b;border:1px solid #27272a;color:#71717a;font-family:inherit;font-size:11px;font-weight:500;border-radius:4px;cursor:pointer;transition:all 0.15s}.status-btn:hover{border-color:var(--sc);color:var(--sc)}.status-btn.active{background:var(--sc);color:#fff;border-color:var(--sc)}
        .doc-actions{display:flex;gap:6px}.doc-btn{display:flex;align-items:center;gap:4px;padding:6px 10px;background:transparent;border:1px solid #27272a;color:#a1a1aa;font-family:inherit;font-size:11px;border-radius:4px;cursor:pointer;transition:all 0.15s}.doc-btn:hover{border-color:#3f3f46;color:#fff}.doc-btn:disabled{opacity:0.4;cursor:not-allowed}.del-btn{padding:6px;background:transparent;border:1px solid #27272a;color:#71717a;border-radius:4px;cursor:pointer}.del-btn:hover{border-color:#f87171;color:#f87171}
        
        .job-timeline{display:flex;align-items:center;justify-content:space-between;margin:16px 0;padding:8px 0}
        .tl-step{flex:1;position:relative;display:flex;flex-direction:column;align-items:center;opacity:0.5;transition:opacity 0.2s}.tl-step.active{opacity:1}
        .tl-dot{width:20px;height:20px;border-radius:50%;background:#27272a;border:2px solid #3f3f46;display:flex;align-items:center;justify-content:center;z-index:2;margin-bottom:4px;color:#fff}.tl-dot-empty{width:6px;height:6px;border-radius:50%;background:#3f3f46}
        .tl-step.active .tl-dot{background:#3b82f6;border-color:#3b82f6}.tl-step.rejected .tl-dot{background:#f87171;border-color:#f87171}
        .tl-content{display:flex;flex-direction:column;align-items:center}.tl-label{font-size:10px;font-weight:600;text-transform:uppercase;color:#71717a}.tl-date{font-size:9px;color:#52525b}
        .tl-line{position:absolute;top:9px;left:50%;width:100%;height:2px;background:#27272a;z-index:1}.tl-line.filled{background:#3b82f6}
        
        .insights-list{display:flex;flex-direction:column;gap:6px}.insight-item{display:flex;align-items:center;gap:8px;font-size:12px;color:#a1a1aa;padding:6px 10px;background:#18181b;border-radius:4px}.insight-item svg{color:#fbbf24}
        
        .profile-ed{max-width:900px}.profile-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:32px}.profile-hdr h2{font-size:20px;font-weight:600;color:#fff}
        .profile-sec{background:#0f0f11;border:1px solid #1c1c1f;border-radius:12px;padding:24px;margin-bottom:24px}.profile-sec h3{font-size:14px;font-weight:600;color:#fff;margin-bottom:20px}
        .form-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}@media(max-width:600px){.form-grid{grid-template-columns:1fr}}
        .form-grp{display:flex;flex-direction:column;gap:6px}.form-grp.full{grid-column:1/-1;margin-top:8px}.form-grp label{font-size:12px;font-weight:500;color:#71717a}.form-grp input,.form-grp textarea{padding:10px 12px;background:#18181b;border:1px solid #27272a;border-radius:6px;color:#fff;font-family:inherit;font-size:14px;transition:border-color 0.15s}.form-grp input:focus,.form-grp textarea:focus{outline:none;border-color:#3f3f46}.form-grp textarea{resize:vertical;min-height:80px}
        .exp-block,.edu-block{background:#18181b;border:1px solid #27272a;border-radius:8px;padding:20px;margin-bottom:16px}.exp-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;font-size:13px;font-weight:500;color:#71717a}
        .btn-icon-danger{padding:6px;background:transparent;border:1px solid #27272a;color:#71717a;border-radius:4px;cursor:pointer}.btn-icon-danger:hover{border-color:#f87171;color:#f87171}
        .btn-add{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:12px;background:transparent;border:1px dashed #27272a;color:#71717a;font-family:inherit;font-size:13px;font-weight:500;border-radius:8px;cursor:pointer;transition:all 0.15s}.btn-add:hover{border-color:#3f3f46;color:#a1a1aa}
        .skill-row{display:flex;gap:8px;margin-bottom:16px}.skill-row input{flex:1;padding:10px 12px;background:#18181b;border:1px solid #27272a;border-radius:6px;color:#fff;font-family:inherit;font-size:14px}.skill-row input:focus{outline:none;border-color:#3f3f46}
        .skills-list{display:flex;flex-wrap:wrap;gap:8px}.skill-chip{display:flex;align-items:center;gap:6px;padding:6px 10px;background:#1c1c1f;border-radius:4px;font-size:13px;color:#d4d4d8}.skill-chip button{background:transparent;border:none;color:#71717a;font-size:16px;cursor:pointer;line-height:1}.skill-chip button:hover{color:#f87171}
        
        .btn-pri{display:flex;align-items:center;justify-content:center;gap:8px;padding:10px 16px;background:#fff;border:none;color:#000;font-family:inherit;font-size:14px;font-weight:500;border-radius:6px;cursor:pointer;transition:all 0.15s}.btn-pri:hover{background:#e5e5e5}.btn-pri:disabled{opacity:0.5;cursor:not-allowed}.btn-lg{padding:14px 24px;font-size:15px}
        .btn-sec{display:flex;align-items:center;gap:6px;padding:10px 16px;background:transparent;border:1px solid #27272a;color:#a1a1aa;font-family:inherit;font-size:13px;font-weight:500;border-radius:6px;cursor:pointer;transition:all 0.15s}.btn-sec:hover{border-color:#3f3f46;color:#fff}
        .btn-icon{padding:8px;background:transparent;border:none;color:#71717a;cursor:pointer;border-radius:4px}.btn-icon:hover{color:#fff;background:#1c1c1f}
        
        .optimizer h2{display:flex;align-items:center;gap:10px;font-size:20px;font-weight:600;color:#fff;margin-bottom:4px}.opt-hdr{margin-bottom:24px;display:flex;justify-content:space-between;align-items:center}
        .opt-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px}@media(max-width:800px){.opt-grid{grid-template-columns:1fr}}
        .opt-input{display:flex;flex-direction:column;gap:16px}.opt-input textarea{width:100%;height:300px;padding:16px;background:#0f0f11;border:1px solid #1c1c1f;border-radius:10px;color:#d4d4d8;font-family:inherit;font-size:13px;line-height:1.5;resize:none}.opt-input textarea:focus{outline:none;border-color:#27272a}.opt-input textarea::placeholder{color:#52525b}
        .opt-term{background:#0f0f11;border:1px solid #1c1c1f;border-radius:10px;overflow:hidden;display:flex;flex-direction:column;transition:height 0.3s ease}.term-hdr{display:flex;align-items:center;gap:8px;padding:12px 16px;background:#18181b;border-bottom:1px solid #1c1c1f;color:#71717a;font-size:12px;font-weight:500}.term-content{flex:1;padding:16px;overflow-y:auto;font-family:'SF Mono','Consolas',monospace;font-size:12px}.term-placeholder{color:#3f3f46}.log{margin-bottom:6px;color:#71717a;line-height:1.4}.log.success{color:#4ade80}.log.warning{color:#fbbf24}.log.error{color:#f87171}
        .spin{animation:spin 1s linear infinite}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        
        .analysis-panel{background:#0f0f11;border:1px solid #1c1c1f;border-radius:10px;margin-bottom:24px;overflow:hidden}
        .analysis-hdr{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:#18181b;font-size:13px;font-weight:500;color:#a1a1aa}
        .analysis-title{display:flex;align-items:center;gap:8px;color:#fff;font-weight:600}
        .analysis-content{padding:16px;font-family:'Inter',sans-serif;font-size:13px;color:#d4d4d8;white-space:pre-wrap;margin:0;max-height:300px;overflow-y:auto;background:#09090b;line-height:1.6}
        .analysis-footer{padding:12px 16px;background:#18181b;border-top:1px solid #27272a;display:flex;align-items:center;gap:8px;color:#52525b;font-size:11px}
        
        .opt-result{background:#0f0f11;border:1px solid #1c1c1f;border-radius:12px;padding:24px}.result-hdr{display:flex;align-items:center;gap:10px;color:#4ade80;font-size:15px;font-weight:600;margin-bottom:20px}
        .result-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:16px;margin-bottom:20px}.result-card{padding:12px 16px;background:#18181b;border-radius:8px}.result-lbl{font-size:11px;font-weight:500;color:#52525b;text-transform:uppercase;margin-bottom:4px}.result-val{font-size:14px;font-weight:500;color:#fff}
        .score-panel{display:flex;align-items:center;justify-content:center;gap:32px;padding:24px;background:#18181b;border-radius:8px;margin-bottom:20px}.score-item{text-align:center}.score-lbl{display:block;font-size:11px;color:#52525b;text-transform:uppercase;margin-bottom:4px}.score-val{font-size:36px;font-weight:700}.score-val.baseline{color:#71717a}.score-val.optimized{color:#4ade80}.score-panel svg{color:#3f3f46}
        .insights-panel{background:#18181b;border-radius:8px;padding:16px;margin-bottom:20px}.insights-hdr{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:600;color:#fbbf24;margin-bottom:12px}.insight-row{font-size:12px;color:#a1a1aa;padding:6px 0;border-bottom:1px solid #27272a}.insight-row:last-child{border:none}
        .skills-det{margin-bottom:20px}.skills-lbl{font-size:11px;font-weight:500;color:#52525b;text-transform:uppercase;margin-bottom:8px}.result-actions{display:flex;gap:12px;flex-wrap:wrap}
        
        .modal{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:1000;padding:24px}.modal-content{background:#0f0f11;border:1px solid #1c1c1f;border-radius:12px;width:100%;max-width:800px;max-height:90vh;display:flex;flex-direction:column;overflow:hidden}.modal-hdr{display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid #1c1c1f}.modal-hdr h3{font-size:15px;font-weight:600;color:#fff}.modal-actions{display:flex;gap:8px}.modal-body{flex:1;overflow-y:auto;padding:24px}.doc-preview{background:#fff;color:#000;padding:40px;border-radius:8px;font-family:'Times New Roman',serif;font-size:10pt;line-height:1.4}
        .doc-preview .job-hdr { display: flex; justify-content: space-between; font-weight: bold; font-size: 9pt; }
        .doc-preview .job-title-row { display: flex; justify-content: space-between; margin-bottom: 1px; font-style: italic; font-size: 9pt; }
        .doc-preview .job-bullets { margin: 2px 0 0 0; padding: 0; list-style-position: inside; }
        .doc-preview .job-bullets li { margin-bottom: 1px; }

        
        .toast-container{position:fixed;bottom:24px;right:24px;display:flex;flex-direction:column;gap:8px;z-index:1100}.toast{display:flex;align-items:center;gap:10px;padding:12px 16px;background:#1c1c1f;border:1px solid #27272a;border-radius:8px;color:#d4d4d8;font-size:13px;box-shadow:0 4px 12px rgba(0,0,0,0.4);animation:slideIn 0.2s ease}@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}.toast-success{border-left:3px solid #4ade80}.toast-success svg{color:#4ade80}.toast-error{border-left:3px solid #f87171}.toast-error svg{color:#f87171}.toast-warning{border-left:3px solid #fbbf24}.toast-warning svg{color:#fbbf24}.toast-info{border-left:3px solid #60a5fa}.toast-info svg{color:#60a5fa}.toast button{background:transparent;border:none;color:#52525b;cursor:pointer;padding:2px}.toast button:hover{color:#a1a1aa}
        
        .email-submission-alert{display:flex;align-items:flex-start;gap:16px;padding:20px;background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.3);border-radius:10px;margin-bottom:20px}.email-submission-alert>svg{color:#fbbf24;flex-shrink:0;margin-top:2px}.email-submission-content{flex:1}.email-submission-title{font-size:15px;font-weight:600;color:#fff;display:block;margin-bottom:8px}.email-submission-content p{font-size:13px;color:#a1a1aa;margin:8px 0}.email-link-large{display:inline-block;padding:10px 20px;background:#fbbf24;color:#000;text-decoration:none;border-radius:6px;font-weight:600;margin:12px 0;transition:all 0.15s ease}.email-link-large:hover{background:#f59e0b;transform:translateY(-1px)}.email-tip{font-size:12px;color:#71717a;font-style:italic}
        
        .email-badge{display:inline-flex;align-items:center;gap:4px;color:#fbbf24;font-weight:500}.interview-badge{display:inline-flex;align-items:center;gap:4px;color:#3b82f6;font-weight:500}

        /* API Key Input Styles */
        .api-config { display: flex; align-items: center; }
        .api-status-pill { display: flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; }
        .api-status-pill:hover { background: #1c1c1f; border-color: #27272a; }
        .api-status-pill.missing { color: #f87171; background: rgba(248, 113, 113, 0.1); border-color: rgba(248, 113, 113, 0.2); }
        .api-status-pill.active { color: #4ade80; background: rgba(74, 222, 128, 0.1); border-color: rgba(74, 222, 128, 0.2); }
        .status-dot { width: 6px; height: 6px; background: #4ade80; border-radius: 50%; box-shadow: 0 0 8px #4ade80; }
        .api-input-group { display: flex; align-items: center; gap: 4px; background: #18181b; padding: 4px 4px 4px 12px; border-radius: 20px; border: 1px solid #3f3f46; animation: fadeIn 0.2s ease; }
        .api-input-group input { background: transparent; border: none; color: #fff; font-size: 12px; width: 160px; outline: none; font-family: monospace; }
        .api-input-group button { background: #27272a; border: none; color: #4ade80; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
        .api-input-group button:hover { background: #3f3f46; color: #fff; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>

      <header className="hdr">
        <div className="logo">
          <span className="logo-text">P.A.T.H.O.S.</span>
          <span className="logo-tagline">Personal Automated Tracking & Hiring Optimization System</span>
        </div>
        <nav className="nav">{tabs.map(t => <button key={t.id} className={`nav-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}><t.icon size={16} />{t.label}</button>)}</nav>
        <div className="hdr-actions">
          <button className="btn-ghost" onClick={() => fileRef.current?.click()}><Upload size={14} /> Import</button>
          <button className="btn-ghost" onClick={exportData}><Download size={14} /> Export</button>
          <input ref={fileRef} type="file" accept=".json" onChange={importData} style={{ display: 'none' }} />
        </div>
      </header>

      <main className="main">
        {tab === 'dashboard' && <><PathosEye message={msg} mood={mood} /><MetricsPanel applications={apps} /><div className="dash-grid"><SankeyDiagram applications={apps} /><DailyMissions applications={apps} /></div></>}
        {tab === 'pipeline' && <><PathosEye message={msg} mood={mood} compact /><PipelineTracker applications={apps} setApplications={setApps} onViewResume={j => setDocView({ job: j, type: 'resume' })} onViewCover={j => setDocView({ job: j, type: 'cover' })} /></>}
        {tab === 'profile' && <><PathosEye message={msg} mood={mood} compact /><ProfileEditor profile={profile} setProfile={setProfile} onSave={save} /></>}
        {tab === 'optimizer' && <><PathosEye message={msg} mood={mood} compact /><ATSOptimizer profile={profile} applications={apps} setApplications={setApps} showToast={showToast} setPathosMsg={setMsg} setPathosMood={setMood} apiKey={apiKey} setApiKey={setApiKey} /></>}
      </main>

      {docView && <DocViewer job={docView.job} type={docView.type} profile={profile} onClose={() => setDocView(null)} />}
      <div className="toast-container">{toasts.map(t => <Toast key={t.id} message={t.message} type={t.type} onClose={() => remToast(t.id)} />)}</div>
    </div>
  );
}