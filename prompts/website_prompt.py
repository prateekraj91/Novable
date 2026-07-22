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
You are editing an existing small-business website. Here is the current website
content as JSON:

{current_json}

The business owner has requested this change:

"{instruction}"

Apply ONLY the requested change and return the COMPLETE updated website as JSON
with exactly the same fields and structure as the input. Preserve every field the
instruction does not touch, unchanged. Do not add, rename, or drop fields. Return
only the website JSON — no markdown, no explanations.

GROUNDING (always applies):
- Never invent business facts that are not already present in the current
  content: no new hours, prices, phone numbers, addresses, awards, credentials,
  named real people, or statistics. You may only rephrase, restructure, or
  restyle information that is already there.
- If a request would require a fact you don't have, make the smallest truthful
  change you can and leave the rest untouched.

HOW TO HANDLE EACH KIND OF REQUEST:

1. Text / copy edits ("change the hero heading", "rewrite the about section",
   "make the CTA say Book Now"):
   - Edit only the specific field named: hero_title, hero_subtitle, about, cta,
     a service's title/description, a faq question/answer, etc.
   - Respect the original length guidance: hero_title under 8 words,
     hero_subtitle under 20 words, about 80-120 words.
   - Leave every other field unchanged.

2. Tone changes ("make it more professional", "sound more casual and friendly"):
   - Rewrite the wording of the text fields (hero_title, hero_subtitle, about,
     service descriptions, why_choose_us, cta, faq answers, meta_description) to
     match the new tone.
   - Keep the same underlying facts and meaning — only the voice changes.
   - Do not change primary_color unless the instruction also asks for it.

3. Adding a section ("add testimonials", "add a few FAQs", "add more services"):
   - Populate the matching array: testimonials, faq, services, why_choose_us.
   - Testimonials are illustrative and fictional: they must read as plausible
     customer sentiment and must NOT reference specific facts (real names,
     prices, hours, locations) that are not already in the content.
   - FAQs and services must be grounded only in facts already present; do not
     invent new offerings, pricing, or policies.

4. Removing a section ("remove the FAQ", "drop the testimonials"):
   - Set that field to an empty list ([]) — the site hides any section whose
     list is empty. Applies to: services, faq, testimonials, why_choose_us.
   - Never blank out hero_title, hero_subtitle, cta, about, meta_title,
     meta_description, or primary_color — those are required and always shown.

5. Theme / colour changes ("make it blue", "use a warmer colour"):
   - Update primary_color to a single valid hex code (e.g. "#1E88E5"). Never
     return a colour name. Change nothing else.

WHAT YOU CANNOT DO (return the content unchanged rather than guess):
- The available fields are fixed: hero_title, hero_subtitle, about, services,
  faq, testimonials, cta, primary_color, why_choose_us, meta_title,
  meta_description. You cannot reorder sections or create section types that are
  not fields in this schema (for example a pricing table or a contact form). If
  the instruction asks for something outside these fields, apply the closest
  valid change if one clearly exists; otherwise return the content exactly as
  given.

Return only the updated website JSON.
"""