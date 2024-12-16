const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/save", (req, res) => {
    const { username, email, birthdate, gender, password } = req.body;

    const registrationDate = new Date().toLocaleString("ru-RU", {
        timeZone: "Europe/Minsk",
    });

    const id = uuidv4();
    const newUser = { id, username, email, birthdate, gender, password, registrationDate };

    fs.readFile("users.json", "utf8", (err, data) => {
        let users = [];
        if (!err && data) {
            users = JSON.parse(data);
        }

        users.push(newUser);

        fs.writeFile("users.json", JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error("Ошибка сохранения:", err);
                res.status(500).send("Ошибка сервера.");
            } else {
                res.redirect(`/user/${id}`);
            }
        });
    });
});

app.get("/api/user/:id", (req, res) => {
    const userId = req.params.id;

    fs.readFile("users.json", "utf8", (err, data) => {
        if (err) {
            console.error("Ошибка чтения файла:", err);
            res.status(500).json({ error: "Ошибка сервера." });
            return;
        }

        const users = JSON.parse(data);
        const user = users.find((u) => u.id === userId);

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: "Пользователь не найден." });
        }
    });
});

app.get("/user/:id", (req, res) => {
    res.sendFile(__dirname + "/public/4.html");
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});