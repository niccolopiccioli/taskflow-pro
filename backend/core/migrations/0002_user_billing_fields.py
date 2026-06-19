"""Add subscription fields to User model."""

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="plan_tier",
            field=models.CharField(default="free", max_length=20),
        ),
        migrations.AddField(
            model_name="user",
            name="stripe_customer_id",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name="user",
            name="subscription_status",
            field=models.CharField(default="free", max_length=30),
        ),
    ]
