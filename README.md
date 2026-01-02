# 🔍 AI Workflow Monitor

**Enterprise SaaS for AI Reliability Testing & Monitoring**

Stop broken AI workflows. Version control your prompts. Ensure consistency across model updates.

## 🎯 Problem We Solve

Based on real Reddit feedback (6,135 upvotes):
- AI workflows break constantly between model versions
- No way to test consistency and reliability
- Zero audit trail for AI decisions
- Companies paying consultants to fix broken implementations

## 💡 Solution

AI Workflow Monitor provides:
- ✅ **Version Control** for AI prompts
- ✅ **Regression Testing** for LLM outputs
- ✅ **Consistency Scoring** across runs
- ✅ **Audit Trails** for compliance
- ✅ **Performance Monitoring** over time

## 🚀 Features

### Core Capabilities

**Workflow Management**
- Create and manage AI workflows
- Version control for prompts
- Multi-model support (GPT, Gemini, Llama, etc.)

**Testing & Validation**
- Automated test case execution
- Consistency scoring algorithm
- Pass/fail criteria
- Execution time tracking

**Monitoring & Analytics**
- Real-time dashboard
- Historical performance data
- Trend analysis
- Alert system (coming soon)

**Audit & Compliance**
- Complete audit logs
- User action tracking
- Workflow change history
- Export capabilities

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- SQL.js (SQLite in JavaScript)
- JWT authentication
- bcrypt password hashing

**Frontend:**
- Vanilla JavaScript
- Modern CSS
- Responsive design

**AI Integration:**
- OpenRouter API
- Support for multiple models
- Free tier available

## 📊 Database Schema

```sql
-- Users
users (id, email, password, company, plan, created_at)

-- Workflows
workflows (id, user_id, name, description, model, prompt_template, test_cases, created_at)

-- Test Runs
test_runs (id, workflow_id, model, prompt, expected_output, actual_output, consistency_score, passed, execution_time, created_at)

-- Audit Logs
audit_logs (id, workflow_id, user_id, action, details, created_at)

-- Prompt Versions
prompt_versions (id, workflow_id, version, prompt, model, performance_score, created_at)
```

## 🚀 Quick Start

### Installation

```bash
git clone https://github.com/Ash-neon/ai-workflow-monitor.git
cd ai-workflow-monitor
npm install
npm start
```

Open browser to `http://localhost:3000`

### Environment Variables

```bash
# Required for production
JWT_SECRET=your-secret-key-here

# Optional: For better AI testing
OPENROUTER_API_KEY=your-openrouter-key

# Port
PORT=3000
```

## 📖 API Documentation

### Authentication

**Register:**
```bash
POST /api/auth/register
{
  "email": "user@company.com",
  "password": "password123",
  "company": "Acme Corp"
}
```

**Login:**
```bash
POST /api/auth/login
{
  "email": "user@company.com",
  "password": "password123"
}
```

### Workflows

**Create Workflow:**
```bash
POST /api/workflows
Authorization: Bearer <token>
{
  "name": "Customer Support Bot",
  "description": "Handles customer inquiries",
  "model": "gpt-4",
  "promptTemplate": "You are a helpful assistant...",
  "testCases": [
    {
      "name": "Greeting Test",
      "prompt": "Hello",
      "expectedOutput": "greeting response"
    }
  ]
}
```

**List Workflows:**
```bash
GET /api/workflows
Authorization: Bearer <token>
```

**Run Tests:**
```bash
POST /api/workflows/:id/test
Authorization: Bearer <token>
```

**Get Test History:**
```bash
GET /api/workflows/:id/history
Authorization: Bearer <token>
```

**Get Prompt Versions:**
```bash
GET /api/workflows/:id/versions
Authorization: Bearer <token>
```

### Dashboard

**Get Stats:**
```bash
GET /api/dashboard/stats
Authorization: Bearer <token>
```

## 💰 Pricing (Coming Soon)

**Free Tier:**
- 3 workflows
- 100 tests/month
- 7-day history
- Community support

**Pro ($49/month):**
- Unlimited workflows
- 10,000 tests/month
- 90-day history
- Email support
- Advanced analytics

**Enterprise (Custom):**
- Unlimited everything
- Custom retention
- Priority support
- On-premise deployment
- SLA guarantees

## 🎯 Use Cases

### For AI Engineers
- Test prompt changes before deployment
- Monitor model performance over time
- Catch regressions early

### For Product Teams
- Validate AI features work consistently
- Track quality metrics
- Ensure user experience

### For Compliance Teams
- Audit AI decision-making
- Track all changes
- Export reports

### For DevOps
- CI/CD integration
- Automated testing
- Performance monitoring

## 🔧 Development

```bash
# Install dependencies
npm install

# Run in development
npm run dev

# Run tests (coming soon)
npm test
```

## 🌐 Deployment

### Railway
```bash
# Connect GitHub repo
# Railway auto-detects and deploys
```

### Docker
```bash
docker build -t ai-workflow-monitor .
docker run -p 3000:3000 ai-workflow-monitor
```

### Vercel/Render
- Connect GitHub repository
- Set environment variables
- Deploy

## 📈 Roadmap

- [ ] Email notifications
- [ ] Slack integration
- [ ] CI/CD webhooks
- [ ] Advanced analytics
- [ ] Team collaboration
- [ ] API rate limiting
- [ ] Multi-region support
- [ ] Custom model integration
- [ ] Export to CSV/PDF
- [ ] Scheduled testing

## 🤝 Contributing

Pull requests welcome! For major changes, open an issue first.

## 📝 License

MIT

## 🔗 Links

- **GitHub:** https://github.com/Ash-neon/ai-workflow-monitor
- **Documentation:** Coming soon
- **Support:** GitHub Issues

---

**Built to solve real problems from the AI community**

Based on feedback from 6,135+ developers experiencing AI reliability issues.