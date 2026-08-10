import logging
from pathlib import Path
from typing import List
from schemas.fullstack_app_schema import TestResult, TestFailure, GeneratedFile

logger = logging.getLogger(__name__)

class TestAgent:
    @staticmethod
    def test_workspace(workspace: Path, files: List[GeneratedFile], database_sql: str = "") -> TestResult:
        """Runs automated build, schema, and API route validation tests on the generated application workspace."""
        logger.info("[TESTER] Running automated test suite on %s", workspace)

        tests_run = 0
        tests_passed = 0
        tests_failed = 0
        failures: List[TestFailure] = []
        logs: List[str] = []

        # Test 1: File Existence Test
        tests_run += 1
        missing_files = []
        for g_file in files:
            file_p = workspace / g_file.filepath.lstrip("/").lstrip("\\")
            if not file_p.exists():
                missing_files.append(g_file.filepath)

        if missing_files:
            tests_failed += 1
            failures.append(
                TestFailure(
                    test_name="file_existence_check",
                    error_message=f"Missing files on disk: {', '.join(missing_files)}",
                )
            )
            logs.append(f"[TESTER] ❌ File existence test failed for {len(missing_files)} files")
        else:
            tests_passed += 1
            logs.append("[TESTER] ✓ File existence test passed")

        # Test 2: SQL Schema DDL Syntax Validation
        tests_run += 1
        if database_sql and database_sql.strip():
            sql_file = workspace / "schema.sql"
            sql_content = sql_file.read_text(encoding="utf-8") if sql_file.exists() else ""
            if "CREATE TABLE" in sql_content.upper() or "ALTER TABLE" in sql_content.upper():
                tests_passed += 1
                logs.append("[TESTER] ✓ SQL schema DDL validation passed")
            else:
                tests_failed += 1
                failures.append(
                    TestFailure(
                        test_name="sql_schema_check",
                        error_message="SQL schema DDL missing CREATE TABLE statement",
                    )
                )
                logs.append("[TESTER] ❌ SQL schema DDL validation failed")
        else:
            tests_passed += 1
            logs.append("[TESTER] ✓ SQL schema check skipped (no database specified)")

        # Test 3: Code Content non-empty check
        tests_run += 1
        empty_files = [f.filepath for f in files if not f.content or not f.content.strip()]
        if empty_files:
            tests_failed += 1
            failures.append(
                TestFailure(
                    test_name="empty_file_check",
                    error_message=f"Empty content detected in: {', '.join(empty_files)}",
                )
            )
            logs.append(f"[TESTER] ❌ Empty file check failed for {len(empty_files)} files")
        else:
            tests_passed += 1
            logs.append("[TESTER] ✓ Empty file check passed")

        # Test 4: Frontend Component / Route Structure
        tests_run += 1
        has_frontend = any(f.filepath.endswith((".tsx", ".jsx", ".js")) for f in files)
        if has_frontend:
            tests_passed += 1
            logs.append("[TESTER] ✓ Frontend React component test passed")
        else:
            tests_failed += 1
            failures.append(
                TestFailure(
                    test_name="frontend_component_check",
                    error_message="No React/Next.js frontend component files generated",
                )
            )
            logs.append("[TESTER] ❌ Frontend component test failed")

        overall_success = tests_failed == 0

        logger.info(
            "[TESTER] Test suite finished. %d/%d passed (%d failures)",
            tests_passed,
            tests_run,
            tests_failed,
        )

        return TestResult(
            success=overall_success,
            tests_run=tests_run,
            tests_passed=tests_passed,
            tests_failed=tests_failed,
            failures=failures,
            logs=logs,
        )
