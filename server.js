//server.js
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

// الاتصال بقاعدة البيانات وبدء السيرفر
sequelize.sync({ alter: true }).then(() => {
  console.log('✅ Database synced.');
  app.listen(PORT, () => {
    console.log(`✔️ Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('❌ Error syncing database:', error);
});
