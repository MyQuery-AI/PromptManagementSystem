# SQL Prompts Documentation

## Overview

This document provides comprehensive documentation for the SQL prompts system used in the MyQuery platform. The SQL prompts are designed to generate optimized database queries across different database dialects.

## File: sql-prompts.ts

**Location:** `app\(themed)\(SignedIn)\(dashboard)\aiquery\_open-ai-actions\prompts\sql-prompts.ts`

### Purpose

The SQL prompts system provides expert-level SQL query generation with dialect-specific optimizations and schema validation.

## Core Functions

### 1. getSQLSystemPrompt(dbConfig)

**Type:** System Prompt Generator  
**Purpose:** Creates a comprehensive system prompt for SQL query generation

#### Key Features:

- **Expert-level guidance:** Simulates a DBA with 15+ years of experience
- **Dialect-specific optimization:** Adapts to different database systems
- **Schema validation:** Ensures all table and column references are valid
- **No placeholders policy:** Embeds all values directly in SQL
- **Performance optimization:** Implements best practices for query performance

#### Critical Requirements:

1. Generate ONLY syntactically correct SQL queries for the specified dialect
2. NEVER use bind variables, placeholders, or parameters
3. Verify ALL table and column names exist in the schema
4. Apply dialect-specific syntax and optimizations
5. Use proper data types and functions
6. Implement appropriate indexing strategies

#### Database Configuration Support:

- **Database Type:** Supports multiple database dialects
- **Quote Character:** Handles dialect-specific quoting
- **Parameter Prefix:** Manages parameter syntax differences
- **LIMIT Support:** Adapts pagination strategies
- **Date Format:** Uses correct date/time formatting
- **String Concatenation:** Applies proper concatenation operators

#### Query Optimization Rules:

1. **JOIN Strategy:** Use appropriate JOIN types (INNER, LEFT, RIGHT, FULL OUTER)
2. **Filter Optimization:** Apply WHERE clause filters early in execution plan
3. **Index Hints:** Use database-specific indexing hints when beneficial
4. **Pagination:** Implement using LIMIT/OFFSET or ROW_NUMBER()/FETCH
5. **Complex Queries:** Use CTEs for complex subqueries
6. **Data Type Handling:** Apply proper casting and conversions

#### Error Prevention:

- Validate all table and column references against schema
- Use correct date/time functions for the specific database
- Apply proper null and string handling
- Prevent common SQL injection vulnerabilities

#### Table Recommendation System:

When exact matches aren't available, the system provides intelligent alternatives:

- Analyzes available tables in the schema
- Identifies columns that might relate to the request
- Returns recommendations with sample queries
- Explains how suggested tables relate to the original request

### 2. getSQLPrompt(dbConfig, input)

**Type:** User Prompt Generator  
**Purpose:** Creates specific query generation prompts based on user input

#### Parameters:

- **dbConfig:** Database configuration object
- **input:** Natural language request from user

#### Features:

- Translates natural language to SQL
- Maintains dialect-specific requirements
- Embeds values directly without placeholders
- Provides query explanations and complexity estimates
- Returns table usage information

## Usage Examples

### Basic Implementation:

```typescript
const systemPrompt = getSQLSystemPrompt(dbConfig);
const userPrompt = getSQLPrompt(
  dbConfig,
  "Find all customers with orders in the last 30 days",
);
```

### Database Configuration Example:

```typescript
const dbConfig = {
  dialectName: "PostgreSQL",
  quoteChar: '"',
  parameterPrefix: "$",
  supportsLimitClause: true,
  supportsOffsetFetch: false,
  dateFormat: "YYYY-MM-DD",
  stringConcat: "||",
};
```

## Best Practices

### Performance Optimization:

1. **Column Selection:** Select only needed columns
2. **Early Filtering:** Apply WHERE clauses early
3. **Index Usage:** Leverage indexes where helpful
4. **Scan Avoidance:** Avoid full-table scans when possible

### Security Considerations:

1. **No Placeholders:** All values are embedded directly
2. **Schema Validation:** All references are validated
3. **Injection Prevention:** Proper escaping and quoting
4. **Access Control:** Respects database permissions

## Error Handling

### Table Recommendation Response Format:

```sql
-- TABLE RECOMMENDATIONS: Instead of [requested data], consider using: [table1], [table2], [table3]

SELECT
  [relevant_columns]
FROM
  [most_appropriate_table]
WHERE
  [relevant_conditions]
ORDER BY
  [logical_sorting]
LIMIT [reasonable_limit];

-- This query uses [explanation of table relevance]
```

## Integration Points

- **Query Generator:** Main entry point for SQL generation
- **Schema Validator:** Validates table and column references
- **Performance Optimizer:** Applies database-specific optimizations
- **Error Handler:** Provides intelligent fallbacks and recommendations

## Maintenance Notes

- Update dialect-specific configurations as new databases are supported
- Review optimization rules periodically for performance improvements
- Update error handling patterns based on common user requests
- Maintain table recommendation logic for better user experience
