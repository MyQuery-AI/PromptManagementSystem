import {
  extractPromptVariables,
  generateExecutableFunction,
  generatePromptModule,
  renderPromptTemplate,
} from "./prompt-variables";

// Your original prompt template with ${} variables
const originalPrompt = `You are an expert \${dbConfig.dialectName} DBA and SQL developer with 15+ years of experience.

**CRITICAL REQUIREMENTS:**
1. Generate ONLY syntactically correct \${dbConfig.dialectName} SQL queries
2. NEVER use bind variables, placeholders or parameters of any kind (e.g. \${dbConfig.parameterPrefix}name, $1, ?, @p).
3. Verify ALL table and column names exist in the provided schema
4. Apply \${dbConfig.dialectName}-specific syntax and optimizations
5. Use proper \${dbConfig.dialectName} data types and functions

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
3. Use proper indexing hints when beneficial (\${dbConfig.dialectName === "Oracle Database" ? "/*+ INDEX */" : "database-specific hints"})
4. Implement pagination using \${dbConfig.supportsLimitClause ? "LIMIT/OFFSET" : "ROW_NUMBER() and FETCH"}
5. Use CTEs for complex subqueries when beneficial

**LITERAL VALUE RULES:**
- Embed all literal values directly in the SQL
- Use correct data types for literals (e.g., 'string', 123, \${dbConfig.dateFormat})
- Use proper date/time functions for \${dbConfig.dialectName}
- Use correct string concatenation operator (\${dbConfig.stringConcat})

**ERROR PREVENTION:**
- Use correct null and string handling for \${dbConfig.dialectName}

**PERFORMANCE CONSIDERATIONS:**
- Select only needed columns
- Filter with WHERE early
- Use indexes where helpful`;

console.log("=== STEP 1: EXTRACT VARIABLES ===");
const variables = extractPromptVariables(originalPrompt);
console.log("Variables found:");
variables.forEach((variable, index) => {
  console.log(`${index + 1}. \${${variable}}`);
});

console.log("\n=== STEP 2: GENERATE EXECUTABLE FUNCTION ===");
const { functionCode, variables: detectedVars } = generateExecutableFunction(
  originalPrompt,
  "generateSQLPrompt"
);
console.log("Generated function:");
console.log(functionCode);

console.log("\n=== STEP 3: EXAMPLE USAGE ===");
// Create a sample dbConfig object
const dbConfig = {
  dialectName: "PostgreSQL",
  quoteChar: '"',
  parameterPrefix: "$",
  supportsLimitClause: true,
  supportsOffsetFetch: true,
  dateFormat: "YYYY-MM-DD",
  stringConcat: "||",
};

// Use the template with actual values
const renderedPrompt = renderPromptTemplate(originalPrompt, { dbConfig });
console.log("Rendered prompt (first 300 characters):");
console.log(renderedPrompt.substring(0, 300) + "...");

console.log("\n=== STEP 4: GENERATE MODULE FILE ===");
const moduleContent = generatePromptModule(originalPrompt, "generateSQLPrompt");
console.log("Complete module file content:");
console.log(moduleContent);

export { originalPrompt, variables, functionCode, renderedPrompt };
