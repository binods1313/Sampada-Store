"""
Sampada Store - Sanity CMS Connector for Onyx

This connector indexes all products from Sampada's Sanity CMS into Onyx's
search index, enabling AI-powered product search and recommendations.

Usage:
    1. Copy this file to: onyx/backend/onyx/connectors/sanity.py
    2. Add SANITY_PROJECT_ID and SANITY_DATASET to Onyx .env
    3. Create connector via Onyx admin UI or API
"""

from __future__ import annotations

import os
from datetime import datetime, timezone
from typing import Any, Iterator

import requests

from onyx.connectors.connector import Connector
from onyx.connectors.models import (
    ConnectorMissingCredentialError,
    Document,
    IndexAttemptMetadata,
    Section,
)
from onyx.indexing.indexing_heartbeat import IndexingHeartbeat


class SanityConnectorCredential:
    """
    Credentials for connecting to Sanity CMS.
    """

    def __init__(
        self,
        project_id: str,
        dataset: str = "production",
        api_token: str | None = None,
        api_version: str = "2024-01-01",
    ):
        self.project_id = project_id
        self.dataset = dataset
        self.api_token = api_token
        self.api_version = api_version

    def validate(self) -> None:
        if not self.project_id:
            raise ConnectorMissingCredentialError("Sanity Project ID is required")


class SanityProductDocument(Document):
    """
    Represents a product from Sanity CMS for indexing.
    """

    pass


class SanityConnector(Connector[SanityConnectorCredential]):
    """
    Connects to Sanity CMS and indexes all products for AI-powered search.
    
    Products indexed include:
    - Product name, description, price
    - Category, tags, specifications
    - Variant information (colors, sizes)
    - Reviews and ratings
    """

    def __init__(
        self,
        batch_size: int = 50,
        include_reviews: bool = True,
        include_variants: bool = True,
    ):
        self.batch_size = batch_size
        self.include_reviews = include_reviews
        self.include_variants = include_variants
        self.credentials: SanityConnectorCredential | None = None

    def load_credentials(self, credentials: dict[str, Any]) -> dict[str, Any] | None:
        """Load credentials from Onyx admin UI."""
        self.credentials = SanityConnectorCredential(
            project_id=credentials.get("sanity_project_id", os.getenv("NEXT_PUBLIC_SANITY_PROJECT_ID", "")),
            dataset=credentials.get("sanity_dataset", os.getenv("NEXT_PUBLIC_SANITY_DATASET", "production")),
            api_token=credentials.get("sanity_api_token", os.getenv("SANITY_API_WRITE_TOKEN")),
            api_version=credentials.get("api_version", "2024-01-01"),
        )
        return None

    def _build_sanity_query(self) -> str:
        """Build GROQ query to fetch all products with full details."""
        query = """*[_type == "product"]{
            _id,
            _createdAt,
            _updatedAt,
            name,
            slug,
            description,
            price,
            discount,
            category-> { name, slug },
            tags[],
            specifications[] {
                label,
                value
            },
            details,
            inStock,
            rating,
            reviewCount,
            "imageUrl": image[0].asset->url,
            variants[] {
                colorName,
                colorHex,
                size,
                variantPrice,
                variantDiscount,
                variantStock,
                "imageUrl": variantImage.asset->url
            },
            reviews[] {
                rating,
                reviewText,
                author,
                createdAt,
                helpfulVotes
            }
        }"""
        return query

    def _product_to_document(self, product: dict[str, Any]) -> Document:
        """Convert a Sanity product to Onyx Document for indexing."""
        # Build main content text
        price_info = f"${product.get('price', 0)}"
        if product.get('discount'):
            price_info += f" (was ${product.get('discount', 0)})"

        main_text = f"""Product: {product.get('name', 'Unknown')}
Category: {product.get('category', {}).get('name', 'Uncategorized')}
Price: {price_info}
Description: {product.get('description', '')}

Details:
{product.get('details', '')}

Specifications:
"""
        # Add specifications
        for spec in product.get('specifications', []):
            main_text += f"- {spec.get('label', '')}: {spec.get('value', '')}\n"

        # Add variants if included
        if self.include_variants and product.get('variants'):
            main_text += "\nAvailable Variants:\n"
            for variant in product['variants']:
                variant_price = variant.get('variantPrice', product.get('price', 0))
                variant_stock = variant.get('variantStock', 0)
                main_text += f"- {variant.get('colorName', '')} / {variant.get('size', '')}: ${variant_price} (Stock: {variant_stock})\n"

        # Add reviews summary if included
        if self.include_reviews and product.get('reviews'):
            avg_rating = product.get('rating', 0)
            review_count = product.get('reviewCount', len(product['reviews']))
            main_text += f"\nCustomer Reviews: {avg_rating}/5 stars ({review_count} reviews)\n"
            
            # Add top reviews
            top_reviews = sorted(product['reviews'], key=lambda r: r.get('helpfulVotes', 0), reverse=True)[:3]
            for review in top_reviews:
                main_text += f"- {review.get('author', 'Anonymous')}: {review.get('reviewText', '')}\n"

        # Build metadata
        metadata = {
            "product_id": product.get('_id', ''),
            "slug": product.get('slug', {}).get('current', ''),
            "category": product.get('category', {}).get('name', ''),
            "price": product.get('price', 0),
            "in_stock": product.get('inStock', True),
            "rating": product.get('rating', 0),
            "review_count": product.get('reviewCount', 0),
            "tags": ",".join(product.get('tags', [])),
        }

        product_url = f"/product/{product.get('slug', {}).get('current', '')}"

        return Document(
            id=product.get('_id', ''),
            sections=[Section(text=main_text, link=product_url)],
            source_type="Sampada Product Catalog",
            metadata=metadata,
            doc_updated_at=datetime.fromisoformat(product.get('_updatedAt', datetime.now(timezone.utc).isoformat())),
        )

    def retrieve_documents(
        self,
        start: int | None = None,
        end: int | None = None,
        *args,
        **kwargs,
    ) -> Iterator[Document]:
        """Fetch all products from Sanity CMS."""
        if self.credentials is None:
            raise ConnectorMissingCredentialError("Sanity credentials not loaded")

        # Build Sanity API URL
        base_url = f"https://{self.credentials.project_id}.api.sanity.io"
        query_url = f"{base_url}/v{self.credentials.api_version}/data/query/{self.credentials.dataset}"

        # Execute query
        groq_query = self._build_sanity_query()
        response = requests.get(
            query_url,
            params={"query": groq_query},
            headers={
                "Authorization": f"Bearer {self.credentials.api_token}" if self.credentials.api_token else "",
                "Content-Type": "application/json",
            },
            timeout=60,
        )
        response.raise_for_status()

        products = response.json().get("result", [])

        # Convert and yield each product as a Document
        for product in products:
            yield self._product_to_document(product)

    def poll_source(
        self,
        start: datetime | None = None,
        end: datetime | None = None,
        *args,
        **kwargs,
    ) -> Iterator[Document]:
        """
        Poll Sanity for updated products since last sync.
        Uses Sanity's delta API to fetch only changed documents.
        """
        if self.credentials is None:
            raise ConnectorMissingCredentialError("Sanity credentials not loaded")

        # Build query with time filter
        time_filter = ""
        if start:
            time_filter = f' && _updatedAt > "{start.isoformat()}"'

        query = f"""*[_type == "product"{time_filter}]{{
            _id,
            _createdAt,
            _updatedAt,
            name,
            slug,
            description,
            price,
            discount,
            category-> {{ name, slug }},
            tags[],
            specifications[] {{
                label,
                value
            }},
            details,
            inStock,
            rating,
            reviewCount
        }}"""

        base_url = f"https://{self.credentials.project_id}.api.sanity.io"
        query_url = f"{base_url}/v{self.credentials.api_version}/data/query/{self.credentials.dataset}"

        response = requests.get(
            query_url,
            params={"query": query},
            headers={
                "Authorization": f"Bearer {self.credentials.api_token}" if self.credentials.api_token else "",
                "Content-Type": "application/json",
            },
            timeout=60,
        )
        response.raise_for_status()

        products = response.json().get("result", [])

        for product in products:
            yield self._product_to_document(product)


# Connector registration for Onyx admin UI
def sanity_connector_factory(**kwargs):
    """Factory function for Onyx to create Sanity connector instances."""
    return SanityConnector(
        batch_size=kwargs.get("batch_size", 50),
        include_reviews=kwargs.get("include_reviews", True),
        include_variants=kwargs.get("include_variants", True),
    )


# Connector metadata for Onyx admin UI
CONNECTOR_DISPLAY_NAME = "Sampada Product Catalog"
CONNECTOR_DESCRIPTION = "Indexes products from Sampada Store's Sanity CMS for AI-powered search and recommendations"
CONNECTOR_INPUT_FIELDS = [
    {
        "name": "sanity_project_id",
        "display_name": "Sanity Project ID",
        "type": "text",
        "required": True,
    },
    {
        "name": "sanity_dataset",
        "display_name": "Sanity Dataset",
        "type": "text",
        "required": False,
        "default": "production",
    },
    {
        "name": "sanity_api_token",
        "display_name": "Sanity API Token",
        "type": "secret",
        "required": False,
    },
]
