const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const uploadDir = path.join(__dirname, 'php_api', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '_' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

app.use('/api/uploads', express.static(uploadDir));
app.use('/api/images', express.static(path.join(__dirname, 'php_api', 'image')));

app.get('/api/customers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers ORDER BY customer_id');
    res.json({ success: true, data: result.rows });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
});

app.post('/api/customers', async (req, res) => {
  const { firstName, lastName, phone, username, password } = req.body;
  if (!firstName || !lastName || !phone || !username || !password) {
    return res.json({ success: false, message: 'ข้อมูลไม่ครบ' });
  }
  try {
    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO customers ("firstName", "lastName", phone, username, password) VALUES ($1,$2,$3,$4,$5)',
      [firstName, lastName, phone, username, hashed]
    );
    res.json({ success: true, message: 'เพิ่มข้อมูลเรียบร้อย' });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
});

app.put('/api/customers', async (req, res) => {
  const { customer_id, firstName, lastName, phone, username, password } = req.body;
  try {
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      await pool.query(
        'UPDATE customers SET "firstName"=$1, "lastName"=$2, phone=$3, username=$4, password=$5 WHERE customer_id=$6',
        [firstName, lastName, phone, username, hashed, customer_id]
      );
    } else {
      await pool.query(
        'UPDATE customers SET "firstName"=$1, "lastName"=$2, phone=$3, username=$4 WHERE customer_id=$5',
        [firstName, lastName, phone, username, customer_id]
      );
    }
    res.json({ success: true, message: 'แก้ไขข้อมูลเรียบร้อย' });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
});

app.delete('/api/customers', async (req, res) => {
  const { customer_id } = req.body;
  try {
    await pool.query('DELETE FROM customers WHERE customer_id=$1', [customer_id]);
    res.json({ success: true, message: 'ลบข้อมูลเรียบร้อย' });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
});

app.get('/api/employees', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employees ORDER BY emp_id');
    res.json(result.rows);
  } catch (e) {
    res.json({ error: e.message });
  }
});

app.post('/api/employees/add', async (req, res) => {
  const { full_name, department, salary, active } = req.body;
  if (!full_name || !department || salary === undefined || active === undefined) {
    return res.json({ success: false, message: 'ข้อมูลไม่ครบ' });
  }
  try {
    await pool.query(
      'INSERT INTO employees (full_name, department, salary, active, image) VALUES ($1,$2,$3,$4,$5)',
      [full_name, department, salary, active, '']
    );
    res.json({ success: true, message: 'เพิ่มข้อมูลเรียบร้อย' });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
});

app.get('/api/employees/crud', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employees ORDER BY emp_id DESC');
    res.json(result.rows);
  } catch (e) {
    res.json({ error: e.message });
  }
});

app.post('/api/employees/crud', upload.single('image'), async (req, res) => {
  const { action } = req.body;
  try {
    if (action === 'add') {
      const { full_name, department, salary, active } = req.body;
      const filename = req.file ? req.file.filename : '';
      await pool.query(
        'INSERT INTO employees (full_name, department, salary, active, image) VALUES ($1,$2,$3,$4,$5)',
        [full_name, department, salary, active, filename]
      );
      res.json({ message: 'เพิ่มสินค้าสำเร็จ' });
    } else if (action === 'update') {
      const { emp_id, full_name, department, salary, active } = req.body;
      if (req.file) {
        await pool.query(
          'UPDATE employees SET full_name=$1, department=$2, salary=$3, active=$4, image=$5 WHERE emp_id=$6',
          [full_name, department, salary, active, req.file.filename, emp_id]
        );
      } else {
        await pool.query(
          'UPDATE employees SET full_name=$1, department=$2, salary=$3, active=$4 WHERE emp_id=$5',
          [full_name, department, salary, active, emp_id]
        );
      }
      res.json({ message: 'แก้ไขสินค้าสำเร็จ' });
    } else if (action === 'delete') {
      const { emp_id } = req.body;
      await pool.query('DELETE FROM employees WHERE emp_id=$1', [emp_id]);
      res.json({ message: 'ลบสินค้าสำเร็จ' });
    } else {
      res.json({ error: 'Action ไม่ถูกต้อง' });
    }
  } catch (e) {
    res.json({ error: e.message });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY product_id DESC');
    res.json(result.rows);
  } catch (e) {
    res.json({ error: e.message });
  }
});

app.get('/api/products/crud', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY product_id DESC');
    res.json({ success: true, data: result.rows });
  } catch (e) {
    res.json({ success: false, data: [] });
  }
});

app.post('/api/products/crud', upload.single('image'), async (req, res) => {
  const { action } = req.body;
  try {
    if (action === 'add') {
      const { product_name, description, price, stock } = req.body;
      const filename = req.file ? req.file.filename : null;
      await pool.query(
        'INSERT INTO products (product_name, description, price, stock, image) VALUES ($1,$2,$3,$4,$5)',
        [product_name, description, price, stock, filename]
      );
      res.json({ message: 'เพิ่มสินค้าสำเร็จ' });
    } else if (action === 'update') {
      const { product_id, product_name, description, price, stock } = req.body;
      if (req.file) {
        await pool.query(
          'UPDATE products SET product_name=$1, description=$2, price=$3, stock=$4, image=$5 WHERE product_id=$6',
          [product_name, description, price, stock, req.file.filename, product_id]
        );
      } else {
        await pool.query(
          'UPDATE products SET product_name=$1, description=$2, price=$3, stock=$4 WHERE product_id=$5',
          [product_name, description, price, stock, product_id]
        );
      }
      res.json({ message: 'แก้ไขสินค้าสำเร็จ' });
    } else if (action === 'delete') {
      const { product_id } = req.body;
      await pool.query('DELETE FROM products WHERE product_id=$1', [product_id]);
      res.json({ message: 'ลบสินค้าสำเร็จ' });
    } else {
      res.json({ error: 'Action ไม่ถูกต้อง' });
    }
  } catch (e) {
    res.json({ error: e.message });
  }
});

app.get('/api/types', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM type ORDER BY type_id');
    res.json(result.rows);
  } catch (e) {
    res.json({ error: e.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API server running on port ${PORT}`);
});
