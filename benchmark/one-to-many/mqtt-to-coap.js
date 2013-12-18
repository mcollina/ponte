/*******************************************************************************
 * Copyright (c) 18-dec-2013 University of Bologna
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * and Eclipse Distribution License v1.0 which accompany this distribution.
 *
 * The Eclipse Public License is available at 
 *    http://www.eclipse.org/legal/epl-v10.html
 * and the Eclipse Distribution License is available at 
 *   http://www.eclipse.org/org/documents/edl-v10.php.
 *
 * Contributors:
 *    Matteo Collina - initial API and implementation and/or initial documentation
 *******************************************************************************/

var coap = require("coap")
  , mqtt = require("mqtt")
  , total = 5000
  , print = function(text) {
              process.stdout.write(text + "\n");
            }
  , receivers = 0
  , publisher = mqtt.createClient()
  , start = null
  , handler = function(packet) {
                var time = Date.now() - start;
                connected--;
                print((total - connected) + "," + time);
                this.close();
              }
  , connected = 0 
  , publish = function() {
                  var req;
                  connected++;
                  if (connected === total) {
                    //print("publishing");
                    console.error("all client connected, sending the message");
                    start = Date.now();
                    publisher.publish("hello", "world", { qos: 1 }, function() {
                      console.error("done");
                      publisher.end();
                    });
                  }
                }
  , i = 0
  , created = function(res) {
                res.once('data', function() {
                  // the first one is the current one
                  res.once('data', handler)
                })
                publish()
                next()
              }
  , next = function() {
             var current = receivers

             if (receivers++ < total) {

               var req = coap.request({ 
                 pathname: "/topics/hello",
                 observe: true
               }).end();

               req.on('response', created)

               req.on('error', function(err) {
                  receivers--;
                  console.error(err);
                  setTimeout(next, 1000);
                  return;
               });
             }
           };

coap.request({
  method: "PUT",
  pathname: "/topics/hello"
}).end("done").on("response", function() {
  next();
})
