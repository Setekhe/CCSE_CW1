const express = require("express");
const fs = require('fs');
const app = express();
app.use(express.json())
app.use(express.static(__dirname + '/public'));
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
app.post("/login",function (req, res){
    var details = req.body;
    let admins =JSON.parse(fs.readFileSync('./admins.json','utf8', (err, data) => {
        if (err) {
          console.error("err");
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
app.listen(8080, function () {
  console.log("Server is running on http://localhost:8080/");
});

