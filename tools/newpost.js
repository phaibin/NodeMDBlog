var readlineSync = require('readline-sync');
var stringex = require('stringex');
var YAML = require('yamljs');
var dateformat = require('dateformat');
var fs = require('fs');
var path = require('path');

var title = readlineSync.question('Title: ');
var slug = stringex.toUrl(stringex.toASCII(title));
// console.log(slug);

var article = '---\n';
article += YAML.stringify({'title':title, 'date':dateformat(Date.now(), 'yyyy-mm-dd HH:MM')});
article += '---\n';
article += 'Once upon a time...\n\n';
// console.log(article);

var path = path.join(__dirname, '../views/articles', dateformat(Date.now(), 'yyyy-mm-dd') + '-' + slug + '.md');
fs.writeFileSync(path, article, 'utf8', 'w+');
console.log('An article was created for you at '+path+'.');
