const express = require('express');
const rateLimiter = require('./middleware/rateLimiter');
const logger = require('./middleware/logger');
const quotes = require('./quotes');
const { swaggerUi, specs } = require('./swagger');

const PORT = process.env.PORT || 3000;
const RATE_LIMIT_COUNT = process.env.RATE_LIMIT_COUNT ? parseInt(process.env.RATE_LIMIT_COUNT, 10) : 5;
const RATE_WINDOW_MS = process.env.RATE_WINDOW_MS ? parseInt(process.env.RATE_WINDOW_MS, 10) : 60 * 1000;

const app = express();
app.set('trust proxy', true);

app.use(logger);

app.get('/', (req, res) => {
  res.json({
    message: "👋 Welcome to the Quote API!",
    endpoints: {
      randomQuote: "/api/quote",
      docs: "/docs"
    }
  });
});

/**
 * @swagger
 * /api/quote:
 *   get:
 *     summary: Get a random inspirational quote
 *     responses:
 *       200:
 *         description: A random quote
 *         content:
 *           application/json:
 *             example:
 *               quote: "The only way to do great work is to love what you do. - Steve Jobs"
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             example:
 *               error: "Rate limit exceeded. Try again in X seconds."
 */
app.get('/api/quote', rateLimiter({ windowMs: RATE_WINDOW_MS, max: RATE_LIMIT_COUNT }), (req, res) => {
  const random = quotes[Math.floor(Math.random() * quotes.length)];
  res.json({ quote: random });
});


app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Quote API listening on http://localhost:${PORT}`);
  console.log(`Rate limit: ${RATE_LIMIT_COUNT} per ${RATE_WINDOW_MS / 1000}s`);
  console.log(`Swagger docs available at http://localhost:${PORT}/docs`);
});
