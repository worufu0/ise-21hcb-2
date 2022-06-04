var http = require('http');
var fs = require('fs');
var url = require('url');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const ejs = require('ejs');

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

app.get('/', function (req, res) {
  res.redirect('/public/login.html');
});
app.get('/getStudents', (req, res) => {
  var file = './datatable.json';
  var result = JSON.parse(fs.readFileSync(file));
  res.json(result);
});
app.get('/getClass', (req, res) => {
  var file = './class.json';
  var result = JSON.parse(fs.readFileSync(file));
  res.json(result);
});
app.get('/getScores', (req, res) => {
  var file = './score.json';
  var result = JSON.parse(fs.readFileSync(file));
  res.json(result);
});
app.post('/register', (req, res) => {
  var path = './user.json';
  var userData = req.body.userData;
  userData = JSON.parse(userData);
  writeJson(userData, path);
  res.send('1');
});
app.post('/adduser', (req, res) => {
  const path = './class.json';
  var userData = req.body;
  console.log('eee');
  // fs.readFile("./class.json", "utf8", function readFileCallback(err, data) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     let obj = JSON.parse(data); //now it an object
  //     obj?.data.push({
  //       id: (parseInt(obj?.data[obj?.data?.length - 1]?.id) + 1).toString(),
  //       name: userData.inputName,
  //       gender: userData.inputGender,
  //       birthday: userData.inputBirthday,
  //       address: userData.inputAddress,
  //     });
  //     json = JSON.stringify(obj); //convert it back to json
  //     fs.writeFile(path, json, 'utf8'); // write it back
  //   }
  // });
  let data = fs.readFileSync(path, 'utf8');
  let obj = JSON.parse(data);
  obj?.data.push({
    id: (parseInt(obj?.data[obj?.data?.length - 1]?.id) + 1).toString(),
    name: userData.inputName,
    gender: userData.inputGender,
    birthday: userData.inputBirthday,
    address: userData.inputAddress,
  });
  fs.writeFileSync(path, JSON.stringify(obj));

  res.send('1');
});
app.post('/putForm', (req, res) => {
  var userData = req.body.userForm;
  var path = './datatable.json';
  userData = JSON.parse(userData);
  writeJson(userData, path);
  res.send('1');
});
app.get('/public/:id', (req, res) => {
  var id1 = parseInt(req.params.id);
  if (id1 == 0) {
    res.redirect('/public/login.html');
  }
  var value = 'I';
  fs.readFile('./user.json', function (err, data) {
    if (err) {
      return console.error(err);
    }
    var user = data.toString();
    user = JSON.parse(user);
    for (var i = 0; i < user.data.length; i++) {
      if (id1 == user.data[i].userId) {
        value = user.data[i].account;
        break;
      }
    }
    res.render('index.ejs', { account: value, ID: id1 });
  });
});
app.post('/login', (req, res) => {
  var Data = req.body.data;
  Data = JSON.parse(Data);
  var account = Data.account;
  var password = Data.password;
  var value = 0;

  fs.readFile('./user.json', function (err, data) {
    if (err) {
      return console.error(err);
    }
    var user = data.toString();
    user = JSON.parse(user);
    for (var i = 0; i < user.data.length; i++) {
      if (account == user.data[i].account) {
        if (password == user.data[i].password) {
          value = user.data[i].userId;
          break;
        }
      }
    }
    res.send(value.toString());
  });
});
app.post('/registerCheck', (req, res) => {
  var userName = req.body.user;
  var value = 1;
  fs.readFile('./user.json', function (err, data) {
    if (err) {
      return console.error(err);
    }
    var user = data.toString();
    user = JSON.parse(user);
    for (var i = 0; i < user.data.length; i++) {
      if (userName == user.data[i].account) {
        value = 0;
        break;
      }
    }
    if (value != 0) {
      value += user.data.length;
      res.send(value.toString());
    } else {
      res.send(value.toString());
    }
  });
});
app.post('/upload', (req, res) => {
  var path = 'public/upload/';
  var imgData = req.body.file;
  var base64Data = String(imgData).replace(/^data:image\/\w+;base64,/, '');
  var dataBuffer = new Buffer.from(base64Data, 'base64');
  fs.writeFile(path, dataBuffer, function (err) {
    if (err) {
      res.send(err);
    } else {
      res.send('Successfully saved!');
    }
  });
});

var server = app.listen(8082, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('The access address is http://localhost:%s', port);
});

function writeJson(params) {
  fs.readFile('./user.json', function (err, data) {
    if (err) {
      return console.error(err);
    }

    var user = data.toString();
    user = JSON.parse(user);

    user.data.push(params);
    user.total = user.data.length;
    var str = JSON.stringify(user);
    fs.writeFile('./user.json', str, function (err) {
      if (err) {
        console.error(err);
      }
      console.log('----------Added successfully-------------');
    });
  });
}

function writeJson(params, jsonPath) {
  console.log(params + '--' + jsonPath);
  fs.readFile(jsonPath, function (err, data) {
    if (err) {
      return console.error(err);
    }

    var user = data.toString();
    user = JSON.parse(user);

    user.data.push(params);
    user.total = user.data.length;
    var str = JSON.stringify(user);
    fs.writeFile(jsonPath, str, function (err) {
      if (err) {
        console.error(err);
      }
      console.log('----------Added successfully-------------');
    });
  });
}

function deleteJson(id) {
  fs.readFile('./user.json', function (err, data) {
    if (err) {
      return console.error(err);
    }
    var user = data.toString();
    user = JSON.parse(user);
    for (var i = 0; i < user.data.length; i++) {
      if (id == user.data[i].id) {
        user.data.splice(i, 1);
      }
    }
    console.log(user.data);
    user.total = user.data.length;
    var str = JSON.stringify(user);
    fs.writeFile('./user.json', str, function (err) {
      if (err) {
        console.error(err);
      }
      console.log('----------Deleted successfully------------');
    });
  });
}
function changeJson(id, params) {
  fs.readFile('./user.json', function (err, data) {
    if (err) {
      console.error(err);
    }
    var user = data.toString();
    user = JSON.parse(user);
    for (var i = 0; i < user.data.length; i++) {
      if (id == user.data[i].id) {
        for (var key in params) {
          if (user.data[i][key]) {
            user.data[i][key] = params[key];
          }
        }
      }
    }
    user.total = user.data.length;
    var str = JSON.stringify(user);
    fs.writeFile('./user.json', str, function (err) {
      if (err) {
        console.error(err);
      }
      console.log('--------------------Modified Successfully');
      console.log(user.data);
    });
  });
}

function gettime() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  var time = year + '' + month + '' + day + '' + hour + '' + minute + '' + second;
  console.log(time);
  var filename = time + '.png';
  return filename;
}
