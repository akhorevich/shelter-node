var express = require('express')
var app = express()
var cheerio = require('cheerio')
var request = require('request')

app.get('/', (req, res) => {
  res.send('Dogs Shelter Kozhuhovo')
})

app.get('/sector-a', (req, res) => {
  const result = parser('sektor');
  res.send(result);
})

app.get('/sector-b', (req, res) => {
  const result = parser('sektor-b');
  res.send(result);
})

app.get('/sector-c', (req, res) => {
  const result = parser('sektor-s');
  res.send(result);
})

app.get('/sector-d', (req, res) => {
  const result = parser('sektor-d');
  res.send(result);
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

function parser(tail) {

    var cards;
    var nameReg = 'div.views-field-title span.field-content a';
    var imageReg = 'div.views-field-image-image span.field-content a img'
    const url = "http://vao-priut.org/category/fotokatalog/" + tail;
    request(url, function(err, res, body){
    if(err){console.log(err);}
    else{
      cards = [];
      $ = cheerio.load(body);
      $('td').each(function(){
        cards.push({
            name:$(nameReg,this).text(),
            image:$(imageReg,this).attr('src')
        });
      });
    }
    console.log(cards);
  });
  var json = JSON.stringify(cards);
  return json;
}
