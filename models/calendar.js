// models/calender.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Calendar', {
    userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
    age: { type: DataTypes.INTEGER, allowNull: false },
    gender: { type: DataTypes.TEXT, allowNull: false },
    lifeStatus: { type: DataTypes.TEXT, allowNull: false },
    availbleHPW: { type: DataTypes.TEXT, allowNull: false },
    goals: { type: DataTypes.TEXT, allowNull: false },
  }, {
    tableName: 'calendar',
    timestamps: false,
  });
};
