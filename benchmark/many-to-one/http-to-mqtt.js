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
