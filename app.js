var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

var fs = require('fs');
var marked = require('marked');
var Feed = require('feed');

Article = require('./lib/article');
Article.load();
// console.log(Article.allArticles);
// Article.allArticles.forEach(function(article) {
//   console.log(article.path);
// });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('connect-livereload')());

app.get('/', function(req, res) {
  res.render('index', { title: '海神', articles: Article.allArticles.slice(0, 6) });
});

app.get('/tags/:tag', function(req, res, next) {
  var tag = req.params.tag;
  res.render('tag', { title:tag, tag: tag, articles: Article.findByTag(tag) });
});

app.get('/atom.xml', function(req, res, next) {
  var feed = new Feed({
    title:        '海神',
    description:  '文祥的Blog',
    link: "http://baidu.com",
    author: {
        name:     '文祥',
        email:    'phaibin@gmail.com',
        link:     'https://phaibin.tk'
    }
  });
  Article.allArticles.slice(0, 6).forEach(function(article) {
    feed.addItem({
      title: article.title,
      link: 'http://phaibin.tk/' + article.path,
      date: article.date,
      description: article.summary,
      content: marked(article.body)
    });
  });
  res.send(feed.render('atom-1.0'));
});

app.get('/archives', function(req, res, next) {
  res.render('pages/archives', { title:'存档', archives: Article.archives });
});

app.get('/search', function(req, res, next) {
  var keywords = req.query['keyword'].split(' ');
  res.render('search', { title:keywords, articles:Article.search(keywords).slice(0, 10) });
});

app.get('/about', function(req, res, next) {
  var path = 'views/pages/about.md';
  var content = fs.readFileSync(path, 'utf8');
  res.render('page', { title:'关于我', content: marked(content) });
});

app.get('/dandelion', function(req, res, next) {
  var path = 'views/pages/dandelion.md';
  var content = fs.readFileSync(path, 'utf8');
  res.render('page', { title:'关于我', content: marked(content) });
});

app.get('/my-favorite-tools', function(req, res, next) {
  var path = 'views/pages/my-favorite-tools.md';
  var content = fs.readFileSync(path, 'utf8');
  res.render('page', { title:'关于我', content: marked(content) });
});

app.get('/snapshot', function(req, res, next) {
  var path = 'views/pages/snapshot.md';
  var content = fs.readFileSync(path, 'utf8');
  res.render('page', { title:'Blog快照', content: marked(content) });
});

app.get('/works', function(req, res, next) {
  var path = 'views/pages/works.md';
  var content = fs.readFileSync(path, 'utf8');
  res.render('page', { title:'作品', content: marked(content) });
});

app.get('/dandelion', function(req, res, next) {
  var path = ['views/blogs/', req.params.title, '.md'].join('');
  var content = fs.readFileSync(path, 'utf8');
  res.render('blog', { title:'Blog', md: marked(content) });
});

app.get('/:year/:month/:day/:slug', function(req, res, next) {
  var article = Article[[req.params.year, req.params.month, req.params.day, req.params.slug].join('-')];
  res.render('article', { title:article.title, article:article, md: marked });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var server = app.listen(4000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
