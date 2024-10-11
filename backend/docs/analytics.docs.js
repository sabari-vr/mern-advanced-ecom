/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Endpoints for analytics
 */

/**
 * @swagger
 * /api/auth/get-analytics-data:
 *   get:
 *     summary: Retrieve analytics data and daily sales data
 *     description: This endpoint provides overall analytics data and sales data for the past 7 days. It is protected and requires admin access.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved analytics and sales data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 analyticsData:
 *                   type: object
 *                   description: General analytics data
 *                 dailySalesData:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Daily sales data for the past 7 days
 *       500:
 *         description: Server error
 */
