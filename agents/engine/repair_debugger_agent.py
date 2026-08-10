from pathlib import Path
from typing import List, Optional
import logging
from services.gemini_service import generate
from schemas.fullstack_app_schema import FullstackAppCode, RepairOutput, GeneratedFile

logger = logging.getLogger(__name__)

MAX_REPAIR_ITERATIONS = 5

class RepairDebuggerAgent:
    @staticmethod
    def repair_and_patch_workspace(
        workspace: Path,
        code: FullstackAppCode,
        errors: List[str],
        attempt_number: int = 1
    ) -> RepairOutput:
        """Analyzes error logs, asks Gemini to generate fixes, and patches actual workspace files on disk."""
        logger.info(
            "[REPAIR] Iteration %d/%d for app '%s'. Errors to fix: %d",
            attempt_number,
            MAX_REPAIR_ITERATIONS,
            code.app_name,
            len(errors)
        )

        error_text = "\n".join(errors)
        file_summary = "\n".join([f"- {f.filepath} ({f.language})" for f in code.files])

        prompt = f"""
You are an expert AI Software Debugger and Repair Agent.
The application "{code.app_name}" encountered build, runtime, or test errors.

Current Project Workspace Files:
{file_summary}

Error Logs & Failures:
{error_text}

Analyze the error logs, identify the root cause, and provide corrected/patched versions of ONLY the broken files.
Ensure the updated file content is complete, valid, and fixes the error.
"""
        repair_res = generate(prompt, RepairOutput)
        if repair_res is None or not repair_res.fixed_files:
            logger.warning("[REPAIR] Repair agent returned no fixed files")
            return RepairOutput(fixed_files=[], summary_of_fixes="No fixes generated", success=False)

        # Patch actual files in workspace on disk
        for fixed_file in repair_res.fixed_files:
            clean_path = fixed_file.filepath.lstrip("/").lstrip("\\")
            file_path = workspace / clean_path
            file_path.parent.mkdir(parents=True, exist_ok=True)

            with open(file_path, "w", encoding="utf-8") as f:
                f.write(fixed_file.content)

            # Also update code object in memory
            for i, orig_f in enumerate(code.files):
                if orig_f.filepath.lstrip("/").lstrip("\\") == clean_path:
                    code.files[i] = fixed_file
                    break
            else:
                code.files.append(fixed_file)

            logger.info("[REPAIR] Patched file on disk: %s", clean_path)

        logger.info(
            "[REPAIR] Iteration %d completed: %s",
            attempt_number,
            repair_res.summary_of_fixes
        )

        return repair_res
