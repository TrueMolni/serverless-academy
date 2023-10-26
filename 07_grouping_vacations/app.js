const fs = require("fs");
const originalData = require("./data.json");

const users = {};

originalData.forEach((record) => {
  const userId = record.user._id;
  const userName = record.user.name;
  const vacation = {
    startDate: record.startDate,
    endDate: record.endDate,
  };

  if (!users[userId]) {
    users[userId] = {
      userId,
      userName,
      vacations: [],
    };
  }

  users[userId].vacations.push(vacation);
});

const transformedData = Object.values(users);

fs.writeFileSync(
  "./transformed.json",
  JSON.stringify(transformedData, null, 2)
);
