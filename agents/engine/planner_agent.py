from services.gemini_service import generate
from schemas.fullstack_app_schema import AppIdeaInput, AppPlanOutput
import logging

logger = logging.getLogger(__name__)

class PlannerAgent:
    @staticmethod
    def plan_app(app_input: AppIdeaInput) -> AppPlanOutput:
        logger.info("Planning full-stack application: %s", app_input.app_name)

        prompt = f"""
You are an expert AI Software Architect and Product Planner.
Decompose the following app idea into a detailed technical specification plan.

App Name: {app_input.app_name}
Description: {app_input.description}
Target Audience: {app_input.target_audience}
Requires Auth: {app_input.requires_auth}
Requires Database: {app_input.requires_database}

Create a structured technical architecture plan including:
1. Architecture Overview
2. Tech Stack (Next.js, TypeScript, Tailwind, FastAPI/Python, PostgreSQL/Supabase)
3. Core Features list
4. Database Entity Data Models (Entities, Field names, Data types)
5. API Endpoints (Path, Method, Description)
6. Step-by-step Implementation plan
"""
        plan = generate(prompt, AppPlanOutput)
        if plan is None or not plan.app_name:
            raise ValueError("App planning returned empty output")

        logger.info("App plan generated successfully for %s", plan.app_name)
        return plan
