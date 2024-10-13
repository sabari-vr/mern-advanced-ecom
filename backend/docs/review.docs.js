/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Endpoints for managing product reviews
 */

/**
 * @swagger
 * /api/review/get-order/{id}:
 *   get:
 *     summary: Get order by ID for review
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the order to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the order
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/review/{productId}:
 *   get:
 *     summary: Get reviews by product ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: ID of the product to retrieve reviews for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved reviews
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/review:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: The ID of the product being reviewed
 *               rating:
 *                 type: integer
 *                 description: Rating given to the product
 *               review:
 *                 type: string
 *                 description: Review text
 *     responses:
 *       201:
 *         description: Successfully created the review
 *       400:
 *         description: Bad request, missing required fields
 *       401:
 *         description: Unauthorized, user not found
 *       500:
 *         description: Server error
 */
