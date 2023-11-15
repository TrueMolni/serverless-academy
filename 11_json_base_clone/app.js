const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Простий об'єкт для зберігання JSON-документів
const jsonStorage = {};

app.use(bodyParser.json());

// Обробник запиту PUT
app.put("/:json_path", (req, res) => {
  const jsonPath = req.params.json_path;
  const jsonData = req.body;

  try {
    // Збереження JSON за шляхом
    jsonStorage[jsonPath] = jsonData;

    res.json({
      success: true,
      message: "JSON stored successfully",
      path: jsonPath,
      data: jsonData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Обробник запиту GET
app.get("/:json_path", (req, res) => {
  const jsonPath = req.params.json_path;

  try {
    // Отримання JSON за шляхом
    const jsonData = jsonStorage[jsonPath];

    if (jsonData) {
      res.json({ success: true, path: jsonPath, data: jsonData });
    } else {
      res
        .status(404)
        .json({ success: false, message: "JSON not found for the given path" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Тестовий варіант - створення та отримання JSON
const request = require("request");

const testPath = "test_json";
const testData = { key: "value" };

// PUT тест
request.put(
  {
    url: `http://localhost:${PORT}/${testPath}`,
    json: testData,
  },
  (error, response, body) => {
    if (error) {
      console.error(error);
    } else {
      console.log("PUT Test:", body);
    }
  }
);

// GET тест
request.get(`http://localhost:${PORT}/${testPath}`, (error, response, body) => {
  if (error) {
    console.error(error);
  } else {
    console.log("GET Test:", body);
  }
});
