const express = require("express");

const fs = require('fs');
const app = express();
const multer = require("multer");
const path = require('path');

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
app.get("/adminviewer", function (req, res) {
    res.sendFile(__dirname + "/adminViewer.html");
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
        try{
            res.send(
                (fs.readdirSync(('./application_files/'+details.ID), (err, files) => {
                    return files;
                }))
            );
        }catch(err){
            res.send(null)
        }
    }else{
        res.send(null);
    }
});

app.get("/download/:id/:file",function (req, res){
    res.download(('./application_files/'+req.params['id']+'/'+req.params['file']));
});



/////////////////////// Middleware Upload
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join('./application_files/'+req.params['id']+'/'));
    },
    filename: function (req, file, cb){
        cb(null, file.originalname);
    }
}); 
let upload = multer({storage: storage})
app.post("/upload/:id", upload.array('files'),function (req, res){
   res.end();
} ,);
  
////////////////starts the server
app.listen(6060, function () {
  console.log("Server is running on http://localhost:6060/");
});

