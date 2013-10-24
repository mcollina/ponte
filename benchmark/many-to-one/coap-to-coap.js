
var coap = require("coap")
  , total = 500
  , received = 0
  , print = function(text) {
              process.stdout.write(text + "\n");
            }
  , start = null
  , publish = function() {
                  //print("publishing");
                  console.error("all client connected, sending the message");
                  start = Date.now();
                  
                  for (i = 0; i < total; i++)
                    coap.request({
                      method: "PUT",
                      pathname: "/topics/hello"
                    }).end("world")
                }

coap.request({
  method: "PUT",
  pathname: "/topics/hello"
}).end("done").on("response", function() {
  var listener = coap.request({
    pathname: "/topics/hello",
    observe: true
  }).end();

  listener.on("response", function(res) {
    var first = true
    
    res.on("data", function() {
      // the first one is the current state
      if (first) {
        first = false
        publish()
        return
      }

      var time = Date.now() - start;

      received++
      print(received + "," + time);

      if (received === total) {
        console.error("done");
        res.close();
      }
    })
  })
})
