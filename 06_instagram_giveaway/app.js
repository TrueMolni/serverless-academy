const fs = require("fs");

function readFiles() {
  const words = [];
  for (let i = 0; i < 20; i += 1) {
    const fileContent = fs.readFileSync(`./texts/out${i}.txt`, "utf-8");
    const fileWords = fileContent.split("\n").map((word) => word.trim());
    words.push(fileWords);
  }

  return words;
}

const allWords = readFiles();

function uniqueValues() {
  const uniqueUsers = new Set(allWords.flat());
  return uniqueUsers.size;
}

function existInAllFiles() {
  const userCounts = {};

  for (let i = 0; i < allWords.length; i++) {
    for (let j = 0; j < allWords[i].length; j++) {
      const username = allWords[i][j];
      userCounts[username] = (userCounts[username] || 0) + 1;
    }
  }

  const usersInAllFiles = Object.keys(userCounts).filter(
    (username) => userCounts[username] >= 20
  );

  return usersInAllFiles.length;
}

function existInAtLeastTenFiles() {
  const userSets = {};

  for (let i = 0; i < allWords.length; i++) {
    for (let j = 0; j < allWords[i].length; j++) {
      const username = allWords[i][j];
      if (!userSets[username]) {
        userSets[username] = new Set();
      }
      userSets[username].add(i);
    }
  }

  const usersInTenOrMoreFiles = Object.keys(userSets).filter(
    (username) => userSets[username].size >= 10
  );

  return usersInTenOrMoreFiles.length;
}

function measurePerformance(func, funcName) {
  console.time(funcName);
  const result = func();
  console.timeEnd(funcName);
  console.log(`Result for ${funcName}: ${result}`);
}

measurePerformance(uniqueValues, "uniqueValues");
measurePerformance(existInAllFiles, "existInAllFiles");
measurePerformance(existInAtLeastTenFiles, "existInAtleastTen");
