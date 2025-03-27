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

## Attributes

The Keystone attribute works similar to json/yaml attributes, where it contains a comma separated list, where the first part is the name (if left blank, the property name will be generated), and options are provided from that point.

	PaymentCount int64 `keystone:"_count_relation:payment"`

- `_entity_id` - The loaded Keystone ID (Parent)
- `_child_id` - The loaded Keystone ID (Child)
- `_schema_id` - Schema ID
- `_created` - Date/Time Created
- `_state_change` - Date/Time State Change
- `_state` - Current State
- `_last_update` - Date/Time Last Updated

## Calculated Attributes

- `_count_relation`
- `_count_descendant`

Optionally suffixed with :vendorId[:appId[:key]]

e.g.

```
  _count_relation:vendorId:appId:key
  _count_relation:vendorId:appId
  _count_relation:vendorId
```

Optionally suffixed with :type[:vendorId[:appId[:key]]]

- `_child_count`
- `_child_sum`
- `_child_min`
- `_child_max`
- `_child_avg`

e.g.

```
  child_count:type:vendorId:appId:key
  child_count:type:vendorId:appId
  child_count:type:vendorId
  child_count:type
```