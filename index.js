const express = require("express");
const path = require("path");

app = express();

// Cerinta 3. A treia linie returneaza calea din care a fost pornit sv-ul
console.log("Calea proiectului este ",__dirname);
console.log("Calea fisierului index.js: ",__filename);
console.log("Calea folderului curent de lucru: ",process.cwd()); 

app.set("view engine", "ejs")

app.use("/resurse", express.static(path.join(__dirname,"resurse")))

app.get(["/","/index","/home"],function(req,res){
    res.render("pagini/index");
})

app.get("/despre",function(req,res){
    res.render("pagini/despre");
})

app.listen(8080);
console.log("Serverul a pornit")


