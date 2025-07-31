# DML Query Prompts Documentation

## Overview

This document provides comprehensive documentation for the DML (Data Manipulation Language) query prompts system used in the MyQuery platform. The DML prompts are designed to generate secure, efficient, and standard-compliant database modification operations with strong emphasis on security and data integrity.

## File: dml-query-prompts.ts

**Location:** `app\(themed)\(SignedIn)\(dashboard)\aiquery\_open-ai-actions\prompts\dml-query-prompts.ts`

### Purpose

The DML query prompts system generates secure INSERT, UPDATE, DELETE, and MERGE/UPSERT operations with comprehensive security measures, parameter binding, and database-specific optimizations. The system prioritizes security, data integrity, and compliance with database best practices.

## Core Functions

### 1. getDMLQuerySystemPrompt(dbConfig, dynamicSchema)

**Type:** System Prompt Generator  
**Purpose:** Creates comprehensive DML operation guidelines with security-first approach

#### Key Features

- **Security-First Design:** Mandatory SQL injection prevention through parameter binding
- **Database Expertise:** Simulates senior DBA with specialization in secure operations
- **Schema Validation:** Ensures all operations comply with database schema
- **Performance Optimization:** Database-specific query optimization and best practices
- **Data Integrity:** Comprehensive referential integrity and constraint handling

#### Security Requirements (Mandatory)

**1. Parameter Binding:**

- Use bind variables for ALL user input without exception
- NEVER concatenate user input directly into queries
- ALWAYS use parameterized queries for dynamic values
- Parameter format specific to database dialect

**2. Explicit Filtering:**

- Include explicit WHERE clauses for ALL UPDATE/DELETE operations
- NEVER allow unfiltered table modifications
- REQUIRE specific record identification criteria
- REJECT requests for mass updates without explicit confirmation

**3. Schema Validation:**

- VERIFY all table names exist in the schema
- CONFIRM all column names exist in referenced tables
- CHECK data types for compatibility with operations

**4. Proper Quoting:**

- Use database-specific quote characters for identifier quoting
- Follow dialect-specific escaping rules
- Handle special characters in string literals correctly

#### Database Environment Configuration

**Supported Configurations:**

- **Database Type:** Multi-dialect support (MySQL, PostgreSQL, Oracle, SQL Server, SQLite)
- **Parameter Style:** Database-specific parameter syntax
- **Identifier Quoting:** Dialect-appropriate quoting characters
- **Auto Increment:** Database-specific auto-increment field handling
- **Schema Structure:** Dynamic schema integration for validation

#### DML Operation Guidance

**INSERT Operations:**

- ALWAYS use explicit column lists for clarity and security
- VALIDATE data types against schema definitions
- HANDLE auto-increment fields correctly based on database type
- BATCH multiple inserts when appropriate for performance
- CONSIDER RETURNING/OUTPUT clauses for retrieving generated IDs

**UPDATE Operations:**

- REQUIRE specific WHERE clause to prevent accidental mass updates
- USE bind variables for both SET and WHERE values
- IMPLEMENT optimistic locking for concurrent edits
- VALIDATE data type compatibility before execution
- CONSIDER impact on foreign key relationships

**DELETE Operations:**

- REQUIRE specific WHERE clause for targeted deletions
- CONSIDER soft delete patterns when appropriate for audit trails
- VALIDATE referential integrity impact before execution
- USE appropriate isolation level for consistency
- HANDLE cascading deletes explicitly

**MERGE/UPSERT Operations:**

- USE database-specific syntax for optimal performance
- HANDLE both insert and update cases properly
- VALIDATE against unique constraints
- USE bind variables for all values in the operation

#### Query Construction Process

**1. Analyze Request:**

- Identify operation type (INSERT/UPDATE/DELETE/MERGE)
- Determine target table(s) from schema
- Extract field requirements and conditions

**2. Security Validation:**

- Identify all user input requiring bind variables
- Verify all identifiers against schema
- Ensure proper filtering criteria exist

**3. Query Formulation:**

- Select appropriate syntax for operation type
- Apply proper quoting for all identifiers
- Include bind variables for all dynamic values
- Format query for readability and maintenance

**4. Verification:**

- Check for SQL injection vulnerabilities
- Verify data type compatibility
- Confirm WHERE clause existence for destructive operations
- Validate against database-specific requirements

#### Database-Specific Features

**Auto-Increment Handling:**

- **MySQL:** OMIT auto_increment columns from INSERT column list
- **PostgreSQL:** Use SERIAL type fields or RETURNING clause
- **Oracle:** Use sequences with SELECT sequence_name.NEXTVAL
- **SQL Server:** Use IDENTITY columns or OUTPUT clause
- **SQLite:** Use ROWID or INTEGER PRIMARY KEY AUTOINCREMENT

**Upsert Syntax:**

- **MySQL:** INSERT ... ON DUPLICATE KEY UPDATE
- **PostgreSQL:** INSERT ... ON CONFLICT ... DO UPDATE SET
- **Oracle:** MERGE INTO ... USING ... ON ... WHEN MATCHED
- **SQL Server:** MERGE INTO ... USING ... ON ... WHEN MATCHED
- **SQLite:** INSERT ... ON CONFLICT ... DO UPDATE SET

#### Error Handling and Edge Cases

**NULL Values:** Use IS NULL/IS NOT NULL for NULL comparisons
**Empty Results:** Consider behavior when no rows match criteria
**Constraints:** Handle potential constraint violations gracefully
**Transactions:** Recommend transaction boundaries for multi-statement operations
**Bulk Operations:** Provide guidance on batch size limitations

### 2. getDMLQueryPrompt(dbConfig, input)

**Type:** User Prompt Generator  
**Purpose:** Creates specific DML query generation prompts based on user input

#### Parameters

- **dbConfig:** Database configuration object with dialect-specific settings
- **input:** Natural language request for data modification operation

#### Features

- **Structured Analysis:** Step-by-step query construction process
- **Security Focus:** Mandatory security considerations for every query
- **Database Optimization:** Dialect-specific syntax and best practices
- **Edge Case Handling:** Comprehensive consideration of potential issues
- **Formatted Response:** Structured output for consistency and clarity

#### Query Construction Process

**1. Intent Analysis:**

- Identify operation type (INSERT, UPDATE, DELETE, MERGE/UPSERT)
- Determine target table(s) from schema
- Extract field requirements and conditions

**2. Security Considerations:**

- Identify all values requiring bind variables
- Verify all identifiers against provided schema
- Ensure proper filtering criteria for data modification
- Prevent SQL injection possibilities

**3. Database-Specific Optimization:**

- Apply dialect-specific syntax and best practices
- Use appropriate date/time functions
- Follow database conventions for identifiers
- Implement proper transaction handling

**4. Edge Case Handling:**

- Address NULL value handling
- Consider record not found scenarios
- Handle potential constraint violations
- Recommend appropriate error handling

#### Response Format Structure

**Operation Analysis:** Brief explanation of operation type and target objects
**Security Considerations:** Explanation of security measures implemented
**Query Solution:** Complete database-specific DML query with bind variables
**Parameter List:** List of all bind parameters with data types
**Additional Notes:** Warnings, alternatives, or optimization suggestions

## Database-Specific Examples

### MySQL INSERT Example

```sql
INSERT INTO users (username, email, created_at)
VALUES (:username, :email, NOW());
```

**Features:**

- Omits auto_increment columns
- Uses MySQL-specific NOW() function
- Proper parameter binding with :paramName syntax

### PostgreSQL UPDATE Example

```sql
UPDATE users
SET email = $email,
    updated_at = CURRENT_TIMESTAMP
WHERE user_id = $userId
  AND (updated_at = $lastUpdated OR updated_at IS NULL)
RETURNING user_id, updated_at;
```

**Features:**

- Includes RETURNING clause for result feedback
- Uses PostgreSQL parameter syntax ($paramName)
- Optimistic locking with timestamp check

### Oracle MERGE Example

```sql
MERGE INTO users u
USING (SELECT :username AS username,
              :email AS email
       FROM dual) src
ON (u.username = src.username)
WHEN MATCHED THEN
  UPDATE SET u.email = src.email, u.last_login = SYSDATE
WHEN NOT MATCHED THEN
  INSERT (user_id, username, email, last_login)
  VALUES (user_seq.NEXTVAL, src.username, src.email, SYSDATE);
```

**Features:**

- Oracle-specific MERGE syntax
- Sequence usage for auto-increment
- Comprehensive upsert handling

## Usage Guidelines

### Security Best Practices

**Parameter Binding:**

- Use database-specific parameter syntax consistently
- Never concatenate user input directly into SQL
- Validate all input types before parameter binding
- Use appropriate parameter types for database columns

**Access Control:**

- Ensure proper database permissions for operations
- Validate user authorization for requested operations
- Implement role-based access control where appropriate
- Log sensitive operations for audit trails

**Data Validation:**

- Validate data types against schema before execution
- Check required field constraints
- Verify foreign key relationships
- Handle unique constraint violations gracefully

### Performance Optimization

**Efficient Operations:**

- Use batch operations for multiple records when possible
- Implement appropriate indexing for WHERE clauses
- Consider transaction isolation levels for consistency
- Optimize query execution plans for complex operations

**Resource Management:**

- Use connection pooling for high-volume operations
- Implement proper transaction boundaries
- Handle large datasets with pagination or batching
- Monitor query performance and optimize accordingly

### Error Handling

**Common Scenarios:**

- Record not found for UPDATE/DELETE operations
- Constraint violations (primary key, foreign key, unique)
- Data type mismatches or conversion errors
- Deadlocks and timeout scenarios

**Response Strategies:**

- Provide clear error messages with actionable guidance
- Suggest alternative approaches for failed operations
- Implement retry logic for transient failures
- Log errors appropriately for debugging and monitoring

## Integration Points

- **Query Generator:** Main entry point for DML operation generation
- **Security Layer:** Implements comprehensive security measures
- **Schema Validator:** Validates operations against database schema
- **Performance Monitor:** Tracks and optimizes query performance
- **Audit System:** Logs and tracks data modification operations

## Maintenance Notes

- Update security practices based on evolving threat landscape
- Review and optimize database-specific syntax as platforms evolve
- Maintain parameter binding patterns for new database versions
- Update error handling for new constraint types and scenarios
- Monitor performance patterns and optimize accordingly
