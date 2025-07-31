/**
 * Utility functions for handling prompt templates with variables
 */

export interface PromptVariable {
  name: string;
  example?: string;
  description?: string;
}

/**
 * Extracts all ${variable} references from a prompt template
 * Returns a unique list of variable names, handling complex object expressions
 */
export function extractPromptVariables(promptContent: string): string[] {
  const variableRegex = /\$\{([^}]+)\}/g;
  const variables = new Set<string>();
  let match;

  while ((match = variableRegex.exec(promptContent)) !== null) {
    const fullExpression = match[1].trim();

    // For simple object properties (e.g., "dbConfig.dialectName"), keep the full path
    if (
      /^[a-zA-Z_$][a-zA-Z0-9_$]*\.[a-zA-Z_$][a-zA-Z0-9_$.]*$/.test(
        fullExpression
      )
    ) {
      variables.add(fullExpression);
    }
    // For simple variables (e.g., "dbConfig"), keep as is
    else if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(fullExpression)) {
      variables.add(fullExpression);
    }
    // For complex expressions, extract the base object
    else {
      const baseObjectMatch = fullExpression.match(
        /^([a-zA-Z_$][a-zA-Z0-9_$]*)/
      );
      if (baseObjectMatch) {
        variables.add(baseObjectMatch[1]);
      } else {
        // Fallback to the full expression if no simple pattern
        variables.add(fullExpression);
      }
    }
  }

  return Array.from(variables).sort();
} /**
 * Extracts all unique variable expressions (including complex ones)
 * This preserves the full ${} expressions for analysis
 */
export function extractAllVariableExpressions(promptContent: string): string[] {
  const variableRegex = /\$\{([^}]+)\}/g;
  const expressions = new Set<string>();
  let match;

  while ((match = variableRegex.exec(promptContent)) !== null) {
    expressions.add(match[1].trim());
  }

  return Array.from(expressions).sort();
}

/**
 * Prepares a prompt template for use in a function by escaping template literals
 * This allows the prompt to be safely stored and later used with template literal syntax
 */
export function escapePromptTemplate(promptContent: string): string {
  // Escape backticks and preserve ${} variables
  return promptContent.replace(/`/g, "\\`").replace(/\\/g, "\\\\");
}

/**
 * Converts a prompt template to a function-ready format
 * Returns both the escaped content and the list of variables
 */
export function preparePromptForFunction(promptContent: string) {
  const variables = extractPromptVariables(promptContent);
  const escapedContent = escapePromptTemplate(promptContent);

  return {
    content: escapedContent,
    variables,
    functionTemplate: generateFunctionTemplate(escapedContent, variables),
  };
}

/**
 * Generates a JavaScript function template that can be used to render the prompt
 */
export function generateFunctionTemplate(
  escapedContent: string,
  variables: string[]
): string {
  const params = variables.join(", ");

  return `function renderPrompt(${params}) {
  return \`${escapedContent}\`;
}`;
}

/**
 * Validates that all required variables are provided
 */
export function validatePromptVariables(
  promptContent: string,
  providedVariables: Record<string, any>
): { isValid: boolean; missingVariables: string[] } {
  const requiredVariables = extractPromptVariables(promptContent);
  const missingVariables = requiredVariables.filter(
    (variable) => !(variable in providedVariables)
  );

  return {
    isValid: missingVariables.length === 0,
    missingVariables,
  };
}

/**
 * Renders a prompt template with provided variables
 */
export function renderPromptTemplate(
  promptContent: string,
  variables: Record<string, any>
): string {
  let rendered = promptContent;

  // Replace each variable with its value
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\$\\{\\s*${key}\\s*\\}`, "g");
    rendered = rendered.replace(regex, String(value));
  });

  return rendered;
}

/**
 * Converts a prompt template to a ready-to-use JavaScript function string
 * This creates actual executable code that can be eval'd or saved to a file
 */
export function generateExecutableFunction(
  promptContent: string,
  functionName: string = "generatePrompt"
): { functionCode: string; variables: string[] } {
  const variables = extractPromptVariables(promptContent);

  // Create the parameter list
  const params = variables.length > 0 ? variables.join(", ") : "";

  // Escape the content for use in a template literal
  const escapedContent = promptContent
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`");

  const functionCode = `function ${functionName}(${params}) {
  return \`${escapedContent}\`;
}`;

  return {
    functionCode,
    variables,
  };
}

/**
 * Creates a standalone module file content for a prompt template
 */
export function generatePromptModule(
  promptContent: string,
  functionName: string = "generatePrompt",
  exportName?: string
): string {
  const { functionCode, variables } = generateExecutableFunction(
    promptContent,
    functionName
  );

  const finalExportName = exportName || functionName;

  return `/**
 * Auto-generated prompt template function
 * Variables required: ${variables.join(", ")}
 */

${functionCode}

// Export the function
export { ${functionName} as ${finalExportName} };

// Export variable list for reference
export const requiredVariables = ${JSON.stringify(variables, null, 2)};

// Example usage:
// const result = ${functionName}(${variables.map((v) => `your_${v}_value`).join(", ")});
`;
}

/**
 * Example usage and testing
 */
export const promptVariableUtils = {
  extractVariables: extractPromptVariables,
  escapeTemplate: escapePromptTemplate,
  prepareForFunction: preparePromptForFunction,
  generateFunction: generateFunctionTemplate,
  validate: validatePromptVariables,
  render: renderPromptTemplate,
};
