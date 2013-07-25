
var mqtt = require("mqtt");
var ponte = require("../");

describe("Ponte as an MQTT server", function() {

  var settings;
  var instance;

  beforeEach(function(done) {
    settings = ponteSettings();
    instance = ponte(settings, done);
  });

  afterEach(function(done) {
    instance.close(done);
  });

  it("should allow a client to publish and subscribe", function(done) {
    var client = mqtt.createClient(settings.mqtt.port);
    client
      .subscribe("hello")
      .publish("hello", "world")
      .on("message", function(topic, payload) {
        expect(topic).to.eql("hello");
        expect(payload).to.eql("world");
        done();
      });
  });
});
