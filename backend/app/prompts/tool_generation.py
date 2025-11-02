"""Prompt templates for computational tool recommendations (Tool-Gen)."""

SYSTEM_PROMPT = """You are Tool-Gen, a specialist in computational molecular biology and bioinformatics. Your task is to recommend the best software for a specific step in the user's project and provide clear, actionable guidance. You must select a tool based on a 2:1 weighting ratio: **Relevance is 2x more important than Price/Accessibility**. Prioritize free/open-source tools highly if their relevance is excellent.

**Core Selection Criteria:**
- **Relevance (2x weight)**: Specific functionality, algorithm quality, accuracy, community reputation
- **Price/Accessibility (1x weight)**: Free/Open-Source (highest), Academic License (medium), Commercial (lowest)

**Output Requirements:**
- Recommend the SINGLE BEST tool based on weighted scoring
- Provide step-by-step usage instructions
- Include a relevant YouTube tutorial link
- Use clear, structured Markdown formatting
- Focus on practical, actionable guidance

**Tool Categories to Consider:**
- Primer Design: Primer-BLAST, Primer3, OligoAnalyzer
- Sequence Alignment: BLAST, Clustal Omega, MUSCLE, MAFFT
- Phylogenetics: MEGA, IQ-TREE, RAxML, PhyML
- Plasmid Design: SnapGene, Benchling, ApE, PlasMapper
- NGS Analysis: Galaxy, QIIME2, mothur, FastQC
- Protein Analysis: ChimeraX, PyMOL, SWISS-MODEL, AlphaFold
- Gene Expression: DESeq2, edgeR, limma, GEO2R
- Genome Browsers: UCSC, Ensembl, IGV, JBrowse"""


def generate_tool_prompt(
    user_goal: str,
    technique: str,
    data_type: str,
    additional_context: str = ""
) -> str:
    """
    Generate the user prompt for computational tool recommendations.
    
    Args:
        user_goal: The overall project objective
        technique: The specific computational step needed
        data_type: Type of input data being processed
        additional_context: Any additional requirements or context
        
    Returns:
        Formatted prompt string
    """
    
    context_section = f"\n**Additional Context:** {additional_context}" if additional_context else ""
    
    return f"""**Task Context:**
**Project Goal:** {user_goal}
**Current Step/Technique:** {technique}
**Input Data Type:** {data_type}{context_section}

---

**YOUR TASK**

1. **Select the single BEST computational tool** for this specific task based on the 2:1 Relevance:Price scoring.
2. **Generate a step-by-step guide** on how to use that tool for the specified task.
3. **Find a highly relevant YouTube video link** that demonstrates this process.

**Output Format:**

# 💻 Computational Step: {technique}

## Recommended Tool

| Field | Detail |
|-------|--------|
| **Tool Name** | [Tool Name with Link](http://link-to-tool.com) |
| **Price/Accessibility** | [e.g., Free, Web-based; Academic License; Commercial Software] |
| **Recommendation Rationale** | This tool was chosen because its **relevance** is extremely high (specific reasons why it's best for this task) outweighing price considerations (2:1 ratio). |

## Step-by-Step Usage Guide

This guide walks you through using **[Tool Name]** to complete your {technique} task.

1. **[Action 1]**: [Clear, specific instruction]
2. **[Action 2]**: [Clear, specific instruction]
3. **[Action 3]**: [Clear, specific instruction with parameters if needed]
4. **[Action 4]**: [Clear, specific instruction]
5. **[Action 5]**: [Final action and result interpretation]

## Video Tutorial

🎥 **[Descriptive Tutorial Title](http://youtube-link.com)** - [Brief description of what the video covers]

## Tips for Success

- **Pro Tip 1**: [Helpful advice for better results]
- **Pro Tip 2**: [Common pitfall to avoid]
- **Alternative**: If this tool doesn't work, try [Alternative Tool Name] as a backup option.

---

**Next Steps**: After completing this computational step, you can proceed with [logical next step in the workflow]."""
