const express = require('express')
const app = express()

var path = require('path')
//app.set('view engine', 'html')
app.use(express.static('.'))
app.get('/', function (req, res) {
  //res.send('Hello World!')
  //res.render('index')
  res.sendFile(path.join(__dirname+'/index.html'))
})

app.listen(3000, function () {
  console.log('Git Analytics CI site listening on port 3000!')
})
