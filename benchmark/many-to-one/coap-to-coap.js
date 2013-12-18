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
