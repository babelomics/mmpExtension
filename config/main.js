module.exports = {
  // Secret key for JWT signing and encryption
  secret: 'My_Secret_KEY',
  // Database connection information
  database: 'mongodb://mongo:27017/MMP-Extension',
  // host
  host: process.env.HOST || 'localhost',
  // Setting port for server
  port: process.env.PORT || 3000,
};
