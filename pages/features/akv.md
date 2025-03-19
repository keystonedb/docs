# App Key Value Store

    rpc AKVGet(AKVGetRequest) returns (AKVGetResponse){}
    rpc AKVPut(AKVPutRequest) returns (GenericResponse){}
    rpc AKVDel(AKVDelRequest) returns (GenericResponse){}

App Key Value Store allows for Keystone Property types to be stored against a key.

AKV Data is used for App Storage, and not stored against workspaces.

This is useful for storing application configuration data.