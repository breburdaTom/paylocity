"""
Tests for employee benefits calculation logic.
Validates that gross, benefitsCost, and net are computed correctly.
"""

import pytest

from utils.assertions import assert_status_code
from utils.data_factory import generate_employee_payload


class TestEmployeeBenefitsCalculation:
    """Test suite for benefits calculation fields (gross, benefitsCost, net)."""

    @pytest.mark.positive
    @pytest.mark.regression
    def test_gross_is_calculated(self, employees_client):
        """Gross pay should be calculated and returned."""
        payload = generate_employee_payload(salary=52000.0, dependants=0)
        response = employees_client.create_employee(payload)
        assert_status_code(response, 200)
        data = response.json()

        assert data.get("gross") is not None, "gross should be present"
        assert isinstance(data["gross"], (int, float)), "gross should be numeric"
        assert data["gross"] > 0, "gross should be positive for a non-zero salary"

        employees_client.delete_employee(str(data["id"]))

    @pytest.mark.positive
    @pytest.mark.regression
    def test_benefits_cost_is_calculated(self, employees_client):
        """Benefits cost should be calculated and returned."""
        payload = generate_employee_payload(salary=52000.0, dependants=2)
        response = employees_client.create_employee(payload)
        assert_status_code(response, 200)
        data = response.json()

        assert data.get("benefitsCost") is not None, "benefitsCost should be present"
        assert isinstance(data["benefitsCost"], (int, float)), "benefitsCost should be numeric"
        assert data["benefitsCost"] >= 0, "benefitsCost should be non-negative"

        employees_client.delete_employee(str(data["id"]))

    @pytest.mark.positive
    @pytest.mark.regression
    def test_net_is_calculated(self, employees_client):
        """Net pay should be calculated and returned."""
        payload = generate_employee_payload(salary=52000.0, dependants=0)
        response = employees_client.create_employee(payload)
        assert_status_code(response, 200)
        data = response.json()

        assert data.get("net") is not None, "net should be present"
        assert isinstance(data["net"], (int, float)), "net should be numeric"

        employees_client.delete_employee(str(data["id"]))

    @pytest.mark.positive
    @pytest.mark.regression
    def test_net_equals_gross_minus_benefits(self, employees_client):
        """Net should equal gross minus benefitsCost."""
        payload = generate_employee_payload(salary=52000.0, dependants=3)
        response = employees_client.create_employee(payload)
        assert_status_code(response, 200)
        data = response.json()

        gross = data.get("gross", 0)
        benefits_cost = data.get("benefitsCost", 0)
        net = data.get("net", 0)

        expected_net = round(gross - benefits_cost, 2)
        actual_net = round(net, 2)

        assert actual_net == expected_net, (
            f"Net ({actual_net}) should equal gross ({gross}) - benefitsCost ({benefits_cost}) = {expected_net}"
        )

        employees_client.delete_employee(str(data["id"]))

    @pytest.mark.positive
    @pytest.mark.regression
    def test_more_dependants_increases_benefits_cost(self, employees_client):
        """More dependants should result in higher benefits cost."""
        # Employee with 0 dependants
        payload_0 = generate_employee_payload(salary=52000.0, dependants=0)
        response_0 = employees_client.create_employee(payload_0)
        assert_status_code(response_0, 200)
        data_0 = response_0.json()

        # Employee with 5 dependants
        payload_5 = generate_employee_payload(salary=52000.0, dependants=5)
        response_5 = employees_client.create_employee(payload_5)
        assert_status_code(response_5, 200)
        data_5 = response_5.json()

        benefits_0 = data_0.get("benefitsCost", 0)
        benefits_5 = data_5.get("benefitsCost", 0)

        assert benefits_5 > benefits_0, (
            f"Benefits with 5 dependants ({benefits_5}) should be greater than "
            f"benefits with 0 dependants ({benefits_0})"
        )

        # Cleanup
        employees_client.delete_employee(str(data_0["id"]))
        employees_client.delete_employee(str(data_5["id"]))

    @pytest.mark.positive
    @pytest.mark.regression
    def test_zero_dependants_has_base_benefits_cost(self, employees_client):
        """An employee with 0 dependants should still have a base benefits cost."""
        payload = generate_employee_payload(salary=52000.0, dependants=0)
        response = employees_client.create_employee(payload)
        assert_status_code(response, 200)
        data = response.json()

        benefits_cost = data.get("benefitsCost", 0)
        assert benefits_cost > 0, (
            "Even with 0 dependants, there should be a base benefits cost"
        )

        employees_client.delete_employee(str(data["id"]))

    @pytest.mark.positive
    @pytest.mark.regression
    def test_max_dependants_benefits_cost(self, employees_client):
        """An employee with 32 dependants (max) should have valid benefits calculation."""
        payload = generate_employee_payload(salary=52000.0, dependants=32)
        response = employees_client.create_employee(payload)
        assert_status_code(response, 200)
        data = response.json()

        assert data.get("benefitsCost") is not None
        assert data.get("gross") is not None
        assert data.get("net") is not None

        employees_client.delete_employee(str(data["id"]))

    @pytest.mark.positive
    @pytest.mark.regression
    def test_exact_benefits_cost_zero_dependants(self, employees_client):
        """Benefits cost for 0 dependants should be exactly $1000/26 = $38.46 per paycheck."""
        payload = generate_employee_payload(salary=52000.0, dependants=0)
        response = employees_client.create_employee(payload)
        assert_status_code(response, 200)
        data = response.json()

        # $1000/year / 26 paychecks = $38.46 per paycheck
        expected_benefits = round(1000 / 26, 2)
        assert round(data.get("benefitsCost", 0), 2) == expected_benefits, (
            f"Expected benefitsCost {expected_benefits}, got {data.get('benefitsCost')}"
        )

        expected_gross = round(52000 / 26, 2)
        assert round(data.get("gross", 0), 2) == expected_gross, (
            f"Expected gross {expected_gross}, got {data.get('gross')}"
        )

        expected_net = round(expected_gross - expected_benefits, 2)
        assert round(data.get("net", 0), 2) == expected_net, (
            f"Expected net {expected_net}, got {data.get('net')}"
        )

        employees_client.delete_employee(str(data["id"]))

    @pytest.mark.positive
    @pytest.mark.regression
    def test_exact_benefits_cost_with_dependants(self, employees_client):
        """Benefits cost for 3 dependants should be ($1000 + 3*$500)/26 = $96.15 per paycheck."""
        payload = generate_employee_payload(salary=52000.0, dependants=3)
        response = employees_client.create_employee(payload)
        assert_status_code(response, 200)
        data = response.json()

        # ($1000 + 3 * $500) / 26 = $2500 / 26 = $96.15
        annual_cost = 1000 + 3 * 500
        expected_benefits = round(annual_cost / 26, 2)
        assert round(data.get("benefitsCost", 0), 2) == expected_benefits, (
            f"Expected benefitsCost {expected_benefits}, got {data.get('benefitsCost')}"
        )

        expected_gross = round(52000 / 26, 2)
        expected_net = round(expected_gross - expected_benefits, 2)
        assert round(data.get("net", 0), 2) == expected_net, (
            f"Expected net {expected_net}, got {data.get('net')}"
        )

        employees_client.delete_employee(str(data["id"]))

    @pytest.mark.positive
    @pytest.mark.regression
    def test_same_salary_same_dependants_same_benefits(self, employees_client):
        """Two employees with the same salary and dependants should have the same benefits."""
        payload_1 = generate_employee_payload(salary=52000.0, dependants=2)
        payload_2 = generate_employee_payload(salary=52000.0, dependants=2)

        response_1 = employees_client.create_employee(payload_1)
        assert_status_code(response_1, 200)
        data_1 = response_1.json()

        response_2 = employees_client.create_employee(payload_2)
        assert_status_code(response_2, 200)
        data_2 = response_2.json()

        assert round(data_1.get("benefitsCost", 0), 2) == round(data_2.get("benefitsCost", 0), 2), (
            "Same salary and dependants should yield same benefitsCost"
        )
        assert round(data_1.get("gross", 0), 2) == round(data_2.get("gross", 0), 2), (
            "Same salary should yield same gross"
        )
        assert round(data_1.get("net", 0), 2) == round(data_2.get("net", 0), 2), (
            "Same salary and dependants should yield same net"
        )

        # Cleanup
        employees_client.delete_employee(str(data_1["id"]))
        employees_client.delete_employee(str(data_2["id"]))
