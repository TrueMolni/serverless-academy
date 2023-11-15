const express = require("express");
const crypto = require("crypto");

const app = express();
const PORT = 3000;

const linkStorage = {};

app.use(express.json());

// Обробник запиту POST
app.post("/shorten", (req, res) => {
  try {
    const originalLink = req.body.link;

    // Перевірка валідності URL
    const isValidUrl = validateUrl(originalLink);
    if (!isValidUrl) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid URL provided" });
    }

    // Генерація короткого хешу для посилання
    const shortLink = generateShortLink(originalLink);

    // Збереження короткого посилання в пам'яті
    linkStorage[shortLink] = originalLink;

    res.json({ success: true, originalLink, shortLink });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
});

// Обробник запиту GET
app.get("/:shortLink", (req, res) => {
  try {
    const shortLink = req.params.shortLink;

    // Перевірка наявності короткого посилання в пам'яті
    const originalLink = linkStorage[shortLink];

    if (originalLink) {
      res.redirect(originalLink);
    } else {
      res.status(404).json({ success: false, message: "Link not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Валідація URL
function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

// Генерація короткого посилання
function generateShortLink(originalLink) {
  const hash = crypto.createHash("sha256").update(originalLink).digest("hex");
  return hash.substring(0, 6); // Використовуємо перші 6 символів хешу як короткий ідентифікатор
}
