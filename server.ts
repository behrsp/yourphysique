import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up PostgreSQL Pool
const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_et9wap1vsCHn@ep-snowy-rice-acf5juh6-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
pg.types.setTypeParser(1700, (val) => parseFloat(val));
const pool = new pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

// Middleware
app.use(express.json({ limit: "20mb" })); // Increase limit to handle comparison photos in base64

// DB Table Initialization
async function initializeDB() {
  const client = await pool.connect();
  try {
    console.log("Initializing database tables/schema in NeonDB...");
    
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        phone VARCHAR(20) PRIMARY KEY,
        password VARCHAR(100) NOT NULL,
        name VARCHAR(100) NOT NULL,
        age INTEGER NOT NULL,
        weight NUMERIC(6, 2) NOT NULL,
        height NUMERIC(6, 2) NOT NULL,
        physical_issue TEXT,
        main_goal VARCHAR(100) NOT NULL,
        role VARCHAR(20) DEFAULT 'client',
        is_demo BOOLEAN DEFAULT TRUE,
        payment_day INTEGER DEFAULT 10,
        last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        avatar TEXT,
        is_frozen BOOLEAN DEFAULT FALSE
      )
    `);

    // Create physical evaluations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS evaluations (
        id SERIAL PRIMARY KEY,
        client_phone VARCHAR(20) REFERENCES users(phone) ON DELETE CASCADE,
        eval_date DATE NOT NULL,
        weight NUMERIC(6, 2) NOT NULL,
        height NUMERIC(6, 2) NOT NULL,
        neck NUMERIC(5, 2) NOT NULL,
        chest NUMERIC(5, 2) NOT NULL,
        waist NUMERIC(5, 2) NOT NULL,
        abdomen NUMERIC(5, 2) NOT NULL,
        hips NUMERIC(5, 2) NOT NULL,
        arm_right NUMERIC(5, 2) NOT NULL,
        arm_left NUMERIC(5, 2) NOT NULL,
        thigh_right NUMERIC(5, 2) NOT NULL,
        thigh_left NUMERIC(5, 2) NOT NULL,
        calf_right NUMERIC(5, 2) NOT NULL,
        calf_left NUMERIC(5, 2) NOT NULL,
        photo_front TEXT,
        photo_side TEXT,
        imc NUMERIC(5, 2),
        body_fat NUMERIC(5, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create workouts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS workouts (
        id SERIAL PRIMARY KEY,
        client_phone VARCHAR(20) REFERENCES users(phone) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        sets INTEGER NOT NULL,
        reps VARCHAR(50) NOT NULL,
        weight_load VARCHAR(50),
        video_url VARCHAR(255),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create workout history (completed exercises tracker)
    await client.query(`
      CREATE TABLE IF NOT EXISTS workout_history (
        id SERIAL PRIMARY KEY,
        client_phone VARCHAR(20) REFERENCES users(phone) ON DELETE CASCADE,
        workout_id INTEGER REFERENCES workouts(id) ON DELETE CASCADE,
        completed_at DATE NOT NULL DEFAULT CURRENT_DATE
      )
    `);

    // Create swap workout requests table
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        client_phone VARCHAR(20) REFERENCES users(phone) ON DELETE CASCADE,
        workout_id INTEGER REFERENCES workouts(id) ON DELETE SET NULL,
        workout_name VARCHAR(100) NOT NULL,
        reason TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'Pendente',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create monthly payments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        client_phone VARCHAR(20) REFERENCES users(phone) ON DELETE CASCADE,
        month VARCHAR(7) NOT NULL, -- e.g., "2026-06"
        amount NUMERIC(10, 2) NOT NULL DEFAULT 150.00,
        status VARCHAR(20) DEFAULT 'Pendente',
        paid_at TIMESTAMP,
        UNIQUE (client_phone, month)
      )
    `);

    // Create diets table
    await client.query(`
      CREATE TABLE IF NOT EXISTS diets (
        id SERIAL PRIMARY KEY,
        client_phone VARCHAR(20) REFERENCES users(phone) ON DELETE CASCADE,
        diet_date DATE NOT NULL,
        title VARCHAR(150) NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS settings (
        key VARCHAR(50) PRIMARY KEY,
        value TEXT NOT NULL
      )
    `);

    // Seed default settings
    await client.query(`
      INSERT INTO settings (key, value)
      VALUES 
        ('pix_key', '41984842941'),
        ('pix_qrcode', '')
      ON CONFLICT (key) DO NOTHING
    `);


    // Seed default admin personal profile if not exists
    const adminCheck = await client.query("SELECT * FROM users WHERE phone = $1", ["41984842941"]);
    if (adminCheck.rows.length === 0) {
      await client.query(`
        INSERT INTO users (phone, password, name, age, weight, height, physical_issue, main_goal, role, is_demo)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [
        "41984842941",
        "123456",
        "Instrutora Personal (Administrador)",
        30,
        65,
        1.68,
        "Nenhum",
        "Gestão de Alunos",
        "admin",
        false
      ]);
      console.log("Admin account seeded successfully (41984842941 / 123456).");
    }

    // Seed Mary Soares admin profile if not exists
    const maryCheck = await client.query("SELECT * FROM users WHERE phone = $1", ["41991455646"]);
    if (maryCheck.rows.length === 0) {
      await client.query(`
        INSERT INTO users (phone, password, name, age, weight, height, physical_issue, main_goal, role, is_demo)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [
        "41991455646",
        "235689",
        "Mary Soares",
        30,
        65,
        1.68,
        "Nenhum",
        "Gestão de Alunos",
        "admin",
        false
      ]);
      console.log("Mary Soares admin account seeded successfully (41991455646 / 235689).");
    }

    console.log("Database tables initialized successfully!");
  } catch (err) {
    console.error("Error initializing database schema:", err);
  } finally {
    client.release();
  }
}

// REST API Endpoints

// Helper to check user freeze and auto-generate current month payment record for completo users
async function handleUserStatsAndPayments(phone: string, isDemo: boolean, paymentDay: number) {
  if (isDemo || phone === "41984842941" || phone === "41991455646") return false; // Demo or Admin does not pay/gets frozen
  
  const currentYearMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
  
  // 1. Ensure current month invoice row exists
  try {
    await pool.query(`
      INSERT INTO payments (client_phone, month, amount, status)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (client_phone, month) DO NOTHING
    `, [phone, currentYearMonth, 150.00, 'Pendente']);
  } catch (err) {
    console.error("Error ensuring current month invoice: ", err);
  }

  // 2. Fetch payment records
  const pmResult = await pool.query(
    "SELECT * FROM payments WHERE client_phone = $1 AND month = $2",
    [phone, currentYearMonth]
  );
  
  if (pmResult.rows.length > 0) {
    const payment = pmResult.rows[0];
    if (payment.status === 'Pago') {
      // Auto-unfreeze if paid
      await pool.query("UPDATE users SET is_frozen = FALSE WHERE phone = $1", [phone]);
      return false;
    } else {
      // If payment is pending, check days past due
      const currentDay = new Date().getDate();
      // On the 5th day after the payment day, we freeze
      if (currentDay >= (paymentDay + 5)) {
        await pool.query("UPDATE users SET is_frozen = TRUE WHERE phone = $1", [phone]);
        return true;
      } else {
        // Not past due 5 days yet
        // Retrieve manual freeze if it was explicitly toggled by personal
        const userRes = await pool.query("SELECT is_frozen FROM users WHERE phone = $1", [phone]);
        return userRes.rows[0]?.is_frozen || false;
      }
    }
  }
  return false;
}

// User login
app.post("/api/auth/login", async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ error: "Telefone de celular e senha obrigatórios" });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE phone = $1", [phone]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Celular ou senha inválidos" });
    }

    const user = result.rows[0];
    if (user.password !== password) {
      return res.status(401).json({ error: "Celular ou senha inválidos" });
    }

    // Refresh online status
    await pool.query("UPDATE users SET last_active_at = NOW() WHERE phone = $1", [phone]);
    
    // Evaluate payment freezing dynamically
    const isFrozen = await handleUserStatsAndPayments(user.phone, user.is_demo, user.payment_day);
    user.is_frozen = isFrozen;

    res.json({ user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update client online action
app.post("/api/ping", async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.sendStatus(400);

  try {
    await pool.query("UPDATE users SET last_active_at = NOW() WHERE phone = $1", [phone]);
    res.sendStatus(200);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// List all users (accessible by Admin/Personal)
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY name ASC");
    
    // Calculate freezing and online properties on the fly
    const users = await Promise.all(result.rows.map(async (u) => {
      if (u.role !== "admin" && u.phone !== "41984842941" && u.phone !== "41991455646" && !u.is_demo) {
        u.is_frozen = await handleUserStatsAndPayments(u.phone, u.is_demo, u.payment_day);
      }
      
      // Determine if online (active in the last 2 minutes)
      const lastActive = new Date(u.last_active_at).getTime();
      const now = Date.now();
      u.is_online = (now - lastActive) < 120000; // 2 minutes window
      
      return u;
    }));

    res.json({ users });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Create user (Admin only)
app.post("/api/users", async (req, res) => {
  const { phone, password, name, age, weight, height, physical_issue, main_goal, is_demo, payment_day } = req.body;
  if (!phone || !password || !name) {
    return res.status(400).json({ error: "Celular, senha e nome são obrigatórios" });
  }

  try {
    const existCheck = await pool.query("SELECT * FROM users WHERE phone = $1", [phone]);
    if (existCheck.rows.length > 0) {
      return res.status(400).json({ error: "Este número de celular já está cadastrado!" });
    }

    const result = await pool.query(`
      INSERT INTO users (phone, password, name, age, weight, height, physical_issue, main_goal, role, is_demo, payment_day)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'client', $9, $10)
      RETURNING *
    `, [phone, password, name, Number(age) || 0, Number(weight) || 0, Number(height) || 0, physical_issue || '', main_goal || 'Perda de Peso', is_demo ?? true, Number(payment_day) || 10]);

    const newUser = result.rows[0];

    // Auto-create monthly payment row for complete user
    if (!newUser.is_demo) {
      const currentYearMonth = new Date().toISOString().slice(0, 7);
      await pool.query(`
        INSERT INTO payments (client_phone, month, amount, status)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (client_phone, month) DO NOTHING
      `, [newUser.phone, currentYearMonth, 150.00, 'Pendente']);
    }

    res.status(201).json({ user: newUser });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/users/:phone", async (req, res) => {
  const { phone } = req.params;
  const { name, age, weight, height, physical_issue, main_goal, is_demo, payment_day, avatar, is_frozen, role } = req.body;

  try {
    const result = await pool.query(`
      UPDATE users 
      SET 
        name = COALESCE($1, name),
        age = COALESCE($2, age),
        weight = COALESCE($3, weight),
        height = COALESCE($4, height),
        physical_issue = COALESCE($5, physical_issue),
        main_goal = COALESCE($6, main_goal),
        is_demo = COALESCE($7, is_demo),
        payment_day = COALESCE($8, payment_day),
        avatar = COALESCE($9, avatar),
        is_frozen = COALESCE($10, is_frozen),
        role = COALESCE($11, role)
      WHERE phone = $12
      RETURNING *
    `, [name, age, weight, height, physical_issue, main_goal, is_demo, payment_day, avatar, is_frozen, role, phone]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json({ user: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user
app.delete("/api/users/:phone", async (req, res) => {
  const { phone } = req.params;
  if (phone === "41984842941" || phone === "41991455646") {
    return res.status(400).json({ error: "Não é possível excluir o administrador" });
  }

  try {
    await pool.query("DELETE FROM users WHERE phone = $1", [phone]);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PHYSICAL EVALUATIONS

// List evaluations for a client
app.get("/api/users/:phone/evaluations", async (req, res) => {
  const { phone } = req.params;
  try {
    const result = await pool.query("SELECT * FROM evaluations WHERE client_phone = $1 ORDER BY eval_date DESC", [phone]);
    res.json({ evaluations: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Create physical evaluation
app.post("/api/evaluations", async (req, res) => {
  const {
    client_phone, eval_date, weight, height, neck, chest, waist, abdomen, hips,
    arm_right, arm_left, thigh_right, thigh_left, calf_right, calf_left, photo_front, photo_side
  } = req.body;

  if (!client_phone || !eval_date || !weight || !height) {
    return res.status(400).json({ error: "Telefone, data, peso e altura são obrigatórios" });
  }

  try {
    // Math formulas: 
    // IMC = weight / (height * height)
    const wtNum = Number(weight);
    const htNum = Number(height);
    const imc = wtNum / (htNum * htNum);

    // Body fat percentage calculated using Jackson-Pollock/US Navy circumferences approximation
    // Let's implement US Navy formula:
    // Navy BF% for Male: 86.010 * log10(waist - neck) - 70.041 * log10(height) + 36.76
    // Navy BF% for Female: 163.205 * log10(waist + hips - neck) - 97.684 * log10(height) - 78.387
    // To make it general & simple without gender drop-down if omitted, we'll try to find an average body fat:
    // Simple average body fat approximation incorporating neck, waist and hips:
    const n = Number(neck) || 37;
    const w = Number(waist) || 80;
    const h = Number(hips) || 90;
    const htCm = htNum * 100;
    
    // Smooth estimation
    let bodyFatVal = 0;
    if (w + h - n > 10) {
      // average calculation based on Navy standard
      bodyFatVal = 120 * Math.log10((w + h - n) / htCm) + 15;
      if (bodyFatVal < 3) bodyFatVal = 3;
      if (bodyFatVal > 50) bodyFatVal = 50;
    } else {
      // standard BMI-based formula
      bodyFatVal = (1.20 * imc) + (0.23 * 30) - 16.2; // default general approximation
    }
    const finalBodyFat = Number(bodyFatVal.toFixed(2));

    const result = await pool.query(`
      INSERT INTO evaluations (
        client_phone, eval_date, weight, height, neck, chest, waist, abdomen, hips,
        arm_right, arm_left, thigh_right, thigh_left, calf_right, calf_left, photo_front, photo_side, imc, body_fat
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *
    `, [
      client_phone, eval_date, wtNum, htNum,
      Number(neck) || 0, Number(chest) || 0, Number(waist) || 0, Number(abdomen) || 0, Number(hips) || 0,
      Number(arm_right) || 0, Number(arm_left) || 0, Number(thigh_right) || 0, Number(thigh_left) || 0,
      Number(calf_right) || 0, Number(calf_left) || 0, photo_front || null, photo_side || null,
      Number(imc.toFixed(2)), finalBodyFat
    ]);

    // Update current user's profile weight & height to match evaluation
    await pool.query("UPDATE users SET weight = $1, height = $2 WHERE phone = $3", [wtNum, htNum, client_phone]);

    res.status(201).json({ evaluation: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete evaluation
app.delete("/api/evaluations/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM evaluations WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DIETS / NUTRITION

// List diets for a client
app.get("/api/users/:phone/diets", async (req, res) => {
  const { phone } = req.params;
  try {
    const result = await pool.query("SELECT * FROM diets WHERE client_phone = $1 ORDER BY diet_date DESC", [phone]);
    res.json({ diets: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Create diet plan
app.post("/api/diets", async (req, res) => {
  const { client_phone, diet_date, title, description } = req.body;
  if (!client_phone || !diet_date || !title || !description) {
    return res.status(400).json({ error: "Telefone, data, título e descrição são obrigatórios" });
  }
  try {
    const result = await pool.query(`
      INSERT INTO diets (client_phone, diet_date, title, description)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [client_phone, diet_date, title, description]);
    res.status(201).json({ diet: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete diet plan
app.delete("/api/diets/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM diets WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// WORKOUTS / EXERCISES

// Get active exercises for a client
app.get("/api/users/:phone/workouts", async (req, res) => {
  const { phone } = req.params;
  try {
    // retrieve demo preference
    const uResult = await pool.query("SELECT is_demo FROM users WHERE phone = $1", [phone]);
    const isDemo = uResult.rows[0]?.is_demo ?? true;

    let result;
    if (isDemo) {
      // limit user demo to exactly 5 exercises
      result = await pool.query("SELECT * FROM workouts WHERE client_phone = $1 ORDER BY id ASC LIMIT 5", [phone]);
    } else {
      result = await pool.query("SELECT * FROM workouts WHERE client_phone = $1 ORDER BY id ASC", [phone]);
    }
    res.json({ workouts: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Create exercise
app.post("/api/workouts", async (req, res) => {
  const { client_phone, name, sets, reps, weight_load, video_url, notes } = req.body;
  if (!client_phone || !name || !sets || !reps) {
    return res.status(400).json({ error: "Faltando dados obrigatórios do exercício" });
  }

  try {
    // Check demo constraint for total exercises posted
    const uRes = await pool.query("SELECT is_demo FROM users WHERE phone = $1", [client_phone]);
    const isDemo = uRes.rows[0]?.is_demo ?? true;

    if (isDemo) {
      const countRes = await pool.query("SELECT COUNT(*) FROM workouts WHERE client_phone = $1", [client_phone]);
      const currentCount = parseInt(countRes.rows[0].count);
      if (currentCount >= 5) {
        return res.status(400).json({ error: "Limite de 5 exercícios atingido para alunos no plano DEMO!" });
      }
    }

    const result = await pool.query(`
      INSERT INTO workouts (client_phone, name, sets, reps, weight_load, video_url, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [client_phone, name, Number(sets), reps, weight_load || "Livre", video_url || "", notes || ""]);

    res.status(201).json({ workout: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Edit exercise
app.put("/api/workouts/:id", async (req, res) => {
  const { id } = req.params;
  const { name, sets, reps, weight_load, video_url, notes } = req.body;
  try {
    const result = await pool.query(`
      UPDATE workouts
      SET 
        name = COALESCE($1, name),
        sets = COALESCE($2, sets),
        reps = COALESCE($3, reps),
        weight_load = COALESCE($4, weight_load),
        video_url = COALESCE($5, video_url),
        notes = COALESCE($6, notes)
      WHERE id = $7
      RETURNING *
    `, [name, sets ? Number(sets) : null, reps, weight_load, video_url, notes, id]);

    res.json({ workout: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete exercise
app.delete("/api/workouts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM workouts WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// EXERCISE COMPLETION & PROGRESS GRAPH

// Mark exercise as completed
app.post("/api/workout-history", async (req, res) => {
  const { client_phone, workout_id, completed_at } = req.body;
  if (!client_phone || !workout_id) {
    return res.status(400).json({ error: "Informações inválidas para marcar conclusão" });
  }

  const logDate = completed_at || new Date().toISOString().slice(0, 10);

  try {
    // Ensure we don't log duplicate on same day for same workout
    const duplicate = await pool.query(
      "SELECT * FROM workout_history WHERE client_phone = $1 AND workout_id = $2 AND completed_at = $3",
      [client_phone, workout_id, logDate]
    );

    if (duplicate.rows.length > 0) {
      // Just return existing
      return res.json({ success: true, history: duplicate.rows[0], message: "Já concluído hoje!" });
    }

    const result = await pool.query(`
      INSERT INTO workout_history (client_phone, workout_id, completed_at)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [client_phone, workout_id, logDate]);

    res.status(201).json({ success: true, history: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get completed history stats (to build the evolution graphs)
app.get("/api/users/:phone/workout-history", async (req, res) => {
  const { phone } = req.params;
  try {
    const query = `
      SELECT h.completed_at, COUNT(*)::INTEGER as count
      FROM workout_history h
      WHERE h.client_phone = $1
      GROUP BY h.completed_at
      ORDER BY h.completed_at ASC
    `;
    const result = await pool.query(query, [phone]);
    res.json({ history: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// MESSAGES / CHANGE EXERCISE REQUESTS

// Request exchange
app.post("/api/messages", async (req, res) => {
  const { client_phone, workout_id, workout_name, reason } = req.body;
  if (!client_phone || !workout_name || !reason) {
    return res.status(400).json({ error: "Nome do exercício e motivo do cancelamento são necessários" });
  }

  try {
    const result = await pool.query(`
      INSERT INTO messages (client_phone, workout_id, workout_name, reason, status)
      VALUES ($1, $2, $3, $4, 'Pendente')
      RETURNING *
    `, [client_phone, workout_id || null, workout_name, reason]);

    res.status(201).json({ message: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// List all swap messages
app.get("/api/messages", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.*, u.name as client_name
      FROM messages m
      JOIN users u ON m.client_phone = u.phone
      ORDER BY m.created_at DESC
    `);
    res.json({ messages: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Resolve message status
app.put("/api/messages/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'Resolvido' or 'Pendente'
  try {
    const result = await pool.query(`
      UPDATE messages
      SET status = $1
      WHERE id = $2
      RETURNING *
    `, [status || 'Resolvido', id]);

    res.json({ message: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// FINANCEIRO / CASH FLOW & STATS

// List current monthly dues/payments of all completo users
app.get("/api/finance/payments", async (req, res) => {
  const currentYearMonth = new Date().toISOString().slice(0, 7);
  try {
    // 1. Fetch all non-demo clients who have payment days
    const cliRes = await pool.query("SELECT phone, name, payment_day FROM users WHERE role = 'client' AND is_demo = FALSE");
    
    // 2. Ensure monthly invoices exist for all complete clients
    for (const client of cliRes.rows) {
      await pool.query(`
        INSERT INTO payments (client_phone, month, amount, status)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (client_phone, month) DO NOTHING
      `, [client.phone, currentYearMonth, 150.00, 'Pendente']);
    }

    // 3. Select all payment invoice items for current dashboard
    const listRes = await pool.query(`
      SELECT p.*, u.name as client_name, u.payment_day
      FROM payments p
      JOIN users u ON p.client_phone = u.phone
      ORDER BY u.name ASC
    `);

    res.json({ payments: listRes.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Put status update (checkbox toggler)
app.put("/api/payments/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'Pago' or 'Pendente'
  
  try {
    const paidAt = status === 'Pago' ? 'NOW()' : 'NULL';
    const result = await pool.query(`
      UPDATE payments
      SET 
        status = $1,
        paid_at = ${paidAt}
      WHERE id = $2
      RETURNING *
    `, [status, id]);

    const updatedPayment = result.rows[0];

    // If marked paid, let's clear the frozen status in case they were frozen!
    if (status === 'Pago' && updatedPayment) {
      await pool.query("UPDATE users SET is_frozen = FALSE WHERE phone = $1", [updatedPayment.client_phone]);
    }

    res.json({ payment: updatedPayment });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get total sum in cash/treasury
app.get("/api/finance/stats", async (req, res) => {
  try {
    const result = await pool.query("SELECT SUM(amount) as total FROM payments WHERE status = 'Pago'");
    const totalInBox = Number(result.rows[0]?.total || 0);
    res.json({ totalInBox });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET Settings for PIX and QR Code config
app.get("/api/settings", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM settings");
    const settings: Record<string, string> = {};
    result.rows.forEach(row => {
      settings[row.key] = row.value;
    });
    res.json({ settings });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST/PUT Settings updates (For instructor/admin config)
app.post("/api/settings", async (req, res) => {
  const { pix_key, pix_qrcode } = req.body;
  try {
    if (pix_key !== undefined) {
      await pool.query("INSERT INTO settings (key, value) VALUES ('pix_key', $1) ON CONFLICT (key) DO UPDATE SET value = $1", [pix_key]);
    }
    if (pix_qrcode !== undefined) {
      await pool.query("INSERT INTO settings (key, value) VALUES ('pix_qrcode', $1) ON CONFLICT (key) DO UPDATE SET value = $1", [pix_qrcode]);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// Fallback to Serve React Web Fronted SPA Assets
async function startServer() {
  await initializeDB();

  if (process.env.NODE_ENV !== "production") {
    // Setup Vite Dev server when not in production environment
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production build environment, serve build bundle
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Express server successfully initialized on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
