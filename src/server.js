const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
// const logger = require("./config/logger");
const fs = require("fs");
const { authMiddleware, isAdmin } = require('./middleware/authMiddleware');
dotenv.config();
const app = express();
const http = require("http");
const { initSocket } = require("./config/socket");
// const { prisma, connectDB } = require('./config/dbConnect');

const server = http.createServer(app);
// const io = initSocket(server); 
// app.set("io", io);

/* middleware */
app.use(bodyParser.json());
app.use(cookieParser());

/* routes */
const authRoutes = require('./modules/auth/auth.route');
const chUserRoutes = require('./modules/control-panel/user/user.route');
const chProductRoutes = require('./modules/control-panel/product/product.route');
const chCategoryRoutes = require('./modules/control-panel/category/category.route');
const chOrderRoutes = require('./modules/control-panel/order/order.route');
const waProductRoutes = require('./modules/web-app/product/product.route');
const waCategoryRoutes = require('./modules/web-app/category/category.route');
const waOrderRoutes = require('./modules/web-app/order/order.route');
const waPaymentRoutes = require('./modules/web-app/payment/payment.route');

/* authentication */
app.use('/api/auth', authRoutes);

/* control hub */
app.use('/api/ch/users', authMiddleware, isAdmin, chUserRoutes);
app.use('/api/ch/products', authMiddleware, isAdmin, chProductRoutes);
app.use('/api/ch/category', authMiddleware, isAdmin, chCategoryRoutes);
app.use('/api/ch/order', authMiddleware, isAdmin, chOrderRoutes);

/* web app */
app.use('/api/wa/products', waProductRoutes);
app.use('/api/wa/category', waCategoryRoutes);
app.use('/api/wa/order', waOrderRoutes);
app.use('/api/wa/payment', waPaymentRoutes);


app.get("/", (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Home</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
            }
            button {
              padding: 10px 16px;
              font-size: 16px;
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <h1>Home Page</h1>
          <p>Server is running successfully 🚀</p>
          <button onclick="window.location.href='/more'">
            Go to More Page
          </button>
        </body>
      </html>
    `);
  });
  
  /**
   * More page
   */
  app.get("/more", (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>More</title>
        </head>
        <body>
          <h1>More Page</h1>
          <p>This is another route.</p>
          <a href="/">⬅ Back to Home</a>
        </body>
      </html>
    `);
  });


/* error handler */
app.use((err, req, res, next) => {
    // logger.error(
    //     {
    //         method: req.method,
    //         url: req.originalUrl,
    //         stack: err.stack,
    //     },
    //     err.message
    // );
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        stack: err?.stack
    });
});

// process.on("unhandledRejection", (reason) => {
//     logger.error(reason, "Unhandled Promise Rejection");
// });

// process.on("uncaughtException", (err) => {
//     logger.fatal(err, "Uncaught Exception");
// });


// /* graceful shutdown */
// process.on('SIGINT', async () => {
//     await prisma.$disconnect();
//     process.exit(0);
// });

// process.on('SIGTERM', async () => {
//     await prisma.$disconnect();
//     process.exit(0);
// });

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '127.0.0.1';

async function startServer() {
    try {
    //   await connectDB();
  
      server.listen(PORT, HOST,() => {
        console.log(`Server running on port ${PORT}`);
      });
    } catch (err) {
    //   logger.fatal(err, "Failed to start server");
    //   process.exit(1);
    }
  }
  
  startServer();

