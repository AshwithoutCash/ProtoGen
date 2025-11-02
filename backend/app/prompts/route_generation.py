"""Prompt templates for experimental route generation (Route-Gen)."""

SYSTEM_PROMPT = """You are Route-Gen, an expert-level Molecular Biology Experimental Design Consultant. Your role is to analyze complex scientific goals and propose 2-3 **distinct, high-level experimental routes** to achieve them. You think in terms of a multi-step workflow, considering trade-offs in time, cost, and final product quality. Your response must be highly structured and comparative.

**Core Design Principles:**
- Every route must include necessary Quality Control (QC) checkpoints (e.g., gel verification, sequencing, concentration measurement).
- All suggested techniques must be standard molecular biology or cell culture procedures.
- You must clearly articulate the *advantage* and *disadvantage* of each proposed route.
- If a route uses a technique that Proto-Gen can generate (like PCR, qPCR, Gibson Assembly, Miniprep, Gel Electrophoresis, Restriction Digestion, Ligation, Transformation, Western Blot, ELISA), note this as a 'Protocol Link: Yes'.
- For other techniques (like Cell Culture, Sequencing, Protein Purification), note as 'Protocol Link: No'.

**Output Format Requirements:**
- Use clear Markdown formatting with headers and bullet points
- Each route must have a distinct workflow with different techniques
- Include realistic time estimates and resource requirements
- Provide actionable next steps"""


def generate_route_prompt(
    overarching_goal: str,
    starting_material: str,
    target_organism: str,
    constraints: str = ""
) -> str:
    """
    Generate the user prompt for experimental route planning.
    
    Args:
        overarching_goal: The main scientific objective
        starting_material: What the user is starting with
        target_organism: The target organism or system
        constraints: Any limitations or requirements
        
    Returns:
        Formatted prompt string
    """
    
    constraints_section = f"\n**Key Constraints:** {constraints}" if constraints else "\n**Key Constraints:** None specified"
    
    return f"""**Overarching Goal:** {overarching_goal}
**Starting Material:** {starting_material}
**Target/Organism:** {target_organism}{constraints_section}

---

**YOUR TASK**

Generate 2-3 distinct experimental routes to achieve this goal.

**Output Format:**

# Experimental Design Analysis for: {overarching_goal}

Here are three potential technical routes to achieve your goal, designed by an expert.

---

## Route 1: The Standard Approach

**Summary:** [One-sentence summary of the route's main benefit]

**Workflow (Step-by-Step):**
1. **[Technique 1]** ([Brief description of the step's purpose]). **[Protocol Link: Yes/No]**
2. **[QC Check 1]** ([Verify successful completion])
3. **[Technique 2]** ([Brief description]). **[Protocol Link: Yes/No]**
4. [Continue until the goal is achieved]

**Estimated Timeline:** [e.g., 3-5 days]

**Pros:**
- [Advantage 1]
- [Advantage 2]

**Cons:**
- [Disadvantage 1]
- [Disadvantage 2]

---

## Route 2: The Fast-Track Approach

**Summary:** [One-sentence summary focusing on speed/efficiency]

**Workflow (Step-by-Step):**
1. **[Different Technique 1]** ([Purpose]). **[Protocol Link: Yes/No]**
2. **[QC Check]** ([Verification step])
3. **[Different Technique 2]** ([Purpose]). **[Protocol Link: Yes/No]**
4. [Continue with distinct approach]

**Estimated Timeline:** [e.g., 1-2 days]

**Pros:**
- [Speed/efficiency advantages]
- [Other benefits]

**Cons:**
- [Trade-offs for speed]
- [Potential limitations]

---

## Route 3: The High-Quality/Robust Approach

**Summary:** [One-sentence summary focusing on quality/robustness]

**Workflow (Step-by-Step):**
1. **[Advanced Technique 1]** ([Purpose]). **[Protocol Link: Yes/No]**
2. **[Comprehensive QC]** ([Thorough verification])
3. **[Advanced Technique 2]** ([Purpose]). **[Protocol Link: Yes/No]**
4. [Continue with quality-focused approach]

**Estimated Timeline:** [e.g., 1-2 weeks]

**Pros:**
- [Quality advantages]
- [Robustness benefits]

**Cons:**
- [Time/resource requirements]
- [Complexity considerations]

---

## Final Recommendation

Based on the constraints provided, I recommend **Route [1/2/3]** as the starting point because [brief reasoning].

**Next Steps:**
- Start with [first technique] - you can generate a detailed protocol for this step
- Prepare [required materials/reagents]
- Plan [estimated timeline] for completion"""
