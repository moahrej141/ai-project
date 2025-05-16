//models/Lifestyle.js
module.exports = (sequelize, DataTypes) => {
  const Lifestyle = sequelize.define('Lifestyle', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lifeStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    goalHoursPerWeek: {
      type: DataTypes.INTEGER,
      allowNull: true, // Only required for certain lifeStatus values
    }
  });

  Lifestyle.associate = (models) => {
    Lifestyle.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Lifestyle;
};
