from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from schemas.website_schema import BusinessInput,WebsiteOutput,EditWebsiteInput
from schemas.review_schema import ReviewInput, ReviewAgentOutput
from schemas.campaign_schema import CampaignInput, CampaignAgentOutput
from schemas.social_schema import SocialInput, SocialAgentOutput
from schemas.analytics_schema import AnalyticsInput, AnalyticsOutput
from schemas.account_manager_schema import AccountManagerInput, AccountManagerOutput
from schemas.payment_schema import PaymentLinkInput, PaymentLinkOutput
from services.razorpay_service import create_payment_link
from agents.website_agent import WebsiteAgent
from agents.review_agent import ReviewAgent
from agents.campaign_agent import CampaignAgent
from agents.social_agent import SocialAgent
from agents.analytics_agent import AnalyticsAgent
from agents.account_manager_agent import AccountManagerAgent
import utils.logger_config
import logging
import os

app=FastAPI(title="GrowthPilot API",version="1.0.0")

logger=logging.getLogger(__name__)

# CORS: the frontend (Lovable) is served from a different origin than this API,
# so the browser will block calls to /generate-website etc. unless we explicitly
# allow it here. ALLOWED_ORIGINS is a comma-separated env var (e.g. your Lovable
# preview + production URLs); falls back to "*" for local/dev testing only.
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message":"GrowthPilot Backend Running!"}

@app.get("/health")
def health():
    return {
        "status": "ok",
        "vertex": "connected"
    }

@app.post("/generate-website",response_model=WebsiteOutput)
def generate_website(business:BusinessInput):

    logger.info(f"Website generation requested for {business.business_name}")

    return WebsiteAgent.generate_website(business)

@app.post("/edit-website",response_model=WebsiteOutput)
def edit_website(data:EditWebsiteInput):

    logger.info("Website edit requested")

    return WebsiteAgent.edit_website(data.current, data.instruction)

@app.post("/generate-reviews",response_model=ReviewAgentOutput)
def generate_reviews(data:ReviewInput):

    return ReviewAgent.generate_replies(data)

@app.post("/generate-campaign",response_model=CampaignAgentOutput)
def generate_campaign(data:CampaignInput):

    return CampaignAgent.generate_campaigns(data)

@app.post("/generate-social",response_model=SocialAgentOutput)
def generate_social(data:SocialInput):

    return SocialAgent.generate_posts(data)

@app.post("/generate-analytics",response_model=AnalyticsOutput)
def generate_analytics(data:AnalyticsInput):

    return AnalyticsAgent.generate_analytics(data)

@app.post("/chat",response_model=AccountManagerOutput)
def chat(data:AccountManagerInput):

    return AccountManagerAgent.answer_question(data)

@app.post("/create-payment-link",response_model=PaymentLinkOutput)
def payment_link(data:PaymentLinkInput):

    logger.info(f"Payment link requested for {data.business_name}")

    return create_payment_link(data.amount, data.business_name, data.phone)

# --- Novable 12-Month Emergent Engine Endpoints ---
from schemas.fullstack_app_schema import AppIdeaInput, AppPlanOutput, FullstackAppCode
from agents.engine.planner_agent import PlannerAgent
from agents.engine.fullstack_generator_agent import FullstackGeneratorAgent

@app.post("/generate-fullstack-plan", response_model=AppPlanOutput)
def generate_fullstack_plan(data: AppIdeaInput):
    logger.info(f"Fullstack plan requested for {data.app_name}")
    return PlannerAgent.plan_app(data)

@app.post("/generate-fullstack-app", response_model=FullstackAppCode)
def generate_fullstack_app(plan: AppPlanOutput):
    logger.info(f"Fullstack app generation requested for {plan.app_name}")
    return FullstackGeneratorAgent.generate_app(plan)

