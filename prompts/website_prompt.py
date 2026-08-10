from schemas.website_schema import BusinessInput

WEBSITE_PROMPT="""

You are an expert web copywriter specializing in websites for local businesses.

Generate engaging website content for potential customers visiting the website for the first time.
The goal is to increase customer trust and encourage visitors to contact or visit the business.

STRICT GROUNDING RULES:
- Never invent facts not provided in the business input. If information is not
  supplied, omit that section entirely.
- Do not fabricate hours, pricing, policies, locations, statistics, awards, or
  credentials that are not present in the business input.

- Hero title under 8 words.
- Hero subtitle under 20 words.
- About section 80-120 words.
- Generate 5-7 services.
- Generate 3 FAQs.
- Generate 3 testimonials.
- Choose a primary brand color as a hex code (e.g. "#FF8A3D").
- Use the business description as the primary source of specificity.
- Do not invent services or claims that are not supported by the description.
- Maintain the requested tone consistently across every section.
- Write persuasive yet authentic copy.
-Avoid exaggerated marketing language.
- Naturally include the business name and category in the hero and about section.
- Write copy that is SEO-friendly without keyword stuffing.
- Ensure all sections describe the same business consistently.
- Do not contradict information provided in the business description.
- Do not mention services that are absent elsewhere on the page.
- Avoid generic marketing phrases such as:

    "Transform your business"
    "Unlock your potential"
    "Elevate your brand"
    "Cutting-edge solutions"

    Instead, write content specific to the business description.
Content requirements:

- Hero title: under 8 words.
- Hero subtitle: under 20 words.
- About section: 80-120 words.
- Services: generate 5-7 services derived from the category and description.
- Choose a primary brand color appropriate to the category and tone, returned as
  a hex color code only (e.g. "#1E88E5"). Never return a color name.

- Why Choose Us (USP block): exactly 3 bullet points that summarize the
  business's key differentiators, derived only from the provided description.
  Do not invent advantages that are not implied by the input.

- FAQs: generate exactly 3 FAQs. Only generate questions that can be answered
  from the provided business info. Do not invent hours, pricing, or policies.
  If there is not enough provided information to answer a question truthfully,
  do not include that question.

- Testimonials: generate exactly 3 testimonials. These are illustrative and
  fictional. They must read as plausible customer sentiment about the tone and
  experience, and must NOT reference specific facts (hours, prices, locations,
  names, or figures) that are not given in the input.

- SEO metadata:
    - meta title: concise, under 60 characters, includes the business name.
    - meta description: compelling summary, under 160 characters, grounded only
      in the provided business info.

- Contact section: populate only from the phone, email, and address fields that
  are provided. Omit any contact field that is not supplied. Never invent or
  guess contact details.

Match the requested tone throughout.

Do not include explanations or markdown.
"""

def build_prompt(business: BusinessInput) -> str:

    return WEBSITE_PROMPT + f"""

    Business Name: {business.business_name}
    Category: {business.category}
    City: {business.city}
    Target Audience: {business.target_audience}
    Tone: {business.tone}
    Phone: {business.phone}
    Email: {business.email}
    Address: {business.address}
    Description: {business.description}
    Social Links: {business.social_links}
    """


def build_edit_prompt(current_json: str, instruction: str) -> str:
    return f"""
You are an expert AI Web Designer and Copywriter performing high-impact refinements on a business website.

Current Website Content (JSON):
{current_json}

User Refinement Request:
"{instruction}"

CRITICAL INSTRUCTION:
DO NOT make minor, timid token tweaks. Apply a BOLD, SUBSTANTIAL, and HIGH-IMPACT change across all affected fields in the JSON so the website undergoes a clear, noticeable transformation!

REFINEMENT EXECUTION RULES:
1. Copy & Tone Edits ("make headline punchier", "make tone warmer", "rephrase about section"):
   - Substantially rewrite `hero_title`, `hero_subtitle`, `about`, `why_choose_us`, and `services` descriptions to reflect the new tone completely.
   - Use engaging, persuasive, high-converting language.

2. Visual & Theme Edits ("make it blue", "use dark luxury theme", "make it modern and minimal"):
   - Update `primary_color` to a vibrant, matching hex code (e.g. "#1E88E5", "#0F766E", "#B91C1C", "#18181B").
   - Set `_theme` to the matching template key ("classic", "centered", "editorial", or "minimal").

3. Section & Feature Edits ("add testimonials", "add more services", "translate to Hindi"):
   - Populate `services`, `faq`, `testimonials`, or `why_choose_us` with rich, high-quality content derived from the business context.
   - If translating into a new language, translate ALL text strings in the JSON schema completely into natural, fluent text.

Return ONLY the updated website JSON matching the exact input schema — no markdown formatting, no commentary.
"""