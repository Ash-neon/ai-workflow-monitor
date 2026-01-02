const express = require('express');
const cors = require('cors');
const axios = require('axios');
const initSqlJs = require('sql.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Initialize Database
let db;
const dbPath = path.join(__dirname, 'workflow-monitor.db');

async function initDatabase() {
  const SQL = await initSqlJs();
  
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      password TEXT,
      company TEXT,
      plan TEXT DEFAULT 'free',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Workflows table
  db.run(`
    CREATE TABLE IF NOT EXISTS workflows (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      name TEXT,
      description TEXT,
      model TEXT,
      prompt_template TEXT,
      test_cases TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);
  
  // Test runs table
  db.run(`
    CREATE TABLE IF NOT EXISTS test_runs (
      id TEXT PRIMARY KEY,
      workflow_id TEXT,
      model TEXT,
      prompt TEXT,
      expected_output TEXT,
      actual_output TEXT,
      consistency_score REAL,
      passed INTEGER,
      execution_time INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(workflow_id) REFERENCES workflows(id)
    )
  `);
  
  // Audit logs table
  db.run(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      workflow_id TEXT,
      user_id TEXT,
      action TEXT,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(workflow_id) REFERENCES workflows(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);
  
  // Prompt versions table
  db.run(`
    CREATE TABLE IF NOT EXISTS prompt_versions (
      id TEXT PRIMARY KEY,
      workflow_id TEXT,
      version INTEGER,
      prompt TEXT,
      model TEXT,
      performance_score REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(workflow_id) REFERENCES workflows(id)
    )
  `);
  
  saveDatabase();
}

function saveDatabase() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

// Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access denied' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// AI Testing Functions
async function testAIWorkflow(model, prompt, expectedOutput) {
  const startTime = Date.now();
  
  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: model || 'google/gemini-2.0-flash-exp:free',
      messages: [{ role: 'user', content: prompt }]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY || 'sk-or-v1-free'}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://github.com/Ash-neon/ai-workflow-monitor',
        'X-Title': 'AI Workflow Monitor'
      },
      timeout: 30000
    });
    
    const actualOutput = response.data.choices[0].message.content;
    const executionTime = Date.now() - startTime;
    
    // Calculate consistency score
    const consistencyScore = calculateConsistency(expectedOutput, actualOutput);
    const passed = consistencyScore >= 0.7;
    
    return {
      actualOutput,
      consistencyScore,
      passed,
      executionTime
    };
  } catch (error) {
    return {
      actualOutput: `Error: ${error.message}`,
      consistencyScore: 0,
      passed: false,
      executionTime: Date.now() - startTime
    };
  }
}

function calculateConsistency(expected, actual) {
  if (!expected || !actual) return 0;
  
  const expectedLower = expected.toLowerCase();
  const actualLower = actual.toLowerCase();
  
  // Simple similarity check (can be enhanced with better algorithms)
  const expectedWords = expectedLower.split(/\s+/);
  const actualWords = actualLower.split(/\s+/);
  
  let matches = 0;
  expectedWords.forEach(word => {
    if (actualWords.includes(word)) matches++;
  });
  
  return matches / expectedWords.length;
}

// API Endpoints

// Auth endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, company } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    
    db.run(
      'INSERT INTO users (id, email, password, company, plan) VALUES (?, ?, ?, ?, ?)',
      [userId, email, hashedPassword, company || '', 'free']
    );
    
    saveDatabase();
    
    const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ success: true, token, userId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    stmt.bind([email]);
    
    if (!stmt.step()) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = stmt.getAsObject();
    stmt.free();
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ success: true, token, userId: user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Workflow endpoints
app.post('/api/workflows', authenticateToken, (req, res) => {
  try {
    const { name, description, model, promptTemplate, testCases } = req.body;
    const workflowId = uuidv4();
    
    db.run(
      'INSERT INTO workflows (id, user_id, name, description, model, prompt_template, test_cases) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [workflowId, req.user.userId, name, description, model, promptTemplate, JSON.stringify(testCases)]
    );
    
    // Create initial version
    db.run(
      'INSERT INTO prompt_versions (id, workflow_id, version, prompt, model) VALUES (?, ?, ?, ?, ?)',
      [uuidv4(), workflowId, 1, promptTemplate, model]
    );
    
    // Audit log
    db.run(
      'INSERT INTO audit_logs (id, workflow_id, user_id, action, details) VALUES (?, ?, ?, ?, ?)',
      [uuidv4(), workflowId, req.user.userId, 'workflow_created', JSON.stringify({ name })]
    );
    
    saveDatabase();
    
    res.json({ success: true, workflowId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/workflows', authenticateToken, (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM workflows WHERE user_id = ? ORDER BY created_at DESC');
    stmt.bind([req.user.userId]);
    
    const workflows = [];
    while (stmt.step()) {
      const workflow = stmt.getAsObject();
      workflow.test_cases = JSON.parse(workflow.test_cases || '[]');
      workflows.push(workflow);
    }
    stmt.free();
    
    res.json({ workflows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/workflows/:id/test', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get workflow
    const stmt = db.prepare('SELECT * FROM workflows WHERE id = ? AND user_id = ?');
    stmt.bind([id, req.user.userId]);
    
    if (!stmt.step()) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    
    const workflow = stmt.getAsObject();
    stmt.free();
    
    const testCases = JSON.parse(workflow.test_cases || '[]');
    const results = [];
    
    // Run all test cases
    for (const testCase of testCases) {
      const result = await testAIWorkflow(
        workflow.model,
        testCase.prompt || workflow.prompt_template,
        testCase.expectedOutput
      );
      
      const testRunId = uuidv4();
      db.run(
        'INSERT INTO test_runs (id, workflow_id, model, prompt, expected_output, actual_output, consistency_score, passed, execution_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [testRunId, id, workflow.model, testCase.prompt, testCase.expectedOutput, result.actualOutput, result.consistencyScore, result.passed ? 1 : 0, result.executionTime]
      );
      
      results.push({
        testCase: testCase.name,
        ...result
      });
    }
    
    // Audit log
    db.run(
      'INSERT INTO audit_logs (id, workflow_id, user_id, action, details) VALUES (?, ?, ?, ?, ?)',
      [uuidv4(), id, req.user.userId, 'test_run', JSON.stringify({ testCount: results.length })]
    );
    
    saveDatabase();
    
    const passedCount = results.filter(r => r.passed).length;
    const avgScore = results.reduce((sum, r) => sum + r.consistencyScore, 0) / results.length;
    
    res.json({
      success: true,
      results,
      summary: {
        total: results.length,
        passed: passedCount,
        failed: results.length - passedCount,
        averageScore: avgScore.toFixed(2)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/workflows/:id/history', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    
    const stmt = db.prepare('SELECT * FROM test_runs WHERE workflow_id = ? ORDER BY created_at DESC LIMIT 50');
    stmt.bind([id]);
    
    const history = [];
    while (stmt.step()) {
      history.push(stmt.getAsObject());
    }
    stmt.free();
    
    res.json({ history });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/workflows/:id/versions', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    
    const stmt = db.prepare('SELECT * FROM prompt_versions WHERE workflow_id = ? ORDER BY version DESC');
    stmt.bind([id]);
    
    const versions = [];
    while (stmt.step()) {
      versions.push(stmt.getAsObject());
    }
    stmt.free();
    
    res.json({ versions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  try {
    const getCount = (query, params = []) => {
      const stmt = db.prepare(query);
      stmt.bind(params);
      stmt.step();
      const result = stmt.getAsObject();
      stmt.free();
      return result.count || 0;
    };
    
    const stats = {
      totalWorkflows: getCount('SELECT COUNT(*) as count FROM workflows WHERE user_id = ?', [req.user.userId]),
      totalTests: getCount('SELECT COUNT(*) as count FROM test_runs WHERE workflow_id IN (SELECT id FROM workflows WHERE user_id = ?)', [req.user.userId]),
      passedTests: getCount('SELECT COUNT(*) as count FROM test_runs WHERE workflow_id IN (SELECT id FROM workflows WHERE user_id = ?) AND passed = 1', [req.user.userId]),
      failedTests: getCount('SELECT COUNT(*) as count FROM test_runs WHERE workflow_id IN (SELECT id FROM workflows WHERE user_id = ?) AND passed = 0', [req.user.userId])
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({
    status: 'operational',
    service: 'AI Workflow Monitor',
    version: '1.0.0'
  });
});

const PORT = process.env.PORT || 3000;

initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🔍 AI Workflow Monitor running on port ${PORT}`);
    console.log(`💼 Enterprise SaaS for AI reliability`);
  });
});