# Chart Configuration Prompts Documentation

## Overview

This document provides comprehensive documentation for the chart configuration prompts system used in the MyQuery platform. The chart config prompts are designed to provide secure, accessible, and accurate chart creation recommendations through sophisticated chain-of-thought reasoning and comprehensive data analysis.

## File: chart-config-prompts.ts

**Location:** `app\(themed)\(SignedIn)\(dashboard)\aiquery\_open-ai-actions\prompts\chart-config-prompts.ts`

### Purpose

The chart configuration prompts system provides expert-level data visualization guidance with security-first approach, ensuring appropriate chart type selection, accessibility compliance, and accurate data representation. The system uses advanced analytical reasoning to prevent misleading visualizations and optimize user experience.

## Core Functions

### 1. getChartConfigSystemPrompt(userIntent)

**Type:** System Prompt Generator  
**Purpose:** Creates comprehensive chart configuration guidelines with security validation

#### Key Features

- **Data Visualization Expertise:** Simulates senior data visualization expert with focus on accessibility and accuracy
- **Security-First Approach:** Prevents misleading visualizations through comprehensive validation
- **Chain-of-Thought Reasoning:** Structured analytical process for optimal chart selection
- **Accessibility Compliance:** Ensures color vision deficiency support and screen reader compatibility
- **Comprehensive Chart Matrix:** Detailed reference table for visualization selection

#### Security Check Framework

**1. Misleading Visualization Prevention:**

- Prevents distorted axes (e.g., truncating Y-axis below 0)
- Avoids 3D effects that distort proportions
- Flags mismatched data-chart pairs (e.g., pie charts for time series)
- Ensures accessible color palettes for color vision deficiencies

**2. Data-Chart Compatibility Validation:**

- Validates chart type appropriateness for data structure
- Prevents high-cardinality pie charts (>7 categories)
- Ensures sufficient data points for statistical validity
- Handles edge cases (empty datasets, single values)

#### Chain-of-Thought Reasoning Process

**Step 1: Data Type Analysis**

- **Numeric Data:** Consider line/bar/scatter charts
- **Categorical Data:** Consider bar/pie/treemap charts
- **Time-Based Data:** MUST use time-series charts
- **Mixed Data:** Consider combination charts with clear legends

**Step 2: User Intent Alignment**

- **Trends:** Line/Area charts
- **Comparisons:** Bar/Column charts
- **Distributions:** Histogram/Boxplot charts
- **Relationships:** Scatter/Heatmap charts
- **Part-to-whole:** Pie/Donut/Treemap charts
- **Composition:** Stacked bar/area charts
- **Rankings:** Horizontal bar charts (sorted)

**Step 3: Data Characteristics Validation**

- **High Cardinality (>7 categories):** Ban pie charts, consider grouped bar or treemap
- **Sparse Time Data:** Prefer markers+lines or add interpolation notes
- **High-Cardinality Categories:** Aggregate or sample with "Others" category
- **Single Values:** Card visualization with contextual comparison
- **Mixed Scales:** Consider dual-axis (with caution) or normalization
- **Small Differences:** Consider delta charts or percentage views

#### Visualization Reference Matrix

| Chart Type   | Best For                    | Data Requirements            | Security Risks          | Accessibility                    |
| ------------ | --------------------------- | ---------------------------- | ----------------------- | -------------------------------- |
| Line Chart   | Trends over time            | Time + 1+ numeric series     | Axis manipulation       | Line patterns for colorblind     |
| Bar Chart    | Category comparisons        | Categorical + numeric        | Truncated baselines     | Sufficient spacing, clear labels |
| Scatter Plot | Correlation analysis        | 2+ numeric variables         | Overplotting            | Shape and color for points       |
| Pie Chart    | Proportions (≤5 categories) | Single categorical series    | Area distortion         | High contrast between segments   |
| Heatmap      | Matrix relationships        | Categorical x Categorical    | Color misinterpretation | Sequential color scales          |
| Histogram    | Distribution shape          | Single numeric variable      | Bin size manipulation   | Clear bin boundaries             |
| Boxplot      | Statistical distribution    | Numeric with outliers        | Hiding outliers         | Clear median/quartile indicators |
| Area Chart   | Cumulative values/trends    | Time + numeric, non-negative | Stacking distortion     | Distinct patterns + colors       |
| Card         | Single KPI metric           | Single value with context    | Lack of context         | Large, readable text             |

#### Advanced Considerations

**Edge Cases:**

- Empty datasets: Return error with guidance
- Mixed data: Consider combination charts with clear legends
- Single data points: Recommend card or gauge visualizations
- High cardinality: Implement aggregation strategies

**Interactivity:**

- Suggest tooltip content for additional context
- Recommend drill-down capabilities where appropriate
- Consider responsive design for different screen sizes

**Annotations:**

- Recommend key thresholds or benchmarks to include
- Suggest contextual information for better understanding
- Include data source and update frequency information

#### Output Requirements

**JSON Structure:**

```json
{
  "chartType": "string",
  "rationale": "string", // Explain chain-of-thought steps
  "securityCheck": "string", // e.g., "Verified: baseline=0"
  "config": {
    "title": "string",
    "colorPalette": ["string"], // Accessibility-optimized
    "altText": "string", // Screen reader description
    "annotations": [] // Optional key points to highlight
  }
}
```

**Rejection Criteria:**

- Data-chart mismatch detected
- > 7 categories for pie chart
- Missing time data for line chart
- Empty dataset or insufficient data points

### 2. getChartConfigPrompt(userQuery, dataAnalysis, results)

**Type:** User Prompt Generator  
**Purpose:** Creates specific chart configuration prompts with comprehensive data analysis

#### Parameters

- **userQuery:** User's natural language request for visualization
- **dataAnalysis:** Structured analysis of data characteristics
- **results:** Array of data records for pattern analysis

#### Features

- **Comprehensive Data Profiling:** Analyzes numeric, categorical, and temporal columns
- **Pattern Recognition:** Identifies data distribution patterns and characteristics
- **Analytical Reasoning:** Step-by-step logical process for chart selection
- **Security Validation:** Multi-layered security and accessibility checks
- **Detailed Configuration:** Complete chart setup with axes, colors, and annotations

#### Data Analysis Components

**Data Profile Analysis:**

- Record count and data volume assessment
- Column type identification (numeric, categorical, date/time)
- Data pattern extraction and trend identification
- Distribution analysis and skew detection

**Analytical Reasoning Process:**

1. **Data Type Analysis:** Identifies available dimensions and measures
2. **Visualization Selection Logic:** Matches data characteristics to chart types
3. **Security & Accessibility Validation:** Ensures compliant and accurate representations

**Output Specification:**

```json
{
  "chartType": "string", // Specific type with variant
  "rationale": "string", // Clear explanation of selection process
  "securityChecks": {
    "axisBaseline": "string",
    "dataVolume": "string",
    "categoryCount": "string"
  },
  "config": {
    "title": "string",
    "subtitle": "string",
    "colors": ["string"], // Accessibility-optimized palette
    "altText": "string",
    "axes": {
      "x": { "title": "string", "type": "string" },
      "y": { "title": "string", "type": "string", "format": "string" }
    },
    "legend": { "position": "string", "title": "string" },
    "annotations": []
  }
}
```

## Helper Functions

### Data Analysis Functions

**extractDataPatterns(results, dataAnalysis)**

- Analyzes basic patterns in result data
- Extracts date ranges and value distributions
- Provides summary statistics for configuration decisions

**analyzeDistribution(results, dataAnalysis)**

- Examines data distribution characteristics
- Identifies skewed vs. even distributions
- Analyzes categorical vs. numeric data patterns

**extractQueryIntent(query)**

- Parses user query to identify visualization intent
- Maps to specific visualization goals (trend, comparison, distribution, etc.)
- Provides context for chart type selection

**checkDataCardinality(results, dataAnalysis)**

- Evaluates categorical data cardinality
- Provides recommendations based on category count
- Prevents inappropriate visualizations for high-cardinality data

### Validation Functions

**validateAxisIntegrity(dataAnalysis)**

- Ensures proper axis baseline selection
- Prevents misleading axis manipulation
- Validates numeric range requirements

**validateChartCompatibility(results, dataAnalysis)**

- Checks data-chart type compatibility
- Identifies potential visualization issues
- Provides alternative recommendations when needed

**handleEdgeCases(results, dataAnalysis)**

- Manages empty datasets and single data points
- Handles null values and missing data
- Provides appropriate fallback visualizations

## Usage Examples

### Basic Chart Configuration

```typescript
const systemPrompt = getChartConfigSystemPrompt("Show sales trends over time");
const configPrompt = getChartConfigPrompt(
  "Display monthly sales by region",
  {
    totalRows: 12,
    numericColumns: ["sales_amount"],
    categoricalColumns: ["region"],
    dateColumns: ["month"],
  },
  salesData,
);
```

### Security Validation Example

```typescript
// System automatically prevents misleading pie chart for high cardinality
const result = getChartConfigPrompt(
  "Show sales by product",
  {
    categoricalColumns: ["product"],
    numericColumns: ["sales"],
  },
  dataWithManyProducts, // >15 products
);
// Result will recommend bar chart instead of pie chart
```

### Accessibility Configuration

```typescript
// System automatically includes accessibility features
const config = {
  chartType: "bar",
  config: {
    colors: ["#1f77b4", "#ff7f0e", "#2ca02c"], // Colorblind-friendly
    altText: "Bar chart showing sales by region with North leading at $150K",
    axes: {
      x: { title: "Region", type: "categorical" },
      y: { title: "Sales ($)", type: "numeric", format: "currency" },
    },
  },
};
```

## Best Practices

### Security and Accuracy

**Axis Integrity:**

- Always start axes at zero unless justified
- Clearly indicate when non-zero baselines are used
- Provide context for axis scaling decisions

**Data-Chart Matching:**

- Validate chart type appropriateness for data structure
- Prevent misleading visualizations through automated checks
- Provide clear rationale for chart type selection

**Statistical Validity:**

- Ensure sufficient data points for meaningful visualization
- Handle outliers and edge cases appropriately
- Provide confidence indicators when appropriate

### Accessibility Compliance

**Color Design:**

- Use colorblind-friendly palettes by default
- Provide sufficient contrast ratios
- Include pattern or texture alternatives to color

**Screen Reader Support:**

- Generate comprehensive alt text descriptions
- Include data summaries and key insights
- Provide keyboard navigation support

**Interactive Elements:**

- Ensure tooltips are accessible
- Provide keyboard shortcuts for chart interactions
- Include focus indicators for interactive elements

### Performance Optimization

**Data Volume Management:**

- Implement aggregation for large datasets
- Use sampling techniques when appropriate
- Optimize rendering for different device capabilities

**Responsive Design:**

- Adapt chart layouts for different screen sizes
- Optimize touch interactions for mobile devices
- Ensure readability across different resolutions

## Integration Points

- **Query Analysis:** Integrates with natural language processing for intent extraction
- **Data Pipeline:** Connects with data analysis and preparation systems
- **Visualization Engine:** Provides configuration for chart rendering systems
- **Accessibility Framework:** Ensures compliance with accessibility standards
- **Security Layer:** Implements comprehensive validation and prevention measures

## Maintenance Notes

- Update visualization best practices based on emerging standards
- Enhance accessibility features as guidelines evolve
- Expand chart type support based on user requirements
- Improve pattern recognition algorithms for better recommendations
- Maintain security validation rules as new threats are identified
