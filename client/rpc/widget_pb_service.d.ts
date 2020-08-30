// package: service
// file: widget.proto

import * as widget_pb from "./widget_pb";
import {grpc} from "@improbable-eng/grpc-web";

type WidgetServiceList = {
  readonly methodName: string;
  readonly service: typeof WidgetService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof widget_pb.Cursor;
  readonly responseType: typeof widget_pb.WidgetList;
};

type WidgetServiceAdd = {
  readonly methodName: string;
  readonly service: typeof WidgetService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof widget_pb.AddRequest;
  readonly responseType: typeof widget_pb.Widget;
};

export class WidgetService {
  static readonly serviceName: string;
  static readonly List: WidgetServiceList;
  static readonly Add: WidgetServiceAdd;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class WidgetServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  list(
    requestMessage: widget_pb.Cursor,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: widget_pb.WidgetList|null) => void
  ): UnaryResponse;
  list(
    requestMessage: widget_pb.Cursor,
    callback: (error: ServiceError|null, responseMessage: widget_pb.WidgetList|null) => void
  ): UnaryResponse;
  add(
    requestMessage: widget_pb.AddRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: widget_pb.Widget|null) => void
  ): UnaryResponse;
  add(
    requestMessage: widget_pb.AddRequest,
    callback: (error: ServiceError|null, responseMessage: widget_pb.Widget|null) => void
  ): UnaryResponse;
}

