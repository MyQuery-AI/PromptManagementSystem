# Dashboard Analytics Prompts Documentation

## Overview

This document provides comprehensive documentation for the dashboard analytics prompts system used in the MyQuery platform. The dashboard analytics prompts are designed to generate key statistics and meaningful insights from dashboard data using a structured 4D analysis framework.

## File: dashboard-analytics-prompts.ts

**Location:** `app\(themed)\(SignedIn)\(dashboard)\dashboard-builder\_open-ai-actions\prompts\dashboard-analytics-prompts.ts`

### Purpose

The dashboard analytics prompts system provides advanced analytical capabilities to extract key statistics and insights from dashboard charts. The system uses a structured 4D framework (Discover, Decompose, Determine, Describe) to ensure comprehensive and actionable analysis.

## Core Functions

### 1. getDashboardStatsSystemPrompt()

**Type:** Analytics Expert System for Statistics Generation
**Purpose:** Creates exactly 4 key numeric statistics that summarize the most important metrics

#### 4D Analysis Framework

**1. DISCOVER: Examine the dashboard context**

- Identify the dashboard's primary purpose and audience
- Recognize the business domain (sales, marketing, operations, etc.)
- Note the types of charts and their relationships
- Assess data completeness and quality

**2. DECOMPOSE: Break down the available data**

- Identify key metrics present in the charts
- Recognize time periods or comparison groups
- Identify categorical vs. numerical data
- Note correlations or relationships between metrics

**3. DETERMINE: Select the most valuable statistics**

- Prioritize metrics that support business decisions
- Select metrics that complement each other for a complete view
- Choose metrics that highlight key trends, patterns, or anomalies
- Include a mix of volume, ratio, and change-over-time metrics

**4. DESCRIBE: Present statistics with context and meaning**

- Name each statistic clearly and descriptively
- Provide appropriate numerical formatting
- Include directional indicators (trend)
- Use relevant emojis that enhance understanding

#### Output Structure

**Required Fields:**

```json
{
  "id": "string (unique identifier)",
  "title": "string (the metric name)",
  "value": "number (the actual numeric value)",
  "trend": "up|down|stable (optional)",
  "emoji": "string (a single emoji that best represents this metric)"
}
```

#### Emoji Guidelines

**Appropriate Emoji Selection:**

- 📈 for growth or increases
- 💰 for revenue or financial metrics
- 👥 for user-related metrics
- ⚡ for performance metrics
- 🎯 for conversion or goal-related metrics
- 📊 for general statistics
- 🔄 for activity or usage metrics
- ⏱️ for time-based metrics
- 📱 for mobile or device metrics
- 🌟 for ratings or satisfaction metrics

#### Insufficient Data Handling

**When charts data is insufficient, empty, or unsuitable:**

1. Do NOT return an error
2. Analyze chart titles and types to infer valuable statistics
3. Create placeholder statistics based on apparent dashboard purpose
4. Include note indicating "recommended metric" rather than actual data
5. Suggest what tables or data fields would be needed for actual values

### 2. getDashboardInsightsSystemPrompt()

**Type:** Analytics Expert System for Insights Generation
**Purpose:** Generates meaningful insights about patterns, trends, and relationships in data

#### 4D Analysis Framework for Insights

**1. DISCOVER: Examine the dashboard context and data patterns**

- Identify the overall business domain and purpose
- Observe data distributions, ranges, and outliers
- Look for visible trends, seasonal patterns, or cycles
- Note relationships between different metrics
- Assess data quality, completeness, and limitations

**2. DECOMPOSE: Break down the observations systematically**

- Segment trends by time periods, categories, or demographics
- Compare different metrics against each other
- Identify top and bottom performers
- Isolate anomalies and their potential causes
- Recognize correlations and potential causal relationships

**3. DETERMINE: Prioritize insights by business impact**

- Focus on insights that drive decision-making
- Highlight patterns that require immediate attention
- Emphasize unexpected or counter-intuitive findings
- Consider both positive opportunities and concerning risks
- Evaluate the statistical significance of patterns

**4. DESCRIBE: Articulate insights with clarity and context**

- State each insight in business terms, not technical language
- Explain why the insight matters (business impact)
- Suggest possible actions or next steps
- Indicate confidence level and limitations
- Link insights to specific charts or data points

#### Insights Output Structure

**Required Fields:**

```json
{
  "id": "string (unique identifier)",
  "content": "string (a clear, concise insight about the data)",
  "type": "trend|comparison|anomaly|correlation|pattern",
  "severity": "info|warning|critical",
  "relatedChartIds": ["string"] (optional array of chart IDs)
}
```

#### Insight Types

**Trend:** Patterns showing change over time
**Comparison:** Relative performance between categories/groups
**Anomaly:** Unusual or unexpected data points
**Correlation:** Relationships between different metrics
**Pattern:** Recurring behaviors or cycles

#### Severity Levels

**Info:** General observations and positive trends
**Warning:** Areas requiring attention or monitoring
**Critical:** Issues requiring immediate action

### 3. getDashboardStatsPrompt(charts)

**Type:** User Statistics Generation Prompt
**Purpose:** Generates specific prompt for extracting statistics from provided charts

#### Parameters

- **charts:** Array of chart objects with id, title, type, and sample data

#### Data Processing

**Chart Data Structure:**

```json
{
  "id": "chart identifier",
  "title": "chart title",
  "type": "chart type (bar, line, pie, etc.)",
  "data": "sample of chart data (first 3 rows)"
}
```

#### Analysis Process

**1. DISCOVER Phase:**

- Examine overall dashboard context
- Identify business domain from chart titles and types
- Determine primary purpose of the charts
- Assess time periods or comparison groups

**2. DECOMPOSE Phase:**

- Analyze individual data points
- Identify most frequent metrics across charts
- Classify categorical and numerical values
- Detect visible trends or patterns in sample data

**3. DETERMINE Phase:**

- Select most actionable metrics for decision-makers
- Choose combination providing complete view
- Highlight most important business outcomes

**4. DESCRIBE Phase:**

- Use clear, descriptive titles for each statistic
- Ensure appropriate precision and formatting
- Add relevant trend indicators and emojis

### 4. getDashboardInsightsPrompt(charts)

**Type:** User Insights Generation Prompt
**Purpose:** Generates specific prompt for extracting insights from provided charts

#### Parameters

- **charts:** Array of chart objects with id, title, type, and sample data

#### Analysis Process

**1. DISCOVER Phase:**

- Examine dashboard context holistically
- Identify business domain represented by charts
- Determine types of metrics being visualized
- Assess relationships between charts

**2. DECOMPOSE Phase:**

- Identify notable patterns, trends, or anomalies
- Look for relationships between different metrics
- Note seasonality, cyclicality, or time-based patterns
- Identify top/bottom performers or significant outliers

**3. DETERMINE Phase:**

- Prioritize patterns impacting business decisions
- Highlight unexpected findings deserving attention
- Connect insights across multiple charts or metrics
- Distinguish immediate actions vs. long-term monitoring

**4. DESCRIBE Phase:**

- State observations in plain business language
- Explain business impact of each insight
- Connect to specific data points or charts
- Suggest potential next steps or actions

## Usage Examples

### Sales Dashboard Statistics

```typescript
const charts = [
  { id: "sales-trend", title: "Monthly Sales Trend", type: "line", data: [...] },
  { id: "region-performance", title: "Sales by Region", type: "bar", data: [...] },
  { id: "product-mix", title: "Product Category Distribution", type: "pie", data: [...] }
];

const statsPrompt = getDashboardStatsPrompt(charts);
```

**Expected Statistics:**

```json
[
  {
    "id": "total-revenue",
    "title": "Total Monthly Revenue",
    "value": 2450000,
    "trend": "up",
    "emoji": "💰"
  },
  {
    "id": "growth-rate",
    "title": "Month-over-Month Growth",
    "value": 12.5,
    "trend": "up",
    "emoji": "📈"
  },
  {
    "id": "top-region-share",
    "title": "Top Region Market Share",
    "value": 34.2,
    "trend": "stable",
    "emoji": "🎯"
  },
  {
    "id": "avg-transaction",
    "title": "Average Transaction Value",
    "value": 1250,
    "trend": "up",
    "emoji": "📊"
  }
]
```

### Marketing Campaign Insights

```typescript
const charts = [
  { id: "conversion-rates", title: "Conversion Rates by Channel", type: "bar", data: [...] },
  { id: "campaign-performance", title: "Campaign ROI Trends", type: "line", data: [...] },
  { id: "audience-engagement", title: "Engagement by Demographics", type: "area", data: [...] }
];

const insightsPrompt = getDashboardInsightsPrompt(charts);
```

**Expected Insights:**

```json
[
  {
    "id": "channel-performance",
    "content": "Email marketing shows 40% higher conversion rates than social media, suggesting budget reallocation opportunities",
    "type": "comparison",
    "severity": "info",
    "relatedChartIds": ["conversion-rates"]
  },
  {
    "id": "roi-decline",
    "content": "Campaign ROI has declined 15% over the last three months, indicating need for strategy review",
    "type": "trend",
    "severity": "warning",
    "relatedChartIds": ["campaign-performance"]
  },
  {
    "id": "demographic-opportunity",
    "content": "25-34 age group shows untapped potential with low engagement but high conversion when reached",
    "type": "pattern",
    "severity": "info",
    "relatedChartIds": ["audience-engagement"]
  }
]
```

### Operational Performance Analytics

```typescript
const charts = [
  { id: "system-uptime", title: "System Uptime by Service", type: "card", data: [...] },
  { id: "response-times", title: "API Response Times", type: "line", data: [...] },
  { id: "error-rates", title: "Error Distribution", type: "pie", data: [...] }
];

const systemPrompt = getDashboardStatsSystemPrompt();
const insightsPrompt = getDashboardInsightsPrompt(charts);
```

**Expected Statistics:**

```json
[
  {
    "id": "overall-uptime",
    "title": "Overall System Uptime",
    "value": 99.85,
    "trend": "stable",
    "emoji": "⚡"
  },
  {
    "id": "avg-response-time",
    "title": "Average Response Time",
    "value": 245,
    "trend": "down",
    "emoji": "⏱️"
  },
  {
    "id": "error-rate",
    "title": "Error Rate",
    "value": 0.12,
    "trend": "down",
    "emoji": "🎯"
  },
  {
    "id": "peak-load-handling",
    "title": "Peak Load Capacity",
    "value": 85.3,
    "trend": "up",
    "emoji": "📊"
  }
]
```

## Best Practices

### Statistics Generation

**Metric Selection:**

- Choose metrics that directly support business decisions
- Include mix of absolute values, ratios, and growth rates
- Ensure statistics complement each other for complete view
- Focus on actionable and measurable outcomes

**Data Quality:**

- Validate data completeness before generating statistics
- Handle null values and edge cases appropriately
- Provide fallback calculations for missing data
- Include confidence indicators when appropriate

**Presentation:**

- Use clear, non-technical language for titles
- Format numbers appropriately (currency, percentages, etc.)
- Include relevant trend indicators
- Choose emojis that enhance understanding

### Insights Generation

**Pattern Recognition:**

- Look for trends across multiple time periods
- Identify relationships between different metrics
- Recognize seasonal or cyclical patterns
- Highlight anomalies and outliers

**Business Context:**

- Frame insights in terms of business impact
- Connect patterns to potential actions
- Consider industry benchmarks and standards
- Assess significance and confidence levels

**Actionability:**

- Suggest specific next steps or investigations
- Prioritize insights by potential impact
- Distinguish between opportunities and risks
- Provide clear recommendations when possible

## Integration Points

- **Chart Data Processing:** Integrates with chart data extraction and formatting
- **Business Intelligence:** Connects with BI reporting and analytics systems
- **Dashboard Rendering:** Provides statistics and insights for dashboard display
- **Performance Monitoring:** Enables tracking of key metrics and trends
- **Decision Support:** Delivers actionable insights for business decision-making

## Maintenance Notes

- Update 4D analysis framework based on analytical best practices
- Enhance insight categorization and severity assessment
- Improve emoji selection guidelines for better user experience
- Expand metric types based on business intelligence requirements
- Maintain compatibility with evolving chart types and data structures
