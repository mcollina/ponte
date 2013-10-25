
var coap = require("coap")
  , async = require("async")
  , request = require("superagent")
  , total = 10000
  , received = 0
  , print = function(text) {
              process.stdout.write(text + "\n");
            }
  , start = null
  , doReq = function() {
                    request
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
}
  , publish = function() {
                  //print("publishing");
                  console.error("all client connected, sending the message");
                  start = Date.now();
                  
                  async.times(total, function(id, cb) { 
setImmediate(doReq)
setImmediate(cb)
}, function() {});
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
