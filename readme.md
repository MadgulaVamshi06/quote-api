# Quote API 

## Run
```bash
npm install
npm start
```

## Config
- PORT (default 3000)
- RATE_LIMIT_COUNT (default 5)
- RATE_WINDOW_MS (default 60000)

## Endpoints

### GET /api/quote
Returns a random inspirational quote.

Response:
```json
{ "quote": "..." }
```

If rate limit exceeded:
```json
{ "error": "Rate limit exceeded. Try again in X seconds." }
```

### Swagger Docs
Visit [https://quote-api-qyjl.onrender.com/docs/](https://quote-api-qyjl.onrender.com/docs/) for interactive API documentation.

## Example
```bash
curl https://quote-api-qyjl.onrender.com/api/quote
```
