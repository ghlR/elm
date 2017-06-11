var express = require('express')
var config = require('./config/index')

var port = process.env.PORT || config.build.port

var app = express()

var router = express.Router()

router.get('/',function (req, res, next) {
  req.url = '/index.html'
  next()
})
//处理接口数据--start
var appData = require('./data.json');

var seller = appData.seller;
var goods = appData.goods;
var ratings = appData.ratings;

var apiRoutes = express.Router();
//获取接口的数据
apiRoutes.get('/seller', function (req, res) {
  res.json({
    errno: 0,
    data: seller
  })
})
apiRoutes.get('/goods', function (req, res) {
  res.json({
    errno: 0,
    data: goods
  })
})
apiRoutes.get('/ratings', function (req, res) {
  res.json({
    errno: 0,
    data: ratings
  })
})

app.use('/api',apiRoutes);
//处理接口数据---end
app.use(router)
app.use(express.static('./dist'))
module.exports = app.listen(port,function (err) {
  if(err){
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:'+port+'\n')
})
