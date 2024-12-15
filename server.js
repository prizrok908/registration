const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/save", (req, res) => {
    const { username, email, birthdate, gender, password } = req.body;

    const registrationDate = new Date().toLocaleString("ru-RU", {
        timeZone: "Europe/Minsk",
    });

    const newUser = { username, email, birthdate, gender, password, registrationDate };

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
                res.redirect(`/4.html?username=${username}&email=${email}&birthdate=${birthdate}&gender=${gender}&registrationDate=${registrationDate}`);
            }
        });
    });
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    fs.readFile("users.json", "utf8", (err, data) => {
        if (err) {
            console.error("Ошибка чтения файла:", err);
            res.status(500).send("Ошибка сервера.");
            return;
        }

        const users = JSON.parse(data);
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            res.redirect(`/4.html?username=${user.username}&email=${user.email}&birthdate=${user.birthdate}&gender=${user.gender}&registrationDate=${user.registrationDate}`);
        } else {
            res.send("Неверное имя пользователя или пароль.");
        }
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
