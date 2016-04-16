var cheerio = require('cheerio');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
Promise.promisifyAll(request);

  url = 'https://www.freecodecamp.com/nmuirbrook';

getUsers()
  .then(function(users) {
    return Promise.all(users.map(getUserInfo));
  })
  .then(function(usersInfo) {
    console.log('users info', usersInfo);
  });

function getUserInfo(username) {
  return request('https://www.freecodecamp.com/' + username)
    .then(function(response) {
      var $ = cheerio.load(response.body);
      
      var points = $('body > div.container > div:nth-child(6) > div > h1.flat-top.text-primary').text();
      points = parseInt(points.match(/\d+/)[0]);
      
      var longestStreak = $('body > div.container > div.col-md-12 > div.row > div > div > h4.col-sm-6.text-right').text();
      longestStreak = longestStreak.match(/\d+\s+\w+/)[0];
      
      var currentStreak = $('body > div.container > div.col-md-12 > div.row > div > div > h4.col-sm-6.text-left').text();
      currentStreak = currentStreak.match(/\d+\s+\w+/)[0];
      
      
      return {
        username: username,
        points: points,
        longestStreak: longestStreak,
        currentStreak: currentStreak
      };
    });
}

function getUsers() {
  return Promise.resolve(['nmuirbrook', 'jbarrus', 'deanbrodrick', 'reedawellman']);
}