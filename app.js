//app.js
const express = require('express');
const app = express();
require('dotenv').config();

// استيراد الراوت الخاص بالمستخدمين
const userRoutes = require('./routes/userRoutes');
const lifestyleRoutes = require('./routes/lifestyleRoutes');
const goalRoutes = require('./routes/goalRoutes');
const calendarRoutes = require('./routes/calendarRoutes');  // Import calendarRoutes



// Middleware لتحليل JSON
app.use(express.json());

// راوت تجريبي للتأكد أن السيرفر يعمل
app.get('/', (req, res) => {
  res.send('Hello, World!');
});
// معالجة الأخطاء المركزية
app.use((err, req, res, next) => {
  console.error('❌ خطأ:', err.stack || err);

  res.status(err.status || 500).json({
    message: err.message || 'حدث خطأ في الخادم الداخلي.',
  });
});

// استخدام راوت المستخدمين
app.use('/api/users', userRoutes);
app.use('/api/users', lifestyleRoutes);
app.use('/api', goalRoutes);
app.use('/api/calendar', calendarRoutes);

module.exports = app;

