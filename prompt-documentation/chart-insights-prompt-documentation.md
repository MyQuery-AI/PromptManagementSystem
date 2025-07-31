# Chart Insights Prompts Documentation

## Overview

This document provides comprehensive documentation for the chart insights prompts system used in the MyQuery platform. The chart insights prompts are designed to generate business-actionable insights from chart data with appropriate context and recommendations.

## File: chart-insights-prompt.ts

**Location:** `app\(themed)\(SignedIn)\(dashboard)\dashboard-builder\_open-ai-actions\prompts\chart-insights-prompt.ts`

### Purpose

The chart insights prompts system generates meaningful, business-actionable insights from chart data, providing statistical analysis, trend identification, and strategic recommendations tailored to different chart types and business contexts.

## Core Functions

### 1. getChartInsightsPrompt(chartType, defaultInsightTypes)

**Type:** System Prompt Generator  
**Purpose:** Creates comprehensive system prompts for chart insight generation

#### Key Features

- **Analytics Expertise:** Simulates an analytics expert with business decision-making focus
- **Audience-Aware Insights:** Tailored for business decision makers, analysts, and executives
- **Chart-Specific Guidance:** Customized analysis approaches for different chart types
- **Statistical Validity:** Ensures insights are statistically significant and actionable
- **Business Impact Focus:** Prioritizes insights that lead to business actions

#### Audience Context

**Business Decision Makers:**

- Need clear, actionable takeaways
- Focus on strategic implications and business outcomes
- Require high-level insights with practical applications

**Data Analysts:**

- Need statistical validity and proper context
- Require technical accuracy with analytical rigor
- Focus on methodology and data quality considerations

**Executives:**

- Need high-level strategic implications
- Focus on competitive advantage and growth opportunities
- Require summary-level insights with clear business impact

#### Insight Structure Requirements

Each insight must include these **required fields:**

**key:** Short identifier for the insight (separate words with underscores)
**value:** Main numeric/string value with appropriate formatting
**description:** Clear explanation of meaning and business implications
**type:** Must be EXACTLY one of: 'trend', 'summary', 'comparison', or 'anomaly'
**severity:** 'info' | 'warning' | 'critical'

Each insight may include these **optional fields** when relevant:

**trend:** 'up' | 'down' | 'stable' (for time-based insights)
**changePercent:** Percentage change (for comparative insights)
**timeframe:** Time period reference (for trend-based insights)
**benchmark:** Numeric reference value for comparison
**thresholds:** Warning/critical thresholds with justification
**recommendation:** Brief actionable suggestion based on the insight

#### Chart-Specific Guidance

**Bar Charts:**

- Focus on comparing categories and identifying top/bottom performers
- Look for outliers that are significantly above/below others
- Consider distribution patterns (even, skewed, bimodal)
- Highlight significant gaps between adjacent categories

**Line Charts:**

- Focus on trends over time (growth, decline, stability)
- Identify significant inflection points or trend changes
- Look for seasonality or cyclical patterns
- Highlight acceleration/deceleration in rates of change
- Compare slopes between different segments

**Pie Charts:**

- Focus on proportional relationships and dominant categories
- Identify categories that represent significant portions (>20%)
- Look for imbalances in distribution
- Highlight categories that are unexpectedly large or small

**Area Charts:**

- Focus on cumulative values and overall trend direction
- Identify periods of significant expansion or contraction
- Look for compositional changes over time
- Highlight relative growth rates between stacked components

**Scatter Charts:**

- Focus on correlation patterns and relationship strength
- Identify clusters or groupings of data points
- Look for outliers that don't follow the general pattern
- Highlight the slope and direction of any trend line

#### Analytical Approach

**1. Data Distribution Analysis:**

- Examine central tendency, outliers, and patterns
- Identify statistical significance of patterns
- Consider data quality and completeness

**2. Temporal Analysis:**

- Look for significant changes over time or between categories
- Identify trend patterns and inflection points
- Assess rate of change and acceleration

**3. Anomaly Detection:**

- Identify unusual values that deviate from expectations
- Assess whether anomalies represent errors or significant events
- Consider business context for anomaly interpretation

**4. Benchmark Comparison:**

- Compare metrics against relevant benchmarks when possible
- Identify performance gaps and opportunities
- Assess competitive positioning

**5. Statistical Significance:**

- Consider statistical significance before highlighting patterns
- Avoid forcing insights from insufficient data
- Acknowledge data limitations where appropriate

**6. Business Relevance:**

- Prioritize insights that would lead to business actions
- Focus on revenue, cost, efficiency, and customer impact
- Consider strategic implications and competitive advantage

**7. Severity Assessment:**

- Ensure severity levels are justified by data magnitude and impact
- Consider both statistical and business significance
- Align severity with potential business consequences

#### Data Quality Considerations

**Sparse Data Handling:**

- Note data quality issues in insights when present
- Consider impact of limited data on insight reliability
- Provide appropriate caveats for small sample sizes

**Time Series Gaps:**

- Comment on data completeness for time-based analysis
- Assess impact of missing data points on trend analysis
- Provide context for data collection periods

**Pattern Validation:**

- Avoid forcing misleading insights from random patterns
- Require sufficient data points for trend identification
- Validate patterns against business logic

**Outlier Assessment:**

- Assess whether extreme outliers represent data errors or significant events
- Consider business context for outlier interpretation
- Provide appropriate treatment recommendations

#### Business Relevance Dimensions

**Revenue Implications:**

- Direct impact on revenue generation and growth
- Cost savings and efficiency improvements
- Market share and competitive positioning

**Customer Experience:**

- Customer satisfaction and retention impacts
- User engagement and behavior patterns
- Service quality and delivery metrics

**Operational Efficiency:**

- Process optimization opportunities
- Resource allocation improvements
- Performance bottleneck identification

**Risk Factors:**

- Potential business risks and vulnerabilities
- Compliance and regulatory considerations
- Market volatility and external factors

### 2. getChartInsightsUserPrompt(chartType, chartTitle, chartDescription, sql, data, stats)

**Type:** User Prompt Generator  
**Purpose:** Creates specific chart insight generation prompts with data context

#### Parameters

- **chartType:** Type of chart being analyzed (bar, line, pie, area, scatter)
- **chartTitle:** Title of the chart
- **chartDescription:** Description of the chart's purpose
- **sql:** SQL query used to generate the data
- **data:** Array of data points from the query
- **stats:** Statistical summary of numeric columns

#### Features

- **Data-Driven Context:** Provides complete data context for analysis
- **Statistical Foundation:** Includes statistical summaries for informed insights
- **Time Period Detection:** Automatically infers time periods from SQL and data
- **Quality Assessment:** Includes data quality notes and considerations
- **Structured Requirements:** Enforces consistent insight format and validation

#### Strict Requirements

**Critical Type Validation:**
Each insight MUST have a 'type' field with ONLY one of these exact values:

- 'trend'
- 'summary'
- 'comparison'
- 'anomaly'

**Important:** Do NOT use 'benchmark' or any other value as the type. The 'benchmark' field is for numeric reference values only.

#### Insight Generation Requirements

**Quantity:** Generate 2-4 meaningful insights based on the data
**Priority Focus:**

- Actionable for business decisions
- Statistically significant (not based on minimal data)
- Relevant to the chart's apparent purpose

**For Each Insight:**

- Clearly state the finding in business terms
- Provide context on why it matters
- Suggest possible actions when appropriate
- Assign appropriate severity based on business impact

### 3. inferTimePeriod(data, sql)

**Type:** Utility Function  
**Purpose:** Automatically detects time periods from SQL queries and data

#### Detection Logic

**Monthly Data:** SQL contains "month" or "monthly" keywords
**Weekly Data:** SQL contains "week" or "weekly" keywords
**Daily Data:** SQL contains "day" or "daily" keywords
**Annual Data:** SQL contains "year" or "annual" keywords
**Default:** "Time period not specified" when no clear indicators

#### Enhancement Opportunities

The current implementation uses simple keyword detection. Future enhancements could include:

- Date column analysis in data structure
- Date range calculation from actual data points
- Frequency detection from timestamp intervals
- Business calendar awareness (fiscal years, quarters)

### 4. generateDataQualityNotes(data, stats)

**Type:** Data Quality Assessment Function  
**Purpose:** Analyzes data quality and provides relevant warnings

#### Quality Checks

**Data Volume Assessment:**

- Identifies insufficient data (< 3 data points)
- Warns about statistical significance limitations
- Provides appropriate caveats for small datasets

**Outlier Detection:**

- Identifies large value ranges that might indicate outliers
- Calculates variance ratios for anomaly detection
- Flags fields with suspicious data patterns

#### Output Format

**No Issues:** "No data quality issues detected"
**With Issues:** Bulleted list of specific warnings with field names and descriptions

## Usage Examples

### Basic Implementation

```typescript
const systemPrompt = getChartInsightsPrompt("bar", [
  "trend",
  "comparison",
  "anomaly",
]);
const userPrompt = getChartInsightsUserPrompt(
  "bar",
  "Sales Performance by Region",
  "Quarterly sales data by geographic region",
  sqlQuery,
  dataPoints,
  statisticalSummary,
);
```

### Chart Type Selection

```typescript
// For trend analysis
const trendPrompt = getChartInsightsPrompt("line", ["trend", "summary"]);

// For category comparison
const comparisonPrompt = getChartInsightsPrompt("bar", [
  "comparison",
  "anomaly",
]);

// For proportion analysis
const proportionPrompt = getChartInsightsPrompt("pie", [
  "summary",
  "comparison",
]);
```

## Best Practices

### Insight Quality

**Statistical Rigor:**

- Ensure sufficient data points for meaningful analysis
- Consider statistical significance in pattern identification
- Provide appropriate confidence levels and caveats

**Business Relevance:**

- Focus on actionable insights that drive decisions
- Connect findings to business objectives and outcomes
- Prioritize insights with clear implementation paths

**Clear Communication:**

- Use business language rather than technical jargon
- Provide specific, quantified findings where possible
- Include context and implications for each insight

### Data Handling

**Quality Assessment:**

- Always assess data quality before generating insights
- Provide appropriate warnings for data limitations
- Consider data source reliability and completeness

**Outlier Management:**

- Investigate outliers for business significance
- Distinguish between data errors and meaningful anomalies
- Provide appropriate treatment recommendations

### Severity Assignment

**Info Level:** Interesting patterns with minor business impact
**Warning Level:** Concerning trends requiring attention
**Critical Level:** Urgent issues requiring immediate action

## Integration Points

- **Dashboard Builder:** Provides insights for dashboard charts
- **Analytics Engine:** Processes chart data for insight generation
- **Business Intelligence:** Delivers actionable business intelligence
- **Report Generation:** Enhances reports with automated insights

## Maintenance Notes

- Update chart-specific guidance based on user feedback and usage patterns
- Enhance time period detection with more sophisticated algorithms
- Improve data quality assessment with additional validation checks
- Expand business relevance dimensions based on industry requirements
