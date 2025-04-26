const express = require("express");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const sass = require("sass");

app = express();

// Cerinta 3. A treia linie returneaza calea din care a fost pornit sv-ul
console.log("Calea proiectului este ",__dirname);
console.log("Calea fisierului index.js: ",__filename);
console.log("Calea folderului curent de lucru: ",process.cwd()); 

app.set("view engine", "ejs")

obGlobal={
    obErori: null,
    obImagini: null,
    folderScss: path.join(__dirname, "resurse/scss"),
    folderCss: path.join(__dirname, "resurse/css"),
    folderBackup: path.join(__dirname, "backup")
}

vect_foldere=["temp", "backup","temp1"]
for (let folder of vect_foldere){
    let caleFolder = path.join(__dirname,folder)
    if(!fs.existsSync(caleFolder)){
        fs.mkdirSync(caleFolder);
    }
}

function compileazaScss(caleScss, caleCss){
    console.log("Cale:",caleCss);
    if(!caleCss){

        let numeFisExt=path.basename(caleScss);
        let numeFis=numeFisExt.split(".")[0]
        caleCss=numeFis+".css";
    }
    
    if (!path.isAbsolute(caleScss))
        caleScss=path.join(obGlobal.folderScss,caleScss )
    if (!path.isAbsolute(caleCss))
        caleCss=path.join(obGlobal.folderCss,caleCss )
    

    let caleBackup=path.join(obGlobal.folderBackup, "resurse/css");
    if (!fs.existsSync(caleBackup)) {
        fs.mkdirSync(caleBackup,{recursive:true})
    }

    let numeFisCss=path.basename(caleScss).split(".")[0] + ".css";
    //let numeFisCss= path.basename(caleScss).split(".")[0] + "_" + (new Date()).getTime() + ".css"; //momentan inactiva pentru a nu aglomera folderul de backup
    if (fs.existsSync(caleCss)){
        fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, "resurse/css", numeFisCss))
    }
    rez=sass.compile(caleScss, {"sourceMap":true});
    fs.writeFileSync(caleCss,rez.css)

}

vFisiere=fs.readdirSync(obGlobal.folderScss);
for( let numeFis of vFisiere ){
    if (path.extname(numeFis)==".scss"){
        compileazaScss(numeFis);
    }
}

fs.watch(obGlobal.folderScss, function(eveniment, numeFis){
    console.log(eveniment, numeFis);
    if (eveniment=="change" || eveniment=="rename"){
        let caleCompleta=path.join(obGlobal.folderScss, numeFis);
        if (fs.existsSync(caleCompleta)){
            compileazaScss(caleCompleta);
        }
    }
})

function initErori(){
    let continut = fs.readFileSync(path.join(__dirname,"resurse/json/erori.json")).toString("utf-8");
    
    obGlobal.obErori=JSON.parse(continut)
    
    obGlobal.obErori.eroare_default.imagine=path.join(obGlobal.obErori.cale_baza, obGlobal.obErori.eroare_default.imagine)
    for (let eroare of obGlobal.obErori.info_erori){
        eroare.imagine=path.join(obGlobal.obErori.cale_baza, eroare.imagine)
    }
    //console.log(obGlobal.obErori)

}
initErori()

function initImagini(){
    var continut= fs.readFileSync(path.join(__dirname,"resurse/json/galerie.json")).toString("utf-8");

    obGlobal.obImagini=JSON.parse(continut);
    let vImagini=obGlobal.obImagini.imagini;

    let caleAbs=path.join(__dirname,obGlobal.obImagini.cale_galerie);
    let caleAbsMediu=path.join(__dirname,obGlobal.obImagini.cale_galerie, "mediu");
    let caleAbsMic=path.join(__dirname,obGlobal.obImagini.cale_galerie, "mic");

    if (!fs.existsSync(caleAbsMediu))
        fs.mkdirSync(caleAbsMediu);

    if (!fs.existsSync(caleAbsMic))
        fs.mkdirSync(caleAbsMic);

    for (let imag of vImagini){
        [numeFis, ext]=imag.fisier_imagine.split(".");
        let caleFisAbs=path.join(caleAbs,imag.fisier_imagine);

        let caleFisMediuAbs=path.join(caleAbsMediu, numeFis+".webp");
        let caleFisMicAbs=path.join(caleAbsMic, numeFis + ".webp");
        
        sharp(caleFisAbs).resize(300).toFile(caleFisMediuAbs);
        sharp(caleFisAbs).resize(100).toFile(caleFisMicAbs);
        
        imagfisier_imagine_mediu=path.join("/", obGlobal.obImagini.cale_galerie, "mediu",numeFis+".webp" )
        imagfisier_imagine_mic=path.join("/", obGlobal.obImagini.cale_galerie, "mic",numeFis+".webp" )
        imag.fisier_imagine=path.join("/", obGlobal.obImagini.cale_galerie, imag.fisier_imagine )
        
    }
    //console.log(obGlobal.obImagini)
}
initImagini(); 

function afisareEroare(res, identificator, titlu, text, imagine){
    let eroare= obGlobal.obErori.info_erori.find(function(elem){ 
                        return elem.identificator==identificator
                    });
    if(eroare){
        if(eroare.status)
            res.status(identificator)
        var titluCustom=titlu || eroare.titlu;
        var textCustom=text || eroare.text;
        var imagineCustom=imagine || eroare.imagine;


    }
    else{
        var err=obGlobal.obErori.eroare_default
        var titluCustom=titlu || err.titlu;
        var textCustom=text || err.text;
        var imagineCustom=imagine || err.imagine;


    }
    res.render("pagini/eroare", { 
        titlu: titluCustom,
        text: textCustom,
        imagine: imagineCustom
})

}

app.use("/resurse", express.static(path.join(__dirname,"resurse")))
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")))

app.get("/favicon.ico", function(req, res, next) {
    res.sendFile(path.join(__dirname, "resurse/imagini/favicon/favicon.ico"));
});

app.get(["/", "/home", "/index"],function(req,res){
    let nr_random_poze = Math.floor(Math.random() * 5 + 3) * 2;
    let durata_totala = nr_random_poze * 4;
    console.log(nr_random_poze);

    const scssContent = `$nr_poze: ${nr_random_poze};`
    const scssPath = path.join(__dirname, 'resurse', 'scss', 'galerie_animata.scss');
    
    let scssFileContent = fs.readFileSync(scssPath, 'utf8');

    const variableRegex = /\$nr_poze:\s*\d+;/;

    if (variableRegex.test(scssFileContent)) {
        scssFileContent = scssFileContent.replace(variableRegex, scssContent);
        console.log("Update $nr_poze");
    }

    fs.writeFileSync(scssPath, scssFileContent);
    compileazaScss(scssPath);

    res.render("pagini/index", {ip: req.ip, imagini: obGlobal.obImagini.imagini, nr_random_poze: nr_random_poze, durata_totala: durata_totala});
}) 

app.get("/despre",function(req,res){
    res.render("pagini/despre");
})

app.get("/galerie",function(req,res){
    res.render("pagini/galerie-pagina", {ip: req.ip, imagini: obGlobal.obImagini.imagini});
})

app.get(/^\/resurse\/[a-zA-Z0-9_\/]*$/, function(req, res, next){
    afisareEroare(res,403)
})

app.get(/^.*\.ejs$/, function(req, res, next){
    afisareEroare(res,400)
})

app.get(/^\/(.*)$/, function(req, res, next){
    try{
    res.render("pagini" + req.url, function(err, rezultatRandare){
        if(err){
            console.log(err);
            if(err.message.startsWith("Failed to lookup view")){
                afisareEroare(res, 404);
            }
            else{
                afisareEroare(res);
            }
        }
        else{
            console.log(rezultatRandare);
            res.send(rezultatRandare);
        }
        })
    }
    catch (errRandare){
        if(errRandare.message.startsWith("Cannot find module ")){
            afisareEroare(res, 404);
        }
        else{
            afisareEroare(res);
        }
    }
})

app.listen(8080);
console.log("Serverul a pornit")


