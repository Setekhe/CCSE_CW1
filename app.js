const express = require("express");

const fs = require('fs');
const app = express();
const util = require("util");
const multer = require("multer");


app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

fs.writeFile("./applications.json", (fs.readFileSync("./apptestdata.json", "utf8")), (err) => {
    if (err)
      console.log(err);
});

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});
app.get("/finance", function (req, res) {
    res.sendFile(__dirname + "/finance.html");
});
app.get("/car", function (req, res) {
    res.sendFile(__dirname + "/car.html");
});
app.get("/dealer", function (req, res) {
    res.sendFile(__dirname + "/dealer.html");
});
app.get("/application", function (req, res) {
    res.sendFile(__dirname + "/application.html");
});
app.get("/admin", function (req, res) {
    res.sendFile(__dirname + "/admin.html");
});
app.get("/favicon.ico", function (req, res) {
    res.sendFile(__dirname + "/favicon.ico");
});
app.get("/:json.json", function (req, res) {
    res.sendFile(__dirname + "/"+req.params['json']+".json");
});
app.get("/images/:image.png", function (req, res) {
    res.sendFile(__dirname + "/images/"+req.params['image']+".png");
});
app.post("/loginadmin",function (req, res){
    var details = req.body;
    let admins =JSON.parse(fs.readFileSync('./admins.json','utf8', (err, data) => {
        if (err) {
          console.error(err);
        }
    }));
    var up=false;
    for (const admin of admins) {
        if(admin.username == details.User && admin.password == details.Pass)
        {
            if(admin.mfa == details.MFA){
                res.send('true');
                up=true;
                break;
            }else{
                res.send('MFA');
                up=true;
                break;
            }
        }
    }if(!up){
        res.send('UP');
    }
    
    
})

app.post("/loginuser",function (req, res){
    var details = req.body;
    let users =JSON.parse(fs.readFileSync('./applications.json','utf8', (err, data) => {
        if (err) {
          console.error(err);
        }
    }));
    if(users[details.ID].password == details.Pass){
        res.json(users[details.ID]);
    }else{
        res.send('UP');
    }
})

app.post("/apply",function (req, res){
    var details = req.body;
    var apps=JSON.parse(fs.readFileSync('./applications.json','utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
    }));
    apps.push(details);
    fs.writeFileSync("./applications.json", JSON.stringify(apps), (err) => {
        if (err){
          console.log(err);
        }
    });
    res.send('true');
});

app.post("/filelist",function (req, res){
    var details = req.body;
    let users =JSON.parse(fs.readFileSync('./applications.json','utf8', (err, data) => {
        if (err) {
          console.error(err);
        }
    }));
    if(users[details.ID].password == details.Pass){
        res.send(
            (fs.readdirSync(('./application_files/'+details.ID), (err, files) => {
                return files;
            }))
        );
    }else{
        res.send(null);
    }
});

app.get("/download/:id/:file",function (req, res){
    res.download(('./application_files/'+req.params['id']+'/'+req.params['file']));
});



/////////////////////// Middleware Upload
var upload = multer({ dest: './application_files/0/'});
app.post("/upload/:id", upload.array('filesarr'),function (req, res){
    console.log(req.body);
    console.log(typeof req.body.filesarr);
    upload.array(req.body.filesarr)
    //upload = multer({ dest: './application_files/0/'})
   res.send('success');
} ,);
  
////////////////starts the server
app.listen(8080, function () {
  console.log("Server is running on http://localhost:8080/");
});

