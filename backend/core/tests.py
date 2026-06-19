import json
from unittest.mock import MagicMock, patch

from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

User = get_user_model()


@override_settings(
    STRIPE_SECRET_KEY="sk_test_fake",
    STRIPE_WEBHOOK_SECRET="",
    STRIPE_PRICE_PRO="price_test_pro",
    FRONTEND_URL="http://localhost:3000",
)
class BillingTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="test@example.com",
            email="test@example.com",
            password="testpass123",
            first_name="Test",
        )

    @patch("core.billing_views.stripe.checkout.Session.create")
    def test_checkout_creates_session(self, mock_create):
        mock_create.return_value = MagicMock(url="https://checkout.stripe.com/test")

        self.client.force_authenticate(user=self.user)
        response = self.client.post("/api/billing/checkout/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["url"], "https://checkout.stripe.com/test")
        mock_create.assert_called_once()

        call_kwargs = mock_create.call_args.kwargs
        self.assertEqual(call_kwargs["mode"], "subscription")
        self.assertEqual(call_kwargs["payment_method_collection"], "if_required")
        self.assertEqual(call_kwargs["subscription_data"]["trial_period_days"], 14)

    def test_checkout_requires_auth(self):
        response = self.client.post("/api/billing/checkout/")
        self.assertEqual(response.status_code, 401)

    @patch("core.billing_views.stripe.checkout.Session.create")
    def test_checkout_rejects_active_subscription(self, mock_create):
        self.user.plan_tier = "pro"
        self.user.subscription_status = "active"
        self.user.save()

        self.client.force_authenticate(user=self.user)
        response = self.client.post("/api/billing/checkout/")

        self.assertEqual(response.status_code, 400)
        mock_create.assert_not_called()

    def test_webhook_checkout_completed_updates_user(self):
        payload = {
            "type": "checkout.session.completed",
            "data": {
                "object": {
                    "client_reference_id": str(self.user.id),
                    "customer": "cus_test123",
                    "subscription": None,
                }
            },
        }

        response = self.client.post(
            "/api/billing/webhook/",
            data=json.dumps(payload),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertEqual(self.user.stripe_customer_id, "cus_test123")
        self.assertEqual(self.user.plan_tier, "pro")
        self.assertEqual(self.user.subscription_status, "trialing")

    def test_webhook_subscription_deleted_downgrades_user(self):
        self.user.stripe_customer_id = "cus_test123"
        self.user.plan_tier = "pro"
        self.user.subscription_status = "active"
        self.user.save()

        payload = {
            "type": "customer.subscription.deleted",
            "data": {
                "object": {
                    "customer": "cus_test123",
                }
            },
        }

        response = self.client.post(
            "/api/billing/webhook/",
            data=json.dumps(payload),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertEqual(self.user.plan_tier, "free")
        self.assertEqual(self.user.subscription_status, "free")


class PlanLimitTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="free@example.com",
            email="free@example.com",
            password="testpass123",
            first_name="Free",
        )
        self.client.force_authenticate(user=self.user)

    def test_free_user_workspace_limit(self):
        from core.models import Workspace

        for i in range(3):
            Workspace.objects.create(name=f"WS {i}", owner=self.user)

        self.assertFalse(self.user.can_create_workspace())

        response = self.client.post(
            "/api/workspaces/",
            {"name": "WS 4", "description": ""},
            format="json",
        )
        self.assertEqual(response.status_code, 403)
