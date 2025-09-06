require('dotenv').config();
const app = require('./app');
const db = require('./config/database');

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

// Test database connection
db.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully');
    connection.release();
    
    // Start server
    app.listen(PORT, HOST, () => {
      console.log(`🚀 EcoFinds server running on http://${HOST}:${PORT}`);
      console.log(`📱 Environment: ${process.env.NODE_ENV}`);
    });
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⏹️ SIGTERM received, shutting down gracefully');
  db.end(() => {
    console.log('📋 Database connections closed');
    process.exit(0);
  });
});