var express = require('express')
var app = express()
var tress = require('tress');
var needle = require('needle');
var cheerio = require('cheerio');
var resolve = require('url').resolve;
var fs = require('fs');

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
  var URL = 'http://vao-priut.org/category/fotokatalog/' + tail;
  var results;

  var q = tress(function(url, callback){
      needle.get(url, function(err, res){
          if (err) throw err;

          var $ = cheerio.load(res.body);
          results = [];
          $('td').each(function(){
              results.push({
                  name: $('div.views-field-title span.field-content a', this).text(),
                  image: $('div.views-field-image-image span.field-content a img', this).attr('src')
              });
          });
          results.splice(0,1);
          console.log(results);
          callback();
      });
  }, 1);

  q.drain = function(){

      fs.writeFileSync('./'+tail+'.json', JSON.stringify(results, null, 4));
  }

  q.push(URL);
  return JSON.stringify(results);
}
