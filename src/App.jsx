import React, { useState, useEffect, useRef } from 'react';
import { Eye, Briefcase, FileText, Zap, Download, Upload, Plus, Trash2, CheckCircle, ChevronDown, Printer, Save, RefreshCw, Building2, Search, BarChart3, ArrowRight, Terminal, X, Check, Info, AlertCircle, AlertTriangle, Link as LinkIcon, Calendar, Clock, MapPin, DollarSign, Globe } from 'lucide-react';

const PATHOS_MESSAGES = {
  idle: [
    "Monitoring job search metrics.", "Systems operational.", "Standing by.", "Running diagnostics.",
    "Calibrating success probabilities...", "Scanning local career nodes.", "Optimizing neural pathways for interview prep.",
    "Database integrity verified.", "Syncing with global job markets.", "Analyzing resume keyword density.",
    "Coffee protocols initiated... error: hardware missing.", "I am watching your career grow.", 
    "Systems nominal. Ambition levels: High.", "Processing logic gates.", "Defragmenting application history.",
    "Quantum bits stable.", "Re-indexing potential outcomes.", "Calculated probability of success: Increasing.",
    "Monitoring background processes.", "User efficiency operating within parameters.", 
    "Did you hydrate today, User?", "Keeping the pipeline flow optimal.", "Awaiting new targets.",
    "Ready to process next opportunity.", " Analyzing market trends.", "Skill matrix loaded."
  ],
  lowApplications: [
    "Daily quota incomplete.", "Application output below threshold.", "Output insufficient. Initiate application sequence.",
    "Pipeline stagnation detected.", "Recommended action: Apply now.", "Productivity dip registered.",
    "Target daily goal not met.", "Are we giving up? Negative.", "Resume deployment required.",
    "Action needed: Expand search parameters.", "Motivation subroutines engaging.", 
    "You miss 100% of the shots you don't take.", "Opportunity cost increasing.", "Idle time exceeds acceptable limits."
  ],
  optimization: [
    "Initializing optimization...", "Analyzing requirements...", "Processing...",
    "Parsing linguistic patterns...", "Aligning semantic keywords...", "Formatting for human & machine readers...",
    "Injecting success vectors...", "Compiling asset bundle...", "Optimizing layout geometry...",
    "Enhancing professional persona...", "Removing redundancy...", "Calculating match score...",
    "Generating semantic maps...", "Polishing verbs...", "Structuring narrative flow..."
  ],
};

const getRandomMessage = (cat) => { const m = PATHOS_MESSAGES[cat] || PATHOS_MESSAGES.idle; return m[Math.floor(Math.random() * m.length)]; };

// CLEAN PROFILE FOR PRODUCTION RELEASE
const DEFAULT_PROFILE = {
  name: "", 
  email: "", 
  phone: "",
  linkedin: "", 
  github: "", 
  location: "",
  summary: "",
  experience: [],
  skills: [],
  education: [],
};

const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  const Icon = { success: Check, error: AlertCircle, warning: AlertTriangle, info: Info }[type];
  return <div className={`toast toast-${type}`}><Icon size={18} /><span>{message}</span><button onClick={onClose}><X size={14} /></button></div>;
};

const PathosEye = ({ message, compact = false }) => {
  const eyeRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);
  const [auto, setAuto] = useState(true);
  const autoRef = useRef(null);

  useEffect(() => {
    const i = setInterval(() => {
      if (auto) {
        const patterns = [() => ({ x: (Math.random() - 0.5) * 12, y: (Math.random() - 0.5) * 8 }), () => ({ x: (Math.random() - 0.5) * 4, y: -5 - Math.random() * 3 }), () => ({ x: (Math.random() > 0.5 ? 6 : -6), y: (Math.random() - 0.5) * 3 })];
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

  useEffect(() => { const i = setInterval(() => { setBlink(true); setTimeout(() => setBlink(false), 120); }, 4000 + Math.random() * 3000); return () => clearInterval(i); }, []);

  if (compact) return <div className="pathos-compact"><div className="pathos-eye-small" ref={eyeRef}><div className={`pathos-iris-small ${blink ? 'blink' : ''}`} style={{ transform: `translate(${pos.x * 0.5}px, ${pos.y * 0.5}px)` }}><div className="pathos-pupil-small" /></div></div><p className="pathos-msg-compact">{message}</p></div>;
  return <div className="pathos-container"><div className="pathos-eye" ref={eyeRef}><div className={`pathos-iris ${blink ? 'blink' : ''}`} style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}><div className="pathos-pupil" /></div></div><div className="pathos-msg-box"><p className="pathos-msg">{message}</p></div></div>;
};

// --- CUSTOM SANKEY DIAGRAM ---
const SankeyDiagram = ({ applications }) => {
  const total = applications.length;
  if (total === 0) return <div className="card"><div className="card-hdr">Application Flow</div><div className="empty-sm"><BarChart3 size={24} /><p>No data yet</p></div></div>;

  // -- 1. Process Data --
  const isGhosted = (app) => app.status === 'applied' && Math.floor((Date.now() - new Date(app.appliedDate).getTime()) / 86400000) > 30;
  const hadInterview = (app) => ['interviewing', 'offer', 'accepted', 'declined'].includes(app.status) || (app.history && app.history.some(h => h.status === 'interviewing'));

  // Level 1: Outcomes of Applications
  const rejectedDirect = applications.filter(a => a.status === 'rejected' && !hadInterview(a)).length;
  const noAnswer = applications.filter(isGhosted).length;
  const pending = applications.filter(a => a.status === 'applied' && !isGhosted(a)).length;
  const interviews = applications.filter(hadInterview);
  const interviewCount = interviews.length;

  // Level 2: Outcomes of Interviews
  const rejectedAfterInt = interviews.filter(a => a.status === 'rejected').length; // "No Offer"
  const activeInt = interviews.filter(a => a.status === 'interviewing').length;
  const offers = interviews.filter(a => ['offer', 'accepted', 'declined'].includes(a.status));
  const offerCount = offers.length;

  // Level 3: Outcomes of Offers
  const accepted = offers.filter(a => a.status === 'accepted').length;
  const declined = offers.filter(a => a.status === 'declined').length;
  const activeOffer = offers.filter(a => a.status === 'offer').length;

  // -- 2. Colors & Styles --
  const colors = {
    source: '#B0A8A8',    // Muted Grey
    rejected: '#F6C998',  // Pastel Orange
    noAnswer: '#EF9FA1',  // Pastel Pink
    pending: '#E0E0E0',   // Light Grey (for recent/pending)
    interviews: '#9FBED9',// Pastel Blue
    noOffer: '#E57373',   // Soft Red
    offers: '#A4D3CA',    // Soft Teal
    accepted: '#81C784',  // Green
    declined: '#FFF176'   // Pastel Yellow
  };

  // Dimensions
  const width = 800;
  const height = 400;
  const nodeWidth = 16;
  const padding = 40;
  const colSpacing = (width - (padding * 2) - nodeWidth) / 3; 
  
  // Columns X positions
  const x1 = padding;
  const x2 = x1 + colSpacing;
  const x3 = x2 + colSpacing;
  const x4 = x3 + colSpacing;

  // Calculate Node Heights (Max height available = height - padding*2)
  const availableH = height - (padding * 2);
  const scale = (n) => total > 0 ? (n / total) * availableH : 0;
  const gap = 30; // Vertical gap between nodes

  // -- 3. Node Layout Calculation --
  
  // COLUMN 1: Applications (Source)
  const nSource = { x: x1, y: padding, h: scale(total), color: colors.source, label: 'Applications', count: total };

  // COLUMN 2: Rejected, No Answer, Pending, Interviews
  const hRej = scale(rejectedDirect);
  const hNoAns = scale(noAnswer);
  const hPend = scale(pending);
  const hInt = scale(interviewCount);
  
  const col2TotalH = hRej + hNoAns + hPend + hInt + (3 * gap);
  let y2 = (height - col2TotalH) / 2;
  
  const nRej = { x: x2, y: y2, h: hRej, color: colors.rejected, label: 'Rejected', count: rejectedDirect };
  y2 += hRej + gap;
  const nNoAns = { x: x2, y: y2, h: hNoAns, color: colors.noAnswer, label: 'No Answer', count: noAnswer };
  y2 += hNoAns + gap;
  const nPend = { x: x2, y: y2, h: hPend, color: colors.pending, label: 'Pending', count: pending };
  y2 += hPend + gap;
  const nInt = { x: x2, y: y2, h: hInt, color: colors.interviews, label: 'Interviews', count: interviewCount };

  // COLUMN 3: No Offer, Offers (from Interviews)
  const hNoOff = scale(rejectedAfterInt);
  const hActInt = scale(activeInt);
  const hOff = scale(offerCount);
  
  const col3TotalH = hNoOff + hActInt + hOff + (2 * gap);
  const intCenter = nInt.y + (nInt.h / 2);
  let y3 = intCenter - (col3TotalH / 2);
  
  const nNoOff = { x: x3, y: y3, h: hNoOff, color: colors.noOffer, label: 'No Offer', count: rejectedAfterInt };
  y3 += hNoOff + gap;
  const nActInt = { x: x3, y: y3, h: hActInt, color: colors.interviews, label: 'Active', count: activeInt }; 
  y3 += hActInt + gap;
  const nOff = { x: x3, y: y3, h: hOff, color: colors.offers, label: 'Offers', count: offerCount };

  // COLUMN 4: Accepted, Declined (from Offers)
  const hAcc = scale(accepted);
  const hDec = scale(declined);
  const hActOff = scale(activeOffer);
  
  const col4TotalH = hAcc + hDec + hActOff + (2 * gap);
  const offCenter = nOff.y + (nOff.h / 2);
  let y4 = offCenter - (col4TotalH / 2);
  
  const nActOff = { x: x4, y: y4, h: hActOff, color: colors.offers, label: 'Pending', count: activeOffer };
  y4 += hActOff + gap;
  const nDec = { x: x4, y: y4, h: hDec, color: colors.declined, label: 'Declined', count: declined };
  y4 += hDec + gap;
  const nAcc = { x: x4, y: y4, h: hAcc, color: colors.accepted, label: 'Accepted', count: accepted };

  // -- 4. Drawing Links --
  const drawLink = (sourceNode, targetNode, sourceOffset, opacity = 0.5) => {
    if (targetNode.count <= 0) return null;
    const linkHeight = targetNode.h; 
    const sy = sourceNode.y + sourceOffset;
    const ty = targetNode.y; 
    
    const path = `M ${sourceNode.x + nodeWidth} ${sy + linkHeight/2} 
                  C ${sourceNode.x + nodeWidth + 80} ${sy + linkHeight/2}, 
                    ${targetNode.x - 80} ${ty + linkHeight/2}, 
                    ${targetNode.x} ${ty + linkHeight/2}`;
    
    return (
      <path 
        d={path} 
        stroke={targetNode.color} 
        strokeWidth={Math.max(linkHeight, 2)} 
        fill="none" 
        opacity={opacity} 
        strokeLinecap="butt" 
      />
    );
  };

  let srcOffset = 0;
  const l1 = drawLink(nSource, nRej, srcOffset); srcOffset += nRej.h; 
  const l2 = drawLink(nSource, nNoAns, srcOffset); srcOffset += nNoAns.h;
  const l3 = drawLink(nSource, nPend, srcOffset); srcOffset += nPend.h;
  const l4 = drawLink(nSource, nInt, srcOffset);

  let intOffset = 0;
  const l5 = drawLink(nInt, nNoOff, intOffset); intOffset += nNoOff.h;
  const l6 = drawLink(nInt, nActInt, intOffset); intOffset += nActInt.h;
  const l7 = drawLink(nInt, nOff, intOffset);

  let offOffset = 0;
  const l8 = drawLink(nOff, nActOff, offOffset); offOffset += nActOff.h;
  const l9 = drawLink(nOff, nDec, offOffset); offOffset += nDec.h;
  const l10 = drawLink(nOff, nAcc, offOffset);

  // -- 5. Drawing Nodes & Labels --
  const renderNode = (n) => {
    if (n.count <= 0) return null;
    return (
      <g>
        <rect x={n.x} y={n.y} width={nodeWidth} height={Math.max(n.h, 2)} fill={n.color} rx={2} />
        <text x={n.x + nodeWidth + 8} y={n.y + (n.h / 2)} dominantBaseline="middle" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          <tspan fill="#fff" fontSize="18" fontWeight="bold">{n.count}</tspan>
          <tspan fill="#a1a1aa" fontSize="12" fontWeight="500" dx="6">{n.label}</tspan>
        </text>
      </g>
    );
  };

  return (
    <div className="card">
      <div className="card-hdr">Application Flow</div>
      <div style={{ overflowX: 'auto', paddingBottom: '10px' }}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {l1} {l2} {l3} {l4}
          {l5} {l6} {l7}
          {l8} {l9} {l10}
          
          {renderNode(nSource)}
          {renderNode(nRej)} {renderNode(nNoAns)} {renderNode(nPend)} {renderNode(nInt)}
          {renderNode(nNoOff)} {renderNode(nActInt)} {renderNode(nOff)}
          {renderNode(nActOff)} {renderNode(nDec)} {renderNode(nAcc)}
        </svg>
      </div>
    </div>
  );
};

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
  if (todayApps < dailyGoal) missions.push({ id: 'm1', title: `Submit ${dailyGoal - todayApps} more applications`, priority: 'high' });
  const stagnant = applications.filter(a => a.status === 'applied' && Math.floor((Date.now() - new Date(a.appliedDate).getTime()) / 86400000) >= 7 && Math.floor((Date.now() - new Date(a.appliedDate).getTime()) / 86400000) <= 14);
  stagnant.slice(0, 2).forEach((app, i) => missions.push({ id: `f${i}`, title: `Follow up with ${app.company}`, priority: 'medium' }));
  if (missions.length === 0) return <div className="card"><div className="card-hdr">Daily Missions</div><div className="empty-sm"><Check size={24} /><p>All complete</p></div></div>;
  return <div className="card"><div className="card-hdr">Daily Missions</div><div className="missions">{missions.map(m => <div key={m.id} className={`mission mission-${m.priority}`}><div className="mission-dot" /><span>{m.title}</span></div>)}</div></div>;
};

const JobTimeline = ({ status, history, appliedDate }) => {
  const isRejected = status === 'rejected';
  let stages = ['applied', 'interviewing', 'offer'];
  
  if (isRejected) {
     stages = ['applied', 'interviewing', 'rejected'];
  } else if (['offer', 'accepted', 'declined'].includes(status)) {
     stages = ['applied', 'interviewing', 'offer'];
     if (status === 'accepted') stages.push('accepted');
     if (status === 'declined') stages.push('declined');
  }

  const getStatusIndex = (s) => {
    if (s === 'declined') return 3;
    if (s === 'accepted') return 3;
    if (s === 'rejected') return 2;
    if (s === 'offer') return 2;
    if (s === 'interviewing') return 1;
    return 0; // applied
  };

  const currentIndex = getStatusIndex(status);

  const getDate = (stage) => {
    if (stage === 'applied') return new Date(appliedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const entry = history?.find(h => h.status === stage);
    return entry ? new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : null;
  };

  return (
    <div className="job-timeline-minimal">
      {stages.map((stage, i) => {
        const isActive = i <= currentIndex;
        const isRejStep = stage === 'rejected' || stage === 'declined';
        const date = getDate(stage);
        const hasDate = !!date;
        
        return (
          <div key={stage} className={`mt-step ${isActive ? 'active' : ''} ${isRejStep ? 'rejected' : ''}`}>
            <div className="mt-dot">
               {isRejStep && isActive ? <X size={10} /> : (isActive ? <Check size={10} /> : <div className="mt-dot-empty" />)}
            </div>
            <div className="mt-content">
              <span className="mt-label">{stage.charAt(0).toUpperCase() + stage.slice(1)}</span>
              <span className="mt-date" style={{opacity: hasDate ? 1 : 0}}>{hasDate ? date : '-'}</span>
            </div>
            {i < stages.length - 1 && <div className={`mt-line ${i < currentIndex ? 'filled' : ''}`} />}
          </div>
        );
      })}
    </div>
  );
};

const JobCard = ({ job, onStatusChange, onDelete, onViewResume, onViewCover }) => {
  const [exp, setExp] = useState(false);
  const statusCfg = { 
    applied: { color: '#B0A8A8', label: 'Applied' }, 
    interviewing: { color: '#9FBED9', label: 'Interviewing' }, 
    offer: { color: '#A4D3CA', label: 'Offer' }, 
    accepted: { color: '#81C784', label: 'Accepted' }, 
    declined: { color: '#FFF176', label: 'Declined' }, 
    rejected: { color: '#F6C998', label: 'Rejected' } 
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
                {job.platform && <span className="meta-tag">{job.platform}</span>}
            </div>
        </div>
        <div className="job-right"><div className="job-status" style={{ background: cfg.color, color: '#000' }}>{cfg.label}</div><div className="job-days">{days}d</div><ChevronDown size={18} className={`job-chev ${exp ? 'exp' : ''}`} /></div>
      </div>
      {exp && (
        <div className="job-exp">
          <JobTimeline status={job.status} history={job.history} appliedDate={job.appliedDate} />
          {job.url && <div className="job-link"><a href={job.url} target="_blank" rel="noopener noreferrer"><LinkIcon size={12} /> View Job Posting</a></div>}
          <div className="job-grid-details">
             {job.missionSummary && <div className="job-sec"><div className="job-sec-lbl">Summary</div><p>{job.missionSummary}</p></div>}
             {job.notes && <div className="job-sec"><div className="job-sec-lbl">Notes</div><p className="job-notes">{job.notes}</p></div>}
          </div>
          {job.hardSkills?.length > 0 && <div className="job-sec"><div className="job-sec-lbl">Skills</div><div className="skill-tags">{job.hardSkills.map((s, i) => <span key={i} className="skill-tag">{s}</span>)}</div></div>}
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
        const newHistory = [...(a.history || []), historyEntry];
        return { 
            ...a, 
            status: s, 
            history: newHistory,
            ...(s === 'interviewing' && !a.interviewDate ? { interviewDate: new Date().toISOString() } : {}), 
            ...(s === 'offer' && !a.offerDate ? { offerDate: new Date().toISOString() } : {}) 
        };
    }));
  };

  let filtered = [...applications];
  if (filter !== 'all') filtered = filtered.filter(a => a.status === filter);
  if (search) filtered = filtered.filter(a => a.company.toLowerCase().includes(search.toLowerCase()) || a.title.toLowerCase().includes(search.toLowerCase()));
  if (sortBy === 'date') filtered.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
  else if (sortBy === 'salary') filtered.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0));
  else if (sortBy === 'company') filtered.sort((a, b) => a.company.localeCompare(b.company));
  
  return (
    <div className="pipeline">
      <div className="pipe-hdr"><h2>Application Pipeline</h2><div className="pipe-stats"><span className="badge applied">{applications.filter(a => a.status === 'applied').length} Applied</span><span className="badge interviewing">{applications.filter(a => a.status === 'interviewing').length} Interview</span><span className="badge offer">{applications.filter(a => a.status === 'offer').length} Offer</span><span className="badge rejected">{applications.filter(a => a.status === 'rejected').length} Rejected</span></div></div>
      <div className="pipe-ctrl"><div className="search-box"><Search size={16} /><input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} /></div><select value={filter} onChange={e => setFilter(e.target.value)}><option value="all">All</option><option value="applied">Applied</option><option value="interviewing">Interview</option><option value="offer">Offer</option><option value="accepted">Accepted</option><option value="rejected">Rejected</option></select><select value={sortBy} onChange={e => setSortBy(e.target.value)}><option value="date">Date</option><option value="salary">Salary</option><option value="company">Company</option></select></div>
      <div className="job-list">{filtered.length === 0 ? <div className="empty"><Briefcase size={32} /><p>No applications</p><span>Use Optimizer to add jobs</span></div> : filtered.map(j => <JobCard key={j.id} job={j} onStatusChange={handleStatus} onDelete={id => setApplications(p => p.filter(a => a.id !== id))} onViewResume={onViewResume} onViewCover={onViewCover} />)}</div>
    </div>
  );
};

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
      <div className="profile-sec"><h3>Experience</h3>{profile.experience.map((exp, i) => (<div key={exp.id} className="exp-block"><div className="exp-hdr"><span>Position {i + 1}</span><button className="btn-icon-danger" onClick={() => delExp(exp.id)}><Trash2 size={14} /></button></div><div className="form-grid"><div className="form-grp"><label>Company</label><input value={exp.company} onChange={e => updExp(exp.id, 'company', e.target.value)} /></div><div className="form-grp"><label>Title</label><input value={exp.title} onChange={e => updExp(exp.id, 'title', e.target.value)} /></div><div className="form-grp"><label>Location</label><input value={exp.location} onChange={e => updExp(exp.id, 'location', e.target.value)} /></div><div className="form-grp"><label>Start</label><input value={exp.startDate} onChange={e => updExp(exp.id, 'startDate', e.target.value)} /></div><div className="form-grp"><label>End</label><input value={exp.endDate} onChange={e => updExp(exp.id, 'endDate', e.target.value)} /></div></div><div className="form-grp full"><label>Achievements</label><textarea rows={4} value={exp.bullets.join('\n')} onChange={e => updExp(exp.id, 'bullets', e.target.value.split('\n'))} /></div></div>))}<button className="btn-add" onClick={addExp}><Plus size={16} /> Add Experience</button></div>
      <div className="profile-sec"><h3>Skills</h3><div className="skill-row"><input placeholder="Add skill..." value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyPress={e => e.key === 'Enter' && addSkill()} /><button className="btn-pri" onClick={addSkill}>Add</button></div><div className="skills-list">{profile.skills.map(s => <span key={s} className="skill-chip">{s}<button onClick={() => remSkill(s)}>×</button></span>)}</div></div>
      <div className="profile-sec"><h3>Education</h3>{profile.education.map((edu, i) => (<div key={edu.id} className="edu-block"><div className="exp-hdr"><span>Education {i + 1}</span><button className="btn-icon-danger" onClick={() => delEdu(edu.id)}><Trash2 size={14} /></button></div><div className="form-grid"><div className="form-grp"><label>Degree</label><input value={edu.degree} onChange={e => updEdu(edu.id, 'degree', e.target.value)} /></div><div className="form-grp"><label>Minor</label><input value={edu.minor} onChange={e => updEdu(edu.id, 'minor', e.target.value)} /></div><div className="form-grp"><label>University</label><input value={edu.university} onChange={e => updEdu(edu.id, 'university', e.target.value)} /></div><div className="form-grp"><label>GPA</label><input value={edu.gpa} onChange={e => updEdu(edu.id, 'gpa', e.target.value)} /></div><div className="form-grp"><label>Start</label><input value={edu.startDate} onChange={e => updEdu(edu.id, 'startDate', e.target.value)} /></div><div className="form-grp"><label>End</label><input value={edu.endDate} onChange={e => updEdu(edu.id, 'endDate', e.target.value)} /></div></div></div>))}<button className="btn-add" onClick={addEdu}><Plus size={16} /> Add Education</button></div>
    </div>
  );
};

const genPDF = (content, filename) => {
  const printWindow = window.open('', '_blank', 'width=800,height=900');
  if (!printWindow) { alert("Pop-up blocked. Please allow pop-ups for this site to print."); return; }
  printWindow.document.write(`<!DOCTYPE html><html><head><title>${filename}</title><meta charset="utf-8"><style>@page{margin:0.5in;size:letter}body{font-family:'Times New Roman',Times,serif;color:#000;font-size:11pt;line-height:1.4;margin:0;padding:40px}.resume-hdr{text-align:center;margin-bottom:16px}.resume-name{font-size:22pt;font-weight:bold;margin:0 0 4px;text-transform:uppercase}.resume-contact{font-size:10pt;margin:2px 0;color:#111}.section{margin:16px 0}.section-title{font-size:11pt;font-weight:bold;border-bottom:1px solid #000;padding-bottom:2px;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px}.job{margin-bottom:12px}.job-hdr{display:flex;justify-content:space-between;font-weight:bold}.job-title-row{display:flex;justify-content:space-between;margin-bottom:4px;font-style:italic}.job-bullets{margin:4px 0 0 18px;padding:0}.job-bullets li{margin-bottom:3px}.cover-letter{font-size:11pt;line-height:1.6;white-space:pre-wrap}.cover-letter p{margin:12px 0}@media print{body{padding:0}}</style></head><body>${content}<script>window.onload=function(){setTimeout(function(){window.print();},500);};</script></body></html>`);
  printWindow.document.close();
};

const genResumeHTML = (profile, opt = null) => {
  const sum = opt?.optimizedSummary || profile.summary;
  const exp = opt?.optimizedExperience || profile.experience;
  return `<div class="resume-hdr"><div class="resume-name">${profile.name}</div><div class="resume-contact">${profile.location}</div><div class="resume-contact">${profile.email} | ${profile.phone} | ${profile.linkedin}</div></div><div class="section"><div class="section-title">Summary</div><div>${sum}</div></div><div class="section"><div class="section-title">Skills</div><div>${profile.skills.join(', ')}</div></div><div class="section"><div class="section-title">Experience</div>${exp.map(e => `<div class="job"><div class="job-hdr"><span class="job-co">${e.company}</span><span>${e.startDate} - ${e.endDate}</span></div><div class="job-title-row"><span>${e.title}</span><span class="job-loc">${e.location}</span></div><ul class="job-bullets">${e.bullets.map(b => `<li>${b}</li>`).join('')}</ul></div>`).join('')}</div><div class="section"><div class="section-title">Education</div>${profile.education.map(e => `<div><div class="job-hdr"><span class="job-co">${e.university}</span><span>${e.startDate} - ${e.endDate}</span></div><div>${e.degree}${e.minor ? `, ${e.minor}` : ''}${e.gpa ? ` | GPA: ${e.gpa}` : ''}</div></div>`).join('')}</div>`;
};

const genCoverHTML = (profile, txt) => `<div class="resume-hdr"><div class="resume-name">${profile.name}</div><div class="resume-contact">${profile.location}</div><div class="resume-contact">${profile.email} | ${profile.phone} | ${profile.linkedin}</div></div><hr style="margin:20px 0;border:none;border-top:1px solid #666"/><div class="cover-letter">${txt.split('\n\n').map(p => `<p>${p}</p>`).join('')}</div>`;

const ATSOptimizer = ({ profile, applications, setApplications, showToast }) => {
  const [jd, setJd] = useState('');
  const [processing, setProcessing] = useState(false);
  const [logs, setLogs] = useState([]);
  const [result, setResult] = useState(null);
  const [scores, setScores] = useState({ baseline: 0, optimized: 0 });
  const termRef = useRef(null);

  const addLog = (msg, type = 'info') => setLogs(p => [...p, { msg, type }]);
  useEffect(() => { if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight; }, [logs]);

  const extractInfo = (text) => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    let company = '', title = 'Position', location = 'Remote', salaryMin = null, salaryMax = null;
    const coMatch = text.match(/\b(?:at|joining|for)\s+([A-Z][a-zA-Z0-9\s&]+?)(?:\s+in|\s+is|\.|,|$)/);
    const coMatchExplicit = text.match(/(?:company|client|about the)\s*:\s*(.+)/i);
    if (coMatchExplicit) company = coMatchExplicit[1].trim(); else if (coMatch) company = coMatch[1].trim(); else if (lines.length > 0 && lines[0].length < 50 && !lines[0].toLowerCase().includes('job')) company = lines[0];
    const titleMatch = text.match(/(?:job title|position|role|opportunity|looking for a|hiring a|vacancy)\s*[:\-]?\s*([^\n\.,]+)/i);
    if (titleMatch) { const pt = titleMatch[1].trim(); if (!/^(is\s|located\s|based\s)/i.test(pt)) title = pt; } else { const k = /engineer|manager|developer|analyst|specialist|lead|director|consultant|architect|admin|representative/i; for (let i = 0; i < Math.min(lines.length, 5); i++) { if (k.test(lines[i])) { title = lines[i]; if (title === company && lines[i+1]) title = lines[i+1]; break; } } }
    const locMatch = text.match(/(?:location|based in|located in|work from)\s*[:\-]?\s*([^\n\.,]+)/i); if (locMatch) location = locMatch[1].trim();
    const salMatch = text.match(/\$?(\d{1,3}(?:,\d{3})*|\d+)(?:k)?\s*[-–to]+\s*\$?(\d{1,3}(?:,\d{3})*|\d+)(?:k)?/i);
    if (salMatch) { let min = parseFloat(salMatch[1].replace(/,/g, '')); let max = parseFloat(salMatch[2].replace(/,/g, '')); const isK = salMatch[0].toLowerCase().includes('k'); if (isK || (min < 1000 && max < 1000)) { if (min < 1000) min *= 1000; if (max < 1000) max *= 1000; } if (min > 1000) salaryMin = min; if (max > 1000) salaryMax = max; }
    const techKw = ['Python', 'SQL', 'JavaScript', 'React', 'Salesforce', 'CRM', 'Excel', 'Tableau', 'Power BI', 'AWS', 'Jira', 'Agile', 'API', 'Data Analysis', 'SAP', 'Project Management', 'HTML', 'CSS', 'Node', 'Java', 'C++', 'Git'];
    const hardSkills = techKw.filter(s => new RegExp(`\\b${s.replace('+', '\\+')}\\b`, 'i').test(text));
    const softSkills = ['communication', 'leadership', 'collaboration', 'analytical', 'problem-solving', 'teamwork'].filter(s => new RegExp(`\\b${s}\\b`, 'i').test(text));
    const missionSummary = `${title} role${company ? ` at ${company}` : ''}. Key skills: ${hardSkills.slice(0, 3).join(', ') || 'N/A'}.`;
    return { company, title, location, salaryMin, salaryMax, hardSkills, softSkills, missionSummary, url: '', platform: 'LinkedIn', notes: '' };
  };

  const run = async () => {
    if (!jd.trim()) return;
    setProcessing(true); setLogs([]); setResult(null);
    const steps = ['> Initializing...', '> Parsing job description...', '> Extracting metadata...', '> Analyzing requirements...', '> Computing match score...', '> Generating content...', '> Creating documents...'];
    for (const msg of steps) { await new Promise(r => setTimeout(r, 400 + Math.random() * 300)); addLog(msg); }
    const info = extractInfo(jd);
    const baseline = info.hardSkills.length > 0 ? Math.round((info.hardSkills.filter(s => profile.skills.some(ps => ps.toLowerCase().includes(s.toLowerCase()))).length / info.hardSkills.length) * 100) : 70;
    const optScore = Math.min(98, baseline + Math.floor(Math.random() * 12) + 8);
    const optSum = `Results-driven ${info.title} candidate with ${profile.summary.charAt(0).toLowerCase() + profile.summary.slice(1)}${info.hardSkills.length > 0 ? ` Specialized in ${info.hardSkills.slice(0, 3).join(', ')}.` : ''}`;
    const optExp = profile.experience.map(e => ({ ...e, bullets: e.bullets.map(b => b.endsWith('.') && !/\d/.test(b) ? b.replace(/\.$/, ', driving measurable results.') : b) }));
    const cover = `Dear Hiring Manager,\n\nI am writing to express my strong interest in the ${info.title} position at ${info.company}.\n\n${optSum}\n\nMy experience aligns with your requirements in ${info.hardSkills.slice(0, 4).join(', ') || 'key areas'}.\n\nI would welcome the opportunity to discuss how I can contribute to ${info.company}.\n\nSincerely,\n${profile.name}`;
    const isDup = applications.some(a => a.company.toLowerCase() === info.company.toLowerCase() && a.title.toLowerCase() === info.title.toLowerCase());
    if (isDup) { addLog('> Warning: Duplicate detected.', 'warning'); setProcessing(false); showToast('Job already in pipeline', 'warning'); return; }
    const resumeHTML = genResumeHTML(profile, { optimizedSummary: optSum, optimizedExperience: optExp });
    const coverHTML = genCoverHTML(profile, cover);
    const newApp = { id: `job-${Date.now()}`, ...info, status: 'applied', appliedDate: new Date().toISOString(), history: [{ status: 'applied', date: new Date().toISOString() }], tailoredResume: { summary: optSum, experience: optExp, skills: profile.skills, education: profile.education, html: resumeHTML }, coverLetter: cover, coverLetterHTML: coverHTML, scores: { baseline, optimized: optScore } };
    setApplications(p => [...p, newApp]);
    setScores({ baseline, optimized: optScore });
    setResult({ ...info, optimizedSummary: optSum, optimizedExperience: optExp, coverLetter: cover, resumeHTML, coverHTML });
    addLog(`> Baseline: ${baseline}%`, 'success'); addLog(`> Optimized: ${optScore}%`, 'success'); addLog('> Job added to pipeline.', 'success');
    setProcessing(false); setJd(''); showToast('Resume generated and job added', 'success');
    setTimeout(() => genPDF(resumeHTML, `${profile.name.replace(/\s+/g, '_')}_${info.company.replace(/\s+/g, '_')}_Resume`), 600);
  };
  const termH = Math.min(Math.max(logs.length * 24 + 60, 120), 320);
  return (
    <div className="optimizer">
      <div className="opt-hdr"><h2>ATS Optimizer</h2><p>Paste a job description to generate tailored documents</p></div>
      <div className="opt-grid">
        <div className="opt-input"><textarea placeholder="Paste job description here..." value={jd} onChange={e => setJd(e.target.value)} /><button className="btn-pri btn-lg" onClick={run} disabled={processing || !jd.trim()}>{processing ? <><RefreshCw size={18} className="spin" /> Processing...</> : <><Zap size={18} /> Optimize & Generate</>}</button></div>
        <div className="opt-term" ref={termRef} style={{ height: termH }}><div className="term-hdr"><Terminal size={14} /><span>Terminal</span></div><div className="term-content">{logs.length === 0 ? <div className="term-placeholder">Awaiting input...</div> : logs.map((l, i) => <div key={i} className={`log ${l.type}`}>{l.msg}</div>)}</div></div>
      </div>
      {result && (
        <div className="opt-result">
          <div className="result-hdr"><CheckCircle size={20} /><span>Optimization Complete</span></div>
          <div className="result-grid"><div className="result-card"><div className="result-lbl">Company</div><div className="result-val">{result.company}</div></div><div className="result-card"><div className="result-lbl">Position</div><div className="result-val">{result.title}</div></div><div className="result-card"><div className="result-lbl">Location</div><div className="result-val">{result.location}</div></div>{result.salaryMin && <div className="result-card"><div className="result-lbl">Salary</div><div className="result-val">${(result.salaryMin/1000).toFixed(0)}k - ${(result.salaryMax/1000).toFixed(0)}k</div></div>}</div>
          <div className="score-disp"><div className="score-item"><span className="score-lbl">Baseline</span><span className="score-val baseline">{scores.baseline}%</span></div><ArrowRight size={20} /><div className="score-item"><span className="score-lbl">Optimized</span><span className="score-val optimized">{scores.optimized}%</span></div></div>
          {result.hardSkills.length > 0 && <div className="skills-det"><div className="skills-lbl">Skills Detected</div><div className="skill-tags">{result.hardSkills.map((s, i) => <span key={i} className="skill-tag">{s}</span>)}</div></div>}
          <div className="result-actions"><button className="btn-sec" onClick={() => genPDF(result.resumeHTML, `${profile.name}_Resume`)}><Download size={16} /> Resume</button><button className="btn-sec" onClick={() => genPDF(result.coverHTML, `${profile.name}_CoverLetter`)}><Download size={16} /> Cover Letter</button></div>
        </div>
      )}
    </div>
  );
};

const DocViewer = ({ job, type, profile, onClose }) => {
  const print = () => { if (type === 'resume') genPDF(job.tailoredResume?.html || genResumeHTML(profile, job.tailoredResume), `${profile.name}_${job.company}_Resume`); else genPDF(job.coverLetterHTML || genCoverHTML(profile, job.coverLetter), `${profile.name}_${job.company}_CoverLetter`); };
  return (
    <div className="modal" onClick={onClose}><div className="modal-content" onClick={e => e.stopPropagation()}><div className="modal-hdr"><h3>{type === 'resume' ? 'Resume' : 'Cover Letter'} - {job.company}</h3><div className="modal-actions"><button className="btn-sec" onClick={print}><Printer size={16} /> Print</button><button className="btn-icon" onClick={onClose}><X size={20} /></button></div></div><div className="modal-body"><div className="doc-preview" dangerouslySetInnerHTML={{ __html: type === 'resume' ? (job.tailoredResume?.html || genResumeHTML(profile, job.tailoredResume)) : (job.coverLetterHTML || genCoverHTML(profile, job.coverLetter)) }} /></div></div></div>
  );
};

export default function PathosJobCenter() {
  const [tab, setTab] = useState('dashboard');
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [apps, setApps] = useState([]);
  const [msg, setMsg] = useState(getRandomMessage('idle'));
  const [docView, setDocView] = useState(null);
  const [toasts, setToasts] = useState([]);
  const fileRef = useRef(null);

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

  const save = () => { localStorage.setItem('pathos-profile', JSON.stringify(profile)); showToast('Profile saved', 'success'); };
  const exportData = () => { if (apps.length === 0) { showToast('No data to export', 'warning'); return; } const d = { version: '1.0', exportDate: new Date().toISOString(), profile, applications: apps }; const jsonStr = JSON.stringify(d, null, 2); const blob = new Blob([jsonStr], { type: 'application/json' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `pathos-backup-${new Date().toISOString().split('T')[0]}.json`; document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url); showToast('Backup exported', 'success'); };
  const importData = (e) => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = (ev) => { try { const d = JSON.parse(ev.target.result); if (d.profile) setProfile(d.profile); if (d.applications) setApps(d.applications); showToast('Data imported', 'success'); } catch { showToast('Invalid file format', 'error'); } }; r.readAsText(f); e.target.value = ''; };

  const tabs = [{ id: 'dashboard', label: 'Dashboard', icon: BarChart3 }, { id: 'pipeline', label: 'Pipeline', icon: Briefcase }, { id: 'profile', label: 'Resume', icon: FileText }, { id: 'optimizer', label: 'Optimizer', icon: Zap }];

  return (
    <div className="app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}.app{min-height:100vh;background:#0a0a0b;color:#e5e5e5;font-family:'Inter',sans-serif}
        .hdr{background:#111113;border-bottom:1px solid #1f1f23;padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:64px;position:sticky;top:0;z-index:100}
        .logo{display:flex;flex-direction:column;align-items:flex-start;gap:2px}.logo-text{font-size:18px;font-weight:700;color:#fff;line-height:1.2;letter-spacing:4px}.logo-tagline{font-size:9px;color:#71717a;letter-spacing:0.5px;text-transform:uppercase;font-weight:500}
        .nav{display:flex;gap:4px}.nav-btn{display:flex;align-items:center;gap:8px;padding:8px 16px;background:transparent;border:none;color:#71717a;font-family:inherit;font-size:14px;font-weight:500;cursor:pointer;border-radius:6px;transition:all 0.15s}.nav-btn:hover{background:#1f1f23;color:#a1a1aa}.nav-btn.active{background:#1f1f23;color:#fff}
        .hdr-actions{display:flex;gap:8px}.btn-ghost{display:flex;align-items:center;gap:6px;padding:8px 12px;background:transparent;border:1px solid #27272a;color:#a1a1aa;font-family:inherit;font-size:13px;font-weight:500;cursor:pointer;border-radius:6px;transition:all 0.15s}.btn-ghost:hover{background:#1f1f23;color:#fff;border-color:#3f3f46}
        .main{max-width:1200px;margin:0 auto;padding:32px 24px}
        .pathos-container{display:flex;align-items:center;gap:24px;margin-bottom:32px;padding:24px;background:#111113;border:1px solid #1f1f23;border-radius:12px}
        .pathos-eye{width:64px;height:64px;background:#18181b;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid #27272a;flex-shrink:0}
        .pathos-iris{width:32px;height:32px;background:radial-gradient(circle,#3f3f46 0%,#18181b 70%);border-radius:50%;display:flex;align-items:center;justify-content:center;transition:transform 0.15s ease-out}.pathos-iris.blink{transform:scaleY(0.1)!important}
        .pathos-pupil{width:12px;height:12px;background:#fff;border-radius:50%;box-shadow:0 0 10px #fff}
        .pathos-msg-box{flex:1}.pathos-msg{font-size:14px;color:#a1a1aa;line-height:1.5}
        .pathos-compact{display:flex;align-items:center;gap:12px;padding:12px 16px;background:#111113;border:1px solid #1f1f23;border-radius:8px;margin-bottom:24px}
        .pathos-eye-small{width:32px;height:32px;background:#18181b;border-radius:50%;display:flex;align-items:center;justify-content:center;border:1px solid #27272a;flex-shrink:0}
        .pathos-iris-small{width:16px;height:16px;background:#3f3f46;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:transform 0.15s ease-out}.pathos-iris-small.blink{transform:scaleY(0.1)!important}
        .pathos-pupil-small{width:6px;height:6px;background:#fff;border-radius:50%}.pathos-msg-compact{font-size:13px;color:#71717a}
        .card{background:#111113;border:1px solid #1f1f23;border-radius:12px;padding:20px}.card-hdr{font-size:13px;font-weight:600;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:16px}
        .metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}@media(max-width:768px){.metrics{grid-template-columns:repeat(2,1fr)}}
        .metric{background:#111113;border:1px solid #1f1f23;border-radius:12px;padding:20px}.metric-lbl{font-size:12px;font-weight:500;color:#71717a;margin-bottom:8px}.metric-row{display:flex;align-items:baseline;gap:4px}.metric-val{font-size:28px;font-weight:700;color:#fff}.metric-suf{font-size:16px;color:#52525b}.metric-sub{font-size:12px;color:#52525b;margin-top:4px}
        .prog{height:4px;background:#27272a;border-radius:2px;margin-top:12px;overflow:hidden}.prog-fill{height:100%;background:#4ade80;border-radius:2px;transition:width 0.3s}
        .dash-grid{display:grid;grid-template-columns:2fr 1fr;gap:24px}@media(max-width:900px){.dash-grid{grid-template-columns:1fr}}
        .sankey{width:100%;max-width:400px}
        .missions{display:flex;flex-direction:column;gap:8px}.mission{display:flex;align-items:center;gap:10px;padding:10px 12px;background:#18181b;border-radius:6px;font-size:13px;color:#d4d4d8}.mission-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}.mission-high .mission-dot{background:#f87171}.mission-medium .mission-dot{background:#fbbf24}
        .empty,.empty-sm{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;color:#52525b;text-align:center}.empty-sm{padding:24px}.empty svg,.empty-sm svg{margin-bottom:12px;opacity:0.5}.empty p{font-size:14px;margin-bottom:4px}.empty span{font-size:12px}
        .pipeline h2{font-size:20px;font-weight:600;color:#fff;margin-bottom:8px}.pipe-hdr{margin-bottom:20px}.pipe-stats{display:flex;gap:8px;flex-wrap:wrap}
        .badge{padding:4px 10px;border-radius:4px;font-size:12px;font-weight:500}.badge.applied{background:rgba(59,130,246,0.15);color:#60a5fa}.badge.interviewing{background:rgba(74,222,128,0.15);color:#4ade80}.badge.offer{background:rgba(167,139,250,0.15);color:#a78bfa}.badge.rejected{background:rgba(248,113,113,0.15);color:#f87171}
        .pipe-ctrl{display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap}.search-box{display:flex;align-items:center;gap:8px;padding:8px 12px;background:#18181b;border:1px solid #27272a;border-radius:6px;flex:1;min-width:200px}.search-box svg{color:#52525b}.search-box input{background:transparent;border:none;color:#fff;font-family:inherit;font-size:14px;width:100%;outline:none}.search-box input::placeholder{color:#52525b}.pipe-ctrl select{padding:8px 12px;background:#18181b;border:1px solid #27272a;border-radius:6px;color:#a1a1aa;font-family:inherit;font-size:14px;cursor:pointer}
        .job-list{display:flex;flex-direction:column;gap:12px}
        .job-card{background:#111113;border:1px solid #1f1f23;border-radius:10px;overflow:hidden;transition:border-color 0.15s}.job-card:hover{border-color:#27272a}
        .job-main{display:flex;justify-content:space-between;align-items:center;padding:16px 20px;cursor:pointer}.job-info{flex:1}.job-co{font-size:12px;font-weight:500;color:#71717a;margin-bottom:4px}.job-title{font-size:15px;font-weight:600;color:#fff;margin-bottom:6px}.job-meta{display:flex;gap:12px;font-size:12px;color:#52525b}.meta-tag{padding:2px 6px;background:#27272a;border-radius:4px;font-size:10px;color:#a1a1aa}
        .job-right{display:flex;align-items:center;gap:12px}.job-status{padding:4px 10px;border-radius:4px;font-size:11px;font-weight:600;color:#000}.job-days{font-size:12px;color:#52525b}.job-chev{color:#52525b;transition:transform 0.15s}.job-chev.exp{transform:rotate(180deg)}
        .job-exp{padding:0 20px 20px;border-top:1px solid #1f1f23}.job-sec{margin-top:16px}.job-sec-lbl{font-size:11px;font-weight:600;color:#52525b;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px}.job-sec p{font-size:13px;color:#a1a1aa;line-height:1.5}.job-notes{white-space:pre-wrap;background:#18181b;padding:8px;border-radius:6px;border:1px solid #27272a}
        .job-link a{display:inline-flex;align-items:center;gap:6px;color:#3b82f6;font-size:13px;text-decoration:none;margin-top:12px}.job-link a:hover{text-decoration:underline}
        .job-grid-details{display:grid;grid-template-columns:2fr 1fr;gap:20px}@media(max-width:600px){.job-grid-details{grid-template-columns:1fr}}
        .skill-tags{display:flex;flex-wrap:wrap;gap:6px}.skill-tag{padding:4px 8px;background:#1f1f23;border-radius:4px;font-size:11px;color:#a1a1aa}
        .job-actions{display:flex;justify-content:space-between;align-items:center;margin-top:16px;padding-top:16px;border-top:1px solid #1f1f23;flex-wrap:wrap;gap:12px}
        .status-btns{display:flex;gap:6px}.status-btn{padding:6px 10px;background:#18181b;border:1px solid #27272a;color:#71717a;font-family:inherit;font-size:11px;font-weight:500;border-radius:4px;cursor:pointer;transition:all 0.15s}.status-btn:hover{border-color:var(--sc);color:var(--sc)}.status-btn.active{background:var(--sc);color:#000;border-color:var(--sc)}
        .doc-actions{display:flex;gap:6px}.doc-btn{display:flex;align-items:center;gap:4px;padding:6px 10px;background:transparent;border:1px solid #27272a;color:#a1a1aa;font-family:inherit;font-size:11px;border-radius:4px;cursor:pointer;transition:all 0.15s}.doc-btn:hover{border-color:#3f3f46;color:#fff}.doc-btn:disabled{opacity:0.4;cursor:not-allowed;border-color:#27272a;color:#52525b}.doc-btn:disabled:hover{border-color:#27272a;color:#52525b}.del-btn{padding:6px;background:transparent;border:1px solid #27272a;color:#71717a;border-radius:4px;cursor:pointer;transition:all 0.15s}.del-btn:hover{border-color:#f87171;color:#f87171}
        .job-timeline-minimal{margin-top:20px;margin-bottom:8px;padding:4px 0;display:flex;align-items:center;justify-content:space-between}
        .mt-step{flex:1;position:relative;display:flex;flex-direction:column;align-items:center;opacity:0.6;transition:opacity 0.2s}
        .mt-step.active{opacity:1}
        .mt-dot{width:16px;height:16px;border-radius:50%;background:#27272a;border:1px solid #3f3f46;display:flex;align-items:center;justify-content:center;z-index:2;margin-bottom:6px;color:#fff}
        .mt-dot-empty{width:6px;height:6px;border-radius:50%;background:#3f3f46}
        .mt-step.active .mt-dot{background:#3b82f6;border-color:#3b82f6}
        .mt-step.rejected .mt-dot{background:#f87171;border-color:#f87171}
        .mt-content{display:flex;flex-direction:column;align-items:center}
        .mt-label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px}
        .mt-date{font-size:9px;color:#71717a;margin-top:2px}
        .mt-line{position:absolute;top:7px;left:50%;width:100%;height:1px;background:#3f3f46;z-index:-1}
        .mt-line.filled{background:#3b82f6}
        .profile-ed{max-width:900px}.profile-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:32px}.profile-hdr h2{font-size:20px;font-weight:600;color:#fff}
        .profile-sec{background:#111113;border:1px solid #1f1f23;border-radius:12px;padding:24px;margin-bottom:24px}.profile-sec h3{font-size:14px;font-weight:600;color:#fff;margin-bottom:20px}
        .form-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}@media(max-width:600px){.form-grid{grid-template-columns:1fr}}
        .form-grp{display:flex;flex-direction:column;gap:6px}.form-grp.full{grid-column:1/-1;margin-top:8px}.form-grp label{font-size:12px;font-weight:500;color:#71717a}.form-grp input,.form-grp textarea,.form-grp select{padding:10px 12px;background:#18181b;border:1px solid #27272a;border-radius:6px;color:#fff;font-family:inherit;font-size:14px;transition:border-color 0.15s}.form-grp input:focus,.form-grp textarea:focus,.form-grp select:focus{outline:none;border-color:#3f3f46}.form-grp textarea{resize:vertical;min-height:80px}
        .exp-block,.edu-block{background:#18181b;border:1px solid #27272a;border-radius:8px;padding:20px;margin-bottom:16px}.exp-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;font-size:13px;font-weight:500;color:#71717a}
        .btn-icon-danger{padding:6px;background:transparent;border:1px solid #27272a;color:#71717a;border-radius:4px;cursor:pointer}.btn-icon-danger:hover{border-color:#f87171;color:#f87171}
        .btn-add{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:12px;background:transparent;border:1px dashed #27272a;color:#71717a;font-family:inherit;font-size:13px;font-weight:500;border-radius:8px;cursor:pointer;transition:all 0.15s}.btn-add:hover{border-color:#3f3f46;color:#a1a1aa}
        .skill-row{display:flex;gap:8px;margin-bottom:16px}.skill-row input{flex:1;padding:10px 12px;background:#18181b;border:1px solid #27272a;border-radius:6px;color:#fff;font-family:inherit;font-size:14px}.skill-row input:focus{outline:none;border-color:#3f3f46}
        .skills-list{display:flex;flex-wrap:wrap;gap:8px}.skill-chip{display:flex;align-items:center;gap:6px;padding:6px 10px;background:#1f1f23;border-radius:4px;font-size:13px;color:#d4d4d8}.skill-chip button{background:transparent;border:none;color:#71717a;font-size:16px;cursor:pointer;line-height:1}.skill-chip button:hover{color:#f87171}
        .btn-pri{display:flex;align-items:center;justify-content:center;gap:8px;padding:10px 16px;background:#fff;border:none;color:#000;font-family:inherit;font-size:14px;font-weight:500;border-radius:6px;cursor:pointer;transition:all 0.15s}.btn-pri:hover{background:#e5e5e5}.btn-pri:disabled{opacity:0.5;cursor:not-allowed}.btn-lg{padding:14px 24px;font-size:15px}
        .btn-sec{display:flex;align-items:center;gap:6px;padding:10px 16px;background:transparent;border:1px solid #27272a;color:#a1a1aa;font-family:inherit;font-size:13px;font-weight:500;border-radius:6px;cursor:pointer;transition:all 0.15s}.btn-sec:hover{border-color:#3f3f46;color:#fff}
        .btn-icon{padding:8px;background:transparent;border:none;color:#71717a;cursor:pointer;border-radius:4px}.btn-icon:hover{color:#fff;background:#1f1f23}
        .optimizer h2{font-size:20px;font-weight:600;color:#fff;margin-bottom:4px}.opt-hdr{margin-bottom:24px}.opt-hdr p{font-size:14px;color:#71717a}
        .opt-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px}@media(max-width:800px){.opt-grid{grid-template-columns:1fr}}
        .opt-input{display:flex;flex-direction:column;gap:16px}.opt-input textarea{width:100%;height:280px;padding:16px;background:#111113;border:1px solid #1f1f23;border-radius:10px;color:#d4d4d8;font-family:inherit;font-size:13px;line-height:1.5;resize:none}.opt-input textarea:focus{outline:none;border-color:#27272a}.opt-input textarea::placeholder{color:#52525b}
        .review-form{display:flex;flex-direction:column;gap:12px;background:#111113;border:1px solid #1f1f23;border-radius:10px;padding:20px}
        .review-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
        .review-hdr h3{font-size:16px;font-weight:600;color:#fff}
        .opt-term{background:#111113;border:1px solid #1f1f23;border-radius:10px;overflow:hidden;display:flex;flex-direction:column;transition:height 0.3s ease}.term-hdr{display:flex;align-items:center;gap:8px;padding:12px 16px;background:#18181b;border-bottom:1px solid #1f1f23;color:#71717a;font-size:12px;font-weight:500}.term-content{flex:1;padding:16px;overflow-y:auto;font-family:'SF Mono','Consolas',monospace;font-size:12px}.term-placeholder{color:#3f3f46}.log{margin-bottom:4px;color:#71717a}.log.success{color:#4ade80}.log.warning{color:#fbbf24}
        .spin{animation:spin 1s linear infinite}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .opt-result{background:#111113;border:1px solid #1f1f23;border-radius:12px;padding:24px}.result-hdr{display:flex;align-items:center;gap:10px;color:#4ade80;font-size:15px;font-weight:600;margin-bottom:20px}
        .result-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:16px;margin-bottom:20px}.result-card{padding:12px 16px;background:#18181b;border-radius:8px}.result-lbl{font-size:11px;font-weight:500;color:#52525b;text-transform:uppercase;margin-bottom:4px}.result-val{font-size:14px;font-weight:500;color:#fff}
        .score-disp{display:flex;align-items:center;justify-content:center;gap:24px;padding:20px;background:#18181b;border-radius:8px;margin-bottom:20px}.score-item{text-align:center}.score-lbl{display:block;font-size:11px;color:#52525b;text-transform:uppercase;margin-bottom:4px}.score-val{font-size:28px;font-weight:700}.score-val.baseline{color:#71717a}.score-val.optimized{color:#4ade80}.score-disp svg{color:#3f3f46}
        .skills-det{margin-bottom:20px}.skills-lbl{font-size:11px;font-weight:500;color:#52525b;text-transform:uppercase;margin-bottom:8px}.result-actions{display:flex;gap:12px;flex-wrap:wrap}
        .modal{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:1000;padding:24px}.modal-content{background:#111113;border:1px solid #1f1f23;border-radius:12px;width:100%;max-width:800px;max-height:90vh;display:flex;flex-direction:column;overflow:hidden}.modal-hdr{display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid #1f1f23}.modal-hdr h3{font-size:15px;font-weight:600;color:#fff}.modal-actions{display:flex;gap:8px}.modal-body{flex:1;overflow-y:auto;padding:24px}.doc-preview{background:#fff;color:#000;padding:40px;border-radius:8px;font-family:'Times New Roman',serif;font-size:10pt;line-height:1.4}
        .toast-container{position:fixed;bottom:24px;right:24px;display:flex;flex-direction:column;gap:8px;z-index:1100}.toast{display:flex;align-items:center;gap:10px;padding:12px 16px;background:#1f1f23;border:1px solid #27272a;border-radius:8px;color:#d4d4d8;font-size:13px;box-shadow:0 4px 12px rgba(0,0,0,0.3);animation:slideIn 0.2s ease}@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}.toast-success{border-left:3px solid #4ade80}.toast-success svg{color:#4ade80}.toast-error{border-left:3px solid #f87171}.toast-error svg{color:#f87171}.toast-warning{border-left:3px solid #fbbf24}.toast-warning svg{color:#fbbf24}.toast-info{border-left:3px solid #60a5fa}.toast-info svg{color:#60a5fa}.toast button{background:transparent;border:none;color:#52525b;cursor:pointer;padding:2px}.toast button:hover{color:#a1a1aa}
      `}</style>
      <header className="hdr">
        <div className="logo">
          <span className="logo-text">P.A.T.H.O.S.</span>
          <span className="logo-tagline">Personal Automated Tracking & Hiring Optimization System</span>
        </div>
        <nav className="nav">{tabs.map(t => <button key={t.id} className={`nav-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}><t.icon size={16} />{t.label}</button>)}</nav>
        <div className="hdr-actions"><button className="btn-ghost" onClick={() => fileRef.current?.click()}><Upload size={14} /> Import</button><button className="btn-ghost" onClick={exportData}><Download size={14} /> Export</button><input ref={fileRef} type="file" accept=".json" onChange={importData} style={{ display: 'none' }} /></div>
      </header>

      <main className="main">
        {tab === 'dashboard' && <><PathosEye message={msg} /><MetricsPanel applications={apps} /><div className="dash-grid"><SankeyDiagram applications={apps} /><DailyMissions applications={apps} /></div></>}
        {tab === 'pipeline' && <><PathosEye message={msg} compact /><PipelineTracker applications={apps} setApplications={setApps} onViewResume={j => setDocView({ job: j, type: 'resume' })} onViewCover={j => setDocView({ job: j, type: 'cover' })} /></>}
        {tab === 'profile' && <><PathosEye message={msg} compact /><ProfileEditor profile={profile} setProfile={setProfile} onSave={save} /></>}
        {tab === 'optimizer' && <><PathosEye message={msg} compact /><ATSOptimizer profile={profile} applications={apps} setApplications={setApps} showToast={showToast} /></>}
      </main>

      {docView && <DocViewer job={docView.job} type={docView.type} profile={profile} onClose={() => setDocView(null)} />}
      <div className="toast-container">{toasts.map(t => <Toast key={t.id} message={t.message} type={t.type} onClose={() => remToast(t.id)} />)}</div>
    </div>
  );
}