
var mqtt = require("mqtt")
  , coap = require("coap")
  , total = 500
  , received = 0
  , print = function(text) {
              process.stdout.write(text + "\n");
            }
  , publishers = []
  , start = null
  , connected = 0 
  , publish = function() {
                  var i
                  connected++;
                  //print("connected " + connected);
                  if (connected === total) {
                    //print("publishing");
                    console.error("all client connected, sending the message");
                    start = Date.now();
                    
                    for (i = 0; i < publishers.length; i++)
                      publishers[i].publish({ topic: "hello", payload: "world", qos: 1, messageId: 42, retain: true })
                  }
                }
  , i = 0
  , created = function(err, conn) {
                if (err) {
                  console.error(err);
                  setTimeout(next, 1000);
                  return;
                }

                publishers.push(conn);

                if (publishers.length % (total / 10) === 0) {
                  console.error("publishers " + publishers.length);
                }

                conn.on("connack", publish);
                conn.on("connack", next);
                conn.on("puback", function() {
                  connected--;
                  this.stream.end()
                });

                conn.connect({
                  protocolId: 'MQIsdp',
                  protocolVersion: 3,
                  clientId: "client" + publishers.length,
                  keepalive: 1000,
                  clean: true
                });
              }
  , next = function() {
             if (publishers.length < total) {
               mqtt.createConnection(1883, '127.0.0.1', created);
             }
           };

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
    next()
    
    res.on("data", function() {
      // the first one is the current state
      if (first) {
        first = false
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
