import fs from "fs/promises";
import inquirer from "inquirer";

const databaseFile = "users.txt";

function saveUser(user) {
  const userData = `${user.name},${user.gender},${user.age}\n`;
  fs.appendFile(databaseFile, userData, "utf8");
}

async function getUserInfo() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Hello! Please, enter the user name. To cancel, press ENTER:",
    },
  ]);

  if (!answers.name) {
    console.log("User not found.");
    searchUser();
    return;
  }

  const genderAnswer = await inquirer.prompt([
    {
      type: "list",
      name: "gender",
      message: "Choose your gender:",
      choices: ["Male", "Female"],
    },
  ]);

  const ageAnswer = await inquirer.prompt([
    {
      type: "input",
      name: "age",
      message: "Enter your age:",
    },
  ]);

  const user = {
    name: answers.name,
    gender: genderAnswer.gender,
    age: ageAnswer.age,
  };

  saveUser(user);
  getUserInfo();
}

async function searchUser() {
  const usersData = await fs.readFile(databaseFile, "utf8");
  const users = usersData.trim()
    ? usersData.split("\n").map((line) => line.split(","))
    : [];

  if (users.length > 0) {
    console.log("Existing users:");
    users.forEach((user) => {
      const name = user[0].trim(); // Видаляємо пробіли з імені користувача
      if (name) {
        console.log("Name:", name);
      }
    });
  } else {
    console.log("No existing users.");
  }

  const searchAnswer = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Enter the user's name that you want to find:",
    },
  ]);

  const searchName = searchAnswer.name.trim();

  if (!searchName) {
    console.log("User not found. Invalid input.");
    return;
  }

  const foundUser = users.find(
    (user) => user[0].trim().toLowerCase() === searchName.toLowerCase()
  );

  if (foundUser) {
    console.log("User found:");
    console.log("Name:", foundUser[0]);
    console.log("Gender:", foundUser[1]);
    console.log("Age:", foundUser[2]);
  } else {
    console.log("User not found.");
  }
}

getUserInfo();
