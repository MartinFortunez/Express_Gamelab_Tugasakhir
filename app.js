var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');
var flash = require('req-flash');
const jwt = require('jsonwebtoken');

var usersRouter = require('./routes/users');
var kelasRouter = require('./routes/kelas');
var sessionRouter = require('./routes/session')
var productsRouter = require('./routes/products');

var indexRouter = require('./routes/index');
const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');


var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    secret: 'iniadalahrahasiamu',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }
  }));
app.use(flash());


app.use(function(req, res, next) {
    res.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.setHeader('Pragma', 'no-cache');
    next();
});

// gunakan body parser sebgai middleware
// Middleware untuk membaca JSON
app.use(bodyParser.json());

// Data yang kita gunakan adalah kelas pada karakter game
var kelas = [
    { 
        id: 1, 
        nama_kelas: "Backend",
        deskripsi: "Kelas ini fokus pada pengembangan perangkat lunak di sisi server, termasuk pengelolaan basis data, logika bisnis, dan integrasi sistem.",
    },
    { 
        id: 2, 
        nama_kelas: "Frontend",
        deskripsi: "Kelas ini membahas pengembangan aplikasi web di sisi klien, termasuk desain tampilan, interaksi pengguna, dan pengalaman pengguna.",
    },
    { 
        id: 3, 
        nama_kelas: "Fullstack",
        deskripsi: "Kelas ini mencakup kedua aspek pengembangan perangkat lunak di sisi klien (frontend) dan sisi server (backend), memungkinkan siswa untuk mempelajari seluruh siklus pengembangan aplikasi web.",
    }
];

// Mendapatkan semua kelas
app.get('/api/kelas', function (req, res) {
    try {
        // Menambahkan deskripsi untuk setiap kelas dalam respons JSON
        const kelasDenganDeskripsi = kelas.map(kls => {
            return {
                id: kls.id,
                nama_kelas: kls.nama_kelas,
                deskripsi: kls.deskripsi
            };
        });
        res.json({ data: kelasDenganDeskripsi });
    } catch (err) {
        res.status(500).json({
            status: false,
            name: err.name,
            message: err.message
        });
    }
});

// Mendapatkan kelas berdasarkan ID
app.get('/api/kelas/:id', function (req, res) {
    try {
        const kls = kelas.find(k => k.id === parseInt(req.params.id));
        if (!kls) return res.status(404).send("Kelas tidak ditemukan");
        res.json({ data: kls });
    } catch (err) {
        res.status(500).json({
            status: false,
            name: err.name,
            message: err.message
        });
    }
});

// Menambahkan data kelas
app.post('/api/kelas', function (req, res) {
    try {
        if (!req.body.nama_kelas || !req.body.deskripsi) {
            return res.status(400).send("Nama kelas dan deskripsi harus diisi");
        }

        const kls = {
            id: kelas.length + 1,
            nama_kelas: req.body.nama_kelas,
            deskripsi: req.body.deskripsi
        };
        kelas.push(kls);
        res.send(kls);
    } catch (err) {
        res.status(500).json({
            status: false,
            name: err.name,
            message: err.message
        });
    }
});

// Mengupdate data kelas
app.put('/api/kelas/:id', function (req, res) {
    try {
        const klas = kelas.find(k => k.id === parseInt(req.params.id));
        if (!klas) return res.status(404).send("Kelas tidak ditemukan");

        if (!req.body.nama_kelas || !req.body.deskripsi) {
            return res.status(400).send("Nama kelas dan deskripsi harus diisi");
        }

        klas.nama_kelas = req.body.nama_kelas;
        klas.deskripsi = req.body.deskripsi;
        res.send({ pesan: "Data berhasil diupdate.", data: klas });
    } catch (err) {
        res.status(500).json({
            status: false,
            name: err.name,
            message: err.message
        });
    }
});

// Menghapus data kelas
app.delete('/api/kelas/:id', function (req, res) {
    try {
        const klas = kelas.find(k => k.id === parseInt(req.params.id));
        if (!klas) return res.status(404).send("Kelas tidak ditemukan");

        const index = kelas.indexOf(klas);
        kelas.splice(index, 1);
        res.send({ pesan: "Data berhasil dihapus.", data: klas });
    } catch (err) {
        res.status(500).json({
            status: false,
            name: err.name,
            message: err.message
        });
    }
});

//Auth JWT
app.post('/products/login',(req,res)=>{
   
  const user = {
      id:Date.now(),
      userEmail:'admin@gamelab.id',
      password:'gamelab'
  }
//Untuk generate token user
  jwt.sign({user},'secretkey',(err,token)=>{
      res.json({
          token
      })
  })
})


app.get('/products/profile',verifyToken,(req,res)=>{

  jwt.verify(req.token,'secretkey',(err,authData)=>{
      if(err)
          res.sendStatus(403);
      else{
          res.json({
              message:"Selamat Datang di Gamelab Indonesia",
              userData:authData
          })
         
      }
  })

});


//Verifikasi Token
function verifyToken(req,res,next){

  const bearerHeader = req.headers['authorization'];
  //cek jika bearer kosong/tidak ada
  if(typeof bearerHeader !== 'undefined'){

      const bearer = bearerHeader.split(' ');
      //Get token 
      const bearerToken = bearer[1];

      //set the token
      req.token = bearerToken;

      //next middleware
      next();

  }else{
      //Jika tidak bisa akses mengarahkan ke halaman forbidden
      res.sendStatus(403);
  }

}
app.set('views',path.join(__dirname,'src/views'));

app.set('views',path.join(__dirname,'./views'));
app.set('view engine', 'ejs');

app.use('/users', usersRouter);
app.use('/kelas', kelasRouter);
app.use('/session', sessionRouter);
// fokus ke ini
app.use('/', indexRouter);
app.use('/login', loginRoutes);
app.use('/register', registerRoutes);
// diabaikan
app.use('/products', productsRouter);


module.exports = app;