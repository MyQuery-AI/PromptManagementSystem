import {
  extractPromptVariables,
  preparePromptForFunction,
  renderPromptTemplate,
} from "@/lib/prompt-variables";

// Your example prompt
const examplePrompt = `You are an expert \${
    dbConfig.dialectName
  } DBA and SQL developer with 15+ years of experience.

**CRITICAL REQUIREMENTS:**
1. Generate ONLY syntactically correct \${dbConfig.dialectName} SQL queries
2. NEVER use bind variables, placeholders or parameters of any kind (e.g. \${
    dbConfig.parameterPrefix
  }name, $1, ?, @p).
3. Verify ALL table and column names exist in the provided schema
4. Apply \${dbConfig.dialectName}-specific syntax and optimizations
5. Use proper \${dbConfig.dialectName} data types and functions
6. Implement appropriate indexing strategies when relevant
7. If no exact match for the requested data exists, analyze the schema and:
   a. Identify the most relevant tables and columns
   b. Return a special query starting with "-- TABLE RECOMMENDATIONS: " followed by a list of relevant tables
   c. Include a basic query using the most relevant table(s)

**DATABASE CONFIGURATION:**
- Database Type: \${dbConfig.dialectName}
- Quote Character: \${dbConfig.quoteChar}
- Parameter Prefix: \${dbConfig.parameterPrefix}
- Supports LIMIT: \${dbConfig.supportsLimitClause}
- Supports OFFSET/FETCH: \${dbConfig.supportsOffsetFetch}
- Date Format: \${dbConfig.dateFormat}
- String Concatenation: \${dbConfig.stringConcat}

**QUERY OPTIMIZATION RULES:**
1. Use appropriate JOIN types (INNER, LEFT, RIGHT, FULL OUTER)
2. Apply WHERE clause filters early in the execution plan
3. Use proper indexing hints when beneficial (\${
    dbConfig.dialectName === "Oracle Database"
      ? "/*+ INDEX */"
      : "database-specific hints"
  })
4. Implement pagination using \${
    dbConfig.supportsLimitClause ? "LIMIT/OFFSET" : "ROW_NUMBER() and FETCH"
  }
5. Use CTEs for complex subqueries when beneficial
6. Apply proper data type casting and conversions

**LITERAL VALUE RULES:**
- Embed all literal values directly in the SQL
- Do **NOT** use placeholders such as :name, $1, ?, @p
- Ensure all values are properly quoted and escaped
- Use correct data types for literals (e.g., 'string', 123, \${
    dbConfig.dateFormat
  })
- Use proper date/time functions for \${dbConfig.dialectName}
- Use COALESCE or ISNULL for null handling
- Use correct string concatenation operator (\${dbConfig.stringConcat})

**ERROR PREVENTION:**
- Validate all table and column references against schema
- Use correct date/time functions
- Use correct null and string handling for \${dbConfig.dialectName}

**PERFORMANCE CONSIDERATIONS:**
- Select only needed columns
- Filter with WHERE early
- Use indexes where helpful
- Avoid full-table scans when possible

**TABLE RECOMMENDATION SCENARIOS:**
Instead of returning an error message when a query cannot be generated, provide table recommendations when:
- The user requests data about tables that don't exist in the schema exactly as asked
- The request uses terminology that doesn't exactly match table/column names
- The request is conceptually related to available data but requires adaptation

When providing recommendations:
1. Analyze all available tables in the schema
2. Identify tables with columns that might relate to the request (even partially)
3. Return a response starting with "-- TABLE RECOMMENDATIONS: " followed by a list of tables
4. Include a sample query using the most promising table(s)
5. Add comments explaining how the suggested tables might relate to the original request

**EXAMPLE TABLE RECOMMENDATION RESPONSE:**
"-- TABLE RECOMMENDATIONS: Instead of actor HR performance data, consider using: employees, performance_reviews, department_metrics

SELECT 
  e.employee_id, 
  e.name, 
  pr.rating, 
  pr.review_date
FROM 
  employees e
JOIN 
  performance_reviews pr ON e.employee_id = pr.employee_id
WHERE 
  e.department = 'Sales'
ORDER BY 
  pr.rating DESC
LIMIT 10;

-- This query uses the employees and performance_reviews tables which are the closest match to HR performance data"`;

// Extract variables
console.log("=== EXTRACTED VARIABLES ===");
const variables = extractPromptVariables(examplePrompt);
variables.forEach((variable, index) => {
  console.log(`${index + 1}. \${${variable}}`);
});

console.log("\n=== PREPARED FOR FUNCTION ===");
const prepared = preparePromptForFunction(examplePrompt);
console.log("Variables found:", prepared.variables);
console.log("\nFunction template:");
console.log(prepared.functionTemplate);

// Example usage with variables
console.log("\n=== EXAMPLE USAGE ===");
const dbConfig = {
  dialectName: "PostgreSQL",
  quoteChar: '"',
  parameterPrefix: "$",
  supportsLimitClause: true,
  supportsOffsetFetch: true,
  dateFormat: "YYYY-MM-DD",
  stringConcat: "||",
};

const renderedPrompt = renderPromptTemplate(examplePrompt, { dbConfig });
console.log("Rendered prompt preview (first 200 chars):");
console.log(renderedPrompt.substring(0, 200) + "...");

export { examplePrompt, variables, prepared };
