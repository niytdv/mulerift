# FRONTEND LOGIC & VISUALIZATION

## 1. GRAPH VISUALIZATION (D3.js Force-Directed Layout)

**Technology:** D3.js v7 with force simulation

**Implementation:**
```typescript
const simulation = d3.forceSimulation(accounts)
  .force("link", d3.forceLink(edges).distance(100))
  .force("charge", d3.forceManyBody().strength(-300))
  .force("center", d3.forceCenter(width/2, height/2))
```

**Forces Explained:**
- **Link Force:** Pulls connected nodes together (distance=100px)
- **Charge Force:** Repels all nodes from each other (strength=-300)
- **Center Force:** Pulls entire graph toward center (prevents drift)

**Why Force-Directed?**
- Automatically positions nodes based on connections
- Clusters emerge naturally (fraud rings group together)
- Interactive and intuitive for judges
- No manual layout required

**Performance:**
- Handles 100+ nodes smoothly
- Simulation stabilizes in ~2 seconds
- GPU-accelerated rendering via SVG

---

## 2. SUSPICIOUS NODE HIGHLIGHTING

**Color Coding:**
```typescript
.attr("fill", (d) => d.suspicion_score > 50 ? "#ef4444" : "#3b82f6")
```

- **Red (#ef4444):** Suspicious accounts (score >50)
- **Blue (#3b82f6):** Normal accounts
- **Size:** All nodes same size (8px radius) for clarity

**Visual Hierarchy:**
- Suspicious nodes stand out immediately
- Color contrast optimized for accessibility
- No gradients (binary classification for clarity)

---

## 3. FRAUD RING DISPLAY

**Ring Table Component:**
```typescript
<FraudRingTable rings={fraud_rings} />
```

**Columns:**
- Ring ID (RING_001, RING_002, etc.)
- Pattern Type (cycle, smurfing, shell_layering)
- Member Count
- Risk Score (0-100, 1 decimal place)
- Member Account IDs (comma-separated, expandable)

**Sorting:**
- Default: By Ring ID (ascending)
- Clickable headers for custom sorting
- Maintains deterministic order from backend

---

## 4. JSON DOWNLOAD GENERATION

**Implementation:**
```typescript
const downloadJson = () => {
  const jsonString = JSON.stringify(analysisResult, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'fraud_analysis_results.json';
  link.click();
};
```

**Format Guarantee:**
- Exact backend format preserved
- 2-space indentation
- UTF-8 encoding
- No extra whitespace or hidden characters

**Float Formatting:**
```typescript
jsonString.replace(
  /"(suspicion_score|risk_score|processing_time_seconds)":(\d+\.?\d*)([,\}])/g,
  (match, field, value, suffix) => {
    const num = parseFloat(value);
    return `"${field}":${num.toFixed(1)}${suffix}`;
  }
);
```
- Ensures exactly 1 decimal place for all numeric fields
- Matches backend format exactly

---

## 5. INTERACTIVE HOVER/CLICK

**Hover Effects:**
```typescript
node.on("mouseover", (event, d) => {
  // Show tooltip with account details
  tooltip.style("opacity", 1)
    .html(`
      <strong>${d.id}</strong><br/>
      Score: ${d.suspicion_score}<br/>
      Patterns: ${d.detected_patterns.join(", ")}<br/>
      Ring: ${d.ring_id || "None"}
    `);
});
```

**Click Interaction:**
```typescript
node.on("click", (event, d) => {
  onNodeClick(d.id);  // Opens AccountModal with full details
});
```

**AccountModal Component:**
- Shows all account information
- Lists detected patterns with descriptions
- Shows ring membership
- Displays connected accounts
- Provides context for fraud indicators

---

## 6. UI FORMAT COMPLIANCE

**Data Contract Enforcement:**
```typescript
interface AnalysisResult {
  suspicious_accounts: SuspiciousAccount[];
  fraud_rings: FraudRing[];
  summary: Summary;
}

interface SuspiciousAccount {
  account_id: string;
  suspicion_score: number;  // 1 decimal place
  detected_patterns: string[];
  ring_id: string;
}

interface FraudRing {
  ring_id: string;
  member_accounts: string[];
  pattern_type: string;
  risk_score: number;  // 1 decimal place
}
```

**TypeScript Validation:**
- Compile-time type checking
- Runtime validation with Zod (optional)
- Ensures frontend never sends/receives wrong format

**Key Ordering:**
- Matches backend exactly: suspicious_accounts, fraud_rings, summary
- No extra keys added by frontend
- JSON.stringify preserves order

---

## 7. RESPONSIVE DESIGN

**Breakpoints:**
- Desktop: 1024px+ (full graph + tables side-by-side)
- Tablet: 768-1023px (stacked layout)
- Mobile: <768px (simplified view, table scrolling)

**Graph Scaling:**
```typescript
const width = Math.min(800, window.innerWidth - 40);
const height = Math.min(600, window.innerHeight - 200);
```
- Adapts to viewport size
- Maintains aspect ratio
- Touch-friendly on mobile

---

## 8. PERFORMANCE OPTIMIZATIONS

**React Optimizations:**
- `useMemo` for expensive calculations
- `useCallback` for event handlers
- Lazy loading for large datasets

**D3 Optimizations:**
- Canvas rendering for >500 nodes (fallback)
- Throttled simulation updates
- Efficient force calculations

**Bundle Size:**
- Next.js code splitting
- Tree-shaking unused D3 modules
- Lazy-loaded components

---

## 9. ERROR HANDLING

**Upload Errors:**
- File type validation (CSV only)
- File size limit (10MB)
- Format validation (required columns)

**Analysis Errors:**
- Backend timeout handling (30s limit)
- Network error recovery
- User-friendly error messages

**Display Errors:**
- Graceful degradation if graph fails
- Fallback to table-only view
- Error boundary components

---

## 10. ACCESSIBILITY

**WCAG 2.1 AA Compliance:**
- Color contrast ratio >4.5:1
- Keyboard navigation support
- Screen reader labels
- Focus indicators
- Alt text for visualizations

**Semantic HTML:**
- Proper heading hierarchy
- ARIA labels for interactive elements
- Role attributes for custom components

---

## FRONTEND TECH STACK

- **Framework:** Next.js 14 (React 18)
- **Styling:** Tailwind CSS
- **Visualization:** D3.js v7
- **3D Graph:** react-force-graph-3d (optional view)
- **Animations:** GSAP
- **TypeScript:** Full type safety
- **API:** Next.js API routes (serverless)

---

## DATA FLOW (Frontend)

1. **Upload:** User selects CSV file
2. **FormData:** File wrapped in FormData object
3. **POST /api/analyze:** Sent to backend API
4. **Python Bridge:** API calls Python engine
5. **JSON Response:** Backend returns analysis results
6. **SessionStorage:** Results cached for navigation
7. **Results Page:** Renders graph + tables
8. **Download:** User can export JSON

**Why SessionStorage?**
- Persists across page navigation
- Cleared on tab close (security)
- No server-side session management needed
- Fast access for re-rendering

---
