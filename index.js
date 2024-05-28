const express = require("express");
const users = require("./mock1.json");
const fs = require("fs");
const app = express();

const PORT = 8080;

// Middleware - plugin
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

app.use((req, res, next) => {
  console.log("New request received");
  next();
});

// Routes
app
  .route("/api/users")
  .get((req, res) => {
    return res.send(users);
  })
  .post((req, res) => {
    const body = req.body;
    users.push({ ...body, id: users.length + 1 });
    try {
      fs.writeFileSync("./mock1.json", JSON.stringify(users, null, 2));
      return res.json({ status: "Success" });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ status: "Error", message: "Failed to write to file" });
    }
  })
  .delete((req, res) => {
    // later
    return res.json({ status: "Pending" });
  });

app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);
  if (user) {
    return res.json(user);
  } else {
    return res.status(404).json({ status: "Error", message: "User not found" });
  }
});

app.listen(PORT, () => console.log(`Server listening at port: ${PORT}`));
