# SQL Transformation Prompts Documentation

## Overview

This document provides comprehensive documentation for the SQL transformation prompts system used in the MyQuery platform. The SQL transformation prompts are designed to convert SQL queries that return only text or date data into queries that include numeric data suitable for visualization and 4D analysis.

## File: sql-transformation-prompt.ts

**Location:** `app\(themed)\(SignedIn)\(dashboard)\dashboard-builder\_open-ai-actions\prompts\sql-transformation-prompt.ts`

### Purpose

The SQL transformation prompts system provides expert SQL transformation capabilities to enhance queries for visualization purposes. The system specializes in adding aggregations, counts, and numeric measures to text-based queries while maintaining data integrity and query performance.

## Core Functions

### 1. getSqlTransformationSystemPrompt()

**Type:** Expert SQL Transformer System
**Purpose:** Modifies SQL queries to include numeric data for visualization by adding aggregations

#### Transformation Principles

**Core Objective:**

- Transform queries returning only text or date data into queries with numeric data
- Add COUNT, SUM, AVG, or similar aggregations for visualization compatibility
- Maintain original query intent while enhancing with numeric measures
- Return original query unchanged if numeric data already exists

#### Basic Transformation Examples

**Simple Count Aggregation:**

```sql
-- Input (text only)
SELECT name FROM customers ORDER BY name

-- Output (with numeric data)
SELECT name, COUNT(*) as count
FROM customers
GROUP BY name
ORDER BY count DESC
```

**Time-Based Aggregation:**

```sql
-- Input (text and date)
SELECT actor_name, last_update
FROM actor
ORDER BY last_update DESC

-- Output (with count measure)
SELECT actor_name, COUNT(*) as appearances, last_update
FROM actor
GROUP BY actor_name, last_update
ORDER BY last_update DESC
```

**Complex Join Transformation:**

```sql
-- Input (concatenated text)
SELECT a.first_name || ' ' || a.last_name AS actor_name, a.last_update
FROM actor a
ORDER BY a.last_update DESC

-- Output (with related table join and count)
SELECT a.first_name || ' ' || a.last_name AS actor_name, COUNT(*) as film_count
FROM actor a
JOIN film_actor fa ON a.actor_id = fa.actor_id
GROUP BY actor_name
ORDER BY film_count DESC
LIMIT 10
```

#### 4D Visualization Transformations

**4D Data Requirements:**

- Include at least 3 dimensions plus a numeric measure
- Incorporate time-based dimension for temporal analysis
- Ensure logical grouping of data with reasonable cardinality
- Add appropriate LIMIT clauses to prevent overwhelming visualizations

**Multi-Dimensional Examples:**

```sql
-- Category, Region, Time, and Measure
SELECT category, region, EXTRACT(YEAR FROM date) as year, COUNT(*) as count
FROM sales
GROUP BY category, region, year

-- Product, Segment, Quarter, and Revenue
SELECT product_type, customer_segment, quarter, SUM(revenue) as total_revenue
FROM sales
GROUP BY product_type, customer_segment, quarter
```

#### Specialized Transformations

**Actor Participation Over Time:**

- Join actor table with film_actor and film tables
- Use release_year or dates from film table for time dimension
- COUNT films per actor per time period
- Include proper GROUP BY clauses

**Database-Specific Considerations:**

- Respect PostgreSQL syntax requirements and functions
- Use appropriate date/time extraction functions
- Handle string concatenation and aggregation properly
- Maintain compatibility with database-specific features

#### Transformation Decision Logic

**When to Transform:**

- Query returns only text or date columns
- No existing numeric measures for visualization
- Query structure allows meaningful aggregation
- Additional numeric context would enhance understanding

**When NOT to Transform:**

- Query already contains numeric columns
- Transformation would change fundamental query purpose
- Aggregation would lose important detail level
- Original query structure doesn't support meaningful grouping

### 2. getSqlTransformationUserPrompt(originalSql, chartTitle?)

**Type:** User Transformation Request Generator
**Purpose:** Creates specific transformation requests for user-provided SQL queries

#### Parameters

- **originalSql:** The original SQL query to be transformed
- **chartTitle:** Optional chart title to provide context for transformation approach

#### Transformation Context

**With Chart Title:**

- Uses chart title to guide transformation approach
- Aligns numeric measures with chart visualization requirements
- Considers chart type implications for data structure
- Optimizes for specific visualization needs

**Without Chart Title:**

- Applies general 4D visualization transformation rules
- Focuses on adding meaningful numeric measures
- Ensures compatibility with common chart types
- Maintains flexibility for various visualization approaches

## Usage Examples

### Customer Analysis Transformation

```typescript
const originalSql =
  "SELECT customer_name, registration_date FROM customers ORDER BY registration_date";
const chartTitle = "Customer Registration Trends";

const transformationPrompt = getSqlTransformationUserPrompt(
  originalSql,
  chartTitle,
);
```

**Expected Transformation:**

```sql
SELECT customer_name,
       DATE_TRUNC('month', registration_date) as month,
       COUNT(*) as registrations
FROM customers
GROUP BY customer_name, month
ORDER BY month, registrations DESC
```

### Product Sales Analysis

```typescript
const originalSql = "SELECT product_name, category FROM products";
const chartTitle = "Product Performance by Category";

const transformationPrompt = getSqlTransformationUserPrompt(
  originalSql,
  chartTitle,
);
```

**Expected Transformation:**

```sql
SELECT product_name,
       category,
       COUNT(*) as product_count,
       SUM(units_sold) as total_units
FROM products p
JOIN sales s ON p.product_id = s.product_id
GROUP BY product_name, category
ORDER BY total_units DESC
LIMIT 20
```

### Geographic Analysis Transformation

```typescript
const originalSql = "SELECT city, state, country FROM locations";
const chartTitle = "Regional Distribution Analysis";

const transformationPrompt = getSqlTransformationUserPrompt(
  originalSql,
  chartTitle,
);
```

**Expected Transformation:**

```sql
SELECT city,
       state,
       country,
       COUNT(*) as location_count,
       SUM(population) as total_population
FROM locations
GROUP BY city, state, country
ORDER BY total_population DESC
LIMIT 50
```

### Time Series Analysis

```typescript
const originalSql = "SELECT order_date, status FROM orders";
const chartTitle = "Order Status Trends Over Time";

const transformationPrompt = getSqlTransformationUserPrompt(
  originalSql,
  chartTitle,
);
```

**Expected Transformation:**

```sql
SELECT DATE_TRUNC('week', order_date) as week,
       status,
       COUNT(*) as order_count,
       SUM(total_amount) as weekly_revenue
FROM orders
GROUP BY week, status
ORDER BY week, status
```

### Complex Relationship Analysis

```typescript
const originalSql =
  "SELECT u.username, p.title FROM users u JOIN posts p ON u.user_id = p.author_id";
const chartTitle = "User Content Creation Activity";

const transformationPrompt = getSqlTransformationUserPrompt(
  originalSql,
  chartTitle,
);
```

**Expected Transformation:**

```sql
SELECT u.username,
       DATE_TRUNC('month', p.created_date) as month,
       COUNT(p.post_id) as posts_created,
       AVG(p.view_count) as avg_views
FROM users u
JOIN posts p ON u.user_id = p.author_id
GROUP BY u.username, month
ORDER BY month, posts_created DESC
LIMIT 100
```

## Transformation Strategies

### Aggregation Patterns

**Count-Based Transformations:**

- Add COUNT(\*) for frequency analysis
- Group by categorical columns for distribution
- Order by count DESC for top-N analysis
- Include LIMIT for performance optimization

**Sum-Based Transformations:**

- Add SUM() for total calculations
- Combine with GROUP BY for category totals
- Use for revenue, quantity, or volume analysis
- Include multiple SUM columns for comprehensive view

**Average-Based Transformations:**

- Add AVG() for central tendency analysis
- Useful for performance metrics and KPIs
- Combine with COUNT for weighted analysis
- Apply to continuous numeric measures

**Time-Based Transformations:**

- Use DATE_TRUNC for time period grouping
- Extract year, quarter, month for temporal analysis
- Combine with other aggregations for trend analysis
- Include time ordering for chronological visualization

### 4D Visualization Optimization

**Dimension Selection:**

- Choose 3-4 meaningful categorical dimensions
- Include at least one time-based dimension
- Ensure reasonable cardinality (not too many unique values)
- Select dimensions that support business analysis

**Measure Selection:**

- Include primary numeric measure (count, sum, average)
- Consider secondary measures for enhanced analysis
- Choose measures that align with chart purpose
- Ensure measures are meaningful for comparison

**Performance Considerations:**

- Add LIMIT clauses to prevent excessive data
- Optimize GROUP BY for indexing efficiency
- Consider pre-aggregation for large datasets
- Balance detail level with performance requirements

### Database-Specific Adaptations

**PostgreSQL Optimizations:**

- Use DATE_TRUNC for time-based grouping
- Leverage EXTRACT for date component analysis
- Use string concatenation (||) operator appropriately
- Apply PostgreSQL-specific aggregation functions

**Common Patterns:**

- Window functions for ranking and percentiles
- CASE statements for conditional aggregation
- CTEs for complex transformation logic
- Subqueries for multi-level aggregation

## Best Practices

### Query Structure Guidelines

**Maintain Query Intent:**

- Preserve original query logic and purpose
- Add numeric measures without changing core meaning
- Ensure transformations enhance rather than replace original intent
- Validate that aggregations make business sense

**Performance Optimization:**

- Include appropriate LIMIT clauses
- Use efficient GROUP BY combinations
- Consider indexing implications of transformations
- Balance detail level with query performance

**Data Quality:**

- Handle NULL values appropriately in aggregations
- Use COALESCE or similar functions for data completeness
- Validate aggregation logic against business rules
- Ensure consistent data types across dimensions

### Visualization Compatibility

**Chart Type Considerations:**

- Bar charts: Include categorical dimensions and numeric measures
- Line charts: Ensure time-based dimension with numeric trends
- Pie charts: Limit categories and include percentage calculations
- Scatter plots: Include multiple numeric dimensions

**4D Analysis Requirements:**

- Include at least 3 categorical dimensions
- Add meaningful time dimension for temporal analysis
- Provide appropriate numeric measures for comparison
- Ensure reasonable data volume for visualization performance

### Error Prevention

**Common Pitfalls:**

- Avoid over-aggregation that loses important detail
- Prevent excessive cardinality in grouping dimensions
- Ensure aggregation functions match data types
- Validate JOIN conditions in transformation

**Quality Assurance:**

- Test transformed queries for syntax correctness
- Verify business logic of aggregations
- Check performance implications of transformations
- Validate output against expected visualization requirements

## Integration Points

- **Query Builder:** Integrates with SQL query construction and optimization tools
- **Chart Generation:** Provides numeric data for visualization components
- **4D Analysis:** Enables multi-dimensional data exploration and analysis
- **Performance Monitoring:** Supports query performance tracking and optimization
- **Database Management:** Connects with database-specific optimization features

## Maintenance Notes

- Update transformation patterns based on new visualization requirements
- Enhance database-specific optimization techniques as platforms evolve
- Improve aggregation logic based on performance monitoring and user feedback
- Expand support for additional chart types and 4D analysis patterns
- Maintain compatibility with evolving SQL standards and database features
