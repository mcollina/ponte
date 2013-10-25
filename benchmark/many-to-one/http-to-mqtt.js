
var mqtt = require("mqtt")
  , request = require("superagent")
  , async = require("async")
  , total = 10000
  , sent = 0
  , received = 0
  , agent = new (require("http")).Agent()
  , listener = mqtt.createClient()
  , print = function(text) {
              process.stdout.write(text + "\n");
            }
  , start = null
  , doReq = function() {
                    var req =request
                        .put('http://localhost:3000/topics/hello')
                        .send("world")
                        .end(function(error, res){
			  if (error) {
setTimeout(doReq(), 10)
console.error(error)
}
                          //if (sent++ % (total / 10)) {
                          //  console.error("sent", sent)
                          //}
                        });
			//req.agent(agent)
}
  , publish = function() {
                  console.error("client connected, sending the message");
                  start = Date.now();

                  async.times(total, function(id, cb) { 
setImmediate(doReq)
setImmediate(cb)
}, function() {});
                  
                }

request
  .put('http://localhost:3000/topics/hello')
  .send("world")
  .set('Accept', 'application/json')
  .end(function(error, res){
    var first = true;
    listener.subscribe("hello", publish);
    listener.on("message", function() {
      // the first one is retained
      if (first) {
        first = false;
        return;
      }

      var time = Date.now() - start;

      received++
      print(received + "," + time);

      if (received === total) {
        console.error("done");
        listener.end();
      }
    });
  });

agent.maxSockets = 1000;
