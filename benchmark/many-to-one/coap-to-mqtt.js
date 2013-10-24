
var coap = require("coap")
  , mqtt = require("mqtt")
  , async = require("async")
  , total = 10000
  , received = 0
  , listener = mqtt.createClient()
  , print = function(text) {
              process.stdout.write(text + "\n");
            }
  , start = null
  , publish = function() {
                  console.error("all client connected, sending the message");
                  start = Date.now();

                  async.timesSeries(total, function(id, cb) { 
                    coap.request({
                      method: "PUT",
                      pathname: "/topics/hello"
                    }).end("world")
	            setImmediate(cb)
		 }, function() {})
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
