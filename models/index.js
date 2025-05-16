// models/index.js
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// ✅ إنشاء اتصال Sequelize مع MySQL
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false, // يمكنك تفعيلها أثناء التطوير
  }
);

// 📦 كائن لتجميع كل النماذج والاتصال
const db = {
  Sequelize,
  sequelize,
};

// ✅ استيراد النماذج
db.User = require('./User')(sequelize, DataTypes);
db.Lifestyle = require('./Lifestyle')(sequelize, DataTypes);
db.Goal = require('./goal')(sequelize, DataTypes);
db.Calendar = require('./calendar')(sequelize, DataTypes);
db.CalendarEvent = require('./calendarEvent')(sequelize, DataTypes); // ← أضفه

// ✅ تفعيل العلاقات (associations) إن وُجدت في كل موديل
Object.values(db).forEach((model) => {
  if (model.associate) {
    model.associate(db);
  }
});

module.exports = db;
