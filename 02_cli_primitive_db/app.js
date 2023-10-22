import fs from "fs/promises";
import inquirer from "inquirer";

const databaseFile = "users.txt";

async function saveUsersToFile(users) {
  try {
    await fs.writeFile(databaseFile, JSON.stringify(users), "utf8");
  } catch (error) {
    console.error("Error saving users:", error);
    return;
  }
}

async function getUsersFromFile() {
  try {
    const data = await fs.readFile(databaseFile, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading users:", error);
    return [];
  }
}

function saveUser(user) {
  getUsersFromFile().then((users) => {
    users.push(user);
    saveUsersToFile(users);
  });
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
  const users = await getUsersFromFile();

  if (users.length > 0) {
    console.log("Existing users:");
    users.forEach((user) => {
      const name = user.name.trim();
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
    (user) => user.name.trim().toLowerCase() === searchName.toLowerCase()
  );

  if (foundUser) {
    console.log("User found:");
    console.log("Name:", foundUser.name);
    console.log("Gender:", foundUser.gender);
    console.log("Age:", foundUser.age);
  } else {
    console.log("User not found.");
  }
}

getUserInfo();
