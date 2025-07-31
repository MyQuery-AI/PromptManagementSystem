/**
 * Example of converting a prompt template into a reusable function
 * This shows how to handle your specific prompt with dbConfig variables
 */

// Type definition for the database configuration
interface DbConfig {
  dialectName: string;
  quoteChar: string;
  parameterPrefix: string;
  supportsLimitClause: boolean;
  supportsOffsetFetch: boolean;
  dateFormat: string;
  stringConcat: string;
}

// The prompt template function - this is what you'd use in your application
export function generateSQLPrompt(dbConfig: DbConfig): string {
  return `You are an expert ${dbConfig.dialectName} DBA and SQL developer with 15+ years of experience.

**CRITICAL REQUIREMENTS:**
1. Generate ONLY syntactically correct ${dbConfig.dialectName} SQL queries
2. NEVER use bind variables, placeholders or parameters of any kind (e.g. ${dbConfig.parameterPrefix}name, $1, ?, @p).
3. Verify ALL table and column names exist in the provided schema
4. Apply ${dbConfig.dialectName}-specific syntax and optimizations
5. Use proper ${dbConfig.dialectName} data types and functions
6. Implement appropriate indexing strategies when relevant
7. If no exact match for the requested data exists, analyze the schema and:
   a. Identify the most relevant tables and columns
   b. Return a special query starting with "-- TABLE RECOMMENDATIONS: " followed by a list of relevant tables
   c. Include a basic query using the most relevant table(s)

**DATABASE CONFIGURATION:**
- Database Type: ${dbConfig.dialectName}
- Quote Character: ${dbConfig.quoteChar}
- Parameter Prefix: ${dbConfig.parameterPrefix}
- Supports LIMIT: ${dbConfig.supportsLimitClause}
- Supports OFFSET/FETCH: ${dbConfig.supportsOffsetFetch}
- Date Format: ${dbConfig.dateFormat}
- String Concatenation: ${dbConfig.stringConcat}

**QUERY OPTIMIZATION RULES:**
1. Use appropriate JOIN types (INNER, LEFT, RIGHT, FULL OUTER)
2. Apply WHERE clause filters early in the execution plan
3. Use proper indexing hints when beneficial (${dbConfig.dialectName === "Oracle Database" ? "/*+ INDEX */" : "database-specific hints"})
4. Implement pagination using ${dbConfig.supportsLimitClause ? "LIMIT/OFFSET" : "ROW_NUMBER() and FETCH"}
5. Use CTEs for complex subqueries when beneficial
6. Apply proper data type casting and conversions

**LITERAL VALUE RULES:**
- Embed all literal values directly in the SQL
- Do **NOT** use placeholders such as :name, $1, ?, @p
- Ensure all values are properly quoted and escaped
- Use correct data types for literals (e.g., 'string', 123, ${dbConfig.dateFormat})
- Use proper date/time functions for ${dbConfig.dialectName}
- Use COALESCE or ISNULL for null handling
- Use correct string concatenation operator (${dbConfig.stringConcat})

**ERROR PREVENTION:**
- Validate all table and column references against schema
- Use correct date/time functions
- Use correct null and string handling for ${dbConfig.dialectName}

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
}

// Example usage with different database configurations
export function demonstrateUsage() {
  console.log("=== POSTGRESQL EXAMPLE ===");
  const postgresConfig: DbConfig = {
    dialectName: "PostgreSQL",
    quoteChar: '"',
    parameterPrefix: "$",
    supportsLimitClause: true,
    supportsOffsetFetch: true,
    dateFormat: "YYYY-MM-DD",
    stringConcat: "||",
  };

  const postgresPrompt = generateSQLPrompt(postgresConfig);
  console.log(postgresPrompt.substring(0, 300) + "...\n");

  console.log("=== MYSQL EXAMPLE ===");
  const mysqlConfig: DbConfig = {
    dialectName: "MySQL",
    quoteChar: "`",
    parameterPrefix: "?",
    supportsLimitClause: true,
    supportsOffsetFetch: false,
    dateFormat: "%Y-%m-%d",
    stringConcat: "CONCAT",
  };

  const mysqlPrompt = generateSQLPrompt(mysqlConfig);
  console.log(mysqlPrompt.substring(0, 300) + "...\n");

  console.log("=== ORACLE EXAMPLE ===");
  const oracleConfig: DbConfig = {
    dialectName: "Oracle Database",
    quoteChar: '"',
    parameterPrefix: ":",
    supportsLimitClause: false,
    supportsOffsetFetch: true,
    dateFormat: "YYYY-MM-DD",
    stringConcat: "||",
  };

  const oraclePrompt = generateSQLPrompt(oracleConfig);
  console.log(oraclePrompt.substring(0, 300) + "...\n");
}

// Generic function generator for any prompt template
export function createPromptFunction(
  templateContent: string,
  variableNames: string[]
): string {
  // Create parameter list
  const params = variableNames.join(", ");

  // Escape the template content for use in a template literal
  const escapedContent = templateContent
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "${");

  return `function generatePrompt(${params}) {
  return \`${escapedContent}\`;
}`;
}

// Usage examples
if (require.main === module) {
  demonstrateUsage();

  console.log("\n=== FUNCTION GENERATION EXAMPLE ===");
  const variables = ["dbConfig"];
  const originalTemplate = `You are an expert \${dbConfig.dialectName} developer.`;
  const generatedFunction = createPromptFunction(originalTemplate, variables);
  console.log(generatedFunction);
}
