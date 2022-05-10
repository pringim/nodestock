const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const path = require('path');
const request = require('request');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5000;

// use body parser middleware
app.use(bodyParser.urlencoded({extended: false}));

// API Key pk_8fd4d93086094b8c984c33dd2f5c96e2
// Create call_api function
function call_api(finishedAPI, ticker) {
    request('https://cloud.iexapis.com/stable/stock/' + ticker + '/quote?token=pk_8fd4d93086094b8c984c33dd2f5c96e2', { json: true}, (err, res, body) => {
    if (err) {return console.log(err);}
    if (res.statusCode === 200){
       // {console.log(body);
        finishedAPI(body);
        };
    });  
};

// Set Handlebars Middleware
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

// Set handlebar index GET routes
app.get('/', function (req, res) {
    call_api(function(doneAPI) {
            res.render('home', {
            stock: doneAPI
        }); 
    }, "tsla");
    
});

// Set handlebar index POST route
app.post('/', function (req, res) {
    call_api(function(doneAPI) {
            //posted_stuff = req.body.stock_ticker;
            res.render('home', {
            stock: doneAPI,
        }); 
    }, req.body.stock_ticker);
    
});

// Create About page route
app.get('/about.html', function (req, res) {
    res.render('about');
});

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => console.log('Sever Listening on port ' + PORT));