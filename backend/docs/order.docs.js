/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Endpoints for managing user orders
 */

/**
 * @swagger
 * /api/orders/getAllOrders:
 *   get:
 *     summary: Get all orders
 *     description: Retrieve all orders in the system. Accessible only to admin users.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Order ID
 *                       userId:
 *                         type: string
 *                         description: ID of the user who placed the order
 *                       orderStatus:
 *                         type: string
 *                         description: Current status of the order
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Date and time when the order was created
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalOrders:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                     hasNextPage:
 *                       type: boolean
 *                     hasPreviousPage:
 *                       type: boolean
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get my orders
 *     description: Retrieve all orders placed by the authenticated user.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Order ID
 *                       orderStatus:
 *                         type: string
 *                         description: Current status of the order
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Date and time when the order was created
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalOrders:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                     hasNextPage:
 *                       type: boolean
 *                     hasPreviousPage:
 *                       type: boolean
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/orders/cancel/{id}:
 *   patch:
 *     summary: Cancel an order
 *     description: Cancel a specific order by its ID.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to be cancelled
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 order:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     orderStatus:
 *                       type: string
 *       404:
 *         description: Order not found
 *       400:
 *         description: Order is already cancelled
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/orders/update-status/{id}:
 *   patch:
 *     summary: Update order status
 *     description: Update the status of a specific order by its ID.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: New status for the order (processing, shipped, delivered, cancelled, returned, refunded)
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 order:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     orderStatus:
 *                       type: string
 *       400:
 *         description: Invalid status provided
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
