import {grpc} from "@improbable-eng/grpc-web";
import {Hello} from "./rpc/hello_pb_service";
import {HelloWorld, Empty} from "./rpc/hello_pb";
import {NodeHttpTransport} from "@improbable-eng/grpc-web-node-http-transport/lib";
import Code = grpc.Code;


const baseURL = "https://6pbzbpxgk5.execute-api.ap-northeast-1.amazonaws.com/default";

const hello = () => {
  const req = new Empty();
  grpc.invoke(Hello.World, {
    host: baseURL,
    request: req,
    metadata: new grpc.Metadata({}),
    transport: NodeHttpTransport(),
    onHeaders: (headers: grpc.Metadata) => {
      console.log("---------- onHeaders ----------");
      console.log(headers);
    },
    onMessage: (message: HelloWorld) => {
      console.log("---------- onMessage ----------");
      console.log(message.toObject());
    },
    onEnd: (code: Code, message: string, trailers: grpc.Metadata) => {
      console.log("---------- onEnd ----------");
      console.log(code);
      console.log(message);
    }
  });
}

hello();