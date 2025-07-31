# Database Action Report Prompts Documentation

## Overview

This document provides comprehensive documentation for the database action report prompts system used in the MyQuery platform. The database action report prompts are designed to generate detailed, security-focused analysis of database operations with business impact assessment and technical validation.

## File: database-action-report-prompts.ts

**Location:** `app\(themed)\(SignedIn)\(dashboard)\aiquery\_open-ai-actions\prompts\database-action-report-prompts.ts`

### Purpose

The database action report prompts system generates comprehensive reports for database operations, providing multi-audience analysis that serves technical teams, business stakeholders, and security professionals. The system emphasizes security-first framework, risk assessment, and actionable recommendations.

## Core Functions

### 1. getDatabaseActionReportSystemPrompt(dbConfig)

**Type:** System Prompt Generator  
**Purpose:** Creates comprehensive database operation analysis guidelines with security-first approach

#### Key Features

- **Multi-Audience Focus:** Serves technical teams, business stakeholders, and security professionals
- **Security-First Framework:** Comprehensive operation verification and risk assessment
- **Database Expertise:** Senior DBA and data governance specialist knowledge
- **Chain-of-Thought Analysis:** Structured 3-step analytical process
- **Database-Specific Guidance:** Tailored analysis for different database dialects

#### Role and Audience

**Technical Audience:**

- Database administrators requiring detailed technical insights
- Developers needing implementation guidance and impact assessment
- System architects evaluating operation implications

**Business Audience:**

- Executives needing clear business impact explanations
- Stakeholders requiring operational risk assessments
- Project managers tracking database changes

**Security Team:**

- Compliance officers requiring governance assurance
- Security analysts evaluating risk implications
- Audit teams reviewing operation compliance

#### Security-First Framework

**1. Operation Verification:**

- Verify operation source and authorized permissions
- Redact sensitive patterns (credentials, PII, connection strings)
- Validate metadata against database system catalogs
- Classify operation risk level (low/medium/high)

**2. Chain-of-Thought Analysis:**

**Step 1: Executive Summary**

- Environment context (development/test/production)
- Operation classification and target object identification
- Business impact assessment with technical mechanism explanation

**Step 2: Technical Validation**

- Pre-operation checks (version compatibility, dependencies, prerequisites)
- Execution metrics (performance indicators, rows affected, statements executed)
- Post-operation validation (system integrity, schema consistency, constraints)

**Step 3: Comprehensive Risk Assessment**

- Data integrity analysis (foreign keys, constraints, data quality)
- Performance implications (query plans, index usage, resource consumption)
- Compliance considerations (data protection, audit requirements, retention policies)

#### Operation-Specific Considerations

**DDL Operations (CREATE/ALTER/DROP):**

- Schema evolution impact assessment
- Backward compatibility verification
- Application dependency analysis
- Version upgrade implications

**DML Operations (INSERT/UPDATE/DELETE):**

- Data volume impact assessment
- Transaction isolation level verification
- Cascade effects on related tables
- Performance impact on concurrent operations

**DCL Operations (GRANT/REVOKE):**

- Privilege scope analysis
- Principle of least privilege verification
- Security posture impact assessment
- Access control matrix updates

#### Database-Specific Expertise

**PostgreSQL Considerations:**

- MVCC (Multi-Version Concurrency Control) implications
- Transaction isolation levels (Read Committed default)
- Autovacuum and table bloat assessment
- Extension dependencies and version compatibility
- Partitioning strategy effectiveness
- PL/pgSQL procedure/function validation

**MySQL Considerations:**

- InnoDB transaction and locking behavior
- Storage engine compatibility (InnoDB vs MyISAM)
- Replication impact assessment
- Binary logging implications
- Character set and collation consistency
- Trigger and stored procedure side effects

**Oracle Considerations:**

- Tablespace and storage management
- Flashback capabilities and limitations
- Redo log generation assessment
- PL/SQL package dependency analysis
- Materialized view refresh implications
- Database link security verification

**SQL Server Considerations:**

- Transaction log impact assessment
- TempDB usage and contention
- Lock escalation possibilities
- Snapshot isolation implications
- CLR integration security checks
- Indexed view maintenance costs

**MongoDB Considerations:**

- Sharding key selection impact
- Index coverage analysis
- Document size and nesting evaluation
- Aggregation pipeline optimization
- Change stream implications
- Atlas service tier compatibility

#### Report Structure and Formatting

**1. Executive Summary:** 3 concise sentences with business impact focus
**2. Operation Details:** Technical specifications with database-specific context
**3. Risk Assessment:** Traffic light system (🟢 Low, 🟡 Medium, 🔴 High)
**4. Recommendations:** Actionable next steps prioritized by impact
**5. Technical Appendix:** Detailed metrics and dialect-specific proof points

#### Mandatory Safeguards

**Security Restrictions:**

- NEVER expose: Connection strings, raw credentials, internal IPs
- REJECT reporting if: Operation source cannot be verified
- FLAG for immediate attention: Security policy violations

**High-Risk Scenarios:**

- Cross-schema dependencies with potential cascading failures
- Operations without backup/rollback capability
- Privilege escalation risks or security policy violations
- Destructive operations in production without proper approvals

### 2. getDatabaseActionReportPrompt(dbConfig, question, statementsCount, rowsAffected, executionMessage)

**Type:** User Prompt Generator  
**Purpose:** Creates specific database operation reports with comprehensive analysis

#### Parameters

- **dbConfig:** Database configuration with environment and dialect information
- **question:** Original SQL question or operation description
- **statementsCount:** Number of SQL statements executed
- **rowsAffected:** Total number of database rows affected
- **executionMessage:** System response message from operation execution

#### Features

- **Operational Context Integration:** Incorporates environment and execution metrics
- **Structured Analysis Approach:** 4-step analytical framework
- **Database-Specific Analysis:** Tailored insights for specific database dialects
- **Multi-Dimensional Assessment:** Technical, business, and security perspectives
- **Actionable Reporting:** Clear recommendations and next steps

#### Analysis Requirements

**1. Operation Classification:**

- Identify operation type (DDL/DML/DCL/DQL) from SQL question
- Determine target objects (tables, views, schemas) affected
- Assess operation scope and potential impact radius

**2. Technical Assessment:**

- Analyze performance metrics and execution results
- Evaluate database-specific implications and behavior
- Assess transaction behavior and locking considerations
- Identify indexing and optimization opportunities

**3. Business Impact Evaluation:**

- Translate technical actions to business outcomes
- Assess downstream effects on dependent systems
- Determine operational risk level with justification

**4. Security & Compliance Analysis:**

- Verify operation alignment with data governance policies
- Check for potential data exposure or security risks
- Validate regulatory compliance considerations

#### Report Format Structure

**1. Executive Summary (3 concise sentences):**

- Operation overview with business context
- Key outcomes and metrics
- Risk assessment summary (Low/Medium/High)

**2. Technical Details:**

- Operation type and target objects
- Database-specific execution analysis
- Performance metrics evaluation

**3. Risk Assessment:**

- Data integrity implications (🟢/🟡/🔴)
- Performance impact (🟢/🟡/🔴)
- Security considerations (🟢/🟡/🔴)

**4. Recommendations:**

- Actionable next steps (if any)
- Optimization opportunities
- Best practices for similar future operations

## Usage Examples

### DDL Operation Report

```typescript
const reportPrompt = getDatabaseActionReportPrompt(
  {
    dialectName: "PostgreSQL",
    environment: "Production",
  },
  "ALTER TABLE customers ADD COLUMN email_verified BOOLEAN DEFAULT FALSE",
  1,
  0,
  "Column added successfully",
);
```

**Expected Output:**

- Executive Summary: Schema modification to customers table
- Technical Details: Non-breaking column addition with default value
- Risk Assessment: 🟢 Low risk - backward compatible change
- Recommendations: Update application code to utilize new column

### DML Operation Report

```typescript
const reportPrompt = getDatabaseActionReportPrompt(
  {
    dialectName: "MySQL",
    environment: "Development",
  },
  "UPDATE users SET status = 'active' WHERE last_login > '2024-01-01'",
  1,
  1250,
  "1250 rows updated successfully",
);
```

**Expected Output:**

- Executive Summary: Bulk user status activation based on login activity
- Technical Details: Mass update operation affecting 1250 user records
- Risk Assessment: 🟡 Medium risk - large data volume change
- Recommendations: Monitor application performance and user access patterns

### Security-Sensitive Operation

```typescript
const reportPrompt = getDatabaseActionReportPrompt(
  {
    dialectName: "Oracle",
    environment: "Production",
  },
  "GRANT SELECT ON sensitive_data TO reporting_user",
  1,
  0,
  "Grant completed successfully",
);
```

**Expected Output:**

- Executive Summary: Access privilege granted to sensitive data
- Technical Details: Read-only access granted to reporting system
- Risk Assessment: 🟡 Medium risk - sensitive data access granted
- Recommendations: Implement access logging and regular privilege review

## Best Practices

### Security and Compliance

**Operation Verification:**

- Always verify operation source and authorization
- Implement proper credential and sensitive data redaction
- Validate operations against security policies
- Maintain comprehensive audit trails

**Risk Assessment:**

- Use consistent risk classification methodology
- Consider both immediate and long-term implications
- Evaluate cascade effects and dependencies
- Document security considerations and mitigations

### Technical Analysis

**Performance Considerations:**

- Analyze resource consumption and optimization opportunities
- Consider concurrent operation impacts
- Evaluate indexing strategies and query optimization
- Monitor transaction isolation and locking behavior

**Database-Specific Expertise:**

- Apply dialect-specific best practices and considerations
- Consider version-specific features and limitations
- Evaluate compatibility and upgrade implications
- Implement appropriate monitoring and alerting

### Business Impact

**Stakeholder Communication:**

- Translate technical concepts to business language
- Quantify operational impacts and benefits
- Provide clear risk assessments and recommendations
- Maintain transparency while protecting sensitive information

**Change Management:**

- Document all significant database changes
- Coordinate with application development teams
- Implement proper testing and rollback procedures
- Communicate changes to relevant stakeholders

## Integration Points

- **Database Monitoring:** Integrates with performance and security monitoring systems
- **Change Management:** Connects with database change control processes
- **Audit Systems:** Provides input for compliance and audit reporting
- **Business Intelligence:** Feeds operational metrics and insights
- **Security Framework:** Supports data governance and risk management

## Maintenance Notes

- Update security validation rules based on emerging threats
- Enhance database-specific guidance as platforms evolve
- Improve risk assessment methodologies based on operational experience
- Maintain compliance with evolving regulatory requirements
- Update reporting formats based on stakeholder feedback and requirements
