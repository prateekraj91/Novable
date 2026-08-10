from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class AppIdeaInput(BaseModel):
    app_name: str = Field(..., description="Name of the application or SaaS product")
    description: str = Field(..., description="Natural language description of what the application does")
    target_audience: Optional[str] = Field("General Users", description="Target users for the app")
    requires_auth: bool = Field(True, description="Whether authentication is required")
    requires_database: bool = Field(True, description="Whether database storage is required")

class DataModelField(BaseModel):
    name: str
    type: str
    required: bool = True
    description: Optional[str] = None

class DataModelSchema(BaseModel):
    entity_name: str
    description: str
    fields: List[DataModelField]

class ApiEndpointSpec(BaseModel):
    path: str
    method: str
    description: str

class AppPlanOutput(BaseModel):
    app_name: str
    architecture_overview: str
    tech_stack: List[str]
    features: List[str]
    data_models: List[DataModelSchema]
    api_endpoints: List[ApiEndpointSpec]
    implementation_steps: List[str]

class GeneratedFile(BaseModel):
    filepath: str
    language: str
    content: str

class FullstackAppCode(BaseModel):
    app_name: str
    summary: str
    database_sql: str
    files: List[GeneratedFile]

class ExecutionResult(BaseModel):
    success: bool
    build_logs: List[str]
    errors: List[str]

class RepairOutput(BaseModel):
    fixed_files: List[GeneratedFile]
    summary_of_fixes: str
    success: bool
