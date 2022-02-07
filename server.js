const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");

var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('./app/sslcert/ssl.key', 'utf8');
var certificate = fs.readFileSync('./app/sslcert/ssl.cert', 'utf8');


const app = express();

var httpsServer = https.createServer(credentials, app);

// var corsOptions = {
//   origin: "http://localhost:8081"
// };

app.use(cors());

var credentials = {key: privateKey, cert: certificate};

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static('public'));

const db = require("./app/models");
const Role = db.role;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Ifund application." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

//httpsServer.listen(PORT,()=>console.log("running at 8000 port https"));

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
// app.use((req, res, next) => {
//   // Error goes via `next()` method
//   setImmediate(() => {
//     next(new Error('Something went wrong'));
//   });
// });
// app.use(function (err, req, res, next) {
//   console.error(err.message);
//   if (!err.statusCode) err.statusCode = 500;
//   res.status(err.statusCode).send(err.message);
// });

