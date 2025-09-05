-- Claude Code Coordination Team Collaboration Schema
-- Migration 004: Real-time collaboration and team coordination tables

-- Collaboration sessions table
CREATE TABLE collaboration_sessions (
  id VARCHAR(255) PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id VARCHAR(255),
  session_name VARCHAR(255) NOT NULL,
  session_type VARCHAR(50) NOT NULL CHECK (session_type IN ('coding', 'review', 'planning', 'meeting')),
  creator_id UUID NOT NULL REFERENCES users(id),
  shared_state JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP WITH TIME ZONE
);

-- Session participants table
CREATE TABLE session_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(255) NOT NULL REFERENCES collaboration_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  left_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  role VARCHAR(50) DEFAULT 'participant', -- 'creator', 'moderator', 'participant', 'observer'
  UNIQUE(session_id, user_id)
);

-- Real-time messages table
CREATE TABLE realtime_messages (
  id VARCHAR(255) PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL REFERENCES collaboration_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  message_type VARCHAR(50) NOT NULL CHECK (message_type IN ('chat', 'cursor', 'selection', 'edit', 'system', 'code_review', 'task_update')),
  content JSONB NOT NULL DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  parent_message_id VARCHAR(255) REFERENCES realtime_messages(id),
  is_deleted BOOLEAN DEFAULT false
);

-- Code edits tracking table
CREATE TABLE code_edits (
  id VARCHAR(255) PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL REFERENCES collaboration_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  file_path VARCHAR(1000) NOT NULL,
  edit_type VARCHAR(20) NOT NULL CHECK (edit_type IN ('insert', 'delete', 'replace')),
  start_line INTEGER NOT NULL,
  start_column INTEGER NOT NULL,
  end_line INTEGER,
  end_column INTEGER,
  content TEXT,
  original_content TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  applied_at TIMESTAMP WITH TIME ZONE,
  reverted_at TIMESTAMP WITH TIME ZONE,
  conflict_resolution VARCHAR(50) DEFAULT 'auto' -- 'auto', 'manual', 'accepted', 'rejected'
);

-- Cursor positions tracking table
CREATE TABLE cursor_positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(255) NOT NULL REFERENCES collaboration_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  file_path VARCHAR(1000) NOT NULL,
  line_number INTEGER NOT NULL,
  column_number INTEGER NOT NULL,
  selection_start_line INTEGER,
  selection_start_column INTEGER,
  selection_end_line INTEGER,
  selection_end_column INTEGER,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(session_id, user_id, file_path)
);

-- Code review comments table
CREATE TABLE code_review_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(255) NOT NULL REFERENCES collaboration_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  file_path VARCHAR(1000) NOT NULL,
  line_number INTEGER NOT NULL,
  comment TEXT NOT NULL,
  review_type VARCHAR(50) NOT NULL CHECK (review_type IN ('suggestion', 'issue', 'praise', 'question')),
  code_snippet TEXT,
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'dismissed')),
  resolved_by UUID REFERENCES users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Task updates and assignments table
CREATE TABLE collaboration_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(255) NOT NULL REFERENCES collaboration_sessions(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES users(id),
  assigned_to UUID REFERENCES users(id),
  task_title VARCHAR(255) NOT NULL,
  task_description TEXT,
  task_type VARCHAR(50) DEFAULT 'general' CHECK (task_type IN ('bug_fix', 'feature', 'refactor', 'review', 'documentation', 'general')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status VARCHAR(20) DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'done', 'cancelled')),
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Session invitations table
CREATE TABLE session_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(255) NOT NULL REFERENCES collaboration_sessions(id) ON DELETE CASCADE,
  inviter_id UUID NOT NULL REFERENCES users(id),
  invitee_id UUID NOT NULL REFERENCES users(id),
  invitation_message TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  responded_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '7 days'),
  UNIQUE(session_id, invitee_id)
);

-- User presence and status table
CREATE TABLE user_presence (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'offline' CHECK (status IN ('online', 'away', 'busy', 'offline')),
  current_project VARCHAR(255),
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status_message VARCHAR(255),
  is_available_for_collaboration BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- File locks table (for collaborative editing)
CREATE TABLE file_locks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(255) NOT NULL REFERENCES collaboration_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  file_path VARCHAR(1000) NOT NULL,
  lock_type VARCHAR(20) NOT NULL CHECK (lock_type IN ('read', 'write', 'exclusive')),
  acquired_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '30 minutes'),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(session_id, file_path, lock_type)
);

-- Screen sharing sessions table
CREATE TABLE screen_sharing_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collaboration_session_id VARCHAR(255) NOT NULL REFERENCES collaboration_sessions(id) ON DELETE CASCADE,
  presenter_id UUID NOT NULL REFERENCES users(id),
  session_name VARCHAR(255),
  sharing_type VARCHAR(50) DEFAULT 'screen' CHECK (sharing_type IN ('screen', 'window', 'tab')),
  is_active BOOLEAN DEFAULT true,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP WITH TIME ZONE,
  viewer_count INTEGER DEFAULT 0
);

-- Collaboration metrics table
CREATE TABLE collaboration_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  session_id VARCHAR(255) REFERENCES collaboration_sessions(id),
  user_id UUID REFERENCES users(id),
  metric_type VARCHAR(50) NOT NULL, -- 'session_duration', 'messages_sent', 'edits_made', 'reviews_given'
  metric_value DECIMAL(15,4) NOT NULL,
  metric_unit VARCHAR(20), -- 'minutes', 'count', 'lines', 'characters'
  measured_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  period_start TIMESTAMP WITH TIME ZONE,
  period_end TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance optimization
CREATE INDEX idx_collaboration_sessions_org_active ON collaboration_sessions(organization_id, is_active);
CREATE INDEX idx_collaboration_sessions_creator ON collaboration_sessions(creator_id, created_at DESC);

CREATE INDEX idx_session_participants_session ON session_participants(session_id, is_active);
CREATE INDEX idx_session_participants_user ON session_participants(user_id, joined_at DESC);

CREATE INDEX idx_realtime_messages_session_time ON realtime_messages(session_id, timestamp DESC);
CREATE INDEX idx_realtime_messages_user_type ON realtime_messages(user_id, message_type, timestamp DESC);
CREATE INDEX idx_realtime_messages_parent ON realtime_messages(parent_message_id);

CREATE INDEX idx_code_edits_session_time ON code_edits(session_id, timestamp DESC);
CREATE INDEX idx_code_edits_user_file ON code_edits(user_id, file_path, timestamp DESC);

CREATE INDEX idx_cursor_positions_session ON cursor_positions(session_id, timestamp DESC);
CREATE INDEX idx_cursor_positions_file ON cursor_positions(file_path, timestamp DESC);

CREATE INDEX idx_code_review_comments_session ON code_review_comments(session_id, status, created_at DESC);
CREATE INDEX idx_code_review_comments_user ON code_review_comments(user_id, created_at DESC);

CREATE INDEX idx_collaboration_tasks_session ON collaboration_tasks(session_id, status, priority);
CREATE INDEX idx_collaboration_tasks_assigned ON collaboration_tasks(assigned_to, status, due_date);

CREATE INDEX idx_session_invitations_invitee ON session_invitations(invitee_id, status, invited_at DESC);
CREATE INDEX idx_session_invitations_session ON session_invitations(session_id, status);

CREATE INDEX idx_file_locks_session_file ON file_locks(session_id, file_path, is_active);
CREATE INDEX idx_file_locks_expires ON file_locks(expires_at) WHERE is_active = true;

CREATE INDEX idx_collaboration_metrics_org_type ON collaboration_metrics(organization_id, metric_type, measured_at DESC);
CREATE INDEX idx_collaboration_metrics_session ON collaboration_metrics(session_id, metric_type, measured_at DESC);

-- Triggers for updating timestamps
CREATE TRIGGER update_collaboration_sessions_updated_at BEFORE UPDATE ON collaboration_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_code_review_comments_updated_at BEFORE UPDATE ON code_review_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_collaboration_tasks_updated_at BEFORE UPDATE ON collaboration_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_presence_updated_at BEFORE UPDATE ON user_presence FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically expire file locks
CREATE OR REPLACE FUNCTION expire_file_locks()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE file_locks 
  SET is_active = false 
  WHERE expires_at < CURRENT_TIMESTAMP AND is_active = true;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Schedule to run file lock expiration every minute (in production, use pg_cron or external scheduler)
-- CREATE TRIGGER expire_locks_trigger
--   AFTER INSERT OR UPDATE ON file_locks
--   FOR EACH STATEMENT
--   EXECUTE FUNCTION expire_file_locks();

-- Function to cleanup old cursor positions (keep only latest per user/session/file)
CREATE OR REPLACE FUNCTION cleanup_old_cursor_positions()
RETURNS void AS $$
BEGIN
  DELETE FROM cursor_positions cp1
  USING cursor_positions cp2
  WHERE cp1.session_id = cp2.session_id
    AND cp1.user_id = cp2.user_id
    AND cp1.file_path = cp2.file_path
    AND cp1.timestamp < cp2.timestamp;
END;
$$ LANGUAGE plpgsql;

-- Initial user presence records for existing users
INSERT INTO user_presence (user_id, status, is_available_for_collaboration)
SELECT id, 'offline', true
FROM users
WHERE id NOT IN (SELECT user_id FROM user_presence)
ON CONFLICT (user_id) DO NOTHING;

-- Sample collaboration session types for reference
INSERT INTO business_metrics (organization_id, metric_name, metric_value, metric_unit, period_type, period_start, period_end, metadata)
SELECT 
  'org-default-uuid-here-000000000000',
  'collaboration_session_types',
  0,
  'count',
  'day',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '1 day',
  '{"types": ["coding", "review", "planning", "meeting"], "most_popular": "coding"}'
WHERE NOT EXISTS (
  SELECT 1 FROM business_metrics 
  WHERE organization_id = 'org-default-uuid-here-000000000000' 
  AND metric_name = 'collaboration_session_types'
);