/**
 * @swagger
 * tags:
 *   name: User
 *   description: Endpoints for managing user addresses and wishlists
 */

/**
 * @swagger
 * /api/user/address:
 *   get:
 *     summary: Get all addresses for the logged-in user
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved addresses
 *       500:
 *         description: Error fetching addresses
 */

/**
 * @swagger
 * /api/user/address:
 *   post:
 *     summary: Create a new address for the logged-in user
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *                 example: "123 Street"
 *               city:
 *                 type: string
 *                 example: "New York"
 *               country:
 *                 type: string
 *                 example: "USA"
 *               pincode:
 *                 type: string
 *                 example: "10001"
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               contact:
 *                 type: string
 *                 example: "1234567890"
 *     responses:
 *       201:
 *         description: Successfully created address
 *       400:
 *         description: Error creating address
 */

/**
 * @swagger
 * /api/user/address/{id}:
 *   put:
 *     summary: Update an existing address for the logged-in user
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the address to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *               pincode:
 *                 type: string
 *               name:
 *                 type: string
 *               contact:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated address
 *       404:
 *         description: Address not found or not authorized
 *       400:
 *         description: Error updating address
 */

/**
 * @swagger
 * /api/user/address/{id}:
 *   delete:
 *     summary: Delete an address for the logged-in user
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the address to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       404:
 *         description: Address not found or not authorized
 *       400:
 *         description: Error deleting address
 */

/**
 * @swagger
 * /api/user/wishlist:
 *   get:
 *     summary: Get the user's wishlist
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved wishlist
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/user/wishlist/toggle:
 *   post:
 *     summary: Toggle a product's presence in the user's wishlist
 *     tags: [User]
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
 *     responses:
 *       200:
 *         description: Product removed from wishlist
 *       201:
 *         description: Product added to wishlist
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
