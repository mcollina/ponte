
var mqtt = require("mqtt")
  , request = require("superagent")
  , total = 500
  , sent = 0
  , received = 0
  , listener = mqtt.createClient()
  , print = function(text) {
              process.stdout.write(text + "\n");
            }
  , start = null
  , publish = function() {
                  console.error("client connected, sending the message");
                  start = Date.now();
                  
                  for (i = 0; i < total; i++)
                    request
                        .put('http://localhost:3000/topics/hello')
                        .send("world")
                        .end(function(error, res){
                          //if (sent++ % (total / 10)) {
                          //  console.error("sent", sent)
                          //}
                        });
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
