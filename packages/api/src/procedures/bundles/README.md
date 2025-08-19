# Bundles CRUD Operations

This module provides comprehensive CRUD (Create, Read, Update, Delete) operations for the bundles system, including vendors, products, bundles, and related entities.

## Overview

The bundles system consists of the following main entities:
- **Vendors**: Companies or individuals offering products
- **Products**: Items/services offered by vendors
- **Product Images**: Images associated with products
- **Bundles**: Collections of products
- **Bundle Items**: Individual products within bundles
- **Product Approvals**: Admin approval workflow for products

## Authentication

All bundles operations require admin privileges using the `adminProcedure` middleware.

## Available Operations

### Create Operations (`/bundles/create`)

- `vendor` - Create a new vendor
- `product` - Create a new product
- `productImage` - Add an image to a product
- `bundle` - Create a new bundle
- `bundleItem` - Add a product to a bundle
- `productApproval` - Approve or reject a product

### List Operations (`/bundles/list`)

- `vendors` - List vendors with filtering and pagination
- `products` - List products with filtering and pagination
- `bundles` - List bundles with filtering and pagination

### Get Operations (`/bundles/get`)

- `vendor` - Get a single vendor by ID or slug
- `product` - Get a single product by ID or slug
- `bundle` - Get a single bundle by ID or slug
- `productImages` - Get all images for a product
- `bundleItems` - Get all items in a bundle
- `productApprovals` - Get approval history for a product

### Update Operations (`/bundles/update`)

- `vendor` - Update vendor information
- `product` - Update product information
- `productImage` - Update product image details
- `bundle` - Update bundle information
- `bundleItem` - Update bundle item details

### Delete Operations (`/bundles/delete`)

- `vendor` - Delete a vendor (cascades to products)
- `product` - Delete a product (cascades to images and approvals)
- `productImage` - Delete a product image
- `bundle` - Delete a bundle (cascades to bundle items)
- `bundleItem` - Delete a bundle item

## Usage Examples

### Creating a Vendor

```typescript
const vendor = await trpc.bundles.create.vendor.mutate({
  name: "Adventure Tours Inc",
  slug: "adventure-tours",
  description: "Premium adventure travel experiences",
  contactEmail: "info@adventuretours.com",
  website: "https://adventuretours.com"
});
```

### Creating a Product

```typescript
const product = await trpc.bundles.create.product.mutate({
  vendorId: "vendor-id",
  title: "Mountain Hiking Adventure",
  slug: "mountain-hiking",
  type: "adventure",
  basePriceCents: 15000,
  currency: "USD",
  description: "Experience the thrill of mountain hiking"
});
```

### Creating a Bundle

```typescript
const bundle = await trpc.bundles.create.bundle.mutate({
  title: "Adventure Package",
  slug: "adventure-package",
  description: "Complete adventure experience",
  status: "draft",
  isPublished: false
});
```

### Adding Products to a Bundle

```typescript
const bundleItem = await trpc.bundles.create.bundleItem.mutate({
  bundleId: "bundle-id",
  productId: "product-id",
  quantity: 1,
  position: 0
});
```

### Listing Bundles with Filters

```typescript
const bundles = await trpc.bundles.list.bundles.query({
  status: "published",
  isPublished: true,
  page: 1,
  limit: 20
});
```

### Listing Products with Filters

```typescript
const products = await trpc.bundles.list.products.query({
  vendorId: "vendor-id",
  type: "adventure",
  status: "approved",
  minPrice: 10000,
  maxPrice: 50000,
  page: 1,
  limit: 20
});
```

### Getting a Single Bundle

```typescript
const bundle = await trpc.bundles.get.bundle.query({
  id: "bundle-id"
  // or slug: "adventure-package"
});
```

### Getting Bundle Items

```typescript
const items = await trpc.bundles.get.bundleItems.query({
  bundleId: "bundle-id"
});
```

### Getting Product Images

```typescript
const images = await trpc.bundles.get.productImages.query({
  productId: "product-id"
});
```

### Updating a Bundle

```typescript
const updatedBundle = await trpc.bundles.update.bundle.mutate({
  id: "bundle-id",
  title: "Updated Adventure Package",
  isPublished: true
});
```

### Deleting a Bundle

```typescript
const result = await trpc.bundles.delete.bundle.mutate({
  id: "bundle-id"
});
```

## Data Validation

All operations include comprehensive input validation using Zod schemas:

- Required fields are enforced
- Email addresses are validated
- URLs are validated
- Price ranges are enforced
- Enum values are restricted to valid options

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (admin access required)
- `404` - Not Found (entity doesn't exist)
- `409` - Conflict (duplicate slug, etc.)
- `500` - Internal Server Error

## Database Relationships

The bundles system uses proper foreign key relationships with cascade deletes:

- Vendors → Products (cascade delete)
- Products → Product Images (cascade delete)
- Products → Product Approvals (cascade delete)
- Bundles → Bundle Items (cascade delete)

## Pagination

List operations support pagination with the following parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

Response includes pagination metadata:
```typescript
{
  items: [...],
  pagination: {
    page: 1,
    limit: 20,
    total: 150,
    totalPages: 8
  }
}
```

## API Structure

The bundles router follows a clear separation of concerns:

```typescript
bundles: {
  create: { /* Create operations */ },
  list: { /* List operations with pagination */ },
  get: { /* Get single items */ },
  update: { /* Update operations */ },
  delete: { /* Delete operations */ }
}
```

This structure makes it easy to understand and use the different types of operations available for managing bundles and related entities. 