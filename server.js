const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const port = process.env.PORT || 8000;
const app = express();

mongoose.connect('mongodb://localhost/dashboard');
var UserSchema = new mongoose.Schema({
    name: String,
    weight: Number,
    color: String
})

mongoose.model('Animal', UserSchema);
var Animal = mongoose.model('Animal')



app.use(bodyParser.urlencoded({extended: true}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
mongoose.Promise = global.Promise;

app.get('/', function(request, response) {
    response.render('index');

});

app.post('/add', function(request, response){
    console.log('POST DATA', request.body);
    var animal = new Animal({name: request.body.name, weight: request.body.weight, color: request.body.color});
    animal.save(function(err){
        if(err){
            console.log('something went wrong');
        } else {
            console.log('successfully added an animal');
            response.redirect('/');
        }
    })
})

app.get('/showall', function(request, response){
    Animal.find({})
    // .populate('_name')
    .then(function(animals){
        console.log(animals);
        response.render('showall.ejs', { data: animals});
    }).catch(function(err){
        console.log('there was an error');
    })
})

app.get('/:id', function(req, res){
  Animal.find({ _id: req.params.id }, function(err, response) {
    if (err) { console.log(err); }
    res.render('showall', { data: response[0] });
  });
});


app.listen(port, () => console.log('listen on port 8000 ${ port }'));
