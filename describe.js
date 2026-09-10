const db = require('./backend/config/db');
(async () => {
  try {
    const [rows] = await db.query('DESCRIBE orders');
    console.log(rows);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
