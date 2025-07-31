# Chart Optimization Prompts Documentation

## Overview

This document provides comprehensive documentation for the chart optimization prompts system used in the MyQuery platform. The chart optimization prompts are designed to enhance database query performance while maintaining visualization effectiveness and data integrity.

## File: chart-optimization-prompt.ts

**Location:** `app\(themed)\(SignedIn)\(dashboard)\dashboard-builder\_open-ai-actions\prompts\chart-optimization-prompt.ts`

### Purpose

The chart optimization prompts system provides database performance expertise to optimize SQL queries specifically for chart visualization requirements. The system balances query performance with chart readability, data volume considerations, and database-specific optimization techniques.

## Core Functions

### 1. getChartTypeOptimizationHints(chartType)

**Type:** Chart-Specific Performance Advisor
**Purpose:** Provides visualization-specific optimization guidelines for different chart types

#### Chart Type Guidelines

**Bar Charts:**

- Limit to 10-20 categories for optimal readability
- Order by value DESC to highlight top performers
- Group smaller categories into 'Other' if more than 15 categories exist
- Ensure y-axis starts at 0 for proper visual proportions

**Line Charts:**

- Ensure chronological ordering with consistent time intervals
- Include all time periods (even zeros) to prevent misleading gaps
- Consider moving averages for noisy data
- Limit to key metrics that show clear trends

**Area Charts:**

- Similar to line charts, ensure chronological ordering
- Ensure non-negative values (use NULLIF or GREATEST to prevent negatives)
- For stacked areas, limit to 3-5 categories for readability
- Consider cumulative values for showing growth over time

**Pie Charts:**

- Limit to 7-10 segments maximum for readability
- Order by value DESC to highlight key segments
- Group values <5% into 'Other' category
- Ensure all segments sum to 100% for accurate representation

**Donut Charts:**

- Same as pie, limit to 7-10 segments maximum
- Consider grouping small segments into 'Other'
- Use for showing composition and proportions
- Include center value for key metric

**Card Charts:**

- Return single row with precisely one key metric
- Include proper formatting for the value (currency, percent, etc.)
- Consider adding comparison to previous period
- Ensure metric is non-NULL with fallback calculations

**Table Charts:**

- Include pagination limits (20-50 rows)
- Order by most relevant column (usually descending)
- Select only essential columns for display
- Include totals/subtotals when appropriate

**Scatter Charts:**

- Limit to 100-500 points to prevent overplotting
- Ensure no NULL values in x/y coordinates
- Consider adding trend lines for correlation analysis
- Use filters to focus on relevant data clusters

**Card Insights:**

- Return single row with key metric
- Include comparison and context
- Format percentage changes appropriately
- Ensure non-NULL results with fallback values

### 2. getDatabaseOptimizationSystemPrompt(databaseType, chartType)

**Type:** Database Performance Expert System
**Purpose:** Generates comprehensive optimization strategies for specific database platforms and chart types

#### Optimization Process

**1. Query Analysis:**

- Analyze original query structure and identify performance bottlenecks
- Apply database-specific optimizations while preserving query intent
- Ensure results match visualization requirements for specific chart type
- Verify query limits results appropriately (generally ≤15 rows unless otherwise required)
- Explain optimization rationale and expected performance impact

**2. Data Volume Considerations:**

- For large tables (>100K rows), prioritize early filtering before joins
- For complex aggregations, consider pre-aggregating data when possible
- For time-series data, ensure proper date/time indexing and filtering
- For hierarchical data, optimize parent-child relationship queries

### 3. Database-Specific Optimization

#### Oracle Database Optimization

**Optimizer Hints:**

- `/*+ FIRST_ROWS(n) */` for faster retrieval of first n rows
- `/*+ INDEX(table index_name) */` to force index usage
- `/*+ PARALLEL(table, degree) */` for large dataset processing

**Query Techniques:**

- Use `FETCH FIRST n ROWS ONLY` for limiting results (more efficient than rownum)
- Leverage analytic functions for complex aggregations
- Remember to use `FROM DUAL` for SELECT without tables
- Consider materialized views for frequently accessed aggregated data
- Use `NVL` or `COALESCE` to handle NULL values predictably
- For date filtering, ensure proper use of `TRUNC` for date-level comparisons

#### PostgreSQL Optimization

**Performance Analysis:**

- Use `EXPLAIN ANALYZE` to understand query execution plans
- Leverage `LIMIT` clause efficiently (add early in development, refine later)
- Consider Common Table Expressions (CTEs) for readability and optimization

**Query Techniques:**

- Use `COALESCE` for NULL handling in visualization data
- For time series data, leverage `DATE_TRUNC` for proper aggregation
- Consider `LATERAL` joins for row-dependent subqueries
- Use `DISTINCT ON` for filtering to unique values efficiently
- Consider partial indexes for filtered data access patterns

#### MySQL Optimization

**Performance Analysis:**

- Use `EXPLAIN` to analyze query execution paths
- Leverage `LIMIT` clause with proper `ORDER BY`
- Ensure proper indexing on filtered and joined columns

**Query Techniques:**

- Use `STRAIGHT_JOIN` hint when join order is critical
- Consider temporary tables for complex multi-step aggregations
- Use `SQL_CALC_FOUND_ROWS` with `LIMIT` for pagination
- Leverage `DATE_FORMAT` for time-based grouping
- Use `IFNULL` or `COALESCE` to handle NULL values

#### MongoDB Optimization

**Aggregation Pipeline Optimization:**

- Push `$match` stages as early as possible in the pipeline
- Use `$limit` to restrict the number of documents processed
- Leverage `$project` to include only necessary fields
- Use `$sort` before `$limit` for top-N queries

**Advanced Techniques:**

- Consider `$bucket` or `$bucketAuto` for histogram-like grouping
- Use `$group` with appropriate accumulators for aggregation
- Leverage `$unwind` carefully as it can multiply document count
- Use `$lookup` efficiently with pre-filtered collections

### 4. getDatabaseOptimizationPrompt(sqlQuery)

**Type:** User Query Optimizer
**Purpose:** Provides optimized version of user-submitted SQL query

#### Parameters

- **sqlQuery:** The original SQL query to be optimized

#### Optimization Example

**Original Query:**

```sql
SELECT department, SUM(salary) as total_salary
FROM employees
WHERE hire_date > '2020-01-01'
GROUP BY department
```

**Optimized for Bar Chart:**

```sql
SELECT department, SUM(salary) as total_salary
FROM employees
WHERE hire_date > '2020-01-01' -- Indexed date filter applied early
GROUP BY department
ORDER BY total_salary DESC -- Order for bar chart visualization
LIMIT 15 -- Prevent excessive data points
```

## Usage Examples

### Sales Performance Bar Chart Optimization

```typescript
const chartType = "bar";
const databaseType = "postgresql";
const hints = getChartTypeOptimizationHints(chartType);
const systemPrompt = getDatabaseOptimizationSystemPrompt(
  databaseType,
  chartType,
);
const optimizationPrompt = getDatabaseOptimizationPrompt(
  "SELECT region, SUM(revenue) FROM sales GROUP BY region",
);
```

**Expected Optimization:**

- Limit to top 15 regions by revenue
- Order by revenue DESC for better visualization
- Add proper indexing suggestions
- Include NULL handling for revenue calculations

### Time Series Line Chart Optimization

```typescript
const chartType = "line";
const databaseType = "oracle";
const hints = getChartTypeOptimizationHints(chartType);
const systemPrompt = getDatabaseOptimizationSystemPrompt(
  databaseType,
  chartType,
);
```

**Expected Guidelines:**

- Ensure chronological ordering with consistent time intervals
- Use Oracle-specific date functions for aggregation
- Include all time periods to prevent misleading gaps
- Consider moving averages for noisy data

### Large Dataset Pie Chart Optimization

```typescript
const chartType = "pie";
const databaseType = "mysql";
const optimizationPrompt = getDatabaseOptimizationPrompt(
  "SELECT category, COUNT(*) FROM products GROUP BY category",
);
```

**Expected Optimization:**

- Limit to 7-10 segments maximum
- Group smaller categories into 'Other' category
- Order by count DESC to highlight key segments
- Ensure proper percentage calculations

## Performance Considerations

### Data Volume Management

**Small Datasets (<1K rows):**

- Focus on query clarity and correct chart formatting
- Minimal optimization needed for performance
- Emphasize data accuracy and completeness

**Medium Datasets (1K-100K rows):**

- Apply filtering early in query execution
- Use appropriate indexing strategies
- Limit result sets to chart requirements
- Consider aggregation at query level

**Large Datasets (>100K rows):**

- Prioritize early filtering before joins
- Consider pre-aggregating data when possible
- Use database-specific optimization techniques
- Implement pagination for table charts

### Chart-Specific Performance

**Real-time Charts:**

- Optimize for fast query execution
- Use appropriate caching strategies
- Limit data points to essential information
- Consider incremental updates

**Historical Analysis:**

- Focus on data completeness over speed
- Use efficient time-based aggregation
- Consider materialized views for common queries
- Implement proper date indexing

## Best Practices

### Query Optimization Guidelines

**Early Filtering:**

- Apply WHERE clauses as early as possible
- Use indexed columns for filtering
- Avoid filtering on calculated fields when possible
- Use appropriate data types for comparisons

**Efficient Joins:**

- Join on indexed columns when possible
- Use appropriate join types (INNER, LEFT, etc.)
- Filter before joining to reduce dataset size
- Consider denormalization for frequently accessed data

**Aggregation Optimization:**

- Use appropriate GROUP BY clauses
- Consider pre-aggregated data for common metrics
- Use window functions efficiently
- Avoid unnecessary subqueries

### Visualization-Specific Optimization

**Chart Readability:**

- Limit data points to prevent overcrowding
- Order results by relevance (usually descending)
- Group smaller categories appropriately
- Use consistent formatting across charts

**Performance Balance:**

- Optimize for both query speed and data accuracy
- Consider caching strategies for frequently accessed data
- Use appropriate database-specific features
- Monitor and adjust based on usage patterns

## Integration Points

- **Query Engine:** Integrates with database-specific query execution systems
- **Chart Rendering:** Provides optimized data for visualization components
- **Performance Monitoring:** Enables query performance tracking and analysis
- **Caching System:** Supports efficient data caching strategies
- **Database Management:** Connects with database-specific optimization tools

## Maintenance Notes

- Update optimization strategies based on database platform evolution
- Monitor query performance metrics and adjust recommendations
- Enhance chart-specific guidelines based on visualization best practices
- Maintain database-specific optimization techniques as platforms update
- Consider emerging database technologies and optimization patterns
