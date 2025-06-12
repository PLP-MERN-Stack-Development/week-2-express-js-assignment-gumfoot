const express = require('express');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const validateProduct = require('../middleware/validateProduct');
const { NotFoundError, ValidationError } = require('../utils/customErrors');

const router = express.Router();
let products = [];

// GET all products with filtering, search, and pagination
router.get('/', (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;

    let filteredProducts = products;

    if (category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search) {
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    res.json({
      total: filteredProducts.length,
      page: pageNum,
      limit: limitNum,
      results: paginatedProducts,
    });
  } catch (err) {
    next(err);
  }
});

// GET product stats
router.get('/stats', (req, res, next) => {
  try {
    const stats = {};
    products.forEach((product) => {
      const category = product.category.toLowerCase();
      stats[category] = (stats[category] || 0) + 1;
    });

    res.json({ totalProducts: products.length, countByCategory: stats });
  } catch (err) {
    next(err);
  }
});

// GET product by ID
router.get('/:id', auth, (req, res, next) => {
  try {
    const product = products.find((p) => p.id === req.params.id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// POST create new product
router.post('/', auth, validateProduct, (req, res, next) => {
  try {
    const { name, description, price, category, inStock } = req.body;
    const newProduct = {
      id: uuidv4(),
      name,
      description,
      price,
      category,
      inStock,
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
});

// PUT update product
router.put('/:id', auth, validateProduct, (req, res, next) => {
  try {
    const index = products.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      throw new NotFoundError('Product not found');
    }
    products[index] = { ...products[index], ...req.body };
    res.json(products[index]);
  } catch (err) {
    next(err);
  }
});

// DELETE product
router.delete('/:id', auth, (req, res, next) => {
  try {
    const index = products.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      throw new NotFoundError('Product not found');
    }
    products.splice(index, 1);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;




