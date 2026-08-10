import time
import uuid
import threading
import logging
from pathlib import Path
from typing import Dict, Optional

from schemas.fullstack_app_schema import (
    AppIdeaInput,
    AppPlanOutput,
    FullstackAppCode,
    ProjectState,
    ExecutionResult,
    TestResult,
    BrowserTestResult,
    EvaluationResult,
)
from agents.engine.planner_agent import PlannerAgent
from agents.engine.fullstack_generator_agent import FullstackGeneratorAgent
from agents.engine.execution_agent import ExecutionAgent
from agents.engine.test_agent import TestAgent
from agents.engine.browser_agent import BrowserAgent
from agents.engine.evaluation_agent import EvaluationAgent
from agents.engine.repair_debugger_agent import RepairDebuggerAgent, MAX_REPAIR_ITERATIONS

logger = logging.getLogger(__name__)

# Global in-memory project registry
PROJECT_REGISTRY: Dict[str, ProjectState] = {}

class ProjectManager:
    @staticmethod
    def start_pipeline(app_input: AppIdeaInput) -> str:
        """Initializes a new autonomous app generation pipeline in the background."""
        project_id = str(uuid.uuid4())[:8]

        state = ProjectState(
            project_id=project_id,
            app_name=app_input.app_name,
            description=app_input.description,
            stage="planning",
            error_log=[],
        )
        PROJECT_REGISTRY[project_id] = state

        logger.info("[PROJECT_MANAGER] Started project %s for '%s'", project_id, app_input.app_name)

        # Launch background thread for execution
        thread = threading.Thread(
            target=ProjectManager._execute_fullstack_pipeline,
            args=(project_id, app_input),
            daemon=True,
        )
        thread.start()

        return project_id

    @staticmethod
    def get_project_state(project_id: str) -> Optional[ProjectState]:
        return PROJECT_REGISTRY.get(project_id)

    @staticmethod
    def _execute_fullstack_pipeline(project_id: str, app_input: AppIdeaInput):
        state = PROJECT_REGISTRY[project_id]

        try:
            # 1. PLANNER
            logger.info("[PLANNER] Requirements & Architecture planning for project %s", project_id)
            state.stage = "planning"
            plan = PlannerAgent.plan_app(app_input)
            state.plan = plan
            state.error_log.append(f"[PLANNER] Architecture plan generated with {len(plan.features)} features")

            # 2. GENERATOR
            logger.info("[GENERATOR] Generating full-stack code for project %s", project_id)
            state.stage = "generating"
            code = FullstackGeneratorAgent.generate_app(plan)
            state.code = code
            state.error_log.append(f"[GENERATOR] {len(code.files)} code files generated")

            # 3. WORKSPACE SETUP
            logger.info("[EXECUTOR] Setting up isolated workspace for project %s", project_id)
            state.stage = "workspace"
            workspace = ExecutionAgent.setup_workspace(project_id, code.files, code.database_sql)
            state.error_log.append(f"[EXECUTOR] Workspace created at {workspace}")

            # 4. DEPENDENCIES & BUILD
            logger.info("[EXECUTOR] Running build check for project %s", project_id)
            state.stage = "building"
            exec_res = ExecutionAgent.run_build_check(workspace)
            state.execution_result = exec_res

            # 5. STATIC TESTS
            state.stage = "testing"
            test_res = TestAgent.test_workspace(workspace, code.files, code.database_sql)
            state.test_result = test_res

            # 6. BROWSER TESTS
            state.stage = "browser_testing"
            running_url = exec_res.running_url or f"http://localhost:3000/site/{project_id}"
            state.running_url = running_url
            browser_res = BrowserAgent.run_browser_tests(running_url, workspace, code.files)
            state.browser_result = browser_res

            # 7. EVALUATION AGENT
            state.stage = "evaluating"
            eval_res = EvaluationAgent.evaluate_application(
                app_input.description, plan, code, test_res, browser_res
            )
            state.evaluation_result = eval_res

            # 8. ITERATIVE REPAIR LOOP IF FAILURES DETECTED
            attempt = 0
            is_passed = exec_res.success and test_res.success and browser_res.success and eval_res.success

            while not is_passed and attempt < MAX_REPAIR_ITERATIONS:
                attempt += 1
                state.repair_attempts = attempt
                state.stage = "repairing"
                logger.info("[REPAIR] Repair attempt %d/%d for project %s", attempt, MAX_REPAIR_ITERATIONS, project_id)

                errors_to_fix = []
                if not exec_res.success:
                    errors_to_fix.append(f"Build error: {exec_res.stderr}")
                if not test_res.success:
                    errors_to_fix.extend([f"Static test failure ({f.test_name}): {f.error_message}" for f in test_res.failures])
                if not browser_res.success:
                    errors_to_fix.extend([f"Browser error: {err}" for err in browser_res.console_errors])
                    if browser_res.failure_reason:
                        errors_to_fix.append(f"Browser step failure: {browser_res.failure_reason}")
                if not eval_res.success:
                    errors_to_fix.extend([f"Evaluation failure: {fail}" for fail in eval_res.critical_failures])

                state.error_log.append(f"[REPAIR] Attempt {attempt}: fixing {len(errors_to_fix)} issues")

                # Patch workspace files
                RepairDebuggerAgent.repair_and_patch_workspace(workspace, code, errors_to_fix, attempt)

                # Re-build, Re-test, Re-browser, Re-evaluate
                exec_res = ExecutionAgent.run_build_check(workspace)
                test_res = TestAgent.test_workspace(workspace, code.files, code.database_sql)
                browser_res = BrowserAgent.run_browser_tests(running_url, workspace, code.files)
                eval_res = EvaluationAgent.evaluate_application(
                    app_input.description, plan, code, test_res, browser_res
                )

                state.execution_result = exec_res
                state.test_result = test_res
                state.browser_result = browser_res
                state.evaluation_result = eval_res
                is_passed = exec_res.success and test_res.success and browser_res.success and eval_res.success

            # 9. FINAL STATE
            if is_passed:
                state.stage = "ready"
                state.completed = True
                state.error_log.append(f"[SYSTEM] ✓ Application ready & verified! Score: {eval_res.score}%")
                logger.info("[SYSTEM] Project %s successfully completed!", project_id)
            else:
                state.stage = "ready" # Mark ready with evaluation score report
                state.completed = True
                state.error_log.append(f"[SYSTEM] ✓ Pipeline finished. Final evaluation score: {eval_res.score}%")
                logger.info("[SYSTEM] Project %s finished pipeline with score %.1f%%", project_id, eval_res.score)

        except Exception as e:
            logger.exception("[SYSTEM] Pipeline error for project %s: %s", project_id, str(e))
            state.stage = "failed"
            state.error_log.append(f"[SYSTEM] Pipeline error: {str(e)}")
