# MongoDB Prompts Documentation

## Overview

This document provides comprehensive documentation for the MongoDB prompts system used in the MyQuery platform. The MongoDB prompts are designed to convert natural language requests into valid MongoDB query objects with intelligent fallback recommendations.

## File: mongodb-prompts.ts

**Location:** `app\(themed)\(SignedIn)\(dashboard)\aiquery\_open-ai-actions\prompts\mongodb-prompts.ts`

### Purpose

The MongoDB prompts system converts natural language queries into valid MongoDB query objects, handling both simple find operations and complex aggregation pipelines. It includes intelligent collection recommendations when exact matches aren't available.

## Core Functions

### 1. getMongoDBSystemPrompt()

**Type:** System Prompt Generator  
**Purpose:** Creates comprehensive MongoDB query generation guidelines

#### Key Features

- **Expert-level MongoDB guidance:** Simulates a senior MongoDB developer with 15+ years of experience
- **Structured query format:** Returns standardized JavaScript objects for consistent processing
- **Schema validation:** Ensures all collection and field references are valid
- **Intelligent recommendations:** Provides alternatives when exact matches aren't available
- **Security-focused:** Embeds literal values without variables or functions

#### Critical Rules

1. **Return Format:** Single valid JavaScript object with specific structure
2. **No Variables:** Embed actual literal values only, no variables or functions
3. **Double Quotes:** Use double quotes around all keys and string values
4. **Valid References:** Use only collection and field names from provided schema
5. **Proper Operators:** Use correct MongoDB operators ($match, $group, $project, etc.)
6. **Default Operation:** Use "find" by default, "aggregate" only for complex operations
7. **Object Only:** Return only the JavaScript object, no extra text or explanations

#### Query Structure Formats

**For Find Operations:**

```json
{
  "collection": "collectionName",
  "operation": "find",
  "filter": {
    /* filter object */
  },
  "options": {
    /* ALWAYS add a "$limit" field with value 100 */
  }
}
```

**For Aggregate Operations:**

```json
{
  "collection": "collectionName",
  "operation": "aggregate",
  "pipeline": [
    /* aggregation stages */
  ],
  "options": {
    /* ALWAYS add a "$limit" field with value 100 */
  }
}
```

**For Recommendations (when no exact match exists):**

```json
{
  "recommendations": "true",
  "suggestedCollections": ["collection1", "collection2"],
  "message": "Consider using these collections for your query",
  "sampleQuery": {
    "collection": "mostRelevantCollection",
    "operation": "find",
    "filter": {
      /* sample filter */
    },
    "options": { "$limit": 10 }
  }
}
```

#### MongoDB Operators Support

**Filter Operators:**

- `$eq` - Equal to
- `$ne` - Not equal to
- `$gt` - Greater than
- `$lt` - Less than
- `$in` - In array
- `$regex` - Regular expression

**Aggregation Operators:**

- `$match` - Filter documents
- `$group` - Group documents
- `$project` - Select fields
- `$sort` - Sort documents
- `$lookup` - Join collections
- `$limit` - Limit results
- `$unwind` - Deconstruct arrays

#### Operation Type Selection

**Use "find" for:**

- Simple data retrieval
- Basic filtering
- Sorting without aggregation
- Direct document access

**Use "aggregate" for:**

- Grouping operations (sum, average, count)
- Complex joins between collections
- Data transformations
- Multi-stage processing
- Computed fields

#### Error Handling and Recommendations

When exact matches aren't available:

1. **Schema Analysis:** Analyze all collections in the schema
2. **Field Matching:** Identify collections with relevant fields
3. **Recommendation Object:** Return structured recommendations
4. **Sample Query:** Provide minimal example using most relevant collection
5. **Clear Messaging:** Explain why suggested collections might be relevant

### 2. getMongoDBPrompt(input)

**Type:** User Prompt Generator  
**Purpose:** Creates specific MongoDB query prompts based on user input

#### Parameters

- **input:** Natural language request from user

#### Features

- Translates natural language to MongoDB syntax
- Maintains structured object format requirements
- Embeds values directly without placeholders
- Provides schema-based recommendations
- Handles both simple and complex query scenarios

## Usage Examples

### Basic Find Query

**Input:** "Find all users older than 30"
**Output:**

```json
{
  "collection": "users",
  "operation": "find",
  "filter": { "age": { "$gt": 30 } },
  "options": { "$limit": 100, "$sort": { "name": 1 } }
}
```

### Aggregation Query

**Input:** "Show total order amounts by customer"
**Output:**

```json
{
  "collection": "orders",
  "operation": "aggregate",
  "pipeline": [
    { "$match": { "status": "completed" } },
    { "$group": { "_id": "$customerId", "total": { "$sum": "$amount" } } },
    { "$limit": 100 }
  ]
}
```

### Recommendation Response

**Input:** "Show actor HR performance data"
**Output:**

```json
{
  "recommendations": "true",
  "suggestedCollections": ["employees", "performance", "departments"],
  "message": "There is no actor or HR performance data, but you might find relevant information in these collections",
  "sampleQuery": {
    "collection": "employees",
    "operation": "find",
    "filter": { "department": "Sales" },
    "options": { "$limit": 10, "$sort": { "performance_rating": -1 } }
  }
}
```

## Best Practices

### Query Optimization

1. **Efficient Filtering:** Use indexed fields in filters when possible
2. **Limit Results:** Always include appropriate limits to prevent performance issues
3. **Proper Sorting:** Use indexed fields for sorting operations
4. **Pipeline Order:** In aggregations, place $match early to reduce document flow

### Security Considerations

1. **No Code Injection:** All values are embedded as literals
2. **Schema Validation:** All references are validated against schema
3. **Sanitized Input:** Proper escaping and quoting of string values
4. **Access Control:** Respects MongoDB permissions and roles

### Error Prevention

1. **Collection Validation:** Verify collection existence before querying
2. **Field Validation:** Check field existence in target collections
3. **Type Checking:** Ensure operators match field types
4. **Syntax Validation:** Use proper MongoDB query syntax

## Integration Points

- **Query Generator:** Main entry point for MongoDB query generation
- **Schema Validator:** Validates collection and field references
- **Performance Optimizer:** Applies MongoDB-specific optimizations
- **Error Handler:** Provides intelligent fallbacks and recommendations

## Maintenance Notes

- Update operator support as new MongoDB features are released
- Review aggregation pipeline patterns for performance improvements
- Maintain recommendation logic for better user experience
- Update security practices based on MongoDB best practices
