import {AddRequest, Cursor, Widget, WidgetList} from "./rpc/widget_pb";
import {grpc} from "@improbable-eng/grpc-web";
import {WidgetService} from "./rpc/widget_pb_service";
import {NodeHttpTransport} from "@improbable-eng/grpc-web-node-http-transport/lib";
import Code = grpc.Code;


const baseURL = "https://13k3scljb1.execute-api.ap-northeast-1.amazonaws.com/default";

const list = () => {
  const req = new Cursor();
  req.setNextCursor("")
  grpc.invoke(WidgetService.List, {
    host: baseURL,
    request: req,
    metadata: new grpc.Metadata({}),
    transport: NodeHttpTransport(),
    onHeaders: (headers: grpc.Metadata) => {
      console.log("---------- onHeaders ----------");
      console.log(headers);
    },
    onMessage: (message: WidgetList) => {
      console.log("---------- onMessage ----------");
      message.getItemsList().forEach((item: Widget) => {
        console.log(item.toObject());
      })
      console.log(message.getNextCursor());
    },
    onEnd: (code: Code, message: string, trailers: grpc.Metadata) => {
      console.log("---------- onEnd ----------");
      console.log(code);
      console.log(message);
    }
  });
}

const add = () => {
  const req = new AddRequest();
  req.setUserId("1");
  req.setMsg("メッセージ1");
  grpc.invoke(WidgetService.Add, {
    host: baseURL,
    request: req,
    metadata: new grpc.Metadata({}),
    transport: NodeHttpTransport(),
    onHeaders: (headers: grpc.Metadata) => {
      console.log("---------- onHeaders ----------");
      console.log(headers);
    },
    onMessage: (message: Widget) => {
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

list();
// add();