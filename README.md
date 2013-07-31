Ponte
=====

[![Build
Status](https://travis-ci.org/mcollina/ponte.png)](https://travis-ci.org/mcollina/ponte)

__Ponte__ is a multi-transport Internet of Things / Machine to Machine broker.
As the current state it supports [MQTT](http://mqtt.org/) and REST
APIs.

__Ponte__ is still under active development, but it should work :).
Let me know if you plan to use __Ponte__ in production.

## Installation 

Ponte is a node.js application, so it needs [node.js](http://nodejs.org)
to run.

```
$: npm install ponte bunyan -g
$: ponte -v | bunyan
```

Then you can connect to it with your preferred [MQTT](http://mqtt.org)
client.

## Configuration

TO BE DONE!

## Pub/Sub Brokers

__Ponte__ is based on
[Ascoltatori](http://github.com/mcollina/ascoltatori), so it supports the same backends:

* [RabbitMQ](http://www.rabbitmq.com/) and all implementations of
  the [AMQP](http://www.amqp.org/) protocol.
* [Redis](http://redis.io/), the fabulous key/value store by
  [@antirez](https://github.com/antirez).
* [Mosquitto](http://mosquitto.org/) and all implementations of the
  [MQTT](http://mqtt.org/) protocol.
* [MongoDB](http://www.mongodb.org/), the documental NoSQL that
  is revolutioning how web apps are built.
* [ZeroMQ](http://www.zeromq.org/) without a central broker, so
  Ascoltatori can also be used in a P2P fashion.

## Persistence

__Ponte__ requires a persistent storage for HTTP syndication and MQTT
support.
At the current state, it uses [Mosca](http://github.com/mcollina/mosca)
persistence layer.
Thus, it offers several persitence options:

* [Memory](http://mcollina.github.com/mosca/docs/lib/persistence/memory.js.html),
* [LevelUp](http://mcollina.github.com/mosca/docs/lib/persistence/levelup.js.html),
* [Redis](http://mcollina.github.com/mosca/docs/lib/persistence/redis.js.html),
* [MongoDB](http://mcollina.github.com/mosca/docs/lib/persistence/mongo.js.html)

All of them can be configured from the configuration file, under the
`persistence` key. The only exception is LevelUp, which can be specified
by using the `--db` option from the command line.

## To do

* [ ] Add WebSocket and Server-Sent Events support.
* [ ] Add a Web App for reading and writing.
* [ ] Add CoAP support.
* [ ] Standalone persistence layer.

## Contributing to Ponte

* Check out the latest master to make sure the feature hasn't been
  implemented or the bug hasn't been fixed yet
* Check out the issue tracker to make sure someone already hasn't
  requested it and/or contributed it
* Fork the project
* Start a feature/bugfix branch
* Commit and push until you are happy with your contribution
* Make sure to add tests for it. This is important so I don't break it
  in a future version unintentionally.
* Please try not to mess with the Makefile and package.json. If you
  want to have your own version, or is otherwise necessary, that is
  fine, but please isolate to its own commit so I can cherry-pick around
  it.

## LICENSE - "New BSD License"

Copyright (c) 2013, Matteo Collina http://matteocollina.com
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are
met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following
      disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer
      in the documentation and/or other materials provided with the
      distribution.
    * Neither the name of the <organization> nor the
      names of its contributors may be used to endorse or promote
      products derived from this software without specific prior written
      permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
