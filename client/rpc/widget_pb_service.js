/* eslint-disable */
// package: service
// file: widget.proto

var widget_pb = require("./widget_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var WidgetService = (function () {
  function WidgetService() {}
  WidgetService.serviceName = "service.WidgetService";
  return WidgetService;
}());

WidgetService.List = {
  methodName: "List",
  service: WidgetService,
  requestStream: false,
  responseStream: false,
  requestType: widget_pb.Cursor,
  responseType: widget_pb.WidgetList
};

WidgetService.Add = {
  methodName: "Add",
  service: WidgetService,
  requestStream: false,
  responseStream: false,
  requestType: widget_pb.AddRequest,
  responseType: widget_pb.Widget
};

exports.WidgetService = WidgetService;

function WidgetServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

WidgetServiceClient.prototype.list = function list(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(WidgetService.List, {
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

WidgetServiceClient.prototype.add = function add(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(WidgetService.Add, {
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

exports.WidgetServiceClient = WidgetServiceClient;

