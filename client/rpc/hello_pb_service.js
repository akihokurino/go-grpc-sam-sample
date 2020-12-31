/* eslint-disable */
// package: service
// file: hello.proto

var hello_pb = require("./hello_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var Hello = (function () {
  function Hello() {}
  Hello.serviceName = "service.Hello";
  return Hello;
}());

Hello.World = {
  methodName: "World",
  service: Hello,
  requestStream: false,
  responseStream: false,
  requestType: hello_pb.Empty,
  responseType: hello_pb.HelloWorld
};

exports.Hello = Hello;

function HelloClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

HelloClient.prototype.world = function world(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Hello.World, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.HelloClient = HelloClient;

