from services.gemini_service import generate
from schemas.fullstack_app_schema import AppPlanOutput, FullstackAppCode
import logging

logger = logging.getLogger(__name__)

class FullstackGeneratorAgent:
    @staticmethod
    def generate_app(plan: AppPlanOutput) -> FullstackAppCode:
        logger.info("Generating full-stack application code for %s", plan.app_name)

        prompt = f"""
You are an expert AI Full-Stack Software Engineer.
Generate production-ready code files and database migrations for the planned application.

App Name: {plan.app_name}
Overview: {plan.architecture_overview}
Tech Stack: {", ".join(plan.tech_stack)}
Features: {", ".join(plan.features)}

Requirements:
1. Provide valid PostgreSQL SQL schema DDL for database tables and relations.
2. Provide complete React/Next.js frontend component files (e.g. Dashboard, Auth Form, Data Table).
3. Provide complete FastAPI/Express API route files for backend endpoints.
4. Ensure all generated code files are syntactically valid and production ready.
"""
        code_output = generate(prompt, FullstackAppCode)
        if code_output is None or not code_output.files:
            raise ValueError("Fullstack app code generation returned empty output")

        logger.info("Generated %d code files for %s", len(code_output.files), plan.app_name)
        return code_output
