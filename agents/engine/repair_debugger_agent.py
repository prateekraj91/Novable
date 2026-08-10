from services.gemini_service import generate
from schemas.fullstack_app_schema import FullstackAppCode, RepairOutput
from typing import List
import logging

logger = logging.getLogger(__name__)

class RepairDebuggerAgent:
    @staticmethod
    def repair_app(code: FullstackAppCode, errors: List[str]) -> RepairOutput:
        logger.info("Repairing app %s for %d error(s)", code.app_name, len(errors))

        error_text = "\n".join(errors)
        prompt = f"""
You are an expert AI Software Debugger and Repair Agent.
The application generated for "{code.app_name}" encountered build or runtime errors.

Build & Runtime Error Log:
{error_text}

Analyze the error log, identify the broken files or syntax bugs, and provide patched versions of the affected files to fix the issues.
"""
        repair_res = generate(prompt, RepairOutput)
        if repair_res is None:
            raise ValueError("Repair agent returned empty response")

        logger.info("Repair completed with summary: %s", repair_res.summary_of_fixes)
        return repair_res
