# Proto-Gen Usage Examples

This document provides example inputs and expected outputs for Proto-Gen to help you get started.

## Example 1: PCR Protocol Generation

### Input

**Experimental Goal:** Amplify a 700bp fragment of the human GAPDH gene for cloning

**Technique:** PCR

**Core Reagents/Enzyme:** Q5 High-Fidelity DNA Polymerase

**Template Details:** Human genomic DNA, 50 ng/µL

**Primer Details:** 
- Forward: 5'-ATGGGGAAGGTGAAGGTCG-3' (Tm: 60°C)
- Reverse: 5'-GGGGTCATTGATGGCAACAATA-3' (Tm: 58°C)

**Amplicon Size:** 700 bp

**Reaction Volume:** 25 µL

**Number of Reactions:** 8

### Expected Output Structure

The generated protocol will include:

1. **Materials and Reagents**
   - Q5 High-Fidelity DNA Polymerase
   - 5X Q5 Reaction Buffer
   - 10 mM dNTPs
   - Forward and Reverse Primers (10 µM)
   - Template DNA
   - Nuclease-free water

2. **Master Mix Calculation (for 9 reactions)**
   - Table with reagent volumes per reaction and total master mix volumes

3. **Thermocycler Program**
   - Initial Denaturation: 98°C for 30 seconds
   - 30 cycles of:
     - Denaturation: 98°C for 10 seconds
     - Annealing: 55°C for 20 seconds (3-5°C below lowest Tm)
     - Extension: 72°C for 21 seconds (30 sec/kb for Q5)
   - Final Extension: 72°C for 2 minutes
   - Hold: 4°C

4. **Detailed Procedure Steps**

5. **Notes & Pitfalls**
   - Primer dimer prevention
   - Template quality considerations
   - Enzyme handling tips

---

## Example 2: Gibson Assembly Protocol

### Input

**Experimental Goal:** Assemble a 3-fragment construct for mammalian expression

**Technique:** Gibson Assembly

**Core Reagents/Enzyme:** NEBuilder HiFi DNA Assembly Master Mix

**Template Details:** 
- Vector backbone: 5 kb, linearized with EcoRI
- Insert 1: 1.2 kb PCR product
- Insert 2: 800 bp PCR product

**Primer Details:** All fragments have 20-25 bp overlaps

**Other Parameters:** Total DNA amount: 100 ng, equimolar ratio of fragments

### Expected Output Structure

1. **Materials and Reagents**
2. **DNA Amount Calculations**
   - Molar ratios for equimolar assembly
   - Volume calculations for each fragment
3. **Assembly Procedure**
   - Mix preparation
   - Incubation conditions (50°C for 60 minutes)
   - Transformation protocol
4. **Notes & Pitfalls**
   - Overlap design importance
   - Fragment purification requirements
   - Troubleshooting low efficiency

---

## Example 3: Troubleshooting - No PCR Product

### Input

**Observed Problem:** No band visible on agarose gel after PCR. Only primer dimers present at ~50 bp.

**Original Protocol:**
```
PCR Reaction (25 µL total):
- 12.5 µL Taq DNA Polymerase Master Mix (2X)
- 1 µL Forward Primer (10 µM)
- 1 µL Reverse Primer (10 µM)
- 2 µL Template DNA (genomic DNA, ~100 ng/µL)
- 8.5 µL Nuclease-free water

Thermocycler Program:
- 95°C for 3 minutes
- 35 cycles:
  - 95°C for 30 seconds
  - 65°C for 30 seconds
  - 72°C for 30 seconds
- 72°C for 5 minutes
- Hold at 4°C

Expected product: 1.5 kb
```

**Additional Details:** Template DNA A260/A280 ratio is 1.85. Primers were designed 2 years ago and stored at -20°C. Using fresh Taq polymerase.

### Expected Output Structure

1. **Troubleshooting Analysis**

2. **Ranked Potential Causes:**

   **1. Annealing Temperature Too High**
   - Reasoning: 65°C is very high for most primers. If primer Tm is around 55-60°C, this could prevent binding.
   - Solution: Run gradient PCR from 50-65°C to find optimal temperature. Start with 55°C.

   **2. Extension Time Too Short**
   - Reasoning: 30 seconds is insufficient for 1.5 kb with Taq polymerase (needs ~60 sec/kb = 90 seconds).
   - Solution: Increase extension time to 90 seconds.

   **3. Degraded or Incorrect Primers**
   - Reasoning: 2-year-old primers may have degraded, especially with freeze-thaw cycles.
   - Solution: Order fresh primers. Check primer sequences against template.

   **4. Template DNA Quality Issues**
   - Reasoning: While A260/A280 is good, there may be PCR inhibitors or DNA degradation.
   - Solution: Dilute template 1:10 and try again. Run template on gel to check integrity.

3. **Further Questions:**
   - What is the Tm of your primers?
   - Have these primers worked successfully before?
   - How many freeze-thaw cycles have the primers undergone?

4. **Quick Checklist:**
   - [ ] Verify primer sequences match template
   - [ ] Check template DNA integrity on gel
   - [ ] Confirm thermocycler is calibrated
   - [ ] Try positive control reaction

---

## Example 4: Troubleshooting - Smear on Gel

### Input

**Observed Problem:** Getting a smear instead of a sharp band. Some product at expected size but lots of non-specific amplification.

**Original Protocol:**
```
Standard PCR with Taq polymerase
Annealing temperature: 52°C
Template: 5 µL of plasmid miniprep (~200 ng/µL)
40 cycles
Expected product: 500 bp
```

**Technique Used:** PCR

### Expected Output Structure

1. **Troubleshooting Analysis**

2. **Ranked Potential Causes:**

   **1. Too Much Template DNA**
   - Reasoning: 1000 ng of plasmid template is excessive (should be 10-100 ng).
   - Solution: Dilute template 1:100 and use 1 µL (10 ng total).

   **2. Too Many PCR Cycles**
   - Reasoning: 40 cycles is excessive and leads to non-specific amplification.
   - Solution: Reduce to 25-30 cycles.

   **3. Annealing Temperature Too Low**
   - Reasoning: 52°C may allow non-specific primer binding.
   - Solution: Increase annealing temperature by 2-5°C. Try 55-58°C.

   **4. Non-Specific Primer Binding**
   - Reasoning: Primers may have secondary binding sites.
   - Solution: Use hot-start polymerase or increase annealing temperature.

---

## Example 5: Miniprep Protocol

### Input

**Experimental Goal:** Extract plasmid DNA from E. coli culture for sequencing

**Technique:** Miniprep

**Core Reagents/Enzyme:** Standard alkaline lysis miniprep kit

**Template Details:** 5 mL overnight culture of DH5α cells with pUC19 plasmid (ampicillin resistance)

**Other Parameters:** Need high purity for Sanger sequencing (A260/A280 > 1.8)

### Expected Output Structure

1. **Materials and Reagents**
2. **Procedure**
   - Cell harvesting by centrifugation
   - Alkaline lysis steps
   - Neutralization
   - Washing
   - Elution
3. **Quality Control**
   - Spectrophotometry (A260/A280 ratio)
   - Gel electrophoresis
   - Expected yield: 5-15 µg
4. **Notes & Pitfalls**
   - Avoiding genomic DNA contamination
   - Proper mixing during lysis
   - RNase A treatment

---

## Tips for Best Results

### For Protocol Generation:

1. **Be Specific**: Include exact reagent names, concentrations, and product sizes
2. **Provide Context**: Mention if you have special requirements (high fidelity, GC-rich template, etc.)
3. **Include Primer Info**: If you know primer Tm values, include them
4. **Mention Equipment**: If you have specific equipment limitations or preferences

### For Troubleshooting:

1. **Describe Exactly What You See**: "Faint band" vs "no band" vs "smear" are all different
2. **Include Complete Protocol**: Don't leave out details - they might be the problem!
3. **Mention Reagent Age**: Old reagents are a common cause of failure
4. **Include Controls**: Did positive/negative controls work?
5. **Note Any Deviations**: Even small changes from standard protocols matter

### Common Mistakes to Avoid:

- ❌ Vague descriptions: "PCR didn't work"
- ✅ Specific descriptions: "No product visible on gel, only primer dimers at ~50 bp"

- ❌ Missing information: "Used Taq polymerase"
- ✅ Complete information: "Used Taq DNA Polymerase from NEB, lot #12345, opened 3 months ago"

- ❌ No context: "Need PCR protocol"
- ✅ With context: "Need PCR protocol for amplifying 2 kb fragment from GC-rich promoter region"

---

## Advanced Use Cases

### 1. Gradient PCR Optimization

**Goal:** Find optimal annealing temperature for new primers

**Input:** Request protocol with gradient from 50-65°C in 2°C increments

### 2. Colony PCR

**Goal:** Screen bacterial colonies for successful cloning

**Input:** Specify colony PCR technique, direct colony as template, fast protocol

### 3. Overlap Extension PCR

**Goal:** Introduce point mutation into gene

**Input:** Describe mutagenic primers with overlapping regions

### 4. Multiplex PCR

**Goal:** Amplify multiple targets in single reaction

**Input:** Multiple primer pairs, need optimization for compatible annealing temperatures

---

## Next Steps

After reviewing these examples:

1. Try generating a simple PCR protocol with your own parameters
2. Experiment with different techniques
3. Use the troubleshooting feature with a real problem you've encountered
4. Compare generated protocols with your lab's standard protocols
5. Iterate and refine your inputs based on the outputs

Remember: Always verify generated protocols with experienced researchers before use!
