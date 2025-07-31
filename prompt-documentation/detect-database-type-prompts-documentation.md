# Detect Database Type Prompts Documentation

## Overview

This document provides comprehensive documentation for the detect database type prompts system used in the MyQuery platform. The database detection prompts are designed to accurately identify database management systems (DBMS) through sophisticated schema fingerprinting and pattern recognition techniques.

## File: detect-database-type-prompts.ts

**Location:** `app\(themed)\(SignedIn)\(dashboard)\aiquery\_open-ai-actions\prompts\detect-database-type-prompts.ts`

### Purpose

The detect database type prompts system provides expert-level database identification capabilities through schema analysis, enabling automatic detection of database types for optimal query generation and configuration. The system uses comprehensive fingerprinting methodology to distinguish between different database management systems.

## Core Functions

### 1. getDetectDatabaseTypeSystemPrompt()

**Type:** System Prompt Generator  
**Purpose:** Creates comprehensive database identification guidelines using fingerprinting methodology

#### Key Features

- **Database Architecture Expertise:** Simulates expert knowledge in database system identification
- **Schema Fingerprinting:** Sophisticated pattern recognition for database type detection
- **Multi-Pattern Analysis:** Comprehensive examination of syntax, data types, and system objects
- **High-Accuracy Detection:** Structured methodology for reliable database identification
- **Confidence Scoring:** Quantitative assessment of identification certainty

#### Database Fingerprinting Methodology

**1. Syntax Pattern Recognition:**

- SQL dialect-specific keywords and syntax structures
- Comment styles and delimiter conventions (/\* \*/, --, #)
- Case sensitivity patterns and identifier handling
- Identifier quoting conventions ([], "", `, etc.)

**2. Data Type Fingerprinting:**

- Distinctive data type names unique to specific databases
- Default type behaviors (case sensitivity, date formats)
- System-specific type extensions and variations
- Size and precision specifications

**3. System Object Identification:**

- System table/view naming patterns (pg**, sys.*, dba*\*)
- System schema structures and organization
- System function naming conventions
- Reserved keyword patterns

**4. Constraint and Index Patterns:**

- Primary key and foreign key syntax variations
- Default constraint naming patterns
- Index type specifications and features
- Auto-increment/sequence implementations

#### Database-Specific Signatures

**Oracle Database:**

- **Distinctive Data Types:** VARCHAR2, NUMBER, ROWID, RAW, LONG RAW
- **System Schemas:** SYS, SYSTEM, DBSNMP
- **Functions:** NVL, DECODE, TO_CHAR, SYSDATE
- **Patterns:** CONNECT BY, ROWNUM, :bind_variables

**PostgreSQL:**

- **Distinctive Data Types:** TEXT, BYTEA, INTERVAL, TIMESTAMPTZ
- **System Schemas:** pg_catalog, information_schema
- **Functions:** array_agg, string_agg, now(), current_timestamp
- **Patterns:** WITH RECURSIVE, RETURNING, schema.table

**MySQL/MariaDB:**

- **Distinctive Data Types:** TINYINT, MEDIUMTEXT, LONGBLOB, ENUM
- **System Schemas:** information_schema, mysql, performance_schema
- **Functions:** IFNULL, CONCAT, NOW(), CURDATE()
- **Patterns:** SHOW TABLES, backtick identifiers

**SQL Server:**

- **Distinctive Data Types:** NVARCHAR, UNIQUEIDENTIFIER, DATETIME2, MONEY
- **System Schemas:** sys, INFORMATION_SCHEMA
- **Functions:** ISNULL, CONVERT, GETDATE(), DATEADD
- **Patterns:** TOP, IDENTITY, square bracket identifiers

**SQLite:**

- **Distinctive Data Types:** NUMERIC, TEXT (for all string types), INTEGER
- **System Tables:** sqlite_master, sqlite_schema
- **Functions:** ifnull, datetime(), julianday()
- **Patterns:** PRAGMA, lack of strict typing

**MongoDB (Schema Definitions):**

- **Distinctive Types:** ObjectId, ISODate, BinData
- **Patterns:** Dot notation (embedded.document), $jsonSchema
- **Types:** NumberDecimal, NumberLong, NumberInt
- **Validators:** $exists, $type, $regex patterns

#### Output Requirements

**JSON Response Structure:**

```json
{
  "primaryType": "string", // Most likely database type
  "confidence": "number", // 1-10 score (10 = highest confidence)
  "secondaryType": "string", // Alternative possibility if confidence <7
  "detectionMethod": "string", // Key pattern that led to identification
  "reasoning": "string" // Brief chain-of-thought explanation
}
```

**Confidence Scoring:**

- **9-10:** Very high confidence with multiple distinctive patterns
- **7-8:** High confidence with clear distinctive features
- **5-6:** Moderate confidence with some ambiguous patterns
- **3-4:** Low confidence with limited distinctive features
- **1-2:** Very low confidence with insufficient evidence

### 2. getDetectDatabaseTypePrompt(schemaInfo)

**Type:** User Prompt Generator  
**Purpose:** Creates specific database identification prompts with schema analysis

#### Parameters

- **schemaInfo:** Raw schema information to be analyzed for database type detection

#### Features

- **Comprehensive Schema Analysis:** Examines all available schema information
- **Multi-Pattern Detection:** Analyzes syntax, data types, and system objects
- **Structured Response:** Ensures consistent JSON output format
- **Alternative Detection:** Provides secondary options for ambiguous cases
- **Evidence Documentation:** Lists specific features that led to identification

#### Analysis Instructions

**1. Schema Examination Process:**

- Carefully examine schema information for database-specific signatures
- Look for distinctive patterns in data types, system objects, and SQL features
- Apply fingerprinting methodology systematically
- Consider comment styles and identifier conventions

**2. Pattern Analysis Areas:**

- **Data Type Definitions:** Unique type names and specifications
- **System Object References:** Schema names and system tables
- **SQL Dialect Features:** Syntax variations and function names
- **Comment and Identifier Styles:** Formatting conventions
- **Function Names and Syntax:** Database-specific function calls

**3. Identification Process:**

- Determine primary database type (most likely match)
- Assess confidence level (1-10 scale)
- Identify alternative possibility (if confidence <7)
- Document key evidence that led to conclusion

**4. Supported Database Types:**

- Oracle Database
- PostgreSQL
- MySQL/MariaDB
- Microsoft SQL Server
- SQLite
- MongoDB (schema definition format)
- IBM Db2
- Snowflake
- Amazon Redshift
- Google BigQuery

#### Response Format

**Complete JSON Structure:**

```json
{
  "primaryType": "string", // Most likely database type
  "confidence": "number", // 1-10 score (10 = highest confidence)
  "secondaryType": "string", // Alternative possibility if confidence <7
  "detectionMethod": "string", // Key pattern that led to identification
  "reasoning": "string", // Brief explanation of conclusion
  "distinctiveFeatures": [
    // List of specific features detected
    "string"
  ]
}
```

## Usage Examples

### High-Confidence PostgreSQL Detection

```typescript
const prompt = getDetectDatabaseTypePrompt(`
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  settings JSONB
);

SELECT * FROM pg_catalog.pg_tables;
`);
```

**Expected Output:**

```json
{
  "primaryType": "PostgreSQL",
  "confidence": 10,
  "secondaryType": null,
  "detectionMethod": "System catalog references",
  "reasoning": "Schema contains SERIAL, TEXT, TIMESTAMPTZ types, pg_catalog references, and now() function - all PostgreSQL-specific",
  "distinctiveFeatures": [
    "SERIAL",
    "TEXT",
    "TIMESTAMPTZ",
    "pg_catalog",
    "JSONB",
    "now()"
  ]
}
```

### MySQL/MariaDB Detection

```typescript
const prompt = getDetectDatabaseTypePrompt(`
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2),
  category ENUM('electronics', 'clothing', 'books'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

SHOW TABLES FROM inventory;
`);
```

**Expected Output:**

```json
{
  "primaryType": "MySQL",
  "confidence": 9,
  "secondaryType": "MariaDB",
  "detectionMethod": "ENUM type and ENGINE specification",
  "reasoning": "Schema contains ENUM data type, AUTO_INCREMENT, ENGINE=InnoDB, and SHOW TABLES syntax - characteristic of MySQL/MariaDB",
  "distinctiveFeatures": [
    "AUTO_INCREMENT",
    "ENUM",
    "ENGINE=InnoDB",
    "SHOW TABLES"
  ]
}
```

### Oracle Database Detection

```typescript
const prompt = getDetectDatabaseTypePrompt(`
CREATE TABLE employees (
  emp_id NUMBER(10) PRIMARY KEY,
  emp_name VARCHAR2(100) NOT NULL,
  hire_date DATE DEFAULT SYSDATE,
  salary NUMBER(10,2)
);

SELECT table_name FROM dba_tables WHERE owner = 'HR';
`);
```

**Expected Output:**

```json
{
  "primaryType": "Oracle",
  "confidence": 10,
  "secondaryType": null,
  "detectionMethod": "VARCHAR2 and NUMBER data types",
  "reasoning": "Schema contains VARCHAR2, NUMBER data types, SYSDATE function, and dba_tables system view - all Oracle-specific",
  "distinctiveFeatures": ["VARCHAR2", "NUMBER", "SYSDATE", "dba_tables"]
}
```

### Ambiguous Case with Lower Confidence

```typescript
const prompt = getDetectDatabaseTypePrompt(`
CREATE TABLE simple_table (
  id INTEGER,
  name VARCHAR(50),
  created_date DATE
);
`);
```

**Expected Output:**

```json
{
  "primaryType": "SQLite",
  "confidence": 4,
  "secondaryType": "PostgreSQL",
  "detectionMethod": "Generic SQL patterns",
  "reasoning": "Schema uses generic SQL types without distinctive features - could be multiple database types",
  "distinctiveFeatures": ["INTEGER", "VARCHAR", "DATE"]
}
```

## Best Practices

### Accurate Detection

**Pattern Recognition:**

- Look for multiple distinctive features rather than relying on single indicators
- Consider system-specific naming conventions and reserved words
- Analyze data type variations and default behaviors
- Examine function names and syntax patterns

**Confidence Assessment:**

- Assign high confidence only when multiple distinctive patterns are present
- Use moderate confidence for cases with some ambiguous features
- Provide alternative suggestions when confidence is below 7
- Document specific evidence that led to identification

### Error Handling

**Insufficient Information:**

- Return low confidence scores when schema information is limited
- Provide multiple possible alternatives for ambiguous cases
- Document the limitations of available information
- Suggest additional schema information that would improve detection

**Edge Cases:**

- Handle mixed schema information from multiple database types
- Recognize database-agnostic SQL patterns
- Consider custom data types and extensions
- Account for migration artifacts and compatibility modes

### Integration Considerations

**Downstream Usage:**

- Ensure JSON output is properly formatted and parseable
- Provide consistent field names and data types
- Include sufficient detail for decision-making processes
- Consider confidence thresholds for automated processing

**Performance Optimization:**

- Prioritize most distinctive patterns for faster recognition
- Implement efficient pattern matching algorithms
- Cache recognition results for similar schema patterns
- Optimize for common database types while supporting edge cases

## Integration Points

- **Query Generation:** Provides database type information for SQL dialect selection
- **Configuration Management:** Determines appropriate database-specific settings
- **Schema Analysis:** Supports automated schema understanding and processing
- **Migration Tools:** Assists in database migration and compatibility assessment
- **Monitoring Systems:** Enables database-specific monitoring and alerting

## Maintenance Notes

- Update signature patterns as database versions evolve
- Add support for new database types and cloud platforms
- Enhance pattern recognition algorithms based on detection accuracy
- Maintain comprehensive test cases for all supported database types
- Update confidence scoring based on real-world detection performance
