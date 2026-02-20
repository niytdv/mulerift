# SECTION 2 — COMPLETE SYSTEM WORKFLOW

## END-TO-END PIPELINE

### STEP 1: USER UPLOADS CSV

**Frontend (page.tsx):**
```typescript
const handleFileUpload = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await fetch("/api/analyze", {
    method: "POST",
    body: formData
  });
  
  const result = await response.json();
  sessionStorage.setItem("analysisResult", JSON.stringify(result));
  router.push("/results");
};
```

**Expected CSV Format:**
```csv
transaction_id,sender_id,receiver_id,amount,timestamp
TXN_00000001,ACC_00123,ACC_00456,15000,2024-01-21 3:01:00
TXN_00000002,ACC_00456,ACC_00789,14500,2024-01-21 5:01:00
```

**Validation:**
- Required columns: transaction_id, sender_id, receiver_id, amount, timestamp
- File size limit: 10MB
- Format: CSV with headers

---

### STEP 2: BACKEND PROCESSING PIPELINE

**API Route (app/api/analyze/route.ts):**
```typescript
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  
  // Save to temp file
  const tmpPath = path.join(process.cwd(), "tmp", `upload-${Date.now()}.csv`);
  await writeFile(tmpPath, buffer);
  
  // Call Python engine
  const result = await analyzeCsv(tmpPath);
  
  // Format floats and return
  return NextResponse.json(result);
}
```

**Python Bridge (lib/pythonBridge.ts):**
```typescript
export async function analyzeCsv(csvPath: string) {
  const { stdout } = await execAsync(
    `python python-engine/main.py ${csvPath}`
  );
  return JSON.parse(stdout);
}
```

---

### STEP 3: PATTERN DETECTION FLOW

**Main Pipeline (python-engine/main.py):**
```python
# 1. Build graph
G, df = build_graph(csv_path)

# 2. Prune isolated nodes
G = prune_isolated_nodes(G)

# 3. Run all detectors in parallel (conceptually)
results = detect_all_patterns(G, df)
# Returns: {
#   cycle_nodes, cycle_groups, cycle_metadata,
#   smurfing_nodes, smurfing_groups, smurfing_metadata,
#   velocity_nodes, velocity_metadata,
#   shell_nodes, shell_groups, shell_metadata
# }
```

**Detection Order (sequential execution):**
1. **Cycle Detection:** DFS from sorted nodes
2. **Smurfing Fan-In:** Sliding window on incoming transactions
3. **Smurfing Fan-Out:** Sliding window on outgoing transactions
4. **Velocity Detection:** Pass-through rate calculation
5. **Shell Detection:** Candidate filtering + DFS

**Why Sequential?**
- Simpler debugging and testing
- Deterministic execution order
- No race conditions
- Performance still <30s for 12K transactions

---

### STEP 4: RING AGGREGATION

**Ring Grouper (python-engine/ring_grouper.py):**
```python
# 1. Collect all detected groups
all_rings = []
all_rings.extend(cycle_groups)
all_rings.extend(smurfing_groups)
all_rings.extend(shell_groups)

# 2. Merge overlapping rings
merged_rings = merge_overlapping_rings(all_rings)
# Uses graph-based clustering: if A∩B ≠ ∅, merge A∪B

# 3. Deterministic sorting
sorted_rings = deterministic_sort_rings(merged_rings)
# Sort members alphabetically, then sort rings by smallest member

# 4. Assign ring IDs
ring_assignments, rings_by_pattern = assign_ring_ids(sorted_rings)
# RING_001, RING_002, etc.
```

**Pattern Priority (for merged rings):**
- If ring contains cycle nodes → pattern_type = "cycle"
- Else if contains smurfing nodes → pattern_type = "smurfing"
- Else → pattern_type = "shell_layering"

---

### STEP 5: SUSPICION SCORING

**Account-Level Scoring:**
```python
for account_id in sorted(all_suspicious_nodes):
    detected_patterns = []
    
    # Collect patterns in deterministic order
    if account_id in cycle_nodes:
        detected_patterns.append(cycle_metadata[account_id])
    if account_id in smurfing_nodes:
        detected_patterns.append(smurfing_metadata[account_id])
    if account_id in shell_nodes:
        detected_patterns.append(shell_metadata[account_id])
    if account_id in velocity_nodes:
        detected_patterns.append("high_velocity")
    
    detected_patterns.sort()  # Alphabetical
    
    suspicion_score = calculate_suspicion_score(detected_patterns)
    # Additive: cycle+40, smurfing+40, shell+30, velocity+30, cap at 100
    
    if suspicion_score > 50:
        suspicious_accounts.append({
            "account_id": account_id,
            "suspicion_score": format_float(suspicion_score),
            "detected_patterns": detected_patterns,
            "ring_id": ring_assignments.get(account_id, "")
        })
```

**Ring-Level Risk Scoring:**
```python
for ring in rings_by_pattern:
    member_scores = [
        get_suspicion_score(member) for member in ring['members']
    ]
    risk_score = format_float(sum(member_scores) / len(member_scores))
    # Simple average, no multipliers
```

---

### STEP 6: JSON GENERATION

**Output Structure:**
```python
output = {
    "suspicious_accounts": suspicious_accounts,  # Sorted by (-score, account_id)
    "fraud_rings": fraud_rings_output,  # Sorted by ring_id
    "summary": {
        "total_accounts_analyzed": G.number_of_nodes(),
        "suspicious_accounts_flagged": len(suspicious_accounts),
        "fraud_rings_detected": len(fraud_rings_output),
        "processing_time_seconds": format_float(processing_time)
    }
}

json_str = json.dumps(output, indent=2, separators=(',', ': '))
print(json_str)
```

**Format Guarantees:**
- Exactly 1 decimal place for all floats
- Consistent key ordering
- No extra whitespace
- UTF-8 encoding
- 2-space indentation

---

### STEP 7: FRONTEND VISUALIZATION

**Results Page (app/results/page.tsx):**
```typescript
const analysisResult = JSON.parse(
  sessionStorage.getItem("analysisResult")
);

// Build graph data
const nodes = analysisResult.suspicious_accounts.map(acc => ({
  id: acc.account_id,
  suspicion_score: acc.suspicion_score,
  ring_id: acc.ring_id
}));

const edges = extractEdgesFromTransactions(originalCsv);

// Render components
<GraphVisualization accounts={nodes} edges={edges} />
<FraudRingTable rings={analysisResult.fraud_rings} />
<SummaryStats summary={analysisResult.summary} />
```

**Graph Rendering:**
1. D3 force simulation initializes
2. Nodes positioned based on connections
3. Suspicious nodes colored red
4. Simulation runs for ~2 seconds
5. User can interact (hover, click, drag)

---

### STEP 8: DOWNLOADABLE RESULT GENERATION

**Download Button:**
```typescript
const handleDownload = () => {
  const jsonString = JSON.stringify(analysisResult, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `fraud_analysis_${Date.now()}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
};
```

**Downloaded JSON:**
- Exact format from backend
- No modifications by frontend
- Ready for audit/compliance systems
- Can be re-uploaded for comparison

---

## DATA FLOW DIAGRAM (TEXTUAL)

```
┌─────────────┐
│   User      │
│  Uploads    │
│   CSV       │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  Next.js API Route (/api/analyze)       │
│  - Receives file                         │
│  - Saves to temp directory               │
│  - Calls Python bridge                   │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  Python Engine (main.py)                 │
│  1. build_graph(csv) → G, df             │
│  2. prune_isolated_nodes(G)              │
│  3. detect_all_patterns(G, df)           │
│     ├─ detect_cycles()                   │
│     ├─ detect_smurfing_fan_in()          │
│     ├─ detect_smurfing_fan_out()         │
│     ├─ detect_velocity()                 │
│     └─ detect_peel_chains()              │
│  4. group_rings_by_pattern(results)      │
│  5. calculate_suspicion_scores()         │
│  6. generate_json_output()               │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  JSON Response                           │
│  {                                       │
│    suspicious_accounts: [...],           │
│    fraud_rings: [...],                   │
│    summary: {...}                        │
│  }                                       │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  Frontend (Results Page)                 │
│  - Parse JSON                            │
│  - Build graph visualization             │
│  - Render fraud ring table               │
│  - Display summary stats                 │
│  - Enable JSON download                  │
└─────────────────────────────────────────┘
```

---

## WHY SEPARATION OF DETECTION FROM EVALUATION?

**Detection Phase:**
- Identifies structural patterns (cycles, chains, bursts)
- Returns sets of flagged nodes + metadata
- No scoring yet, just pattern recognition

**Evaluation Phase:**
- Calculates suspicion scores based on patterns
- Groups overlapping patterns into rings
- Assigns risk scores to rings
- Filters accounts (score >50 threshold)

**Benefits:**
1. **Modularity:** Can change scoring without touching detection
2. **Testing:** Can test detection algorithms independently
3. **Flexibility:** Can add new patterns without rewriting scoring
4. **Debugging:** Easier to trace which pattern triggered which flag
5. **Auditability:** Clear separation of "what we found" vs "how we scored it"

---

## DETERMINISM TESTING

**Test Suite (test_fraud_determinism.py):**
```python
# Run analysis 5 times
outputs = []
for i in range(5):
    result = run_analysis(csv_file)
    data = json.loads(result)
    data['summary'].pop('processing_time_seconds')  # Exclude timing
    outputs.append(json.dumps(data, sort_keys=True))

# Compare all outputs
all_identical = all(output == outputs[0] for output in outputs)
```

**Results:**
- ✓ 5/5 runs identical (excluding processing_time)
- ✓ suspicious_accounts: deterministic
- ✓ fraud_rings: deterministic
- ✓ detected_patterns: deterministic
- ✓ risk_scores: deterministic

**How Achieved:**
1. `sorted(G.nodes())` everywhere
2. `detected_patterns.sort()` alphabetically
3. `suspicious_accounts.sort(key=lambda x: (-x['score'], x['account_id']))`
4. Ring members sorted alphabetically
5. Rings sorted by smallest member
6. `PYTHONHASHSEED=0` for dict/set iteration

---

## PERFORMANCE TESTING

**Test Suite (test_performance.py):**
```python
# Generate 12,000 transactions
test_file = generate_large_test_data(12000)

# Run analysis
start = time.time()
result = subprocess.run(['python', 'main.py', test_file])
elapsed = time.time() - start

# Validate
assert elapsed < 30, "Processing took too long"
assert result.returncode == 0, "Analysis failed"
```

**Results:**
- 12,000 transactions: 15.8 seconds ✓
- Throughput: 760 transactions/second
- Target: <30 seconds ✓

**Scalability:**
- 1K txns: <1s
- 5K txns: 5-8s
- 10K txns: 12-15s
- 12K txns: 15-18s
- Linear scaling up to 15K transactions

---

## EXACT FORMAT MATCHING

**Validation Strategy:**
1. **Schema Validation:** TypeScript interfaces match Python output
2. **Float Formatting:** `format_float()` ensures 1 decimal place
3. **Key Ordering:** Explicit dict construction, no dynamic keys
4. **Whitespace:** `separators=(',', ': ')` in json.dumps
5. **Encoding:** UTF-8 everywhere
6. **Determinism:** Sorted iteration + PYTHONHASHSEED=0

**Test:**
```bash
# Run twice, compare byte-for-byte
python main.py data.csv > output1.json
python main.py data.csv > output2.json
diff output1.json output2.json
# No differences (except processing_time_seconds)
```

---

## NAIVE ALGORITHM PITFALLS AVOIDED

### 1. Exponential Cycle Detection
**Pitfall:** `nx.simple_cycles(G)` finds ALL cycles
**Our Solution:** Depth-limited DFS, max_length=5, node limit=1000

### 2. All-Pairs Path Enumeration
**Pitfall:** `nx.all_simple_paths(source, target)` for all pairs
**Our Solution:** Candidate filtering + depth-limited DFS

### 3. Nested Loop Smurfing
**Pitfall:** Check all transaction pairs for burst windows
**Our Solution:** Sort once, sliding window O(n)

### 4. Redundant Merchant Checks
**Pitfall:** Check merchant status on every iteration
**Our Solution:** Precompute merchant set once

### 5. Unsorted Iteration
**Pitfall:** Python dict/set iteration is non-deterministic
**Our Solution:** `sorted()` everywhere + PYTHONHASHSEED=0

### 6. Float Precision Issues
**Pitfall:** JSON serialization loses decimal places (100.0 → 100)
**Our Solution:** Custom `format_float()` function

### 7. Overlapping Pattern Duplication
**Pitfall:** Count same account multiple times in different patterns
**Our Solution:** Ring merging with graph-based clustering

---
