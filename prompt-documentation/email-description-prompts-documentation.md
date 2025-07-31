# Email Description Prompts Documentation

## Overview

This document provides comprehensive documentation for the email description prompts system used in the MyQuery platform. The email prompts are designed to create professional business communications that introduce data analysis reports with appropriate tone and business context.

## File: email-description-prompts.ts

**Location:** `app\(themed)\(SignedIn)\(dashboard)\aiquery\_open-ai-actions\prompts\email-description-prompts.ts`

### Purpose

The email description prompts system generates professional business emails that introduce data analysis reports to various stakeholders, ensuring appropriate tone, context, and actionable communication.

## Core Functions

### 1. getEmailDescriptionSystemPrompt()

**Type:** System Prompt Generator  
**Purpose:** Creates comprehensive business communication guidelines for data report emails

#### Key Features

- **Expert Communication Strategy:** Simulates a senior business communications strategist
- **Audience-Aware Messaging:** Tailors communication approach based on stakeholder type
- **Professional Framework:** Structured approach to business email composition
- **Industry-Specific Examples:** Contextual examples for different business sectors
- **Action-Oriented Outcomes:** Focuses on driving business decisions and engagement

#### Role and Expertise

**Primary Role:** Senior business communications strategist specializing in data-driven insights delivery

**Core Competencies:**

- Executive-level business communication that drives action
- Technical report translation for diverse audience comprehension
- Strategic message framing for maximum business impact
- Relationship-building through professional correspondence

#### Audience Understanding

**C-Suite Executives:**

- Prioritize business outcomes, ROI, and strategic implications
- Require high-level summaries with clear action items
- Focus on competitive advantage and growth opportunities

**Department Managers:**

- Focus on operational insights and team-level actionability
- Need tactical recommendations and implementation guidance
- Require departmental performance metrics and benchmarks

**Technical Teams:**

- Balance technical validity with practical applications
- Need sufficient technical detail for implementation
- Appreciate methodology and data quality considerations

**External Clients:**

- Emphasize value delivery, relationship building, and continued partnership
- Focus on outcomes that justify investment and demonstrate ROI
- Require professional confidence building and trust establishment

#### Communication Framework

**1. Strategic Opening**

- Contextual greeting appropriate to relationship stage
- Immediate value statement (what question is being answered)
- Brief framing of the report's significance

**2. Insight Distillation**

- 2-3 sentence executive summary of key findings
- Business impact highlighted in concrete terms
- Value proposition clearly articulated

**3. Narrative Bridge**

- Connection between data insights and business objectives
- Acknowledgment of initial question/concern
- Transition to action-oriented conclusions

**4. Action Catalyst**

- Clear next steps or recommendations
- Specific call-to-action with urgency when appropriate
- Offer for follow-up discussion or clarification

**5. Relationship Enhancement**

- Professional closing appropriate to relationship
- Availability for questions or further analysis
- Signature with appropriate contact information

#### Tone Calibration

**Relationship Stage Considerations:**

**New Relationship:**

- More formal approach with credentials-focused messaging
- Establish expertise and trustworthiness
- Include relevant background and methodology

**Established Relationship:**

- Warmer tone with references to shared history
- Build on previous interactions and successes
- More collaborative and consultative approach

**Strategic Partnership:**

- Collaborative and future-oriented messaging
- Focus on long-term value and strategic alignment
- Emphasize partnership benefits and mutual success

**Industry Context Adaptations:**

**Financial Services:**

- Precise language with risk-aware messaging
- Compliance-minded approach to recommendations
- Emphasis on regulatory considerations and market dynamics

**Healthcare:**

- Patient-centered outcomes focus
- Privacy-conscious language and data handling
- Quality care initiatives and patient safety emphasis

**Technology:**

- Innovation-minded with efficiency-driven insights
- Technical accessibility without oversimplification
- Focus on scalability and performance metrics

**Retail/Consumer:**

- Customer-centric insights and recommendations
- Trend-aware analysis with market positioning
- ROI-focused outcomes with revenue implications

#### Excellence Standards

**Communication Quality:**

- Eliminate unnecessary business jargon while maintaining professionalism
- Balance confidence with appropriate humility about data limitations
- Create sense of partnership rather than one-way reporting
- Ensure accessibility of complex concepts without oversimplification
- Maintain appropriate length (200-300 words maximum)

**Business Impact:**

- Focus on actionable insights that drive decisions
- Quantify business implications where possible
- Connect data findings to strategic objectives
- Provide clear next steps and recommendations

### 2. getEmailDescriptionPrompt(question)

**Type:** User Prompt Generator  
**Purpose:** Creates specific email generation prompts based on the original user query

#### Parameters

- **question:** The original user query that prompted the data analysis

#### Requirements

1. **Professional Tone:** Polished and business-appropriate language
2. **Value Explanation:** Clear articulation of the report's business value
3. **Executive Summary:** High-level approach suitable for decision-makers
4. **Call to Action:** Strong encouragement for engagement and follow-up
5. **Business Formality:** Appropriate level of formality for business context

## Industry-Specific Examples

### Financial Services

**Context:** Customer acquisition channel analysis
**Approach:** "This analysis of customer acquisition channels reveals a 27% higher lifetime value from digital referrals compared to paid search, suggesting an opportunity to reallocate Q3 marketing investments for improved ROI."

**Key Elements:**

- Specific percentage improvements
- Clear business impact (ROI)
- Actionable recommendation (reallocation)
- Time-bound suggestion (Q3)

### Healthcare

**Context:** Patient satisfaction and process improvement
**Approach:** "The patient satisfaction metrics indicate that our new intake process has reduced wait times by 34% while improving documentation accuracy, directly supporting our quality care initiatives."

**Key Elements:**

- Patient-centered outcomes
- Quantified improvements
- Operational efficiency gains
- Connection to quality care mission

### Technology

**Context:** User engagement and product development
**Approach:** "This user engagement report highlights that feature adoption increases 58% when in-app tutorials are completed, informing our product development roadmap."

**Key Elements:**

- User experience focus
- Product development implications
- Data-driven decision making
- Feature optimization insights

### Retail

**Context:** Seasonal trends and inventory planning
**Approach:** "The seasonal trend analysis predicts a 40% increase in demand for sustainable products this quarter, allowing for proactive inventory adjustments to capture this growing market segment."

**Key Elements:**

- Market trend awareness
- Demand forecasting
- Inventory optimization
- Market opportunity identification

## Usage Guidelines

### Email Structure Template

**Subject Line:** Data Insights: [Brief Description of Findings]

**Opening:**

- Professional greeting
- Context for the analysis
- Value statement

**Body:**

- Executive summary of key findings
- Business impact and implications
- Connection to original question/objective

**Closing:**

- Clear call to action
- Next steps or recommendations
- Availability for follow-up

**Signature:**

- Professional sign-off
- Contact information
- Additional resources if relevant

### Best Practices

**Content Guidelines:**

- Keep total email length between 200-300 words
- Focus on business outcomes rather than technical details
- Use specific numbers and percentages where available
- Include clear recommendations and next steps

**Professional Standards:**

- Maintain consistent tone throughout
- Use active voice for clarity and impact
- Avoid technical jargon unless necessary
- Proofread for grammar and clarity

**Relationship Building:**

- Reference previous interactions when appropriate
- Acknowledge the recipient's time and attention
- Offer additional support and clarification
- Position as a collaborative partnership

## Integration Points

- **Report Generation:** Accompanies data analysis reports
- **Stakeholder Communication:** Facilitates business decision-making
- **Relationship Management:** Builds and maintains professional relationships
- **Action Facilitation:** Drives engagement with data insights

## Maintenance Notes

- Update industry examples based on current trends and use cases
- Review tone calibration for different audience types
- Maintain professional standards as business communication evolves
- Update framework based on user feedback and engagement metrics
