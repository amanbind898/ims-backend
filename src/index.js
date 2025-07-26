import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from './middlewares/auth.middleware.js';
import cors from 'cors';
const prisma = new PrismaClient();


dotenv.config();

const app = express();
app.use(cors());

const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Inventory Management API is running.');
});
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered
 *       400:
 *         description: Bad input or user already exists
 */

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
if(!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  const existingUser = await prisma.user.findUnique({
    where: { username },
  });
  if (existingUser) {
    return res.status(400).json({ message: 'Username already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const newUser = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });
  if (!newUser) {
    return res.status(500).json({ message: 'Error creating user' });
  }

  
  res.status(201).json({
    message: 'User registered successfully',
    username
  });
});
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login and receive a JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  const user = await prisma.user.findUnique({
    where: { username },
  });
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  if (!token) {
    return res.status(500).json({ message: 'Error generating token' });
  }
  res.status(200).json({
    message: 'Login successful',
    token,
    username
  });
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - sku
 *               - image_url
 *               - description
 *               - quantity
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               sku:
 *                 type: string
 *               image_url:
 *                 type: string
 *               description:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product added
 *       401:
 *         description: Unauthorized
 */

app.post('/products', verifyToken, async (req, res) => {
  const { name, type, sku, image_url, description, quantity, price } = req.body;

  if (!name || !type || !sku || !image_url || !description || !price || !quantity) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        type,
        sku,
        image_url,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity, 10),
      },
    });

    res.status(201).json({
      message: 'Product added successfully',
      product: newProduct,
      product_id: newProduct.id 
    });
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ message: 'Error adding product' });
  }
});
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products (paginated)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *     responses:
 *       200:
 *         description: List of products
 *       401:
 *         description: Unauthorized
 */

app.get('/products', verifyToken, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const products = await prisma.product.findMany({
      skip,
      take: limit,
      orderBy: { id: 'asc' },
    });

    res.status(200).json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Error fetching products' });
  }
});
/**
 * @swagger
 * /products/{id}/quantity:
 *   put:
 *     summary: Update product quantity
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product quantity updated
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

app.put('/products/:id/quantity', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (typeof quantity !== 'number' || quantity < 0) {
    return res.status(400).json({ message: 'Invalid quantity' });
  }

  try {
    const product = await prisma.product.update({
      where: { id: parseInt(id, 10) },
      data: { quantity },
    });

    res.status(200).json({
      message: 'Product quantity updated successfully',
      product,
    });
  } catch (err) {
    console.error('Error updating product quantity:', err);
    res.status(500).json({ message: 'Error updating product quantity' });
  }
});



import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Inventory Management API',
      version: '1.0.0',
      description: 'Backend APIs for user authentication and inventory management',
    },
    servers: [
      {
        url: 'http://localhost:8080',
      },
    ],
    components: { 
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/index.js'],
};


const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
