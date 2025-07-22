const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'procurement_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));
app.use('/uploads', express.static('uploads'));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  }
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes

// Authentication
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Requisitions
app.get('/api/requisitions', authenticateToken, async (req, res) => {
  try {
    const { status, department, search } = req.query;
    let query = `
      SELECT r.*, u.name as requestor_name, u.department
      FROM requisitions r
      JOIN users u ON r.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (status && status !== 'all') {
      paramCount++;
      query += ` AND r.status = $${paramCount}`;
      params.push(status);
    }

    if (department) {
      paramCount++;
      query += ` AND u.department = $${paramCount}`;
      params.push(department);
    }

    if (search) {
      paramCount++;
      query += ` AND (r.title ILIKE $${paramCount} OR r.id::text ILIKE $${paramCount} OR u.name ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += ' ORDER BY r.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get requisitions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/requisitions', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const {
      title,
      department,
      costCenter,
      justification,
      priority,
      expectedDate,
      vendor,
      items
    } = req.body;
    
    // Insert requisition
    const requisitionResult = await client.query(`
      INSERT INTO requisitions (
        user_id, title, department, cost_center, justification, 
        priority, expected_date, vendor, status, total_amount
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      req.user.userId,
      title,
      department,
      costCenter,
      justification,
      priority,
      expectedDate,
      vendor,
      'pending',
      items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
    ]);
    
    const requisitionId = requisitionResult.rows[0].id;
    
    // Insert items
    for (const item of items) {
      await client.query(`
        INSERT INTO requisition_items (
          requisition_id, description, quantity, unit_price, 
          total_price, category, specifications
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        requisitionId,
        item.description,
        item.quantity,
        item.unitPrice,
        item.quantity * item.unitPrice,
        item.category,
        item.specifications
      ]);
    }
    
    await client.query('COMMIT');
    
    // Send email notifications (implement based on your email service)
    // await sendRequisitionNotification(requisitionResult.rows[0]);
    
    res.status(201).json(requisitionResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create requisition error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// Inventory
app.get('/api/inventory', authenticateToken, async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM inventory WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (category && category !== 'all') {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(category);
    }

    if (search) {
      paramCount++;
      query += ` AND (name ILIKE $${paramCount} OR item_code ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += ' ORDER BY name';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Vendors
app.get('/api/vendors', authenticateToken, async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = 'SELECT * FROM vendors WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (status && status !== 'all') {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(status);
    }

    if (search) {
      paramCount++;
      query += ` AND (name ILIKE $${paramCount} OR contact_email ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += ' ORDER BY name';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get vendors error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Approvals
app.put('/api/requisitions/:id/approve', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { comments } = req.body;
    
    const result = await pool.query(`
      UPDATE requisitions 
      SET status = 'approved', approved_by = $1, approved_at = NOW(), approval_comments = $2
      WHERE id = $3
      RETURNING *
    `, [req.user.userId, comments, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Requisition not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Approve requisition error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/requisitions/:id/reject', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { comments } = req.body;
    
    const result = await pool.query(`
      UPDATE requisitions 
      SET status = 'rejected', approved_by = $1, approved_at = NOW(), approval_comments = $2
      WHERE id = $3
      RETURNING *
    `, [req.user.userId, comments, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Requisition not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Reject requisition error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// File upload
app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    res.json({
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      path: `/uploads/${req.file.filename}`
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  pool.end(() => {
    process.exit(0);
  });
});