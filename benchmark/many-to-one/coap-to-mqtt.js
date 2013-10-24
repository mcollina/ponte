
var coap = require("coap")
  , mqtt = require("mqtt")
  , total = 500
  , received = 0
  , listener = mqtt.createClient()
  , print = function(text) {
              process.stdout.write(text + "\n");
            }
  , start = null
  , publish = function() {
                  console.error("all client connected, sending the message");
                  start = Date.now();
                  
                  for (i = 0; i < total; i++)
                    coap.request({
                      method: "PUT",
                      pathname: "/topics/hello"
                    }).end("world")
                }

listener.subscribe("hello", publish);
listener.on("message", function() {
  var time = Date.now() - start;

  received++
  print(received + "," + time);

  if (received === total) {
    console.error("done");
    listener.end();
  }
})
