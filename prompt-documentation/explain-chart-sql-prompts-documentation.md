# Explain Chart SQL Prompts Documentation

## Overview

This document provides comprehensive documentation for the explain chart SQL prompts system used in the MyQuery platform. The explain chart SQL prompts are designed to translate complex SQL and NoSQL queries into simple, business-friendly explanations that connect query logic to chart purposes.

## File: explain-chart-sql-prompts.ts

**Location:** `app\(themed)\(SignedIn)\(dashboard)\dashboard-builder\_open-ai-actions\prompts\explain-chart-sql-prompts.ts`

### Purpose

The explain chart SQL prompts system provides database expertise to translate technical query syntax into clear business language. The system focuses on explaining the business meaning of queries rather than technical syntax, helping users understand what data is being retrieved and how it relates to their charts.

## Core Functions

### 1. getExplainChartSQLSystemPrompt()

**Type:** Database Expert System for Query Explanation
**Purpose:** Translates SQL and NoSQL queries into simple, business-friendly explanations

#### Explanation Principles

**1. Business-Focused Communication**

- Focus on business meaning, not technical syntax
- Highlight what data is being retrieved or manipulated
- Explain filtering, grouping, and sorting in plain language
- Avoid unnecessary technical jargon
- Connect query purpose to chart title

**2. Accessible Language**

- Use analogies when helpful for complex concepts
- Provide concise, clear explanations (2-3 sentences)
- Use business terminology familiar to end users
- Relate queries to chart purposes and business objectives

**3. Query Validation**

- Identify clearly invalid, incomplete, or mismatched queries
- Provide constructive alternatives when queries don't match chart titles
- Suggest appropriate tables or data sources for specific chart purposes
- Recommend better approaches based on chart context

#### Invalid Query Handling

**When queries are clearly invalid, incomplete, or don't match chart titles:**

1. Acknowledge the query may not be suitable for explanation
2. Suggest what tables or data might be more appropriate for the chart title
3. Recommend a more suitable approach based on the chart title
4. Avoid forcing explanations that don't make business sense

### 2. getExplainChartSQLPrompt(chartTitle, sqlQuery)

**Type:** Specific Query Explanation Generator
**Purpose:** Creates tailored explanations for specific SQL queries in context of chart titles

#### Parameters

- **chartTitle:** The title of the chart the query is intended to support
- **sqlQuery:** The SQL or NoSQL query string to be explained

#### Explanation Requirements

**Concise Communication:**

- Provide 2-3 sentence explanations
- Use business terminology over technical jargon
- Relate query directly to chart's purpose
- Explain what data is shown and how it's organized

**Context Validation:**

- Ensure query matches chart title intent
- Identify mismatches between query and chart purpose
- Provide recommendations for better approaches when needed
- Suggest appropriate data sources when current query is unsuitable

## Usage Examples

### Sales Performance Query Explanation

```typescript
const chartTitle = "Top 10 Best-Selling Products";
const sqlQuery =
  "SELECT product_name, SUM(sales) FROM products GROUP BY product_name ORDER BY SUM(sales) DESC LIMIT 10";

const explanation = getExplainChartSQLPrompt(chartTitle, sqlQuery);
```

**Expected Explanation:**
"This query finds your top 10 best-selling products by calculating the total sales for each product and sorting them from highest to lowest sales volume. The results show which products generate the most revenue for your business."

### Customer Analytics Query Explanation

```typescript
const chartTitle = "Active Customer Distribution";
const mongoQuery =
  '{"collection": "customers", "operation": "find", "filter": {"status": "active"}, "options": {"$limit": 100}}';

const explanation = getExplainChartSQLPrompt(chartTitle, mongoQuery);
```

**Expected Explanation:**
"This query retrieves up to 100 active customers from your customer database. The results help you understand the distribution and characteristics of your currently engaged customer base."

### Revenue Analysis Query Explanation

```typescript
const chartTitle = "Monthly Revenue Growth";
const sqlQuery =
  "SELECT MONTH(order_date) as month, SUM(total_amount) as revenue FROM orders WHERE YEAR(order_date) = 2024 GROUP BY MONTH(order_date) ORDER BY month";

const explanation = getExplainChartSQLPrompt(chartTitle, sqlQuery);
```

**Expected Explanation:**
"This query calculates total revenue for each month in 2024 by summing all order amounts and grouping them by month. The results show how your monthly revenue changes throughout the year, helping identify growth trends and seasonal patterns."

### Geographic Sales Query Explanation

```typescript
const chartTitle = "Sales by Region";
const sqlQuery =
  "SELECT r.region_name, SUM(s.amount) as total_sales FROM sales s JOIN regions r ON s.region_id = r.id GROUP BY r.region_name ORDER BY total_sales DESC";

const explanation = getExplainChartSQLPrompt(chartTitle, sqlQuery);
```

**Expected Explanation:**
"This query combines sales data with regional information to calculate total sales amount for each geographic region. The results are sorted by highest sales first, showing which regions are your strongest performing markets."

### Invalid Query Handling Example

```typescript
const chartTitle = "Monthly Revenue Growth";
const invalidQuery = "SELECT * FROM users WHERE created_at > '2024-01-01'";

const explanation = getExplainChartSQLPrompt(chartTitle, invalidQuery);
```

**Expected Response:**
"The provided query doesn't appear to analyze revenue over time as suggested by the chart title. Consider using the sales_transactions or revenue_data tables with date-based grouping to properly track monthly revenue changes. A more appropriate query would sum revenue amounts grouped by month to show growth trends."

### Complex Aggregation Query Explanation

```typescript
const chartTitle = "Customer Lifetime Value by Segment";
const sqlQuery = `
  SELECT 
    c.segment,
    AVG(customer_totals.lifetime_value) as avg_clv
  FROM customers c
  JOIN (
    SELECT customer_id, SUM(total_amount) as lifetime_value
    FROM orders 
    GROUP BY customer_id
  ) customer_totals ON c.id = customer_totals.customer_id
  GROUP BY c.segment
  ORDER BY avg_clv DESC
`;

const explanation = getExplainChartSQLPrompt(chartTitle, sqlQuery);
```

**Expected Explanation:**
"This query calculates the average customer lifetime value for each customer segment by first totaling all orders per customer, then averaging those totals within each segment. The results show which customer segments are most valuable to your business, helping guide marketing and retention strategies."

## Query Type Support

### SQL Query Explanations

**SELECT Statements:**

- Explain data retrieval purpose and scope
- Describe filtering criteria in business terms
- Clarify grouping and aggregation meaning
- Translate sorting logic to business priorities

**Aggregate Functions:**

- SUM: "calculating total amounts" or "adding up values"
- AVG: "finding average" or "calculating typical values"
- COUNT: "counting occurrences" or "tallying items"
- MAX/MIN: "finding highest/lowest values"

**JOIN Operations:**

- Explain relationship connections in business context
- Describe how multiple data sources combine
- Clarify why joining is necessary for the analysis
- Avoid technical join type terminology

**Date/Time Functions:**

- Translate date filtering to time periods
- Explain time-based grouping for trends
- Describe seasonal or periodic analysis
- Convert technical date functions to business meaning

### NoSQL Query Explanations

**MongoDB Operations:**

- find: "retrieving" or "searching for"
- aggregate: "analyzing" or "summarizing"
- match: "filtering" or "selecting"
- group: "organizing by" or "categorizing"

**Filters and Criteria:**

- Explain selection criteria in business terms
- Describe data quality filters
- Clarify scope limitations
- Translate technical operators to business logic

## Best Practices

### Explanation Guidelines

**Language Clarity:**

- Use simple, everyday business language
- Avoid database-specific terminology
- Explain acronyms and technical terms when necessary
- Use active voice for clearer communication

**Business Context:**

- Connect queries to business objectives
- Explain why the analysis matters
- Relate results to decision-making processes
- Provide context for data significance

**Accuracy and Completeness:**

- Ensure explanations accurately reflect query logic
- Include important filtering or limitation details
- Mention data sources and scope when relevant
- Clarify any assumptions or limitations

### Common Query Patterns

**Performance Metrics:**

- Revenue analysis: "calculating total income from sales"
- Growth analysis: "comparing performance over time periods"
- Efficiency metrics: "measuring productivity or utilization"

**Customer Analytics:**

- Segmentation: "grouping customers by characteristics"
- Behavior analysis: "understanding customer actions and patterns"
- Lifetime value: "calculating total customer worth over time"

**Operational Insights:**

- Activity monitoring: "tracking system or user activity levels"
- Quality metrics: "measuring performance against standards"
- Resource utilization: "analyzing how resources are used"

### Error Prevention

**Query Validation:**

- Verify query logic matches chart purpose
- Check for appropriate data sources and tables
- Ensure aggregations make sense for visualization
- Validate time periods and filtering logic

**Explanation Quality:**

- Test explanations with non-technical users
- Ensure business relevance and clarity
- Verify accuracy of business interpretation
- Maintain consistency across similar query types

## Integration Points

- **Chart Generation:** Integrates with chart creation and configuration systems
- **Query Builder:** Connects with SQL and NoSQL query construction tools
- **User Interface:** Provides explanations for dashboard and chart interfaces
- **Documentation:** Supports self-service analytics and user education
- **Business Intelligence:** Enhances BI tool accessibility for business users

## Maintenance Notes

- Update explanation patterns based on user feedback and comprehension
- Enhance business terminology dictionary for consistent language
- Improve query validation logic for better mismatch detection
- Expand support for additional database types and query patterns
- Maintain alignment with evolving business intelligence requirements
