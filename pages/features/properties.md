```proto
  string text = 2;
  int64 int = 3;
  bool bool = 4;
  double float = 5;
  google.protobuf.Timestamp time = 6;
  string secure_text = 7;
  bytes raw = 8;

  RepeatedValue array = 9;
  RepeatedValue array_append = 10;
  RepeatedValue array_reduce = 11;
  
  RepeatedValue:
  map<string, bytes> key_value = 1;
  repeated string strings = 2;
  repeated int64 ints = 3;
```

# Property Types

Data can be transferred to KeystoneDB in a variety of formats. The following are the supported data types:

- `Text` - A string of text.
- `Number` - A 64-bit integer.
- `Boolean` - A boolean value.
- `Float` - A 64-bit floating point number.
- `Time` - A timestamp.
- `SecureText` - A text value that is encrypted at rest.
- `VerifyText` - A text value that is hashed for verification, but not decrypted
- `Amount` - A financial amount, with a currency code and the number of units
- `KeyValue` - Map of string keys & values.
- `Strings` - Array/Slice of strings
- `Ints` - Array/Slice of integers
- `IntSet` - A unique set of integers
- `StringSet` - A unique set of strings
- `Bytes` - Raw bytes













