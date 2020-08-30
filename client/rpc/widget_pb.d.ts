// package: service
// file: widget.proto

import * as jspb from "google-protobuf";

export class Widget extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getUserId(): string;
  setUserId(value: string): void;

  getMsg(): string;
  setMsg(value: string): void;

  getCreatedAt(): string;
  setCreatedAt(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Widget.AsObject;
  static toObject(includeInstance: boolean, msg: Widget): Widget.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Widget, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Widget;
  static deserializeBinaryFromReader(message: Widget, reader: jspb.BinaryReader): Widget;
}

export namespace Widget {
  export type AsObject = {
    id: string,
    userId: string,
    msg: string,
    createdAt: string,
  }
}

export class WidgetList extends jspb.Message {
  clearItemsList(): void;
  getItemsList(): Array<Widget>;
  setItemsList(value: Array<Widget>): void;
  addItems(value?: Widget, index?: number): Widget;

  getNextCursor(): string;
  setNextCursor(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WidgetList.AsObject;
  static toObject(includeInstance: boolean, msg: WidgetList): WidgetList.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WidgetList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WidgetList;
  static deserializeBinaryFromReader(message: WidgetList, reader: jspb.BinaryReader): WidgetList;
}

export namespace WidgetList {
  export type AsObject = {
    itemsList: Array<Widget.AsObject>,
    nextCursor: string,
  }
}

export class Cursor extends jspb.Message {
  getNextCursor(): string;
  setNextCursor(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Cursor.AsObject;
  static toObject(includeInstance: boolean, msg: Cursor): Cursor.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Cursor, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Cursor;
  static deserializeBinaryFromReader(message: Cursor, reader: jspb.BinaryReader): Cursor;
}

export namespace Cursor {
  export type AsObject = {
    nextCursor: string,
  }
}

export class AddRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): void;

  getMsg(): string;
  setMsg(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AddRequest): AddRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AddRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddRequest;
  static deserializeBinaryFromReader(message: AddRequest, reader: jspb.BinaryReader): AddRequest;
}

export namespace AddRequest {
  export type AsObject = {
    userId: string,
    msg: string,
  }
}

