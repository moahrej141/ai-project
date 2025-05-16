require('dotenv').config();
const { OpenAI } = require('openai');

// دالة البيانات الوهمية
async function generateCalendarMock({ lifestyle, goals }) {
  return [
    {
      date: "2025-05-16",
      time: "09:00",
      event_name: "تمرين صباحي",
      description: "تمرين لمدة 30 دقيقة"
    },
    {
      date: "2025-05-16",
      time: "14:00",
      event_name: "وقت الدراسة",
      description: "مذاكرة لمدة ساعتين"
    }
  ];
}

// دالة لإخفاء جزء من المفتاح عند الطباعة
function maskKey(key) {
  if (!key) return '';
  return key.slice(0, 4) + '...' + key.slice(-4);
}

let openai = null;

if (process.env.OPENAI_API_KEY) {
  console.log(`🔐 OpenAI key loaded (${maskKey(process.env.OPENAI_API_KEY)})`);
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
} else {
  console.warn('⚠️ The OPENAI API KEY does not exist. Dummy data will be used instead to connect to OpenAI.');
}

/**
 * generateCalendar
 * ----------------
 * يُنشئ جدولًا أسبوعيًا (7 أيام) بصيغة JSON اعتمادًا على
 * نمط حياة المستخدم وأهدافه.
 *
 * @param {Object}  userData              - بيانات المستخدم
 * @param {string}  userData.lifestyle    - وصف نمط الحياة
 * @param {string}  userData.goals        - وصف الأهداف
 * @returns {Array} مصفوفة أحداث التقويم
 */
async function generateCalendar({ lifestyle, goals }) {
  // لو المفتاح غير موجود، نرجع البيانات الوهمية مباشرة
  if (!openai) {
    return generateCalendarMock({ lifestyle, goals });
  }

  const prompt = `
You are an assistant that plans personalized weekly schedules.

INSTRUCTIONS:
• Produce exactly **7 days** of events.
• Return **only** valid JSON (no markdown back‑ticks or commentary).
• Each event object must contain:
  - "date"   (YYYY‑MM‑DD)
  - "time"   (HH:MM, 24‑hour)
  - "event_name"
  - "description"

USER PROFILE
------------
Lifestyle: ${lifestyle}
Goals: ${goals}

OUTPUT:
Return a JSON array of events sorted by date & time. Example:
[
  { "date":"2025-05-19","time":"07:00","event_name":"Morning Run","description":"5 km run around the park" },
  ...
]
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 800
    });

    const raw = response.choices[0].message.content.trim();

    // استخراج أول "[" وآخر "]" لضمان JSON صالح
    const start = raw.indexOf('[');
    const end = raw.lastIndexOf(']') + 1;
    if (start === -1 || end === 0) {
      throw new Error('الاستجابة لا تحتوي على JSON صالح.');
    }

    const jsonText = raw.slice(start, end);
    const calendar = JSON.parse(jsonText);

    if (!Array.isArray(calendar) || calendar.length === 0) {
      throw new Error('الجدول المولّد فارغ أو ليس مصفوفة.');
    }

    return calendar;

  } catch (err) {
    console.error('❌ خطأ في توليد التقويم من OpenAI:', err);
    throw new Error('فشل توليد التقويم. الرجاء المحاولة لاحقًا.');
  }
}

module.exports = { generateCalendar };
