from google import genai
from google.genai import types
import utils.logger_config
import os
import logging
from tenacity import retry, stop_after_attempt, wait_fixed, before_sleep_log

logger=logging.getLogger(__name__)

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

@retry(
    stop=stop_after_attempt(3),
    wait=wait_fixed(2),
    before_sleep=before_sleep_log(logger, logging.WARNING),
    reraise=True,
)
def generate(prompt:str,response_schema=None,image_urls=None):

    config = None

    if response_schema:
        config = types.GenerateContentConfig(
        response_mime_type="application/json",
        response_schema=response_schema
        )

    contents = prompt

    # If reference images are supplied, fetch them and send a multimodal request
    # so Gemini can factor the business's real look/branding into the output.
    if image_urls:
        import requests

        image_parts = []
        for url in image_urls[:4]:
            try:
                r = requests.get(url, timeout=15)
                r.raise_for_status()
                mime = (r.headers.get("content-type") or "image/jpeg").split(";")[0]
                image_parts.append(types.Part.from_bytes(data=r.content, mime_type=mime))
            except Exception:
                logger.warning("Could not fetch reference image: %s", url)
        if image_parts:
            contents = [prompt, *image_parts]

    response=client.models.generate_content(
        model="gemini-2.5-flash",
        contents=contents,
        config=config
        )
    
    logger.info(f"Tokens used: {response.usage_metadata}")

    if not response.candidates:
        raise ValueError("Gemini returned empty response")

    if response_schema:
        return response.parsed

    return response.text