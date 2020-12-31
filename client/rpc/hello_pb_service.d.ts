// package: service
// file: hello.proto

import * as hello_pb from "./hello_pb";
import {grpc} from "@improbable-eng/grpc-web";

type HelloWorld = {
  readonly methodName: string;
  readonly service: typeof Hello;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof hello_pb.Empty;
  readonly responseType: typeof hello_pb.HelloWorld;
};

export class Hello {
  static readonly serviceName: string;
  static readonly World: HelloWorld;
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

export class HelloClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  world(
    requestMessage: hello_pb.Empty,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: hello_pb.HelloWorld|null) => void
  ): UnaryResponse;
  world(
    requestMessage: hello_pb.Empty,
    callback: (error: ServiceError|null, responseMessage: hello_pb.HelloWorld|null) => void
  ): UnaryResponse;
}

