const { Calendar, CalendarEvent } = require('../models');
const { generateCalendar } = require('../services/openaiService');

async function saveInputToCalendar(userId, lifestyle, goals) {
  const { age, gender, lifeStatus, availbleHPW } = lifestyle;

  if (!age || !gender || !lifeStatus || !availbleHPW) {
    throw new Error("All lifestyle fields are required.");
  }

  // حذف البيانات القديمة الخاصة بالمستخدم (اختياري)
  await Calendar.destroy({ where: { userId } });

  // إنشاء سجل جديد
  await Calendar.create({
    userId,
    age,
    gender,
    lifeStatus,
    availbleHPW,
    goals,
  });
}

async function saveCalendarEventsToDB(userId, calendar) {
  if (!Array.isArray(calendar)) {
    throw new Error("Evaluation data must be matrixed.");
  }

  // حذف الأحداث القديمة للمستخدم (اختياري)
  await CalendarEvent.destroy({ where: { userId } });

  // حفظ الأحداث الجديدة
  await CalendarEvent.bulkCreate(
    calendar.map(event => ({
      userId,
      date: event.date,
      time: event.time,
      event_name: event.event_name,
      description: event.description,
    }))
  );
}

async function generateCalendarHandler(req, res) {
  const { lifestyle, goals } = req.body;
  const userId = req.user.id;

  if (!lifestyle || !goals) {
    return res.status(400).json({ message: "Please enter your lifestyle and goals." });
  }

  try {
    await saveInputToCalendar(userId, lifestyle, goals);

    const calendar = await generateCalendar({ lifestyle, goals });

    await saveCalendarEventsToDB(userId, calendar);

    res.status(200).json({ message: "The calendar was created successfully.", calendar });
  } catch (error) {
    console.error("❌Error creating calendar:", error);
    res.status(500).json({ message: "An internal server error occurred.", error: error.message });
  }
}

async function getCalendarHandler(req, res) {
  const userId = req.user.id;

  try {
    const calendar = await CalendarEvent.findAll({
      where: { userId },
      order: [['date', 'ASC'], ['time', 'ASC']],
    });

    if (!calendar || calendar.length === 0) {
      return res.status(404).json({ message: "There are no events in the calendar." });
    }

    res.status(200).json({ calendar });
  } catch (error) {
    console.error("❌ Error fetching calendar:", error);
    res.status(500).json({ message: "An internal server error occurred." });
  }
}

module.exports = {
  generateCalendarHandler,
  getCalendarHandler,
};
