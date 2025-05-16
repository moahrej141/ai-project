//models/goal.js
module.exports = (sequelize, DataTypes) => {
  const Goal = sequelize.define('Goal', {
    goalName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    targetDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
        userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  return Goal;
};