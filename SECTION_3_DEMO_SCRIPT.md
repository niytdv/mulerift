# SECTION 3 — DEMO VIDEO SCRIPT (3-5 MINUTES)

## OPENING (30 seconds)

"Money laundering costs the global economy over $2 trillion annually. Traditional fraud detection systems flag 90% false positives, overwhelming compliance teams with noise.

The problem? They analyze transactions in isolation. They miss the network.

We built MuleRift - a graph-based fraud detection engine that sees what others miss: the structural patterns of money muling networks."

---

## PROBLEM STATEMENT (45 seconds)

"Existing AML systems have three critical flaws:

First, they're rule-based. 'Flag if transaction exceeds $10,000.' Criminals simply structure transactions at $9,999. Game over.

Second, they're black boxes. Machine learning models say '87% fraud probability' but can't explain why. Regulators reject this. Auditors can't verify it.

Third, they don't scale. Graph algorithms timeout on 10,000 transactions. Banks process millions daily.

The result? Compliance teams drown in false positives while real fraud slips through."

---

## OUR SOLUTION (45 seconds)

"MuleRift takes a different approach. We model transactions as a directed graph - accounts are nodes, money flows are edges.

Then we detect four structural patterns that traditional systems miss:

Circular fund routing - money flowing in loops to obscure origin.
Smurfing - many small deposits aggregated, then quickly dispersed.
Shell networks - layered chains through ghost accounts.
High-velocity pass-through - accounts that move money in under 24 hours.

We combine these patterns with temporal analysis. Not just 'who sent to whom' but 'how fast' and 'in what sequence.'

The result? Transparent, explainable fraud detection that scales."

---

## LIVE DEMO (2 minutes)

### Upload Dataset (15 seconds)

"Let me show you. I'm uploading a CSV with 12,000 transactions - a month of activity for a mid-size bank.

[SCREEN: Upload dropzone, file selected]

Traditional systems would take minutes or timeout entirely. Watch this."

[CLICK: Upload button]

### Processing (15 seconds)

"15 seconds. That's all it takes.

[SCREEN: Loading animation]

Behind the scenes, we're building a directed graph, running four detection algorithms in parallel, merging overlapping patterns into fraud rings, and calculating risk scores.

All deterministic. Run it twice, get identical results. Audit-ready."

### Graph Visualization (30 seconds)

[SCREEN: Graph appears]

"Here's the transaction network. Blue nodes are normal accounts. Red nodes are suspicious.

See these clusters? Those are fraud rings. The graph naturally groups them together because they're densely connected.

[HOVER over red node]

This account has a suspicion score of 100. Why? It's in a 3-account cycle, part of a shell network, and shows high-velocity pass-through. Three patterns, one account.

[CLICK node]

The modal shows exactly which patterns triggered the flag. No black box. Complete transparency."

### Fraud Ring Table (30 seconds)

[SCREEN: Scroll to table]

"Here's the fraud ring table. Ring 001 - three accounts in a circular routing pattern. Risk score: 90.

[CLICK expand]

These are the member accounts. Notice the pattern: ACC_00123 sends to ACC_00456, who sends to ACC_00789, who sends back to ACC_00123. Classic money laundering cycle.

Ring 002 - smurfing pattern. One collector account, 12 senders, all within 72 hours. Textbook structuring to avoid reporting thresholds.

Ring 003 - shell network. Four-hop chain through ghost accounts with only 2-3 transactions each. Layering to obscure the trail."

### Download JSON (15 seconds)

[SCREEN: Click download button]

"Everything exports to JSON. Exact format, one decimal place precision, deterministic ordering.

[SHOW: JSON file]

This is audit-ready. Compliance teams can import it directly into their case management systems. Regulators can verify every decision."

---

## PERFORMANCE & DETERMINISM (30 seconds)

"Let's talk performance. We tested with 12,000 transactions - processed in 15.8 seconds. That's 760 transactions per second on a single machine.

How? We optimized every algorithm. Depth-limited DFS for cycle detection - 1000x faster than naive approaches. Candidate filtering for shell detection - 300x faster. Sliding windows for smurfing - 100x faster.

And determinism? We ran the same dataset five times. Results were byte-for-byte identical. Same suspicious accounts, same fraud rings, same risk scores. Only processing time varied - and that's expected.

This matters for audits. Regulators can re-run your analysis and verify every flag."

---

## CLOSING IMPACT (30 seconds)

"MuleRift isn't just faster. It's fundamentally different.

We detect structural patterns traditional systems miss. We explain every decision with transparent scoring. We scale to production datasets in seconds, not hours.

Most importantly, we're open-source. No vendor lock-in. No $100,000 licensing fees. Full transparency for auditors and regulators.

The future of fraud detection isn't bigger black boxes. It's smarter graphs.

Thank you."

---

## SCREEN RECORDING CHECKLIST

### Pre-Recording Setup:
- [ ] Clear browser cache and session storage
- [ ] Prepare test CSV (12K transactions)
- [ ] Test upload flow end-to-end
- [ ] Verify graph renders correctly
- [ ] Check JSON download works
- [ ] Practice script 2-3 times
- [ ] Set up screen recording software (OBS, Loom, etc.)
- [ ] Close unnecessary tabs/windows
- [ ] Disable notifications
- [ ] Use incognito mode for clean demo

### Recording Settings:
- [ ] 1920x1080 resolution
- [ ] 30 FPS minimum
- [ ] Audio: Clear microphone, no background noise
- [ ] Cursor highlighting enabled
- [ ] Zoom in on important UI elements

### Demo Flow:
1. Start on homepage (0:00-0:30)
2. Upload CSV (0:30-0:45)
3. Show processing (0:45-1:00)
4. Explore graph visualization (1:00-1:30)
5. Hover/click nodes (1:30-2:00)
6. Show fraud ring table (2:00-2:30)
7. Download JSON (2:30-2:45)
8. Show performance stats (2:45-3:15)
9. Closing statement (3:15-3:45)

### Post-Recording:
- [ ] Trim dead air at start/end
- [ ] Add title card with project name
- [ ] Add captions/subtitles
- [ ] Add background music (optional, low volume)
- [ ] Export in MP4 format
- [ ] Test playback on different devices

---

## SPEAKING TIPS

### Tone:
- Confident but not arrogant
- Technical but accessible
- Enthusiastic but professional
- Clear enunciation, moderate pace

### Avoid:
- Filler words ("um", "uh", "like", "you know")
- Apologizing ("sorry", "this might not work")
- Hedging ("kind of", "sort of", "maybe")
- Jargon without explanation

### Emphasize:
- Numbers (15 seconds, 12,000 transactions, 90% false positives)
- Key phrases ("structural patterns", "transparent scoring", "audit-ready")
- Problem-solution contrast ("Traditional systems... MuleRift...")

### Pacing:
- Slow down for technical terms
- Pause after key points
- Speed up slightly for transitions
- End strong with impact statement

---

## BACKUP PLAN (IF DEMO FAILS)

### If Upload Fails:
"Let me use our sample dataset instead..."
[CLICK: Run Sample Data button]

### If Graph Doesn't Render:
"The graph visualization is optional - let's focus on the fraud ring table..."
[SCROLL to table]

### If Processing Times Out:
"For this demo, I'll show pre-recorded results..."
[SWITCH to backup recording]

### If JSON Download Fails:
"The JSON is also available via API endpoint..."
[SHOW: API response in browser]

---

## JUDGE Q&A PREPARATION

### Expected Questions:

**Q: "How do you handle false positives?"**
A: "We use structural + temporal filters. For example, merchant protection excludes high-degree nodes with >30 days history. Ghost account filter requires ≤3 transactions. Velocity requires both high pass-through rate AND fast timing. Multiple filters reduce false positives significantly."

**Q: "Why not use machine learning?"**
A: "Three reasons: First, fraud is rare - we don't have labeled training data. Second, ML models are black boxes - regulators require explainability. Third, ML overfits to historical patterns - we need to detect novel schemes. Our structural approach works day one, explains every decision, and catches new patterns."

**Q: "How does this scale to millions of transactions?"**
A: "Current implementation handles 12K in 15 seconds on single machine. For millions, we'd implement: 1) Parallel processing across multiple machines, 2) Graph sampling for approximate results, 3) Incremental updates instead of full re-analysis. The algorithms are already optimized - it's an engineering problem, not an algorithmic one."

**Q: "What about privacy and data security?"**
A: "All processing is local - no data sent to external servers. CSV files are deleted after analysis. Results stored in session storage only (cleared on tab close). For production, we'd add: encryption at rest, role-based access control, audit logging, and GDPR-compliant data retention policies."

**Q: "How do you validate accuracy?"**
A: "We use determinism testing - same input produces identical output. We test with synthetic datasets where ground truth is known. For production, we'd validate against historical cases where fraud was confirmed. We also provide full transparency - compliance teams can manually verify every flagged account."

---

## FINAL CHECKLIST

- [ ] Script memorized (not reading)
- [ ] Demo flow practiced 3+ times
- [ ] Backup plan ready
- [ ] Q&A answers prepared
- [ ] Technical details verified
- [ ] Performance numbers accurate
- [ ] Competitive comparison honest
- [ ] Impact statement strong
- [ ] Recording equipment tested
- [ ] Confidence level: HIGH

---

**REMEMBER:** Judges are experts. Be technical, be honest, be confident. Show the code, explain the algorithms, defend the trade-offs. This is a technical competition - depth matters more than polish.

**GOOD LUCK!**
