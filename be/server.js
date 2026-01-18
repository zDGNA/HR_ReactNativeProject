const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

// Middleware - CRITICAL: Order matters!
app.use(cors());

// Manual body parser yang lebih reliable
app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      console.log('\n📦 Raw body received:', body);

      if (body) {
        try {
          req.body = JSON.parse(body);
          console.log('✅ Parsed body:', req.body);
        } catch (e) {
          console.log('❌ JSON parse error:', e.message);
          req.body = {};
        }
      } else {
        req.body = {};
      }

      next();
    });
  } else {
    req.body = {};
    next();
  }
});

// Debug middleware
app.use((req, res, next) => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`📨 ${req.method} ${req.path}`);
  console.log(`📋 Content-Type: ${req.headers['content-type']}`);
  console.log(`📦 Body:`, req.body);
  console.log('='.repeat(50));
  next();
});

// Database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hrd',
});

// Test database connection
connection.connect(err => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to MySQL database');
});

// ==================== HEALTH CHECK ====================
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'HRD Management API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth/*',
      divisions: '/api/divisions',
      employees: '/api/employees',
      announcements: '/api/announcements/*',
      statistics: '/api/statistics/*',
    },
  });
});

// ==================== AUTH ENDPOINTS ====================

// Login
app.post('/api/auth/login', (req, res) => {
  try {
    console.log('🔐 Login endpoint hit');
    console.log('Request body:', JSON.stringify(req.body));

    // Cek apakah req.body ada
    if (!req.body || typeof req.body !== 'object') {
      console.log('❌ Body is not an object:', req.body);
      return res.status(400).json({
        success: false,
        message: 'Invalid request body',
      });
    }

    // Ambil data dengan cara yang lebih aman
    const username = req.body.username;
    const password = req.body.password;

    console.log('📝 Credentials:', {
      username,
      password: password ? '***' : undefined,
    });

    if (!username || !password) {
      console.log('❌ Missing credentials');
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      });
    }

    connection.query(
      'SELECT id, username, email, role FROM users WHERE username = ? AND password = ?',
      [username, password],
      (err, results) => {
        if (err) {
          console.error('❌ Database error:', err);
          return res.status(500).json({
            success: false,
            message: 'Database error',
          });
        }

        if (results.length === 0) {
          console.log('❌ Invalid credentials');
          return res.status(401).json({
            success: false,
            message: 'Invalid username or password',
          });
        }

        const user = results[0];
        console.log('✅ Login successful:', user.username);

        res.status(200).json({
          success: true,
          message: 'Login successful',
          data: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
        });
      },
    );
  } catch (error) {
    console.error('❌ Exception in login:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
});

// Update Username
app.put('/api/auth/update-username', (req, res) => {
  const userId = req.body?.userId;
  const newUsername = req.body?.newUsername;

  console.log('📝 Update username:', { userId, newUsername });

  if (!userId || !newUsername) {
    return res.status(400).json({
      success: false,
      message: 'User ID and new username are required',
    });
  }

  // Check if username already exists
  connection.query(
    'SELECT id FROM users WHERE username = ? AND id != ?',
    [newUsername, userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Database error',
        });
      }

      if (results.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken',
        });
      }

      // Update username
      connection.query(
        'UPDATE users SET username = ? WHERE id = ?',
        [newUsername, userId],
        (err, results) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Database error',
            });
          }

          if (results.affectedRows === 0) {
            return res.status(404).json({
              success: false,
              message: 'User not found',
            });
          }

          console.log('✅ Username updated');
          res.status(200).json({
            success: true,
            message: 'Username updated successfully',
            data: { username: newUsername },
          });
        },
      );
    },
  );
});

// Update Password
app.put('/api/auth/update-password', (req, res) => {
  const userId = req.body?.userId;
  const oldPassword = req.body?.oldPassword;
  const newPassword = req.body?.newPassword;

  console.log('📝 Update password for user:', userId);

  if (!userId || !oldPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }

  // Verify old password
  connection.query(
    'SELECT password FROM users WHERE id = ?',
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Database error',
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      if (results[0].password !== oldPassword) {
        console.log('❌ Old password incorrect');
        return res.status(401).json({
          success: false,
          message: 'Old password is incorrect',
        });
      }

      // Update password
      connection.query(
        'UPDATE users SET password = ? WHERE id = ?',
        [newPassword, userId],
        (err, results) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Database error',
            });
          }

          console.log('✅ Password updated');
          res.status(200).json({
            success: true,
            message: 'Password updated successfully',
          });
        },
      );
    },
  );
});

// ==================== DIVISION ENDPOINTS ====================

// Get all divisions
app.get('/api/divisions', (req, res) => {
  console.log('📂 Fetching all divisions');

  connection.query('SELECT * FROM divisions ORDER BY name ASC', (err, data) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Database error',
      });
    }

    console.log(`✅ Found ${data.length} divisions`);
    res.status(200).json({
      success: true,
      data,
    });
  });
});

// Get division by ID
app.get('/api/divisions/:id', (req, res) => {
  const { id } = req.params;

  console.log('📂 Fetching division:', id);

  connection.query(
    'SELECT * FROM divisions WHERE id = ?',
    [id],
    (err, data) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Database error',
        });
      }

      if (data.length === 0) {
        console.log('❌ Division not found');
        return res.status(404).json({
          success: false,
          message: 'Division not found',
        });
      }

      console.log('✅ Division found:', data[0].name);
      res.status(200).json({
        success: true,
        data: data[0],
      });
    },
  );
});

// Create division
app.post('/api/divisions', (req, res) => {
  const name = req.body?.name;
  const description = req.body?.description;
  const icon = req.body?.icon;
  const color = req.body?.color;

  console.log('📂 Creating division:', name);

  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Division name is required',
    });
  }

  connection.query(
    'INSERT INTO divisions (name, description, icon, color) VALUES (?, ?, ?, ?)',
    [name, description || '', icon || 'folder', color || '#3b82f6'],
    (err, results) => {
      if (err) {
        console.error('❌ Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error',
        });
      }

      console.log('✅ Division created with ID:', results.insertId);
      res.status(201).json({
        success: true,
        message: 'Division created successfully',
        data: {
          id: results.insertId,
          name,
          description,
          icon,
          color,
        },
      });
    },
  );
});

// Update division
app.put('/api/divisions/:id', (req, res) => {
  const { id } = req.params;
  const name = req.body?.name;
  const description = req.body?.description;
  const icon = req.body?.icon;
  const color = req.body?.color;

  console.log('📂 Updating division:', id);

  connection.query(
    'UPDATE divisions SET name = ?, description = ?, icon = ?, color = ? WHERE id = ?',
    [name, description, icon, color, id],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Database error',
        });
      }

      if (results.affectedRows === 0) {
        console.log('❌ Division not found');
        return res.status(404).json({
          success: false,
          message: 'Division not found',
        });
      }

      console.log('✅ Division updated');
      res.status(200).json({
        success: true,
        message: 'Division updated successfully',
      });
    },
  );
});

// Delete division
app.delete('/api/divisions/:id', (req, res) => {
  const { id } = req.params;

  console.log('📂 Deleting division:', id);

  connection.query(
    'DELETE FROM divisions WHERE id = ?',
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Database error',
        });
      }

      if (results.affectedRows === 0) {
        console.log('❌ Division not found');
        return res.status(404).json({
          success: false,
          message: 'Division not found',
        });
      }

      console.log('✅ Division deleted');
      res.status(200).json({
        success: true,
        message: 'Division deleted successfully',
      });
    },
  );
});

// ==================== EMPLOYEE ENDPOINTS ====================

// Get all employees
app.get('/api/employees', (req, res) => {
  console.log('👥 Fetching all employees');

  const query = `
    SELECT e.*, d.name as division_name, d.color as division_color, d.icon as division_icon
    FROM employees e 
    LEFT JOIN divisions d ON e.division_id = d.id
    ORDER BY e.name ASC
  `;

  connection.query(query, (err, data) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Database error',
      });
    }

    console.log(`✅ Found ${data.length} employees`);
    res.status(200).json({
      success: true,
      data,
    });
  });
});

// Get employees by division
app.get('/api/employees/division/:divisionId', (req, res) => {
  const { divisionId } = req.params;

  console.log('👥 Fetching employees for division:', divisionId);

  const query = `
    SELECT e.*, d.name as division_name, d.color as division_color, d.icon as division_icon
    FROM employees e 
    LEFT JOIN divisions d ON e.division_id = d.id
    WHERE e.division_id = ?
    ORDER BY e.name ASC
  `;

  connection.query(query, [divisionId], (err, data) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Database error',
      });
    }

    console.log(`✅ Found ${data.length} employees`);
    res.status(200).json({
      success: true,
      data,
    });
  });
});

// Get employee by ID
app.get('/api/employees/:id', (req, res) => {
  const { id } = req.params;

  console.log('👥 Fetching employee:', id);

  const query = `
    SELECT e.*, d.name as division_name, d.color as division_color, d.icon as division_icon
    FROM employees e 
    LEFT JOIN divisions d ON e.division_id = d.id
    WHERE e.id = ?
  `;

  connection.query(query, [id], (err, data) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Database error',
      });
    }

    if (data.length === 0) {
      console.log('❌ Employee not found');
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    console.log('✅ Employee found:', data[0].name);
    res.status(200).json({
      success: true,
      data: data[0],
    });
  });
});

// Create employee
app.post('/api/employees', (req, res) => {
  const name = req.body?.name;
  const division_id = req.body?.division_id;
  const status = req.body?.status;
  const position = req.body?.position;
  const age = req.body?.age;
  const email = req.body?.email;
  const phone = req.body?.phone;
  const address = req.body?.address;
  const contract_end_date = req.body?.contract_end_date;

  console.log('👥 Creating employee:', name);

  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Employee name is required',
    });
  }

  connection.query(
    `INSERT INTO employees 
    (name, division_id, status, position, age, email, phone, address, contract_end_date) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      division_id,
      status || 'Active',
      position,
      age,
      email,
      phone,
      address,
      contract_end_date,
    ],
    (err, results) => {
      if (err) {
        console.error('❌ Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error',
        });
      }

      // Update division employee count
      if (division_id) {
        connection.query(
          'UPDATE divisions SET employee_count = employee_count + 1 WHERE id = ?',
          [division_id],
          err => {
            if (err) console.error('Warning: Failed to update employee count');
          },
        );
      }

      console.log('✅ Employee created with ID:', results.insertId);
      res.status(201).json({
        success: true,
        message: 'Employee created successfully',
        data: {
          id: results.insertId,
          name,
          division_id,
          status,
          position,
        },
      });
    },
  );
});

// Update employee
app.put('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  const name = req.body?.name;
  const division_id = req.body?.division_id;
  const status = req.body?.status;
  const position = req.body?.position;
  const age = req.body?.age;
  const email = req.body?.email;
  const phone = req.body?.phone;
  const address = req.body?.address;
  const contract_end_date = req.body?.contract_end_date;

  console.log('👥 Updating employee:', id);

  connection.query(
    `UPDATE employees SET 
    name = ?, division_id = ?, status = ?, position = ?, age = ?, 
    email = ?, phone = ?, address = ?, contract_end_date = ? 
    WHERE id = ?`,
    [
      name,
      division_id,
      status,
      position,
      age,
      email,
      phone,
      address,
      contract_end_date,
      id,
    ],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Database error',
        });
      }

      if (results.affectedRows === 0) {
        console.log('❌ Employee not found');
        return res.status(404).json({
          success: false,
          message: 'Employee not found',
        });
      }

      console.log('✅ Employee updated');
      res.status(200).json({
        success: true,
        message: 'Employee updated successfully',
      });
    },
  );
});

// Delete employee
app.delete('/api/employees/:id', (req, res) => {
  const { id } = req.params;

  console.log('👥 Deleting employee:', id);

  // Get employee division before deleting
  connection.query(
    'SELECT division_id FROM employees WHERE id = ?',
    [id],
    (err, results) => {
      if (err || results.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found',
        });
      }

      const divisionId = results[0].division_id;

      connection.query(
        'DELETE FROM employees WHERE id = ?',
        [id],
        (err, results) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Database error',
            });
          }

          // Update division employee count
          if (divisionId) {
            connection.query(
              'UPDATE divisions SET employee_count = GREATEST(0, employee_count - 1) WHERE id = ?',
              [divisionId],
              err => {
                if (err)
                  console.error('Warning: Failed to update employee count');
              },
            );
          }

          console.log('✅ Employee deleted');
          res.status(200).json({
            success: true,
            message: 'Employee deleted successfully',
          });
        },
      );
    },
  );
});

// ==================== ANNOUNCEMENT ENDPOINTS ====================

// Get contract announcements
app.get('/api/announcements/contracts', (req, res) => {
  console.log('📢 Fetching contract announcements');

  const query = `
    SELECT 
      e.id,
      e.name as employeeName,
      e.contract_end_date as contractEndDate,
      DATEDIFF(e.contract_end_date, CURDATE()) as daysLeft,
      CASE 
        WHEN DATEDIFF(e.contract_end_date, CURDATE()) < 0 THEN 'expired'
        WHEN DATEDIFF(e.contract_end_date, CURDATE()) <= 7 THEN 'urgent'
        WHEN DATEDIFF(e.contract_end_date, CURDATE()) <= 14 THEN 'warning'
        ELSE 'normal'
      END as status,
      CASE 
        WHEN DATEDIFF(e.contract_end_date, CURDATE()) < 0 THEN 'alert-circle'
        ELSE 'document-text'
      END as icon,
      d.name as divisionName
    FROM employees e
    LEFT JOIN divisions d ON e.division_id = d.id
    WHERE e.contract_end_date IS NOT NULL
      AND DATEDIFF(e.contract_end_date, CURDATE()) <= 30
    ORDER BY e.contract_end_date ASC
  `;

  connection.query(query, (err, data) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Database error',
      });
    }

    const formattedData = data.map(item => ({
      ...item,
      type: item.daysLeft < 0 ? 'contract_ended' : 'contract_ending',
    }));

    console.log(`✅ Found ${formattedData.length} announcements`);
    res.status(200).json({
      success: true,
      data: formattedData,
    });
  });
});

// ==================== STATISTICS ENDPOINTS ====================

// Get dashboard statistics
app.get('/api/statistics/dashboard', (req, res) => {
  console.log('📊 Fetching dashboard statistics');

  const queries = {
    totalEmployees:
      "SELECT COUNT(*) as count FROM employees WHERE status = 'Active'",
    totalDivisions: 'SELECT COUNT(*) as count FROM divisions',
    contractsEnding: `
      SELECT COUNT(*) as count FROM employees 
      WHERE DATEDIFF(contract_end_date, CURDATE()) <= 30 
      AND DATEDIFF(contract_end_date, CURDATE()) >= 0
    `,
    contractsExpired: `
      SELECT COUNT(*) as count FROM employees 
      WHERE DATEDIFF(contract_end_date, CURDATE()) < 0
    `,
  };

  const stats = {};
  let completed = 0;
  const total = Object.keys(queries).length;

  Object.entries(queries).forEach(([key, query]) => {
    connection.query(query, (err, results) => {
      if (!err && results.length > 0) {
        stats[key] = results[0].count;
      } else {
        stats[key] = 0;
      }

      completed++;
      if (completed === total) {
        console.log('✅ Statistics:', stats);
        res.status(200).json({
          success: true,
          data: stats,
        });
      }
    });
  });
});

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message,
  });
});

// ==================== SERVER ====================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log(`🚀 Server API berjalan di http://localhost:${PORT}`);
  console.log('='.repeat(50));
  console.log('📋 Available endpoints:');
  console.log('   - GET  /');
  console.log('   - POST /api/auth/login');
  console.log('   - PUT  /api/auth/update-username');
  console.log('   - PUT  /api/auth/update-password');
  console.log('   - GET  /api/divisions');
  console.log('   - GET  /api/employees');
  console.log('   - GET  /api/announcements/contracts');
  console.log('   - GET  /api/statistics/dashboard');
  console.log('='.repeat(50) + '\n');
});
