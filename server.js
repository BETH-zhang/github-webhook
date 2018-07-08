var http = require('http')
var createHandler = require('./oschina-webhook-handler/lib/github-webhook-handler.js')
var handler = createHandler([
  {path: '/', secret: 'root'},
  {path: '/admin', secret: 'bethroot'},
])

function run_cmd(cmd, args, callback) {
  var spawn = require('child_process').spawn;
  var child = spawn(cmd, args);
  var resp = "";

  child.stdout.on('data', function(buffer) { resp += buffer.toString(); });
  child.stdout.on('end', function() { callback (resp) });
}

http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404
    res.end('no such location')
  })
}).listen(7777)

handler.on('error', function (err) {
  console.error('Error:', err.message)
})

handler.on('push', function (event) {
  console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref,
    event.url);

    switch (event.url) {
      case '/':
         console.log(`pull ${event.payload.repository.name} data...`);
         run_cmd('sh', ['./gitpull.sh',event.payload.repository.name,8080], function(text){ console.log(text) });
         break;
      case '/admin':
         console.log(`pull ${event.payload.repository.name} data...`);
         run_cmd('sh', ['./gitpull.sh',event.payload.repository.name,7002], function(text){ console.log(text) });
         break;
      default:
         break;
    }
})

console.log('http://qiuge.me:7777');
