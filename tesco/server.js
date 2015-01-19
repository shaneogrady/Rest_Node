var express = require('express'),
    path = require('path'),
    product = require('./routes/products');

var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
    app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/products', product.findAll);
app.get('/products/:id', product.findById);
app.post('/products', product.addproduct);
app.put('/products/:id', product.updateproduct);
app.delete('/products/:id', product.deleteproduct);

app.listen(3000);
console.log('Listening on port 3000...');