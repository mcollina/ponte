
var mqtt = require("mqtt")
  , request = require("superagent")
  , total = 5000
  , print = function(text) {
              process.stdout.write(text + "\n");
            }
  , receivers = []
  , start = null
  , handler = function(packet) {
                var time = Date.now() - start;
                connected--;
                print(time);
                //print("disconnected " +  connected);
                this.stream.end();
              }
  , connected = 0 
  , publish = function() {
                  connected++;
                  //print("connected " + connected);
                  if (connected >= total) {
                    //print("publishing");
                    console.error("all client connected, sending the message");
                    start = Date.now();
                    request
                        .put('http://localhost:3000/topics/hello')
                        .send("world")
                        .set('X-API-Key', 'foobar')
                        .set('Accept', 'application/json')
                        .end(function(error, res){
                          console.error("done");
                        });
                  }
                }
  , i = 0
  , created = function(err, conn) {
                if (err) {
                  console.error(err);
                  setTimeout(next, 1000);
                  return;
                }

                receivers.push(conn);

                if (receivers.length % 500 === 0) {
                  console.error("receivers " + receivers.length);
                }

                conn.on("connack", function() {
                  conn.subscribe({ messageId: 2, subscriptions: [{ topic: "hello", qos: 0 }] });
                });

                conn.on("publish", handler);
                conn.on("suback", publish);
                conn.on("suback", next);

                conn.connect({
                  protocolId: 'MQIsdp',
                  protocolVersion: 3,
                  clientId: "client" + receivers.length,
                  keepalive: 1000,
                  clean: true
                });
              }
  , next = function() {
             if (receivers.length <= total) {
               mqtt.createConnection(1883, '127.0.0.1', created);
             }
           };

next();
