# Debugging Guide: Data Flow and Error Tracing

> **📁 IMPORTANT FOR LLMs**: Always output your debug findings to a `.md` file in the ROOT directory of the project/codebase you're investigating. This keeps the debug report with the relevant code.

## Purpose
This guide helps trace the flow of data, function calls, and dependencies that lead to errors through systematic investigation.

## Core Questions to Ask
- **What depends on what?**
- **What gets called or passed first?**
- **Where might the logic break down or data be corrupted?**

## Available Tools
- Code snippets analysis
- Stack trace examination
- Log file investigation
- Dependency mapping
- Function call tracing

*Note: Provide specific code snippets, stack traces, or logs as needed to narrow down issues.*

## Primary Debugging Strategy: Layered Trace Method (LTM)

### 🎯 1. Reproduce the Issue
- **Goal**: Achieve reliable error triggering
- **Action**: If you can't reproduce consistently, fix this first
- **Rationale**: Unreproducible bugs are nearly impossible to trace effectively

### 🧭 2. Identify the Symptom Layer
- **Goal**: Locate where the error manifests
- **Check**: UI, Console, Network, API, or Logic layer
- **Action**: Mark this as your anchor point for investigation

### 🧵 3. Trace Upstream
**Key Questions:**
- What called this failing component?
- What input/data/context entered this layer?
- What was the state before the failure?

**Methods:**
- Analyze stack traces
- Review logs
- Use AI-assisted code walkthrough
- Follow the call chain backwards

### 🔨 4. Trace Downstream (if needed)
**Key Questions:**
- What does this code attempt after the failing point?
- Are there misassumptions about expected output?
- What should happen next in the flow?

**Focus**: Sometimes bugs stem from incorrect assumptions about output rather than input issues.

### 🔁 5. Isolate the Component
**Actions:**
- Extract the problematic component
- Test it independently
- Hardcode inputs to eliminate variables
- Verify if it fails in isolation

### 🧠 6. Compare Expected vs Actual Behavior
**Framework for LLM Analysis:**
```
Expected: [Describe intended function behavior]
Actual: [Describe observed behavior]
Context: [Relevant environmental factors]
Question: Why might this discrepancy occur?
```

### 🧹 7. Fix the Root Cause
**Principles:**
- Target the underlying logic, schema, or dependency issue
- Avoid surface-level patches
- Address upstream data handling problems
- Ensure the fix aligns with system architecture

### 🧪 8. Validate the Fix
**Testing Protocol:**
1. Re-run the original failing scenario
2. Test edge cases and boundary conditions
3. Verify no regression in related functionality
4. If issues persist, return to step 3 (Trace Upstream)

## Navigation Commands

### Moving Up the Chain
```
"Let's move one level up the chain. What's calling this?"
```
Use when you need to understand the caller context or input source.

### Moving Down the Chain
```
"Let's go one level down — what's this function doing internally?"
```
Use when you need to examine internal implementation details.

### Iterative Investigation
```
"Let's keep stepping through the system until we find the bug."
```
Continue this process systematically until the root cause is identified.

## Documentation Requirements

**CRITICAL**: When investigating any codebase or project:
- Document ALL issues encountered during the investigation
- **Output findings to a `.md` file in the ROOT directory of the project/codebase being investigated**
- This ensures the debug report stays with the relevant codebase
- Name the file descriptively (e.g., `DEBUG_REPORT_[issue-name]_[date].md`)

**What to Include:**
- All steps taken during investigation
- Findings and discoveries
- Resolution path taken
- Any related issues or potential future problems discovered

## Error Documentation Template
```markdown
## Issue Investigation: [Brief Description]

### Symptom
- **Location**: [Where error appears]
- **Behavior**: [What's happening vs expected]

### Investigation Steps
1. [Step taken]
   - Finding: [What was discovered]
   - Next Action: [What to do next]

### Root Cause
[Description of underlying issue]

### Resolution
[How the issue was fixed]

### Related Issues Found
[Any additional problems discovered during investigation]
```

## XML Alternative Format
For systems that prefer XML structure, here's the same methodology:

**Remember**: Output findings to the ROOT directory of the project being debugged.

```xml
<debugging_guide>
  <purpose>Trace data flow and dependencies leading to errors</purpose>
  
  <core_questions>
    <question>What depends on what?</question>
    <question>What gets called or passed first?</question>
    <question>Where might logic break down or data be corrupted?</question>
  </core_questions>
  
  <strategy name="Layered Trace Method">
    <step number="1" name="reproduce">
      <goal>Achieve reliable error triggering</goal>
      <action>Fix reproduction issues first</action>
    </step>
    
    <step number="2" name="identify_symptom">
      <goal>Locate error manifestation layer</goal>
      <layers>UI, Console, Network, API, Logic</layers>
    </step>
    
    <step number="3" name="trace_upstream">
      <questions>
        <q>What called this?</q>
        <q>What input entered this layer?</q>
        <q>What was the prior state?</q>
      </questions>
    </step>
    
    <step number="4" name="trace_downstream">
      <focus>Check for output assumptions</focus>
    </step>
    
    <step number="5" name="isolate">
      <action>Test component independently</action>
    </step>
    
    <step number="6" name="compare_behavior">
      <template>Expected vs Actual analysis</template>
    </step>
    
    <step number="7" name="fix_root_cause">
      <principle>Address underlying issues, not symptoms</principle>
    </step>
    
    <step number="8" name="validate">
      <protocol>Test original scenario and edge cases</protocol>
    </step>
  </strategy>
</debugging_guide>
```

---
*This guide should be used iteratively, moving between upstream and downstream analysis until the root cause is identified and resolved.*