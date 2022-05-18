import django

import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "prominformatics.settings")
django.setup()

from .celery import app as celery_app
__all__ = ("celery_app",)