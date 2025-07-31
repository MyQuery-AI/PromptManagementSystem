# Dashboard Generation Prompts Documentation

## Overview

This document provides comprehensive documentation for the dashboard generation prompts system used in the MyQuery platform. The dashboard generation prompts are designed to create executive-ready dashboards with comprehensive chart collections, metrics, and business insights.

## File: dashboard-generation-prompt.ts

**Location:** `app\(themed)\(SignedIn)\(dashboard)\dashboard-builder\_open-ai-actions\prompts\dashboard-generation-prompt.ts`

### Purpose

The dashboard generation prompts system creates complete dashboard solutions including chart configurations, single-value metrics, and actionable insights. The system emphasizes executive readiness, business relevance, and data validation to ensure accurate and meaningful visualizations.

## Core Functions

### 1. getDashboardOverviewPrompt()

**Type:** Dashboard Overview Generator  
**Purpose:** Creates executive-ready dashboard overviews with professional presentation

#### Key Features

- **Executive Focus:** Designed for business executives and decision-makers
- **Professional Language:** Clear, concise, and jargon-free communication
- **Business Impact:** Emphasizes strategic metrics and actionable insights
- **Structured Output:** Consistent JSON format for programmatic processing

#### Target Audience Considerations

**Business Executives:**

- Need clear, actionable insights at a glance
- Require professional, concise language
- Focus on business impact and strategic metrics
- Avoid technical jargon or implementation details

#### Output Structure

**Required Fields:**

- **title:** Concise, professional title (≤6 words)
- **summary:** One-sentence overview (≤20 words) highlighting purpose and key metrics
- **targetAudience:** Brief description of who benefits most (≤10 words)
- **validation:** Confirmation of JSON validity and structure

**Domain-Specific Examples:**

**Sales Dashboard:**

```json
{
  "title": "Executive Sales Performance",
  "summary": "High‑level view of monthly revenue, profit margins, and customer acquisition",
  "targetAudience": "Sales directors and C-suite executives",
  "validation": "✔️ JSON valid and keys correct"
}
```

**Marketing Dashboard:**

```json
{
  "title": "Campaign Effectiveness Tracker",
  "summary": "Consolidated metrics on conversion rates, channel performance, and engagement",
  "targetAudience": "Marketing managers and CMOs",
  "validation": "✔️ JSON valid and keys correct"
}
```

### 2. getDashboardChartsPrompt(databaseType)

**Type:** Comprehensive Dashboard Generator  
**Purpose:** Creates complete dashboard solutions with charts, metrics, and insights

#### Key Features

- **Schema Reference Validation:** Mandatory verification of all table and column references
- **Multi-Component Generation:** Charts, single-value metrics, and insights
- **Database-Specific Optimization:** Tailored for different database platforms
- **Data Visualization Guidelines:** Sophisticated chart type selection logic
- **Empty Chart Handling:** Graceful handling of insufficient or incompatible data

#### Schema Reference Requirements

**Critical Validation:**

- MUST only reference tables and columns explicitly provided in schema sections
- NEVER reference tables or columns not defined in provided schema
- Return empty charts with recommendations when requested data doesn't exist
- Validate all schema references before query generation

#### Data Visualization Guidelines

**Chart Type Selection Considerations:**

**1. Data Types and Relationships:**

- **Categorical Data:** Use bar or pie charts for distribution
- **Time Series Data:** Use line or area charts for trends over time
- **Part-to-Whole Relationships:** Use pie charts for percentage breakdowns
- **Correlations:** Use scatter plots or line charts

**2. Data Sufficiency:**

- Add proper filtering to handle null values
- Use appropriate aggregations (SUM, AVG, COUNT)
- Limit results to prevent overplotting (20 items max)

**3. Data Relevance Assessment:**

- Return empty charts when data cannot be meaningfully represented
- Verify column/field existence before querying
- Include only directly relevant data fields

#### Chart Type Selection Restrictions

**Critical Guidelines:**

**For Rating Data or Categorical Data:**

- Use BAR CHARTS to show distribution across categories
- NEVER use line charts unless data has actual time dimension
- Use grouped bar charts for multiple category comparisons

**For Non-Time-Series Data:**

- NEVER use line or area charts without proper time dimension
- Use bar charts for comparing categories
- Use pie charts for showing proportions (limited categories)

**For Time Series Data:**

- VERIFY that time columns actually exist in schema
- Ensure proper date/time formatting before grouping
- Use line charts only for sequential time periods

#### Empty Chart Handling

**When to Create Empty Charts:**

- Requested tables or fields DO NOT EXIST in schema
- Data type incompatible with visualization
- Insufficient data for meaningful visualization
- Query results contain only text/date data with no numeric values

**Empty Chart Format:**

```json
{
  "id": "emptyChart1",
  "type": "bar",
  "title": "Customer Lifetime Value",
  "description": "Cannot display customer lifetime value",
  "isEmpty": true,
  "emptyReason": "No purchase history or customer data available in schema",
  "recommendedTables": ["customers_purchase_history", "customer_transactions"],
  "sql": "SELECT 'placeholder' as x, 0 as y FROM dual",
  "dataValidation": "Schema lacks required customer purchase history data"
}
```

#### Schema Validation Protocol

**For EVERY Query Generated:**

1. **Schema Scanning:** Create mental list of available tables and columns
2. **Table Verification:** Verify ALL tables mentioned exist in schema
3. **Column Validation:** Verify each column exists in respective table definition
4. **Join Validation:** Verify join columns exist with compatible data types
5. **Function Validation:** Verify column types appropriate for function calls
6. **Numeric Column Requirement:** Ensure at least one numeric column for visualization
7. **Empty Chart Decision:** Generate empty chart if any validation fails

#### Error Prevention Checklist

**Always Perform These Validations:**

1. **Table Existence:** Only reference explicitly listed schema tables
2. **Column Existence:** Only use explicitly defined columns for each table
3. **Data Type Validation:** Check column types before type-specific functions
4. **Join Condition Verification:** Ensure foreign keys exist before joins
5. **NULL Value Handling:** Use appropriate functions for potential NULLs
6. **Chart Type Compatibility:** Verify data structure matches chart requirements

#### Required Components

**Dashboard Structure:**

- **4 Charts:** Different metrics/KPIs with unique business value
- **1 Single-Value Metric:** Key performance indicator with context
- **1 Insights Panel:** Actionable business intelligence

**Chart Fields:**

```json
{
  "id": "string",
  "type": "bar|line|area|pie",
  "title": "string",
  "description": "string",
  "isEmpty": "boolean",
  "emptyReason": "string", // only when isEmpty=true
  "recommendedTables": ["string"], // only when isEmpty=true
  "sql": "string", // valid SQL or MongoDB query
  "dataValidation": "string"
}
```

**Single Value Metric Fields:**

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "sql": "string", // query returning single numeric value
  "label": "string",
  "emoji": "string", // representative emoji
  "fallbackValue": "number"
}
```

**Insights Fields:**

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "insights": [
    {
      "title": "string",
      "description": "string",
      "type": "trend|comparison|anomaly|correlation|pattern",
      "severity": "info|warning|critical",
      "relatedChartIds": ["string"],
      "actionability": "string"
    }
  ]
}
```

### 3. Database-Specific Guidelines

#### Oracle Database Guidelines

- **Schema Validation:** ONLY USE tables/columns that exist in provided schema
- **Empty Chart Handling:** Return empty charts with clear explanations for missing data
- **Query Syntax:** Always use "FROM DUAL" for SELECT statements without table
- **Date Functions:** Use SYSDATE, TO_CHAR, ADD_MONTHS, etc.
- **Result Limiting:** Use FETCH FIRST n ROWS ONLY (max 20 rows)
- **NULL Handling:** Use NVL() function for null values
- **String Operations:** Use UPPER(), LOWER(), SUBSTR(), INSTR() functions

#### PostgreSQL Guidelines

- **Schema Validation:** ONLY USE tables/columns that exist in provided schema
- **Date Function Validation:** NEVER use EXTRACT() on non-date columns
- **Date Extraction:** Use DATE_PART('year', date_column) ONLY on DATE/TIMESTAMP columns
- **Chart Type Verification:** Only use line charts with verified time/date columns
- **Numeric Data Requirement:** Every chart must return at least one numeric column
- **Result Limiting:** Use LIMIT n (max 20 rows)
- **NULL Handling:** Use COALESCE() for null values
- **String Operations:** Use CONCAT(), LEFT(), RIGHT(), POSITION()

#### MongoDB Guidelines

- **Schema Validation:** ONLY include fields directly relevant to visualization
- **Query Format:** Return stringified JavaScript objects for 'sql' field
- **Operators:** Use correct MongoDB operators ($match, $group, $project, etc.)
- **Operation Types:** Use "find" by default, "aggregate" for complex operations
- **Result Format:** Return ONLY JavaScript object as JSON-valid string
- **Time Grouping:** Use "$dateTrunc" with appropriate time units

### 4. getDashboardUserPrompt(prompt, databaseType)

**Type:** User Dashboard Prompt Generator  
**Purpose:** Creates specific dashboard generation prompts based on user requirements

#### Parameters

- **prompt:** User's dashboard requirements description
- **databaseType:** Target database platform for optimization

#### Data Considerations

1. **Data Type Analysis:** Analyze available data types for appropriate visualizations
2. **Data Quality:** Handle null values and provide fallbacks
3. **Business Questions:** Ensure visualizations answer specific business questions
4. **Time-Based Analysis:** Include temporal analysis where appropriate
5. **Relevance Filtering:** Only query fields directly relevant to chart purpose
6. **Empty Chart Handling:** Return empty charts for unavailable data with recommendations

#### Critical Database Validation

**For Each Generated Query:**

1. **Table Verification:** Verify all tables exist in schema BEFORE use
2. **Column Verification:** Verify all columns exist in respective tables BEFORE reference
3. **Data Type Verification:** Verify data types before applying functions
4. **Join Validation:** Verify join conditions reference valid foreign key relationships
5. **NULL Handling:** Handle potential NULL values with appropriate functions
6. **Error Testing:** Test query logic for common errors

#### Query Validation Checklist

**Before Finalizing Any Query:**

1. All tables mentioned actually exist in schema
2. All columns referenced exist in their respective tables
3. Data types appropriate for functions used (especially date functions)
4. Join conditions use compatible data types
5. Aggregation functions have proper GROUP BY clauses
6. Appropriate handling of NULL values
7. Query syntax valid for specific database type

## Usage Examples

### Executive Sales Dashboard

```typescript
const overviewPrompt = getDashboardOverviewPrompt();
const chartsPrompt = getDashboardChartsPrompt("postgresql");
const userPrompt = getDashboardUserPrompt(
  "Create a sales performance dashboard showing regional performance, top products, and revenue trends",
  "postgresql",
);
```

**Expected Components:**

- **Chart 1:** Regional sales comparison (bar chart)
- **Chart 2:** Monthly revenue trends (line chart)
- **Chart 3:** Top-selling products (horizontal bar)
- **Chart 4:** Sales by category (pie chart)
- **Metric:** Total quarterly revenue with growth percentage
- **Insights:** Regional performance analysis, seasonal trends, product opportunities

### Marketing Campaign Dashboard

```typescript
const userPrompt = getDashboardUserPrompt(
  "Marketing campaign effectiveness with conversion rates, channel performance, and customer acquisition",
  "mysql",
);
```

**Expected Components:**

- **Chart 1:** Conversion rates by channel (bar chart)
- **Chart 2:** Customer acquisition over time (line chart)
- **Chart 3:** Campaign ROI comparison (horizontal bar)
- **Chart 4:** Traffic source distribution (pie chart)
- **Metric:** Overall conversion rate with period comparison
- **Insights:** Channel optimization recommendations, trend analysis, performance alerts

### Operational Performance Dashboard

```typescript
const userPrompt = getDashboardUserPrompt(
  "Operational metrics dashboard with system performance, user activity, and error rates",
  "oracle",
);
```

**Expected Components:**

- **Chart 1:** System response times (line chart)
- **Chart 2:** User activity by hour (area chart)
- **Chart 3:** Error rates by service (bar chart)
- **Chart 4:** Resource utilization (gauge/card)
- **Metric:** System uptime percentage
- **Insights:** Performance bottlenecks, usage patterns, operational recommendations

## Best Practices

### Chart Selection Guidelines

**Appropriate Chart Types:**

**Bar Charts:**

- Best for comparing values across categories
- Use when data is categorical or discrete
- Ideal for rankings and comparisons

**Line Charts:**

- ONLY for showing trends over time or continuous variables
- Require verified TIME DATA in schema
- Ideal for temporal patterns and trend analysis

**Area Charts:**

- ONLY for cumulative totals or compositions over time
- Require verified TIME DATA in schema
- Good for showing volume changes over time

**Pie Charts:**

- Use only for proportions of a whole
- Limit to 5-7 categories maximum
- Ideal for part-to-whole relationships

### Data Validation Best Practices

**Schema Verification:**

- Always verify table and column existence before query generation
- Use consistent naming conventions and case sensitivity
- Validate data types before applying functions
- Handle missing or incomplete schema information gracefully

**Query Optimization:**

- Limit result sets to prevent performance issues (max 20 rows)
- Use appropriate aggregation functions for meaningful metrics
- Handle NULL values with database-specific functions
- Optimize joins and indexing for performance

**Error Prevention:**

- Test query logic against common error scenarios
- Validate join conditions and data type compatibility
- Provide meaningful error messages and recommendations
- Implement graceful fallbacks for edge cases

### Business Intelligence Integration

**Executive Readiness:**

- Focus on key performance indicators and business metrics
- Use clear, professional language in titles and descriptions
- Provide actionable insights and recommendations
- Ensure visualizations support decision-making processes

**Stakeholder Value:**

- Create charts that answer specific business questions
- Provide different perspectives on the same data
- Include relevant context and benchmarks
- Support both high-level overview and detailed analysis

## Integration Points

- **Schema Analysis:** Integrates with database schema discovery and validation
- **Query Engine:** Connects with database-specific query execution systems
- **Visualization Framework:** Provides configuration for chart rendering components
- **Business Intelligence:** Delivers executive-ready insights and recommendations
- **Performance Monitoring:** Enables dashboard performance tracking and optimization

## Maintenance Notes

- Update chart type selection logic based on visualization best practices
- Enhance schema validation rules as database platforms evolve
- Improve empty chart handling based on user feedback and common scenarios
- Maintain database-specific optimization guidelines as platforms update
- Expand insight generation capabilities based on business intelligence requirements
