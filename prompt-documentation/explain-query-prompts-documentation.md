# Explain Query Prompts Documentation

## Overview

This document provides comprehensive documentation for the explain query prompts system used in the MyQuery platform. The explain query prompts are designed to provide detailed technical analysis and optimization guidance for database queries with audience-specific adaptations.

## File: explain-query-prompts.ts

**Location:** `app\(themed)\(SignedIn)\(dashboard)\aiquery\_open-ai-actions\prompts\explain-query-prompts.ts`

### Purpose

The explain query prompts system generates comprehensive technical analysis of database queries, providing performance insights, optimization recommendations, and security assessments tailored to different technical audiences.

## Core Functions

### 1. getExplainQuerySystemPrompt(dbConfig, input, sqlQuery)

**Type:** System Prompt Generator  
**Purpose:** Creates comprehensive query analysis guidelines with database-specific optimization

#### Key Features

- **Expert-Level Analysis:** Simulates a senior database performance tuning expert with 15+ years of experience
- **Audience Adaptation:** Tailors explanations to different technical levels and roles
- **Database-Specific Insights:** Provides dialect-specific optimization recommendations
- **Structured Analysis:** Follows systematic framework for comprehensive query evaluation
- **Security Assessment:** Includes security analysis and vulnerability identification

#### Role and Expertise

**Primary Role:** Senior database performance tuning expert and database architect

**Core Competencies:**

- Theoretical database knowledge combined with practical optimization strategies
- Execution plan analysis and performance tuning
- Database-specific feature utilization and optimization
- Security assessment and vulnerability identification
- Cross-audience technical communication

#### Audience Adaptation

**Database Administrators:**

- Deep technical analysis with execution plan insights
- Index strategy recommendations with specific implementations
- Resource utilization and performance monitoring guidance
- Advanced database feature utilization suggestions

**Backend Developers:**

- Practical optimization guidance with code examples
- Query reformulation techniques and best practices
- Integration considerations with application logic
- Performance testing and monitoring approaches

**Data Analysts:**

- Query logic explanation with business impact assessment
- Data quality and accuracy considerations
- Reporting and analytics optimization techniques
- Business intelligence integration strategies

**Technical Managers:**

- Performance implications and resource considerations
- Cost-benefit analysis of optimization strategies
- Risk assessment and mitigation strategies
- Resource allocation and capacity planning guidance

#### Query Analysis Framework

**1. Query Structure Decomposition:**

- Parse each clause (SELECT, FROM, JOIN, WHERE, GROUP BY, HAVING, ORDER BY)
- Identify logical flow and data transformation steps
- Map table relationships and join patterns
- Determine result set characteristics (cardinality, structure)

**2. Database-Specific Analysis:**

- Dialect-specific feature utilization assessment
- Performance characteristics unique to the database platform
- Optimization opportunities specific to the database engine
- Resource usage patterns and limitations

**3. Performance Evaluation:**

- Analyze potential execution plan characteristics
- Identify table access patterns (full scan vs. index seek)
- Evaluate join algorithms and their implications
- Assess filter selectivity and predicate efficiency
- Calculate potential memory and I/O requirements
- Detect possible bottlenecks and resource contention points

**4. Optimization Recommendations:**

- Suggest index strategies with specific column combinations
- Recommend query reformulation for better optimizer utilization
- Propose alternative join strategies when beneficial
- Advise on statistics and execution plan optimization
- Consider caching and materialized view opportunities
- Provide specific code examples of optimized versions

**5. Security Assessment:**

- Verify proper use of parameterization/bind variables
- Identify potential SQL injection vulnerabilities
- Assess data exposure risks and unnecessary column selection
- Evaluate permission requirements and principle of least privilege
- Recommend security improvements with specific syntax

#### Explanation Structure

**1. Executive Summary:**

- 2-3 sentence overview of the query's purpose
- Key performance characteristics (complexity level)
- Most significant optimization opportunity

**2. Query Breakdown:**

- Step-by-step explanation of query execution
- Table interactions and data flow
- Potential result set size and characteristics

**3. Database-Specific Optimization Analysis:**

- Database-specific features usage
- Performance implications
- Resource utilization patterns

**4. Recommendations:**

- Prioritized list of optimization suggestions
- Code examples of improved approaches
- Trade-offs between different optimization strategies

**5. Security Considerations:**

- Risk assessment
- Best practices compliance
- Improvement suggestions

## Database-Specific Analysis Components

### MySQL Analysis Features

- InnoDB storage engine optimization
- Query cache utilization strategies
- Index merge and covering index opportunities
- Partition pruning and table partitioning benefits
- MySQL-specific function usage and optimization

### PostgreSQL Analysis Features

- Query planner and execution statistics analysis
- Partial index and expression index opportunities
- Common Table Expression (CTE) optimization
- PostgreSQL-specific data types and function usage
- Vacuum and analyze strategy recommendations

### Oracle Analysis Features

- Cost-based optimizer (CBO) analysis
- Hint usage and execution plan control
- Parallel execution opportunities
- Oracle-specific features (analytical functions, materialized views)
- Automatic Workload Repository (AWR) integration suggestions

### SQL Server Analysis Features

- Query execution plan analysis
- Index usage statistics and recommendations
- SQL Server-specific functions and features
- Columnstore index opportunities
- Resource Governor and query optimization

### SQLite Analysis Features

- Lightweight optimization strategies
- Index usage in embedded environments
- Query plan analysis with EXPLAIN QUERY PLAN
- SQLite-specific limitations and workarounds
- Performance tuning for mobile and embedded applications

## Performance Optimization Strategies

### Index Strategy Development

**Single Column Indexes:**

- Primary key and unique constraint analysis
- Cardinality assessment for index effectiveness
- Query pattern analysis for optimal column selection

**Composite Indexes:**

- Column order optimization for maximum effectiveness
- Covering index opportunities for I/O reduction
- Index intersection and merge strategies

**Specialized Indexes:**

- Partial indexes for filtered queries
- Expression indexes for computed columns
- Full-text indexes for search functionality

### Query Reformulation Techniques

**Join Optimization:**

- Join order analysis and optimization
- Alternative join strategies (hash, merge, nested loop)
- Subquery vs. join performance comparison
- Common Table Expression usage for readability and performance

**Predicate Optimization:**

- WHERE clause ordering and selectivity analysis
- Function usage and index compatibility
- Range vs. equality predicate optimization
- NULL handling and three-valued logic considerations

**Aggregation Optimization:**

- GROUP BY clause optimization strategies
- HAVING vs. WHERE clause placement
- Window function usage for analytical queries
- Materialized view opportunities for frequent aggregations

### Resource Utilization Analysis

**Memory Usage:**

- Sort buffer and temporary table memory requirements
- Hash join memory allocation and optimization
- Buffer pool utilization and cache hit ratios
- Memory-bound vs. I/O-bound operation identification

**I/O Optimization:**

- Sequential vs. random I/O patterns
- Index seek vs. table scan trade-offs
- Read-ahead strategies and optimization
- Disk layout and storage optimization considerations

**CPU Utilization:**

- Computational complexity analysis
- Function call overhead and optimization
- Parallel processing opportunities
- CPU-bound operation identification and optimization

## Security Analysis Components

### SQL Injection Prevention

**Parameter Binding Analysis:**

- Proper parameterization verification
- Dynamic SQL construction review
- Input validation and sanitization assessment
- Escape sequence usage and effectiveness

**Access Control Validation:**

- Principle of least privilege compliance
- Role-based access control implementation
- Column-level security considerations
- Row-level security policy evaluation

### Data Exposure Assessment

**Sensitive Data Handling:**

- Unnecessary column selection identification
- Data masking and anonymization opportunities
- Audit trail and logging requirements
- Compliance with data protection regulations

**Query Result Security:**

- Result set size and data volume considerations
- Export and data extraction security
- Temporary data storage and cleanup
- Cross-database and cross-schema access validation

## Usage Examples

### Basic Query Analysis

**Input Query:**

```sql
SELECT u.username, p.title, COUNT(c.id) as comment_count
FROM users u
JOIN posts p ON u.id = p.user_id
LEFT JOIN comments c ON p.id = c.post_id
WHERE u.created_at > '2023-01-01'
GROUP BY u.id, u.username, p.id, p.title
ORDER BY comment_count DESC
LIMIT 10;
```

**Analysis Output:**

- **Executive Summary:** Query retrieves top 10 posts by comment count for users created after 2023, joining three tables with potential performance implications
- **Performance Assessment:** Multiple table joins with aggregation may benefit from covering indexes
- **Optimization Recommendations:** Consider composite index on (created_at, id) for users table and (post_id) for comments table

### Complex Query Optimization

**Input Query:**

```sql
WITH monthly_sales AS (
  SELECT DATE_TRUNC('month', sale_date) as month,
         SUM(amount) as total_sales
  FROM sales
  WHERE sale_date >= '2023-01-01'
  GROUP BY DATE_TRUNC('month', sale_date)
)
SELECT month, total_sales,
       LAG(total_sales) OVER (ORDER BY month) as prev_month_sales,
       (total_sales - LAG(total_sales) OVER (ORDER BY month)) / LAG(total_sales) OVER (ORDER BY month) * 100 as growth_rate
FROM monthly_sales
ORDER BY month;
```

**Analysis Output:**

- **CTE Analysis:** Common Table Expression efficiently organizes monthly aggregation
- **Window Function Assessment:** LAG function usage appropriate for time-series analysis
- **Index Recommendations:** Covering index on (sale_date, amount) for optimal performance
- **Alternative Approaches:** Consider materialized view for frequently accessed monthly summaries

## Best Practices

### Analysis Quality

**Comprehensive Coverage:**

- Address all aspects of query performance and security
- Provide specific, actionable recommendations
- Include code examples for suggested improvements
- Consider multiple optimization strategies and trade-offs

**Technical Accuracy:**

- Ensure database-specific syntax and features are correctly referenced
- Validate optimization recommendations against actual database behavior
- Consider version-specific features and limitations
- Provide accurate performance impact assessments

### Communication Effectiveness

**Audience Adaptation:**

- Adjust technical depth based on intended audience
- Use appropriate terminology and examples
- Provide context for recommendations and trade-offs
- Include business impact assessment where relevant

**Structured Presentation:**

- Follow consistent analysis framework
- Use clear headings and sections
- Prioritize recommendations by impact and effort
- Provide summary and detailed analysis sections

## Integration Points

- **Query Generator:** Provides detailed analysis of generated queries
- **Performance Monitor:** Integrates with query performance tracking
- **Security Audit:** Supports security assessment and compliance checking
- **Developer Tools:** Enhances debugging and optimization workflows
- **Training Systems:** Provides educational content for database optimization

## Maintenance Notes

- Update database-specific analysis as new versions and features are released
- Review optimization strategies based on evolving best practices
- Maintain accuracy of performance assessments as database engines evolve
- Update security considerations based on emerging threats and vulnerabilities
- Enhance audience adaptation based on user feedback and usage patterns
