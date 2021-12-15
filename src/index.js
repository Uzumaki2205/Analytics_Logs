const express = require('express');
const { engine } = require ('express-handlebars');
const path = require('path');
const route = require('./routes');

const app = express();

app.use(express.urlencoded({ extended:true }))
app.use(express.json())

app.use(express.static(path.join(__dirname, 'public')))

// app.engine('hbs', handlebars({
//   extname: '.hbs',
//   //helpers: require(path.join(__dirname + '/public/js/hbsHelper.js'))
// }));

// app.set('view engine', 'hbs');
// app.set('views', path.join(__dirname, 'resources/views'));

app.engine('.hbs', engine({
  extname: ".hbs",
  helpers: {
    sum: function(param) {
      return param + 1;
    },
    is_sqli: function(label) {
      return label === 'sqli';
    }
  }
}))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'resources', 'views'))

route(app);

const port = 3000;
app.listen(port)
console.log("Browser is listing at port " + port);