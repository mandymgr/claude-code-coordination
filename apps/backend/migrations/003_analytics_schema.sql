-- Claude Code Coordination Analytics Schema
-- Migration 003: Business Intelligence and Analytics tables

-- System metrics table for real-time data collection
CREATE TABLE system_metrics (
  id VARCHAR(255) PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  metric_type VARCHAR(20) NOT NULL CHECK (metric_type IN ('counter', 'gauge', 'histogram', 'summary')),
  name VARCHAR(255) NOT NULL,
  value DECIMAL(20,6) NOT NULL,
  unit VARCHAR(50),
  labels JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Business metrics table for aggregated business intelligence
CREATE TABLE business_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  metric_name VARCHAR(255) NOT NULL,
  metric_value DECIMAL(20,6) NOT NULL,
  metric_unit VARCHAR(50),
  period_type VARCHAR(20) NOT NULL CHECK (period_type IN ('hour', 'day', 'week', 'month', 'quarter', 'year')),
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(organization_id, metric_name, period_type, period_start)
);

-- Productivity metrics table
CREATE TABLE productivity_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  total_tasks INTEGER NOT NULL DEFAULT 0,
  completed_tasks INTEGER NOT NULL DEFAULT 0,
  completion_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  avg_completion_time_hours DECIMAL(8,2) NOT NULL DEFAULT 0.00,
  ai_assisted_tasks INTEGER NOT NULL DEFAULT 0,
  ai_assistance_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  code_lines_generated INTEGER NOT NULL DEFAULT 0,
  code_quality_score DECIMAL(3,1) NOT NULL DEFAULT 0.0,
  deployment_success_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  mean_time_to_deployment DECIMAL(8,2) NOT NULL DEFAULT 0.00,
  developer_satisfaction_score DECIMAL(3,1) NOT NULL DEFAULT 0.0,
  period DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(organization_id, period)
);

-- ROI calculations table
CREATE TABLE roi_calculations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  calculation_type VARCHAR(50) NOT NULL CHECK (calculation_type IN ('time_saved', 'cost_reduction', 'revenue_increase', 'efficiency_gain')),
  baseline_value DECIMAL(15,2) NOT NULL,
  current_value DECIMAL(15,2) NOT NULL,
  improvement_percentage DECIMAL(8,2) NOT NULL,
  roi_percentage DECIMAL(8,2) NOT NULL,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  confidence_score DECIMAL(3,2) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
  data_sources TEXT[] NOT NULL DEFAULT '{}',
  methodology TEXT,
  assumptions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Dashboard configurations table
CREATE TABLE dashboard_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  dashboard_name VARCHAR(255) NOT NULL,
  dashboard_type VARCHAR(50) NOT NULL CHECK (dashboard_type IN ('executive', 'operational', 'developer', 'analyst', 'custom')),
  config JSONB NOT NULL DEFAULT '{}',
  is_shared BOOLEAN DEFAULT false,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Analytics reports table
CREATE TABLE analytics_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES users(id),
  report_name VARCHAR(255) NOT NULL,
  report_type VARCHAR(50) NOT NULL CHECK (report_type IN ('executive', 'productivity', 'roi', 'custom')),
  report_config JSONB NOT NULL DEFAULT '{}',
  report_data JSONB,
  period_start TIMESTAMP WITH TIME ZONE,
  period_end TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'completed', 'failed')),
  generated_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_scheduled BOOLEAN DEFAULT false,
  schedule_config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Team performance tracking
CREATE TABLE team_performance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  team_name VARCHAR(255) NOT NULL,
  team_members UUID[] NOT NULL DEFAULT '{}',
  performance_metrics JSONB NOT NULL DEFAULT '{}',
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- AI usage analytics
CREATE TABLE ai_usage_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  ai_provider VARCHAR(50) NOT NULL,
  model_name VARCHAR(100) NOT NULL,
  request_type VARCHAR(50) NOT NULL,
  tokens_used INTEGER NOT NULL DEFAULT 0,
  cost_usd DECIMAL(10,4) DEFAULT 0.0000,
  response_time_ms INTEGER NOT NULL DEFAULT 0,
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,
  usage_context JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cost tracking and budgeting
CREATE TABLE cost_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  cost_category VARCHAR(50) NOT NULL,
  cost_subcategory VARCHAR(50),
  amount_usd DECIMAL(12,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  billing_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  billing_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  provider VARCHAR(100),
  resource_details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performance benchmarks table
CREATE TABLE performance_benchmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  benchmark_type VARCHAR(50) NOT NULL,
  benchmark_name VARCHAR(255) NOT NULL,
  industry_average DECIMAL(10,2),
  organization_value DECIMAL(10,2) NOT NULL,
  percentile_rank INTEGER CHECK (percentile_rank >= 0 AND percentile_rank <= 100),
  benchmark_date DATE NOT NULL,
  source VARCHAR(255),
  methodology TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(organization_id, benchmark_type, benchmark_name, benchmark_date)
);

-- Indexes for performance optimization
CREATE INDEX idx_system_metrics_org_timestamp ON system_metrics(organization_id, timestamp DESC);
CREATE INDEX idx_system_metrics_name_timestamp ON system_metrics(name, timestamp DESC);
CREATE INDEX idx_system_metrics_labels ON system_metrics USING GIN(labels);

CREATE INDEX idx_business_metrics_org_period ON business_metrics(organization_id, period_type, period_start DESC);
CREATE INDEX idx_business_metrics_name ON business_metrics(metric_name);

CREATE INDEX idx_productivity_metrics_org_period ON productivity_metrics(organization_id, period DESC);

CREATE INDEX idx_roi_calculations_org_period ON roi_calculations(organization_id, period_start DESC, period_end DESC);
CREATE INDEX idx_roi_calculations_type ON roi_calculations(calculation_type);

CREATE INDEX idx_ai_usage_org_timestamp ON ai_usage_analytics(organization_id, timestamp DESC);
CREATE INDEX idx_ai_usage_provider_model ON ai_usage_analytics(ai_provider, model_name);
CREATE INDEX idx_ai_usage_user ON ai_usage_analytics(user_id, timestamp DESC);

CREATE INDEX idx_cost_tracking_org_period ON cost_tracking(organization_id, billing_period_start DESC);
CREATE INDEX idx_cost_tracking_category ON cost_tracking(cost_category, cost_subcategory);

CREATE INDEX idx_performance_benchmarks_org_type ON performance_benchmarks(organization_id, benchmark_type, benchmark_date DESC);

-- Materialized view for real-time dashboard performance
CREATE MATERIALIZED VIEW dashboard_summary AS
SELECT 
  p.organization_id,
  p.period,
  p.completion_rate,
  p.ai_assistance_rate,
  p.code_quality_score,
  p.deployment_success_rate,
  p.developer_satisfaction_score,
  COALESCE(r.total_roi, 0) as total_roi,
  COALESCE(c.monthly_cost, 0) as monthly_cost,
  COALESCE(a.daily_ai_requests, 0) as daily_ai_requests
FROM productivity_metrics p
LEFT JOIN (
  SELECT 
    organization_id,
    DATE(period_start) as period,
    SUM(roi_percentage) as total_roi
  FROM roi_calculations 
  GROUP BY organization_id, DATE(period_start)
) r ON p.organization_id = r.organization_id AND p.period = r.period
LEFT JOIN (
  SELECT 
    organization_id,
    DATE(billing_period_start) as period,
    SUM(amount_usd) as monthly_cost
  FROM cost_tracking 
  WHERE billing_period_start >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY organization_id, DATE(billing_period_start)
) c ON p.organization_id = c.organization_id AND p.period = c.period
LEFT JOIN (
  SELECT 
    organization_id,
    DATE(timestamp) as period,
    COUNT(*) as daily_ai_requests
  FROM ai_usage_analytics
  WHERE timestamp >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY organization_id, DATE(timestamp)
) a ON p.organization_id = a.organization_id AND p.period = a.period;

-- Create unique index on the materialized view
CREATE UNIQUE INDEX idx_dashboard_summary_org_period ON dashboard_summary(organization_id, period);

-- Function to refresh dashboard summary
CREATE OR REPLACE FUNCTION refresh_dashboard_summary()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_summary;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-refresh materialized view (be careful in production - consider scheduled refresh instead)
-- CREATE TRIGGER refresh_dashboard_on_productivity AFTER INSERT OR UPDATE OR DELETE ON productivity_metrics FOR EACH STATEMENT EXECUTE FUNCTION refresh_dashboard_summary();
-- CREATE TRIGGER refresh_dashboard_on_roi AFTER INSERT OR UPDATE OR DELETE ON roi_calculations FOR EACH STATEMENT EXECUTE FUNCTION refresh_dashboard_summary();

-- Update triggers for updated_at fields
CREATE TRIGGER update_business_metrics_updated_at BEFORE UPDATE ON business_metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_productivity_metrics_updated_at BEFORE UPDATE ON productivity_metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dashboard_configs_updated_at BEFORE UPDATE ON dashboard_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_analytics_reports_updated_at BEFORE UPDATE ON analytics_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Initial data for performance benchmarks (industry standards)
INSERT INTO performance_benchmarks (organization_id, benchmark_type, benchmark_name, industry_average, organization_value, benchmark_date, source) 
SELECT 
  'org-default-uuid-here-000000000000',
  'productivity',
  'task_completion_rate',
  75.0,
  85.0,
  CURRENT_DATE,
  'Industry Research 2024'
WHERE NOT EXISTS (
  SELECT 1 FROM performance_benchmarks 
  WHERE organization_id = 'org-default-uuid-here-000000000000' 
  AND benchmark_name = 'task_completion_rate'
);

INSERT INTO performance_benchmarks (organization_id, benchmark_type, benchmark_name, industry_average, organization_value, benchmark_date, source) 
SELECT 
  'org-default-uuid-here-000000000000',
  'quality',
  'code_quality_score',
  7.2,
  8.7,
  CURRENT_DATE,
  'Industry Research 2024'
WHERE NOT EXISTS (
  SELECT 1 FROM performance_benchmarks 
  WHERE organization_id = 'org-default-uuid-here-000000000000' 
  AND benchmark_name = 'code_quality_score'
);