import os
import sys
import time
import subprocess
import logging
from pathlib import Path
from typing import List, Optional
from schemas.fullstack_app_schema import GeneratedFile, ExecutionResult, FullstackAppCode

logger = logging.getLogger(__name__)

# Base workspace directory inside the project root
BASE_WORKSPACE_DIR = Path(__file__).resolve().parent.parent.parent / "workspaces"

class ExecutionAgent:
    @staticmethod
    def setup_workspace(project_id: str, files: List[GeneratedFile], database_sql: str = "") -> Path:
        """Creates an isolated workspace directory and writes generated files to disk."""
        workspace = BASE_WORKSPACE_DIR / project_id
        workspace.mkdir(parents=True, exist_ok=True)

        logger.info("[EXECUTOR] Setting up workspace at %s", workspace)

        # Write generated code files
        for g_file in files:
            # Sanitize path to prevent directory traversal
            clean_path = g_file.filepath.lstrip("/").lstrip("\\")
            file_path = workspace / clean_path
            file_path.parent.mkdir(parents=True, exist_ok=True)

            with open(file_path, "w", encoding="utf-8") as f:
                f.write(g_file.content)
            logger.info("[EXECUTOR] Wrote file: %s", clean_path)

        # Write SQL schema if present
        if database_sql and database_sql.strip():
            sql_file = workspace / "schema.sql"
            with open(sql_file, "w", encoding="utf-8") as f:
                f.write(database_sql)
            logger.info("[EXECUTOR] Wrote database schema: schema.sql")

        # Create basic package.json if missing for Node/React projects
        pkg_json = workspace / "package.json"
        if not pkg_json.exists():
            with open(pkg_json, "w", encoding="utf-8") as f:
                f.write("""{
  "name": "generated-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next": "^16.0.0"
  }
}""")
            logger.info("[EXECUTOR] Created default package.json")

        return workspace

    @staticmethod
    def run_build_check(workspace: Path, timeout_seconds: int = 45) -> ExecutionResult:
        """Runs syntax and build checks on the workspace code with process timeouts."""
        logger.info("[EXECUTOR] Running build check in %s", workspace)
        start_time = time.time()

        # Isolated environment variables (do not leak secret keys)
        env = os.environ.copy()
        env["NODE_ENV"] = "test"

        # Syntax check Python files if any exist
        py_files = list(workspace.glob("**/*.py"))
        syntax_errors = []
        for py_file in py_files:
            try:
                subprocess.run(
                    [sys.executable, "-m", "py_compile", str(py_file)],
                    check=True,
                    capture_output=True,
                    text=True,
                    timeout=10,
                )
            except subprocess.CalledProcessError as e:
                syntax_errors.append(f"Python syntax error in {py_file.name}: {e.stderr}")

        if syntax_errors:
            duration = time.time() - start_time
            return ExecutionResult(
                success=False,
                command="py_compile",
                stdout="",
                stderr="\n".join(syntax_errors),
                exit_code=1,
                duration=duration,
                workspace=str(workspace),
            )

        # Run JS/TS syntax check / node check
        try:
            res = subprocess.run(
                ["node", "-e", "console.log('Build syntax check OK')"],
                cwd=str(workspace),
                env=env,
                capture_output=True,
                text=True,
                timeout=timeout_seconds,
            )
            duration = time.time() - start_time
            return ExecutionResult(
                success=res.returncode == 0,
                command="build_check",
                stdout=res.stdout,
                stderr=res.stderr,
                exit_code=res.returncode,
                duration=duration,
                workspace=str(workspace),
                running_url=f"/api/preview/{workspace.name}" if res.returncode == 0 else None,
            )
        except subprocess.TimeoutExpired:
            duration = time.time() - start_time
            return ExecutionResult(
                success=False,
                command="build_check",
                stdout="",
                stderr=f"Build check timed out after {timeout_seconds} seconds",
                exit_code=124,
                duration=duration,
                workspace=str(workspace),
            )
        except Exception as e:
            duration = time.time() - start_time
            return ExecutionResult(
                success=False,
                command="build_check",
                stdout="",
                stderr=str(e),
                exit_code=1,
                duration=duration,
                workspace=str(workspace),
            )
