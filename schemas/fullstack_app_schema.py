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
    command: str
    stdout: str
    stderr: str
    exit_code: int
    duration: float
    workspace: str
    running_url: Optional[str] = None

class TestFailure(BaseModel):
    test_name: str
    error_message: str

class TestResult(BaseModel):
    success: bool
    tests_run: int
    tests_passed: int
    tests_failed: int
    failures: List[TestFailure] = []
    logs: List[str] = []

class BrowserStepResult(BaseModel):
    step_name: str
    action: str
    target_element: str
    status: str  # passed | failed
    details: str

class BrowserTestResult(BaseModel):
    success: bool
    steps: int
    passed_steps: int
    failed_steps: int
    step_details: List[BrowserStepResult] = []
    screenshots: List[str] = []
    console_errors: List[str] = []
    network_errors: List[str] = []
    failure_reason: Optional[str] = None

class RequirementCheck(BaseModel):
    requirement_name: str
    status: str  # passed | failed
    details: str

class EvaluationResult(BaseModel):
    success: bool
    requirements_checked: int
    requirements_passed: int
    requirements_failed: int
    requirement_checks: List[RequirementCheck] = []
    user_journeys: List[str] = []
    critical_failures: List[str] = []
    score: float = 0.0  # 0 to 100 percentage

class RepairOutput(BaseModel):
    fixed_files: List[GeneratedFile]
    summary_of_fixes: str
    success: bool

class ProjectState(BaseModel):
    project_id: str
    app_name: str
    description: str
    stage: str  # planning | generating | workspace | building | testing | browser_testing | evaluating | repairing | ready | failed
    plan: Optional[AppPlanOutput] = None
    code: Optional[FullstackAppCode] = None
    execution_result: Optional[ExecutionResult] = None
    test_result: Optional[TestResult] = None
    browser_result: Optional[BrowserTestResult] = None
    evaluation_result: Optional[EvaluationResult] = None
    repair_attempts: int = 0
    running_url: Optional[str] = None
    completed: bool = False
    error_log: List[str] = []
