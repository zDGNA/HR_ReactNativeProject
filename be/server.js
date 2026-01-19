const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

// ==================== MIDDLEWARE & DEBUGGING ====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware Debugging: Menampilkan log setiap ada request masuk
app.use((req, res, next) => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`📨 REQUEST: [${req.method}] ${req.path}`);
  console.log(`⏰ TIME   : ${new Date().toLocaleString()}`);
  if (Object.keys(req.params).length > 0)
    console.log(`🔍 PARAMS :`, req.params);
  if (Object.keys(req.query).length > 0) console.log(`❓ QUERY  :`, req.query);
  if (req.method !== 'GET')
    console.log(`📦 BODY   :`, JSON.stringify(req.body, null, 2));
  console.log(`${'='.repeat(50)}`);
  next();
});

// ==================== DATABASE CONNECTION ====================
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hrd',
});

connection.connect(err => {
  if (err) {
    console.error('❌ DATABASE CONNECTION FAILED:', err.message);
    process.exit(1);
  }
  console.log('✅ DATABASE CONNECTED SUCCESSFULLY');
});

// ==================== ENDPOINTS ====================

// 1. Health Check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'HRD Management API is active' });
});

// 2. Auth: Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  connection.query(
    'SELECT id, username, email, role FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, results) => {
      if (err) {
        console.error('❌ LOGIN ERROR:', err);
        return res
          .status(500)
          .json({ success: false, message: 'Database error' });
      }
      if (results.length === 0) {
        console.log('⚠️  LOGIN FAILED: Invalid credentials for', username);
        return res
          .status(401)
          .json({ success: false, message: 'Username atau password salah' });
      }
      console.log('✅ LOGIN SUCCESS:', username);
      res.json({ success: true, data: results[0] });
    },
  );
});

// 3. Divisions: Get All with Employee Count
app.get('/api/divisions', (req, res) => {
  const query = `
    SELECT 
      d.id,
      d.name,
      d.description,
      d.color,
      d.icon,
      COUNT(e.id) as employee_count
    FROM divisions d
    LEFT JOIN employees e ON d.id = e.division_id AND e.status = 'Active'
    GROUP BY d.id, d.name, d.description, d.color, d.icon
    ORDER BY d.name ASC
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('❌ FETCH DIVISIONS ERROR:', err);
      return res
        .status(500)
        .json({ success: false, message: 'Database error' });
    }
    console.log(`📊 FETCHED ${results.length} divisions with employee counts`);
    res.json({ success: true, data: results || [] });
  });
});

// 4. Employees: Get All
app.get('/api/employees', (req, res) => {
  const query = `
    SELECT e.*, d.name as division_name, d.color as division_color, d.icon as division_icon
    FROM employees e 
    LEFT JOIN divisions d ON e.division_id = d.id
    ORDER BY e.name ASC
  `;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('❌ FETCH EMPLOYEES ERROR:', err);
      return res
        .status(500)
        .json({ success: false, message: 'Database error' });
    }
    console.log(`📊 FETCHED ${results.length} employees`);
    res.json({ success: true, data: results || [] });
  });
});

// 5. Employees: Get by Division ID
app.get('/api/employees/division/:divisionId', (req, res) => {
  const { divisionId } = req.params;
  const query = `
    SELECT e.*, d.name as division_name, d.color as division_color, d.icon as division_icon
    FROM employees e 
    LEFT JOIN divisions d ON e.division_id = d.id
    WHERE e.division_id = ?
    ORDER BY e.name ASC
  `;

  connection.query(query, [divisionId], (err, results) => {
    if (err) {
      console.error('❌ FETCH EMPLOYEES BY DIVISION ERROR:', err);
      return res
        .status(500)
        .json({ success: false, message: 'Database error' });
    }
    console.log(
      `📊 FETCHED ${results.length} employees for division ID ${divisionId}`,
    );
    res.json({ success: true, data: results || [] });
  });
});

// 6. Employees: Add New
app.post('/api/employees', (req, res) => {
  const {
    name,
    position,
    age,
    email,
    phone,
    address,
    contract_end_date,
    status,
    division_id,
  } = req.body;

  const query = `
    INSERT INTO employees (name, position, age, email, phone, address, contract_end_date, status, division_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    query,
    [
      name,
      position,
      age,
      email,
      phone,
      address,
      contract_end_date,
      status || 'Active',
      division_id || 1,
    ],
    (err, result) => {
      if (err) {
        console.error('❌ ADD EMPLOYEE ERROR:', err.message);
        return res.status(500).json({ success: false, message: err.message });
      }
      console.log('✅ EMPLOYEE ADDED, ID:', result.insertId);
      res.json({ success: true, id: result.insertId });
    },
  );
});

// 7. Employees: Update
app.put('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  const {
    name,
    position,
    age,
    email,
    phone,
    address,
    contract_end_date,
    status,
    division_id,
  } = req.body;

  const query = `
    UPDATE employees 
    SET name = ?, position = ?, age = ?, email = ?, phone = ?, 
        address = ?, contract_end_date = ?, status = ?, division_id = ?
    WHERE id = ?
  `;

  connection.query(
    query,
    [
      name,
      position,
      age,
      email,
      phone,
      address,
      contract_end_date,
      status,
      division_id,
      id,
    ],
    (err, result) => {
      if (err) {
        console.error('❌ UPDATE EMPLOYEE ERROR:', err.message);
        return res.status(500).json({ success: false, message: err.message });
      }
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ success: false, message: 'Employee not found' });
      }
      console.log('✅ EMPLOYEE UPDATED, ID:', id);
      res.json({ success: true, message: 'Employee updated successfully' });
    },
  );
});

// 8. Employees: Delete
app.delete('/api/employees/:id', (req, res) => {
  const { id } = req.params;

  connection.query(
    'DELETE FROM employees WHERE id = ?',
    [id],
    (err, result) => {
      if (err) {
        console.error('❌ DELETE EMPLOYEE ERROR:', err.message);
        return res.status(500).json({ success: false, message: err.message });
      }
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ success: false, message: 'Employee not found' });
      }
      console.log('✅ EMPLOYEE DELETED, ID:', id);
      res.json({ success: true, message: 'Employee deleted successfully' });
    },
  );
});

// 9. Employees: Update Status
app.put('/api/employees/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  connection.query(
    'UPDATE employees SET status = ? WHERE id = ?',
    [status, id],
    err => {
      if (err) {
        console.error('❌ UPDATE STATUS ERROR:', err);
        return res.status(500).json({ success: false });
      }
      console.log(`🔄 STATUS UPDATED: ID ${id} to ${status}`);
      res.json({ success: true });
    },
  );
});

// 10. Users: Update Username
app.put('/api/users/update-username', (req, res) => {
  const { userId, newUsername } = req.body;
  connection.query(
    'UPDATE users SET username = ? WHERE id = ?',
    [newUsername, userId],
    err => {
      if (err) {
        console.error('❌ UPDATE USERNAME ERROR:', err);
        return res.status(500).json({ success: false });
      }
      console.log(`👤 USERNAME UPDATED: User ID ${userId} to ${newUsername}`);
      res.json({ success: true, message: 'Username updated' });
    },
  );
});

// 11. Users: Update Password
app.put('/api/users/update-password', (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  // Verifikasi password lama
  connection.query(
    'SELECT password FROM users WHERE id = ?',
    [userId],
    (err, results) => {
      if (err) {
        console.error('❌ VERIFY PASSWORD ERROR:', err);
        return res
          .status(500)
          .json({ success: false, message: 'Database error' });
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: 'User not found' });
      }

      if (results[0].password !== oldPassword) {
        return res
          .status(401)
          .json({ success: false, message: 'Password lama tidak sesuai' });
      }

      // Update password
      connection.query(
        'UPDATE users SET password = ? WHERE id = ?',
        [newPassword, userId],
        err => {
          if (err) {
            console.error('❌ UPDATE PASSWORD ERROR:', err);
            return res
              .status(500)
              .json({ success: false, message: 'Failed to update password' });
          }
          console.log(`🔐 PASSWORD UPDATED: User ID ${userId}`);
          res.json({ success: true, message: 'Password updated successfully' });
        },
      );
    },
  );
});

// ==================== ERROR HANDLING 404 ====================
app.use((req, res) => {
  console.log(`🚫 404 NOT FOUND: ${req.path}`);
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// ==================== START SERVER ====================

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '='.repeat(50));
  console.log(`🚀 Server API berjalan di http://localhost:${PORT}`);
  console.log('='.repeat(50));
  console.log('📋 Available endpoints:');
  console.log('   - GET    /');
  console.log('   - POST   /api/auth/login');
  console.log('   - GET    /api/divisions');
  console.log('   - GET    /api/employees');
  console.log('   - GET    /api/employees/division/:divisionId');
  console.log('   - POST   /api/employees');
  console.log('   - PUT    /api/employees/:id');
  console.log('   - DELETE /api/employees/:id');
  console.log('   - PUT    /api/employees/:id/status');
  console.log('   - PUT    /api/users/update-username');
  console.log('   - PUT    /api/users/update-password');
  console.log('='.repeat(50) + '\n');
});
