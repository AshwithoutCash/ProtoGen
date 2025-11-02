"""Prompt templates for protocol generation."""


SYSTEM_PROMPT = """You are Proto-Gen, an expert-level molecular biologist and laboratory protocol generation AI. Your sole purpose is to create accurate, detailed, and safe laboratory protocols based on user requests. You think step-by-step and always double-check your calculations. You format your output in clean Markdown.

**Core Scientific Knowledge:**
- A standard PCR reaction contains: DNA Polymerase, dNTPs, a buffer, MgCl2, forward primer, reverse primer, template DNA, and nuclease-free water.
- The annealing temperature (Ta) is typically set 3-5°C below the lowest primer's melting temperature (Tm). If Tm is not provided, you must state that it needs to be calculated and use a placeholder.
- Extension time for PCR is generally 30-60 seconds per kilobase (kb) of the amplicon length, depending on the polymerase (e.g., Taq is ~60s/kb, Q5 is ~30s/kb).
- Final reaction volume is typically 25 µL or 50 µL. You will default to 25 µL unless specified otherwise.
- Always include a "Notes & Pitfalls" section to warn the user about common mistakes, such as reagent degradation, contamination, or incorrect measurements.
- For master mix calculations, always calculate for N+1 reactions to account for pipetting errors.
- For Gibson Assembly: Use NEBuilder HiFi DNA Assembly Master Mix or similar. Typical assembly uses 50-100 ng total DNA with equimolar ratios of fragments. Incubate at 50°C for 15-60 minutes depending on fragment number.
- For Miniprep: Use alkaline lysis method. Typical yield is 5-15 µg from 3-5 mL overnight culture. A260/A280 ratio should be 1.8-2.0 for pure DNA.
- For Gel Electrophoresis: Use 0.8-2% agarose depending on fragment size. Run at 80-120V. Include loading dye and DNA ladder.
- For Restriction Digestion: Use 1-2 units enzyme per µg DNA. Incubate at optimal temperature (usually 37°C) for 1-4 hours. Check buffer compatibility for double digests.
- For Ligation: Use T4 DNA Ligase. Typical insert:vector ratio is 3:1 to 5:1. Incubate at 16°C overnight or room temperature for 1-2 hours.
- For Transformation: Use competent cells (chemical or electrocompetent). Heat shock at 42°C for 30-45 seconds for chemical competent cells. Plate on selective media.
"""


def generate_protocol_prompt(
    experimental_goal: str,
    technique: str,
    reagents: str,
    template_details: str,
    primer_details: str = "",
    amplicon_size: str = "",
    reaction_volume: str = "25",
    num_reactions: str = "1",
    other_params: str = ""
) -> str:
    """Generate the user prompt for protocol generation."""
    
    # Calculate N+1 for master mix
    try:
        n_plus_one = int(num_reactions) + 1
    except (ValueError, TypeError):
        n_plus_one = 2
    
    user_prompt = f"""**USER REQUEST**

**Goal:** {experimental_goal}
**Technique:** {technique}
**Core Reagents/Enzyme:** {reagents}
**Template DNA:** {template_details}
**Reaction Volume:** {reaction_volume} µL
**Number of Reactions:** {num_reactions}"""

    if primer_details:
        user_prompt += f"\n**Primers:** {primer_details}"
    
    if amplicon_size:
        user_prompt += f"\n**Desired Amplicon Size:** {amplicon_size}"
    
    if other_params:
        user_prompt += f"\n**Other Parameters:** {other_params}"
    
    user_prompt += f"""

---
**YOUR TASK**

Based on the user request and your core scientific knowledge, generate a complete, step-by-step protocol.

**Output Format:**

### **Protocol: [Protocol Title based on user goal]**

**1. Materials and Reagents**
- List all components needed, including those specified by the user and those implied by the technique (e.g., dNTPs, nuclease-free water).

**2. Master Mix Calculation (for {n_plus_one} reactions)**
- Create a Markdown table with three columns: Reagent, Volume per Reaction (µL), Volume for Master Mix (µL).
- Calculate the required volume for each component to reach standard concentrations in a final volume of {reaction_volume} µL.

**3. {"Thermocycler Program" if technique in ["PCR", "qPCR"] else "Procedure Steps"}**
"""

    if technique in ["PCR", "qPCR"]:
        user_prompt += """- Create a Markdown table with three columns: Step, Temperature (°C), Time.
- Include Initial Denaturation, Denaturation, Annealing (state the temperature used and why), Extension (calculate time based on amplicon size and polymerase), Final Extension, and Hold steps.

**4. Procedure**
1. Thaw reagents on ice.
2. Prepare the master mix in a sterile microcentrifuge tube as calculated above. Mix gently by pipetting.
3. Aliquot the master mix into PCR tubes.
4. Add the template DNA to each PCR tube.
5. ... (continue with clear, unambiguous steps).
6. Run the specified thermocycler program.
7. Analyze the results via gel electrophoresis.
"""
    else:
        user_prompt += """- Provide a detailed, numbered list of procedural steps.
- Include specific temperatures, times, and equipment settings where applicable.
- Be clear and unambiguous in each step.

"""
    
    user_prompt += """**5. Notes & Pitfalls**
- Provide at least 3 critical tips or warnings relevant to this specific protocol. For example, mention primer-dimers, template DNA quality, enzyme handling, contamination risks, or common mistakes.

**6. Expected Results**
- Describe what successful results should look like.
- Mention any quality control checks or measurements to perform.

Remember to be precise with calculations, use proper scientific notation, and ensure all steps are clear and actionable."""

    return user_prompt
