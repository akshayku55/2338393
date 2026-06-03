const axios = require("axios");
require("dotenv").config();

function getWeight(type) {
  switch (type) {
    case "Placement":
      return 3;
    case "Result":
      return 2;
    case "Event":
      return 1;
    default:
      return 0;
  }
}

function calculatePriority(notification) {
  const timestampScore =
    new Date(notification.Timestamp).getTime() / 1000000000;

  return (
    getWeight(notification.Type) * 1000 +
    timestampScore
  );
}

async function getTop10Notifications() {
  try {
    const response = await axios.get(
      "http://4.224.186.213/evaluation-service/notifications",
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      }
    );

    const notifications = response.data.notifications;

    const top10 = notifications
      .map(notification => ({
        ...notification,
        priority: calculatePriority(notification)
      }))
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 10);

    console.log("\nTOP 10 PRIORITY NOTIFICATIONS\n");

    top10.forEach((notification, index) => {
      console.log(
        `${index + 1}. ${notification.Type} | ${notification.Message}`
      );
    });

    return top10;
  } catch (error) {
    console.error(
      error.response?.data || error.message
    );
  }
}

getTop10Notifications();