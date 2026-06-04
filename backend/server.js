const dotenv = require('dotenv');

// Load environment variables FIRST before any other imports
dotenv.config();

const connectDB = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 5000;

/**
 * Start the server
 * Connects to MongoDB first, then starts HTTP server
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    const launchServer = (port, attempt = 1) => {
      const server = app.listen(port, () => {
        console.log('');
        console.log('🏛️  ========================================');
        console.log('   Public Grievance Management System');
        console.log('   ========================================');
        console.log(`🚀 Server running in ${process.env.NODE_ENV} mode`);
        console.log(`📡 API available at: http://localhost:${port}/api`);
        console.log(`❤️  Health check: http://localhost:${port}/api/health`);
        console.log('   ========================================');
        console.log('');
      });

      server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
          if (attempt < 3) {
            const fallbackPort = Number(port) + 1;
            console.warn(`❌ Port ${port} is already in use. Trying fallback port ${fallbackPort}...`);
            launchServer(fallbackPort, attempt + 1);
            return;
          }

          console.error(`❌ Port ${port} is already in use. Stop the process using this port or set a different PORT in backend/.env.`);
        } else {
          console.error('❌ Server error:', error);
        }
        process.exit(1);
      });
    };

    launchServer(PORT);

    // ─── Graceful Shutdown ─────────────────────────────────────────────────

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('❌ Unhandled Promise Rejection:', err.message);
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error('❌ Uncaught Exception:', err.message);
      process.exit(1);
    });

    // Handle SIGTERM signal (e.g., from Docker or cloud platforms)
    process.on('SIGTERM', () => {
      console.log('📴 SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('💤 Server closed.');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
