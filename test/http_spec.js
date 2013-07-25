
var request = require("supertest");
var ponte = require("../");

describe("Ponte as a REST API", function() {

  var settings;
  var instance;

  beforeEach(function(done) {
    settings = ponteSettings();
    instance = ponte(settings, done);
  });

  afterEach(function(done) {
    instance.close(done);
  });

  it("should GET an unknown topic and return a 404", function(done) {
    request(instance.rest.http)
      .get("/topics/hello")
      .expect(404, done);
  });

  it("should PUT a topic and return a 204", function(done) {
    request(instance.rest.http)
      .put("/topics/hello")
      .send("hello world")
      .expect(204, done);
  });

  it("should PUT and GET a topic and its payload", function(done) {
    request(instance.rest.http)
      .put("/topics/hello")
      .set("content-type", "text/plain")
      .send("hello world")
      .expect(204, function() {
        request(instance.rest.http)
          .get("/topics/hello")
          .expect(200, "hello world", done);
      });
  });
});
