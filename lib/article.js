var fs = require('fs');
var fm = require('front-matter');
var path = require('path');
var strsplit = require('strsplit');
var dateformat = require('dateformat');
var marked =require('marked');

var Article = function (filePath) {
  this.filePath = filePath;

  var fileContent = fs.readFileSync(filePath, 'utf8');
  // console.log(filePath);
  var fmContent = fm(fileContent);
  Object.assign(this, fmContent.attributes);
  this.date = new Date(this.date);
  // console.log(this.title);
  // console.log(this.date);
  // console.log(dateformat(this.date, 'yyyy-M-d'));
  this.body = fmContent.body;
  // console.log([(/([^]{1,150}).*?(\n|$)/m).exec(this.body)[0]]);
};

Object.defineProperty(Article.prototype, 'slug', { get: function() {
  return path.basename(this.filePath, '.md');
}});

Object.defineProperty(Article.prototype, 'path', { get: function() {
  return '/' + strsplit(this.slug, '-', 4).join('/');
}});

Object.defineProperty(Article.prototype, 'showDate', { get: function() {
  return dateformat(this.date, 'yyyy-mm-dd');
}});

Object.defineProperty(Article.prototype, 'summary', { get: function() {
  return marked((/([^]{1,150}[^]*?)(\n|$)/m).exec(this.body)[0]);
}});

Object.defineProperty(Article.prototype, 'monthIndex', { get: function() {
  return dateformat(this.date, 'yyyy.mm');
}});

Article.prototype.toString = function() {
  return this.filePath;
};

Article.prototype.match = function(keywords) {
  var that = this;
  var find = false;
  this.searchTitle = this.title;
  this.searchContent = '';
  keywords.forEach(function(keyword) {
    if (that.title.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
      find = true;
      var re = new RegExp(keyword, 'i');
      that.searchTitle = that.title.replace(re, '<span class=\"search\">'+keyword+'</span>');
    }

  });
  return find;
};

Article.load = function() {
  console.log('load');
  var allFiles = fs.readdirSync('views/articles').filter(function(file) {
    return file.substr(-3) === '.md';
  });
  allFiles = allFiles.map(function(f) { return 'views/articles/' + f; });
  var allArticles = allFiles.map(function(f) {
    var article = new Article(f);
    Article[article.slug] = article;
    return article;
  });
  Article.allArticles = allArticles.sort(function(left, right) {
    return new Date(right.date) - new Date(left.date);
  });

  var archives = {};

  Article.allArticles.forEach(function(article, index) {
    if (index > 0) {
      article.left = Article.allArticles[index-1];
    }
    if (index < Article.allArticles.length-1) {
      article.right = Article.allArticles[index+1];
    }

    archives[article.monthIndex] = archives[article.monthIndex] || [];
    archives[article.monthIndex].push(article);
  });

  Article.archives = archives;
};

Article.findByTag = function(tag) {
  var filtered = Article.allArticles.filter(function(article) {
    if (article.tags !== undefined && article.tags.indexOf(tag) !== -1) {
      console.log(article.tags);
      return true;
    }
    return false;
  });
  return [].concat(filtered);
};

Article.search = function(keywords) {
  var filtered = Article.allArticles.filter(function(article) {
    return article.match(keywords);
  });
  return [].concat(filtered);
};

var log = ['test'];
var obj = {
  get latest () {
    if (log.length == 0) return undefined;
    return log[log.length - 1];
  }
};
console.log (obj.latest); // Will return "test".

module.exports = Article;
