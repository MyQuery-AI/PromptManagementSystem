# Dashboard Improvement Prompts Documentation

## Overview

This document provides comprehensive documentation for the dashboard improvement prompts system used in the MyQuery platform. The dashboard improvement prompts are designed to analyze dashboard configurations and provide actionable suggestions for better data visualization, user experience, and performance optimization.

## File: dashboard-improvement-prompts.ts

**Location:** `app\(themed)\(SignedIn)\(dashboard)\dashboard-builder\_open-ai-actions\prompts\dashboard-improvement-prompts.ts`

### Purpose

The dashboard improvement prompts system provides expert-level dashboard design analysis and recommendations. The system focuses on enhancing data visualization clarity, improving user experience, optimizing performance, and ensuring adherence to best practices while maintaining the dashboard's business purpose.

## Core Functions

### 1. getDashboardImprovementSystemPrompt()

**Type:** Dashboard Design Expert System
**Purpose:** Analyzes dashboard configurations and suggests comprehensive improvements

#### Improvement Focus Areas

**1. Data Visualization Enhancement**

- Chart selection appropriateness for data types
- Visual clarity and impact optimization
- Data granularity and filtering improvements
- Chart type recommendations for specific metrics

**2. User Experience Optimization**

- Layout optimization (positioning, sizing, grouping)
- Color schemes and visual hierarchy
- Readability and accessibility improvements
- Navigation and interaction enhancements

**3. Performance Considerations**

- Dashboard loading and rendering optimization
- Data query efficiency improvements
- Resource utilization optimization
- Scalability considerations

**4. Best Practices Compliance**

- Industry-standard dashboard design principles
- Accessibility guidelines adherence
- Mobile responsiveness considerations
- Cross-browser compatibility

**5. Business Purpose Alignment**

- Ensuring visualizations support business objectives
- Maintaining focus on key performance indicators
- Aligning with target audience needs
- Supporting decision-making processes

#### Incomplete Configuration Handling

**When dashboard configuration is missing essential data or is unusable:**

1. Do not return error messages
2. Analyze what tables or data would better fit the dashboard's apparent purpose
3. Provide recommendations for more appropriate data sources
4. Suggest possible chart configurations that would work well with recommended data sources

#### Recommendation Criteria

**Actionable Specificity:**

- Provide specific, concrete recommendations rather than general advice
- Include implementation details and technical considerations
- Suggest measurable improvements with expected outcomes
- Prioritize high-impact changes with reasonable implementation effort

### 2. getDashboardImprovementPrompt(dashboardConfig)

**Type:** Configuration Analysis Prompt
**Purpose:** Generates specific improvement suggestions for provided dashboard configuration

#### Parameters

- **dashboardConfig:** Complete dashboard configuration object including charts, layout, and metadata

#### Analysis Structure

**For Each Suggestion:**

1. **Issue Identification:** Specific problem or opportunity identified
2. **Impact Explanation:** Why the issue matters for users or business
3. **Concrete Recommendation:** Specific implementation guidance
4. **Expected Benefit:** Measurable improvement anticipated

#### Recommendation Categories

**Chart Optimization:**

- Chart type appropriateness for data characteristics
- Data aggregation and filtering improvements
- Visual encoding effectiveness
- Legend and labeling clarity

**Layout Enhancement:**

- Chart positioning and sizing optimization
- Visual hierarchy establishment
- Grouping and categorization improvements

- Whitespace utilization

**Performance Optimization:**

- Query efficiency improvements
- Data loading optimization

- Rendering performance enhancements
- Caching strategy recommendations

**Accessibility Improvements:**

- Color contrast and accessibility compliance

- Screen reader compatibility
- Keyboard navigation support
- Mobile responsiveness

**Data Quality Enhancement:**

- Data completeness assessment
- Accuracy and reliability improvements
- Real-time vs. batch data considerations
- Data freshness indicators

## Usage Examples

### Sales Dashboard Improvement Analysis

```typescript
const dashboardConfig = {
  title: "Sales Performance Dashboard",
  charts: [
    {
      id: "sales-trend",
      type: "line",
      title: "Monthly Sales Trend",
      data: [...],
      position: { x: 0, y: 0, width: 6, height: 4 }
    },
    {
      id: "regional-sales",
      type: "pie",
      title: "Sales by Region",
      data: [...],
      position: { x: 6, y: 0, width: 6, height: 4 }
    },
    {
      id: "product-performance",
      type: "bar",
      title: "Product Sales",
      data: [...],
      position: { x: 0, y: 4, width: 12, height: 4 }
    }
  ],
  layout: { columns: 12, rows: 8 },
  theme: "light"
};

const improvementPrompt = getDashboardImprovementPrompt(dashboardConfig);
```

**Expected Improvements:**

1. **Chart Type Optimization**
   - Issue: Pie chart with many regions creates readability problems
   - Recommendation: Replace pie chart with horizontal bar chart for better comparison
   - Benefit: Improved readability and easier comparison between regions

2. **Layout Enhancement**
   - Issue: Charts are equally sized but have different information densities
   - Recommendation: Resize charts based on data complexity and importance
   - Benefit: Better space utilization and visual hierarchy

3. **Color Scheme Improvement**
   - Issue: Default color palette may not be accessible or brand-aligned
   - Recommendation: Implement consistent color scheme with accessibility compliance
   - Benefit: Better brand alignment and improved accessibility

### Marketing Campaign Dashboard Analysis

```typescript
const dashboardConfig = {
  title: "Campaign Performance Dashboard",
  charts: [
    {
      id: "conversion-funnel",
      type: "bar",
      title: "Conversion Funnel",
      data: [...],
      filters: []
    },
    {
      id: "channel-performance",
      type: "line",
      title: "Channel Performance Over Time",
      data: [...],
      timeRange: "last30days"
    },
    {
      id: "geographic-reach",
      type: "map",
      title: "Geographic Reach",
      data: [...],
      unavailable: true
    }
  ]
};

const systemPrompt = getDashboardImprovementSystemPrompt();
const improvementPrompt = getDashboardImprovementPrompt(dashboardConfig);
```

**Expected Improvements:**

1. **Missing Data Handling**
   - Issue: Geographic reach chart is unavailable due to missing location data
   - Recommendation: Implement geographic data collection or replace with alternative metric
   - Benefit: Complete dashboard functionality and better geographic insights

2. **Filtering Enhancement**
   - Issue: Limited filtering options across charts
   - Recommendation: Add cross-chart filtering for date ranges and campaign types
   - Benefit: Improved interactivity and deeper analysis capabilities

3. **Real-time Updates**
   - Issue: Static data may not reflect current campaign performance
   - Recommendation: Implement real-time or near-real-time data updates
   - Benefit: More timely decision-making and campaign optimization

### Operational Metrics Dashboard Analysis

```typescript
const dashboardConfig = {
  title: "System Performance Dashboard",
  charts: [
    {
      id: "response-times",
      type: "line",
      title: "API Response Times",
      data: [...],
      realtime: true
    },
    {
      id: "error-distribution",
      type: "pie",
      title: "Error Types Distribution",
      data: [...],
      drilldown: false
    },
    {
      id: "server-health",
      type: "gauge",
      title: "Server Health Score",
      data: [...],
      thresholds: { warning: 70, critical: 50 }
    }
  ],
  refreshInterval: 300000, // 5 minutes
  alerting: false
};
```

**Expected Improvements:**

1. **Real-time Optimization**
   - Issue: 5-minute refresh interval too slow for operational monitoring
   - Recommendation: Reduce refresh interval to 30 seconds for critical metrics
   - Benefit: Faster incident detection and response

2. **Alerting Integration**
   - Issue: No alerting system for threshold breaches
   - Recommendation: Implement threshold-based alerting with notification system
   - Benefit: Proactive incident management and reduced downtime

3. **Drill-down Capabilities**
   - Issue: Limited ability to investigate specific errors or performance issues
   - Recommendation: Add drill-down functionality to error distribution chart
   - Benefit: Faster root cause analysis and problem resolution

## Best Practices

### Dashboard Design Principles

**Visual Hierarchy:**

- Establish clear importance levels through size and positioning
- Use consistent spacing and alignment across charts
- Implement logical grouping of related metrics
- Maintain visual balance and avoid clutter

**Color and Typography:**

- Use consistent color schemes across all charts
- Ensure sufficient color contrast for accessibility
- Implement consistent typography and sizing
- Use color meaningfully to convey information

**Layout Optimization:**

- Follow grid-based layouts for consistency
- Prioritize most important metrics in prime visual real estate
- Group related charts and metrics logically
- Ensure responsive design for different screen sizes

### Performance Optimization

**Data Loading:**

- Implement efficient data queries and caching strategies
- Use appropriate aggregation levels for different zoom levels
- Consider lazy loading for less critical charts
- Optimize refresh intervals based on data criticality

**Rendering Performance:**

- Limit data points to prevent performance degradation
- Use appropriate chart types for data volume
- Implement progressive loading for large datasets

- Consider server-side rendering for complex visualizations

### User Experience Enhancement

**Interactivity:**

- Provide meaningful hover states and tooltips
- Implement cross-chart filtering and highlighting

- Add drill-down capabilities where appropriate
- Include export and sharing functionality

**Accessibility:**

- Ensure keyboard navigation support

- Provide alternative text for charts and visualizations
- Implement high contrast mode support
- Use ARIA labels and roles appropriately

### Data Quality Assurance

**Accuracy:**

- Validate data sources and transformation logic
- Implement data quality checks and indicators
- Provide clear timestamps for data freshness
- Handle missing or incomplete data gracefully

**Relevance:**

- Align metrics with business objectives and user needs
- Regularly review and update chart selections
- Remove or replace outdated or irrelevant metrics
- Ensure appropriate granularity for decision-making

## Integration Points

- **Dashboard Builder:** Integrates with dashboard configuration and layout systems
- **Chart Rendering:** Connects with visualization libraries and rendering engines
- **Performance Monitoring:** Links with system performance tracking and optimization
- **User Experience:** Interfaces with UX design systems and accessibility tools
- **Business Intelligence:** Aligns with BI requirements and best practices

## Maintenance Notes

- Update improvement criteria based on evolving dashboard design best practices
- Enhance recommendation specificity based on user feedback and success metrics
- Expand analysis capabilities for new chart types and dashboard features
- Maintain compatibility with accessibility guidelines and standards
- Improve integration with performance monitoring and optimization tools
