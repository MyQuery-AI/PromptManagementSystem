export interface PromptType {
  id: string;
  name: string;
  description: string;
  color: string;
  bgColor: string;
  textColor: string;
  usage: string;
  icon?: string;
}

export const PROMPT_TYPES: PromptType[] = [
  {
    id: "sql_generation",
    name: "SQL Generation",
    description: "Generate SQL queries from natural language",
    color: "blue",
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
    usage: "Database Query Builder",
    icon: "🗄️",
  },
  {
    id: "code_explanation",
    name: "Code Explanation",
    description: "Explain complex code snippets in simple terms",
    color: "green",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
    usage: "Developer Assistant",
    icon: "📝",
  },
  {
    id: "data_visualization",
    name: "Data Visualization",
    description: "Create charts and visual representations of data",
    color: "purple",
    bgColor: "bg-purple-100",
    textColor: "text-purple-800",
    usage: "Chart Generation",
    icon: "📊",
  },
  {
    id: "performance_optimization",
    name: "Performance Optimization",
    description: "Analyze and optimize query/code performance",
    color: "orange",
    bgColor: "bg-orange-100",
    textColor: "text-orange-800",
    usage: "System Optimizer",
    icon: "⚡",
  },
  {
    id: "data_validation",
    name: "Data Validation",
    description: "Validate data integrity and quality",
    color: "red",
    bgColor: "bg-red-100",
    textColor: "text-red-800",
    usage: "Quality Assurance",
    icon: "✅",
  },
  {
    id: "schema_design",
    name: "Schema Design",
    description: "Design optimal database schemas",
    color: "indigo",
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-800",
    usage: "Database Architect",
    icon: "🏗️",
  },
  {
    id: "api_documentation",
    name: "API Documentation",
    description: "Generate comprehensive API documentation",
    color: "teal",
    bgColor: "bg-teal-100",
    textColor: "text-teal-800",
    usage: "Documentation Generator",
    icon: "📚",
  },
  {
    id: "test_generation",
    name: "Test Generation",
    description: "Create automated tests for code",
    color: "pink",
    bgColor: "bg-pink-100",
    textColor: "text-pink-800",
    usage: "Test Automation",
    icon: "🧪",
  },
  {
    id: "security_analysis",
    name: "Security Analysis",
    description: "Analyze code for security vulnerabilities",
    color: "yellow",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
    usage: "Security Scanner",
    icon: "🔒",
  },
  {
    id: "report_generation",
    name: "Report Generation",
    description: "Generate comprehensive reports from data",
    color: "gray",
    bgColor: "bg-gray-100",
    textColor: "text-gray-800",
    usage: "Report Builder",
    icon: "📋",
  },
];

export const getPromptTypeById = (id: string): PromptType | undefined => {
  return PROMPT_TYPES.find((type) => type.id === id);
};

export const getPromptTypeByName = (name: string): PromptType | undefined => {
  return PROMPT_TYPES.find(
    (type) => type.name.toLowerCase() === name.toLowerCase()
  );
};

export const getPromptTypeColors = (typeId: string) => {
  const type = getPromptTypeById(typeId);
  return type
    ? {
        bgColor: type.bgColor,
        textColor: type.textColor,
        color: type.color,
      }
    : {
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
        color: "gray",
      };
};
