/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Endpoints for managing user's cart
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get all products in the user's cart
 *     description: Retrieve all products currently in the authenticated user's cart.
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of products in the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Product ID
 *                   quantity:
 *                     type: integer
 *                   size:
 *                     type: string
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add a product to the cart
 *     description: Add a new product to the authenticated user's cart or increase the quantity if it already exists.
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: The product's ID
 *               size:
 *                 type: string
 *                 description: The size of the product
 *     responses:
 *       200:
 *         description: Product added or updated in the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   size:
 *                     type: string
 *                   quantity:
 *                     type: integer
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/cart:
 *   delete:
 *     summary: Remove all products from the cart
 *     description: Remove all products from the authenticated user's cart or a specific product based on product ID and size.
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: The product's ID to be removed (optional)
 *               size:
 *                 type: string
 *                 description: The size of the product to be removed (optional)
 *     responses:
 *       200:
 *         description: Cart cleared or specific product removed
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   size:
 *                     type: string
 *                   quantity:
 *                     type: integer
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/cart/{id}:
 *   put:
 *     summary: Update quantity of a product in the cart
 *     description: Update the quantity of a product in the authenticated user's cart.
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product's ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 description: Updated quantity of the product
 *               size:
 *                 type: string
 *                 description: The size of the product
 *     responses:
 *       200:
 *         description: Product quantity updated
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   size:
 *                     type: string
 *                   quantity:
 *                     type: integer
 *       400:
 *         description: Invalid size or not enough stock
 *       404:
 *         description: Product or user not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/cart/create-single-order:
 *   post:
 *     summary: Create a single order from the cart products
 *     description: Create an order from a specific set of cart products based on their IDs and quantities.
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 productId:
 *                   type: string
 *                   description: The product's ID
 *                 quantity:
 *                   type: integer
 *                   description: The quantity of the product
 *                 size:
 *                   type: string
 *                   description: The size of the product
 *     responses:
 *       200:
 *         description: Order created from the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   quantity:
 *                     type: integer
 *                   size:
 *                     type: string
 *       500:
 *         description: Server error
 */
