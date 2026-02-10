"""
Base HTTP client wrapping requests library with common configuration.
"""

import logging
from typing import Optional

import requests

from config.settings import BASE_URL, API_TOKEN, REQUEST_TIMEOUT

logger = logging.getLogger(__name__)


class BaseClient:
    """Base API client with shared HTTP methods and authentication."""

    def __init__(self, base_url: Optional[str] = None, token: Optional[str] = None):
        self.base_url = (base_url or BASE_URL).rstrip("/")
        self.session = requests.Session()
        self.timeout = REQUEST_TIMEOUT

        # Set up authentication
        token = token or API_TOKEN
        if token:
            self.session.headers.update({"Authorization": f"Basic {token}"})
        elif not token:
            logger.warning("No API token provided. Requests may fail due to authentication errors.")

        self.session.headers.update({
            "Content-Type": "application/json",
            "Accept": "application/json",
        })

    def _url(self, endpoint: str) -> str:
        """Build full URL from endpoint."""
        return f"{self.base_url}{endpoint}"

    def get(self, endpoint: str, **kwargs) -> requests.Response:
        """Send a GET request."""
        url = self._url(endpoint)
        logger.info(f"GET {url}")
        response = self.session.get(url, timeout=self.timeout, **kwargs)
        logger.info(f"Response: {response.status_code}")
        return response

    def post(self, endpoint: str, json: dict = None, **kwargs) -> requests.Response:
        """Send a POST request."""
        url = self._url(endpoint)
        logger.info(f"POST {url} | Body: {json}")
        response = self.session.post(url, json=json, timeout=self.timeout, **kwargs)
        logger.info(f"Response: {response.status_code}")
        return response

    def put(self, endpoint: str, json: dict = None, **kwargs) -> requests.Response:
        """Send a PUT request."""
        url = self._url(endpoint)
        logger.info(f"PUT {url} | Body: {json}")
        response = self.session.put(url, json=json, timeout=self.timeout, **kwargs)
        logger.info(f"Response: {response.status_code}")
        return response

    def delete(self, endpoint: str, **kwargs) -> requests.Response:
        """Send a DELETE request."""
        url = self._url(endpoint)
        logger.info(f"DELETE {url}")
        response = self.session.delete(url, timeout=self.timeout, **kwargs)
        logger.info(f"Response: {response.status_code}")
        return response

    def close(self):
        """Close the underlying session."""
        self.session.close()
