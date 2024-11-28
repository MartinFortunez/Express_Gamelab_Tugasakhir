var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser')

/* GET users listing. */
// router.get('/', function(req, res, next) {
 // res.send('respond with a resource');
//}); 

router.get('/', function (req, res) {
  console.log(req.method) 
  res.send('Halo Gamelab')
})


router.use(bodyParser.json())
router.post('/', function (req, res) {
  console.log(req.body) 
  res.send('Data sudah diterima')
})

router.get('/kueri', function (req, res) {
  var nama = req.query.nama;
  var usia = req.query.usia;
  console.log(nama, usia) 
  res.json({nama, usia})
});

router.post('/users/:id', function (req, res) {
  var id = req.params.id;
  var path = req.path;
  console.log(id, path) 
  res.json({id, path})
});
router.get('/header', function (req, res) {
  let userAgent = req.headers['user-agent'];
  console.log(userAgent); 
  res.send(userAgent); 
});

const users = {
  gamelab: {
    username: 'gamelab',
    password: 'indonesia',
  },
};

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Tidak ada akses' });
  }

  const [type, encodedCredentials] = authHeader.split(' ');
  if (type !== 'Basic' || !encodedCredentials) {
    return res.status(401).json({ message: 'Tidak ada akses' });
  }

  const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString();
  const [username, password] = decodedCredentials.split(':');
  
  const user = users[username];
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Tidak ada akses' });
  }

  req.auth = { username };
  next();
};

router.use(authenticate);

router.get('/profile', (req, res) => {
  res.json({
    message: 'Selamat Datang di Gamelab Indonesia',
    user: req.auth,
  });
});


module.exports = router;
