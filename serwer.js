var express = require("express")
var app = express()
const PORT = process.env.PORT || 80
var path = require("path")
var hbs = require('express-handlebars');
var bodyParser = require("body-parser");
var formidable = require('formidable');
var id = 0;
//LOKALNIE

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/static')));
app.set('views', path.join(__dirname, 'views'));  // katalog views
app.set('view engine', 'hbs');  // określenie nazwy silnika szablonów
app.engine('hbs', hbs({
    defaultLayout: 'main.hbs',
    extname: '.hbs',
    partialsDir: "views/partials",
}));

// routingi
app.get("/", function (req, res) {
    res.render('upload.hbs');
})
app.get("/filemanager", function (req, res) {
    res.render('filemanager.hbs', tablica_plikow);
})
app.get("/info/:id", function (req, res) {
    var id = req.params.id
    var item
    for (litem of tablica_plikow.pliki) {
        try {
            if (litem.id == id) {
                item = litem
            }
        } catch (error) {

        }
    }
    res.render('info.hbs', item);
})
app.get("/info", function (req, res) {
    res.render('info.hbs');
})
app.get("/delete/:id", function (req, res) {
    var id = req.params.id
    for (item of tablica_plikow.pliki) {
        try {
            if (item.id == id) {
                delete tablica_plikow.pliki[tablica_plikow.pliki.indexOf(item)]
            }
        } catch (e) {

        }
    }
    res.redirect("/filemanager")
})
app.get("/download/:id", function (req, res) {
    var id = req.params.id
    for (item of tablica_plikow.pliki) {
        try {
            if (item.id == id) {
                res.download(item.path)
            }
        } catch (e) {

        }
    }
})



app.post('/handleUpload', function (req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '/static/upload/'  // folder do zapisu zdjęcia
    form.keepExtensions = true  // zapis z rozszerzeniem pliku
    form.multiples = true   // zapis wielu plików                          
    form.parse(req, function (err, fields, files) {
        if (Array.isArray(files.imageupload)) { // jeżeli jest to tablica
            for (plik of files.imageupload) { // of - przelatuje wszystkie elementy w tablicy
                var item = JSON.parse(JSON.stringify(plik, null, 4)) // stringify - robi z tablicy pliki JSON
                var x = item.name.split(".")
                var p_koncowy = { id: id, ikona: pobierz_ikone(x[x.length - 1]), size: item.size, path: item.path, name: item.name, type: item.type, mtime: item.mtime }
                tablica_plikow.pliki.push(p_koncowy)
                id++
            }
        }
        else {
            var item = JSON.parse(JSON.stringify(files.imageupload, null, 4))
            var x = item.name.split(".")
            var p_koncowy = { id: id, ikona: pobierz_ikone(x[x.length - 1]), size: item.size, path: item.path, name: item.name, type: item.type, mtime: item.mtime }
            tablica_plikow.pliki.push(p_koncowy)
            id++
        }
        res.redirect("/filemanager")
    });
});

// nasłuch na porcie 
app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})

// tworzenie tabeli w filemanager
var tablica_plikow = {
    pliki: [],
}

var tablica_ikony = ['001-3ds.png', '002-ai file.png', '003-app.png', '004-asp.png', '005-bat.png', '006-c++.png', '007-c sharp.png', '008-css.png', '009-csv.png', '010-dat.png', '011-dll.png', '012-doc.png', '013-docx.png', '014-dwg.png', '015-eml.png', '016-eps.png', '017-exe.png', '018-flv.png', '019-gif.png', '020-html.png', '021-ics.png', '022-iso.png', '023-jar.png', '024-jpeg.png', '025-jpg.png', '026-js.png', '027-log format.png', '028-mdb.png', '029-mov.png', '030-mp3.png', '031-mp4.png', '032-pdf.png', '033-obj.png', '034-otf.png', '035-php.png', '036-png.png', '037-ppt.png', '038-psd.png', '039-pub.png', '040-rar.png', '041-sql.png', '042-srt.png', '043-svg.png', '044-ttf.png', '045-txt.png', '046-wav.png', '047-xls.png', '048-xlsx.png', '049-xml.png', '050-zip.png']
function pobierz_ikone(rozszerzenie) {
    for (ikona of tablica_ikony) {
        if (rozszerzenie == ikona.split("-")[1].split(".")[0]) {
            return ikona
        }
    }
}

app.get("/usuwanie", function (req, res) {
    tablica_plikow = {
        pliki: [],
    }
    res.redirect("/filemanager")
})