/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Endpoints for managing payments and orders
 */

/**
 * @swagger
 * /api/payment/order:
 *   post:
 *     summary: Create an Order
 *     description: Creates a new order and initiates payment processing with Razorpay.
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The total amount for the order.
 *               itemsInCart:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: ID of the product.
 *                     name:
 *                       type: string
 *                       description: Name of the product.
 *                     size:
 *                       type: string
 *                       description: Size of the product.
 *                     color:
 *                       type: string
 *                       description: Color of the product.
 *                     quantity:
 *                       type: integer
 *                       description: Quantity of the product.
 *                     price:
 *                       type: number
 *                       description: Price of the product.
 *     responses:
 *       200:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID of the created order.
 *                     amount:
 *                       type: number
 *                       description: Total amount for the order.
 *                     currency:
 *                       type: string
 *                       description: Currency used for the order.
 *       404:
 *         description: Product not found or invalid size
 *       400:
 *         description: Insufficient stock for product or invalid data
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/payment/verify:
 *   post:
 *     summary: Verify Payment
 *     description: Verify the payment made for an order and finalize the order creation.
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               razorpay_order_id:
 *                 type: string
 *                 description: Razorpay order ID.
 *               razorpay_payment_id:
 *                 type: string
 *                 description: Razorpay payment ID.
 *               razorpay_signature:
 *                 type: string
 *                 description: Razorpay signature to verify payment authenticity.
 *               itemsInCart:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: ID of the product.
 *                     name:
 *                       type: string
 *                       description: Name of the product.
 *                     size:
 *                       type: string
 *                       description: Size of the product.
 *                     color:
 *                       type: string
 *                       description: Color of the product.
 *                     quantity:
 *                       type: integer
 *                       description: Quantity of the product.
 *                     price:
 *                       type: number
 *                       description: Price of the product.
 *               deliveryAddress:
 *                 type: string
 *                 description: Delivery address for the order.
 *               clearCart:
 *                 type: boolean
 *                 description: Indicates if the cart should be cleared after the order.
 *     responses:
 *       201:
 *         description: Payment verified and order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 orderId:
 *                   type: string
 *       400:
 *         description: Invalid signature or order not found
 *       500:
 *         description: Internal Server Error
 */
