import express from 'express';
import cors from 'cors';
import { config } from './src/config/index.js';
import apiRoutes from './src/routes/index.js';

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Health Check
app.get('/health', (req, res) => res.json({ status: 'Healthy', timestamp: new Date().toISOString() }));

// Swagger UI Documentation Endpoint
const swaggerHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>TalentPulse AI - Swagger API Documentation</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
  <style>
    body { margin: 0; background: #0b0f19; color: #fff; }
    .swagger-ui .topbar { display: none; }
    .swagger-ui { background: #0b0f19; filter: invert(0.88) hue-rotate(180deg); }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
  <script>
    const spec = {
      openapi: "3.0.0",
      info: { title: "TalentPulse Job Portal API", version: "1.0.0", description: "SOLID Architecture Web API REST endpoints" },
      paths: {
        "/api/jobs": {
          get: { summary: "Get published jobs list", responses: { "200": { description: "Success" } } },
          post: { summary: "Create new job opportunity", responses: { "201": { description: "Job created" } } }
        },
        "/api/admin/pending-employers": {
          get: { summary: "Get pending employer account approvals", responses: { "200": { description: "Success" } } }
        },
        "/api/admin/approve-employer/{id}": {
          post: { summary: "Approve employer registration", responses: { "200": { description: "Success" } } }
        },
        "/api/admin/pending-jobs": {
          get: { summary: "Get pending job posting quality queue", responses: { "200": { description: "Success" } } }
        },
        "/api/admin/approve-job/{id}": {
          post: { summary: "Publish pending job post", responses: { "200": { description: "Success" } } }
        },
        "/api/applications/apply": {
          post: { summary: "Submit job application with AI NLP Match Score", responses: { "200": { description: "Success" } } }
        },
        "/api/applications/job/{jobId}": {
          get: { summary: "Get applicants for job ranked by AI fit score", responses: { "200": { description: "Success" } } }
        }
      }
    };
    window.onload = () => {
      SwaggerUIBundle({ spec: spec, dom_id: '#swagger-ui' });
    };
  </script>
</body>
</html>
`;

app.get('/swagger', (req, res) => res.send(swaggerHtml));
app.get('/swagger/index.html', (req, res) => res.send(swaggerHtml));
app.get('/', (req, res) => res.redirect('/swagger'));

// Start Server
app.listen(config.port, () => {
  console.log(`=======================================================`);
  console.log(`🚀 TalentPulse AI API Server running on port ${config.port}`);
  console.log(`   Swagger UI active at http://localhost:${config.port}/swagger`);
  console.log(`=======================================================`);
});
