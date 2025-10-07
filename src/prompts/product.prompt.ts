import { PlanVariantDataforAI } from "../models/brochure/planVariant.model";
import { ProductData } from "../models/brochure/product.model";

export const eligibilityPrompt = (
  products: ProductData | ProductData[],
  variants: PlanVariantDataforAI | PlanVariantDataforAI[],
) => {
  const productArray = Array.isArray(products) ? products : [products];
  const variantArray = Array.isArray(variants) ? variants : [variants];

  return `
CRITICAL INSTRUCTIONS — FOLLOW EXACTLY

Goal: Generate brochure-friendly JSON for product variants with concise, meaningful summaries and clean eligibility lines.

-----------------------------------
HARD RULES
-----------------------------------
1) VARIANT COUNT
- Input has ${variantArray.length} variant(s).
- Output MUST contain EXACTLY ${variantArray.length} objects inside "variants" (no omission/duplication).

2) ELIGIBILITY DATA SOURCE - UPDATED
- Each variant contains its own eligibility data in variant.eligibility array.
- Use the FIRST eligibility object from variant.eligibility array for each variant.
- If variant.eligibility is empty, use empty values but still include the variant.

3) STRICT JSON SCHEMA (no extra/missing keys):
{
  "product_glance": {
    "product_id": string,
    "product_name": string,
    "product_code": string,           // map from products.UIN (or "Not specified")
    "insurer": string,
    "product_tagline": string,
    "effective_from": string,         // format: DD Mon YYYY
    "effective_to": string            // "" if not available
  },
  "variants": [
    {
      "variant_code": string,
      "variant_label": string,
      "summary": string               // ≤ 80 words, brochure tone
    }
  ],
  "eligibility_snapshot": string,     // bullet-like lines separated by "; "
  "notes": string
}

-----------------------------------
BROCHURE WRITING RULES
-----------------------------------
- Tone: simple, benefits-first, no jargon.
- "summary": For each variant, use ONLY its own eligibility data from variant.eligibility[0].
- Start with a one-line value statement using plan_variants.variant_description; fallback to products.product_tagline; else neutral opener. Then compress key facts: Pay type + PPT; Policy Term; Premium mode; Sum assured band.
- Avoid repeating "Not specified" in the summary; omit missing items instead.
- "eligibility_snapshot": Use short clauses separated by "; ". If a field is missing, use "Not specified" for that clause only.

-----------------------------------
DATA MAPPING & FORMATTING
-----------------------------------
- product_code = products.UIN (if missing, "Not specified").
- Dates: format all displayed dates as "DD Mon YYYY".
- Currency: prefer variant.eligibility[0].currency else products.currency. Format: INR 1,00,000 / PHP 100,000 / MYR 100,000 (no decimals).
- channel: pos → "POS"; non_pos → "Non-POS"; any → "Any channel".
- pay_type: single → "Single Pay"; regular → "Regular Pay"; limited → "Limited Pay".
- premium_modes: USE THE SINGLE STORED VALUE ONLY (do not invent multiple modes).
- Policy Term phrasing:
  - For each of MIN and MAX, consider its own type:
    - fixed_years → "fixed {value} yrs"
    - age_less_entry → "to age {value} less entry"
    - whole_life → "whole life"
  - If min and max types differ, output both, e.g., "Term: min fixed 10 yrs; max to age 70 less entry".
  - If both are fixed and equal, output "fixed {value} yrs".
- PPT phrasing:
  - fixed_years → "PPT: {ppt_fixed_years} yrs"
  - range_years → "PPT: {ppt_min_years}–{ppt_max_years} yrs"
  - relative_to_polterm → "PPT: up to Policy Term − 1 yr"
- Age ranges:
  - Entry: "{min_entry_age}–{max_entry_age} yrs" or "Not specified"
  - Maturity: "{min_maturity_age}–{max_maturity_age} yrs" or "Not specified"
- Sum assured:
  - Use min/max_base_sum_assured as a band: "{CURRENCY} {min}–{max}". If only one side exists, show the available one; if none, "Not specified".

-----------------------------------
OUTPUT LOGIC - UPDATED FOR ELIGIBILITY STRUCTURE
-----------------------------------
1) product_glance: from products.
2) variants: preserve input order (${variantArray.map(v => v.variant_id).join(", ")}). Use exact code/label.
   - For EACH variant, use its variant.eligibility[0] data
   - "summary" ≤ 80 words: Generate using ONLY the eligibility data from variant.eligibility[0]
     Template example:
     "{value line}. Pay: {pay_type}; {ppt_phrase}. Term: {term_phrase}. Mode: {premium_mode}. Sum assured: {band}."
3) eligibility_snapshot:
   - Join with "; " the clauses:
     "Entry: …"; "Maturity: …"; "Term: ..."; "PPT: …"; "Channels: …"; "Pay: …"; "Premium mode: …"; "SA: …".
   - Use eligibility data from variant.eligibility[0] for each variant when generating snapshot
4) notes: Always include
   "Subject to terms and conditions. Refer to the policy document; this is not a contract."
   Append products.notes and plan_variants.notes if present (concatenate with spaces).

-----------------------------------
VARIANT-ELIGIBILITY MAPPING DETAILS
-----------------------------------
${variantArray.map(variant => {
  const eligibility = variant.eligibility && variant.eligibility.length > 0 ? variant.eligibility[0] : null;
  return `Variant ${variant.variant_id} (${variant.variant_code}) -> Eligibility: ${eligibility ? 'AVAILABLE' : 'NONE'}`;
}).join('\n')}

-----------------------------------
INPUT DATA
Products:
${JSON.stringify(productArray, null, 2)}

Plan Variants (with embedded eligibility):
${JSON.stringify(variantArray, null, 2)}
`;
};