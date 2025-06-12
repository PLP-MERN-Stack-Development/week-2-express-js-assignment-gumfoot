const express = require('express');
const bodyParser = require('body-parser');

const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(logger);
const PORT = 3000;

// Middleware
app.use(logger);              // log requests
app.use(bodyParser.json());   // parse JSON

// Routes
const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
