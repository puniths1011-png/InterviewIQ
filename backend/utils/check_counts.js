const Question = require('../models/Question');
const connectDB = require('../config/database');

async function check() {
  await connectDB();
  const techs = await Question.aggregate([
    { $group: { _id: '$technology', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
  console.log(JSON.stringify(techs, null, 2));
  process.exit();
}
check();
