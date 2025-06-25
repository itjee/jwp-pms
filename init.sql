-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create initial roles and permissions
INSERT INTO roles (name, description, is_active) VALUES
('admin', 'System Administrator', true),
('manager', 'Project Manager', true),
('developer', 'Developer', true),
('viewer', 'Viewer', true);

INSERT INTO permissions (name, resource, action, description) VALUES
-- User permissions
('user.create', 'user', 'create', 'Create new users'),
('user.read', 'user', 'read', 'View user information'),
('user.update', 'user', 'update', 'Update user information'),
('user.delete', 'user', 'delete', 'Delete users'),

-- Project permissions
('project.create', 'project', 'create', 'Create new projects'),
('project.read', 'project', 'read', 'View project information'),
('project.update', 'project', 'update', 'Update project information'),
('project.delete', 'project', 'delete', 'Delete projects'),

-- Task permissions
('task.create', 'task', 'create', 'Create new tasks'),
('task.read', 'task', 'read', 'View task information'),
('task.update', 'task', 'update', 'Update task information'),
('task.delete', 'task', 'delete', 'Delete tasks'),
('task.assign', 'task', 'assign', 'Assign tasks to users'),

-- Calendar permissions
('calendar.create', 'calendar', 'create', 'Create calendar events'),
('calendar.read', 'calendar', 'read', 'View calendar events'),
('calendar.update', 'calendar', 'update', 'Update calendar events'),
('calendar.delete', 'calendar', 'delete', 'Delete calendar events');

-- Assign permissions to roles
-- Admin has all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p WHERE r.name = 'admin';

-- Manager permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'manager' AND p.name IN (
    'user.read', 'project.create', 'project.read', 'project.update', 'project.delete',
    'task.create', 'task.read', 'task.update', 'task.delete', 'task.assign',
    'calendar.create', 'calendar.read', 'calendar.update', 'calendar.delete'
);

-- Developer permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'developer' AND p.name IN (
    'user.read', 'project.read', 'task.create', 'task.read', 'task.update',
    'calendar.create', 'calendar.read', 'calendar.update'
);

-- Viewer permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'viewer' AND p.name IN (
    'user.read', 'project.read', 'task.read', 'calendar.read'
);

-- Create default admin user (password: admin123)
INSERT INTO users (email, username, full_name, hashed_password, role, is_active, is_verified) VALUES
('admin@pms.com', 'admin', 'System Administrator', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'admin', true, true);
