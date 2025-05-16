module.exports = (sequelize, DataTypes) => {
  const CalendarEvent = sequelize.define('CalendarEvent', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false
    },
    event_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    category: {
      type: DataTypes.STRING,  // ممكن يكون STRING أو ENUM لو حابب تخصص الفئات
      allowNull: true          // لو مش ضروري، خليها true
    }
  }, {
    tableName: 'CalendarEvents',
    timestamps: false
  });

  CalendarEvent.associate = (models) => {
    CalendarEvent.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return CalendarEvent;
};
