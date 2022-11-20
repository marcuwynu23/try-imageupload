const path = require("path")
const express = require("express");
const session = require("express-session")
const fileUpload = require("express-fileupload")
const nunjucks = require("nunjucks")
const constants = require("./constants")
const logger = require('morgan')

const app = express()
nunjucks.configure(path.resolve(__dirname, 'view'), {
  express: app,
  autoscape: true,
  noCache: false,
  watch: true
})
app.use(fileUpload())
app.use(logger('dev', {}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session({
  secret: "secret of the star",
  saveUninitialized: false,
  resave: false
}))
app.use(express.static(path.join(__dirname, 'public')))

app.get("/", (req, res) => {
  return res.render("index.html", {
    context: {
      title: constants.TITLE
    }
  });
})
app.post("/upload", (req, res) => {
  if (!req.files) {
    return res.status(400).send("No files were uploaded.");
  }
  // console.log(req.files.file)
  require("./lib/lib").uploadCloudImage(req.files.file, { rootDir: __dirname, tempFolder: "temp", imageName: "peculiarOrg", folderName: "peculiarOrg" }).then((url) => {
    return res.send(url)
  })
  res.send("done")
})


const PORT = 9000;
app.listen(process.env.PORT || PORT, (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log(`Running Server on ${PORT}...`)
  }
});