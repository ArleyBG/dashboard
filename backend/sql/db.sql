-- Roles Restringir o filtrar datos segun el rol
CREATE TABLE roles (
  id TINYINT UNSIGNED PRIMARY KEY,
  name VARCHAR(20) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- estado de tareas // Definir el estado de la tarea
CREATE TABLE task_states (
  id TINYINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE,
  display_order TINYINT UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- tipo de tareas // Categorizar tareas 
CREATE TABLE task_types (
  id SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Usuarios
CREATE TABLE users (
  id VARCHAR(30) PRIMARY KEY,          
  name VARCHAR(150) NOT NULL,
  role_id TINYINT UNSIGNED NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,      
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tareas
CREATE TABLE tasks (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type_id SMALLINT UNSIGNED NULL,
  state_id TINYINT UNSIGNED NOT NULL,
  assigned_role TINYINT UNSIGNED NULL,
  assigned_to VARCHAR(30) NULL,
  created_by VARCHAR(30) NOT NULL,
  start_date DATE NULL,
  end_date DATE NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (type_id) REFERENCES task_types(id) ON DELETE SET NULL,
  FOREIGN KEY (state_id) REFERENCES task_states(id) ON DELETE RESTRICT,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (assigned_role) REFERENCES roles(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Historial de tareas
CREATE TABLE task_history (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  task_id INT UNSIGNED NOT NULL,
  actor_id VARCHAR(30) NULL,
  prev_state_id TINYINT UNSIGNED NULL,
  new_state_id TINYINT UNSIGNED NULL,
  prev_assigned_to VARCHAR(30) NULL,
  new_assigned_to VARCHAR(30) NULL,
  comment TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (prev_state_id) REFERENCES task_states(id) ON DELETE SET NULL,
  FOREIGN KEY (new_state_id) REFERENCES task_states(id) ON DELETE SET NULL,
  FOREIGN KEY (prev_assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (new_assigned_to) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- roles iniciales
INSERT INTO roles (id, name) VALUES
  (1, 'admin'),
  (2, 't1'),
  (3, 't2')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- usuario admin por defecto
-- contraseña "admin123"
INSERT INTO users (id, name, role_id, email, password) VALUES
  ('1001', 'Administrador General', 1, 'admin@example.com', '$2a$10$9y6WZJj6sYv4kRn1iGc2R.cX8EuoS75E/BX71ZXqSbzprZyQf1mAq')
ON DUPLICATE KEY UPDATE email = VALUES(email), password = VALUES(password);



-- Insertar estados iniciales en task_states
INSERT INTO task_states (id, name, display_order) VALUES
  (1, 'Compromiso', 1),
  (2, 'Implementación', 2),
  (3, 'QA', 3),
  (4, 'Finalizado', 4)
ON DUPLICATE KEY UPDATE 
  name = VALUES(name), 
  display_order = VALUES(display_order);
