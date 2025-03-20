```proto
rpc RateLimit(RateLimitRequest) returns (RateLimitResponse) {}
```

# Rate Limits

Rate limits allow for quick rate limit setups, which can be used to throttle requests within your application.

For each request, you must provide a key and transaction ID.

The `key` is the unique value for the limiter.
The `transactionID` is the unique value for the current action. This stops double reporting of individual events.

Limits can be setup with a `hardLimit` which stops writing any transactions after the limit is set.
`rateMinutes` allows you to specify the time period the limit is set for, this allows for a sliding window of time to be used.

Events are written with a 7 day TTL.

The `storeHistorical` flag will store a count minute by minute, allowing for charting of the rate limit, and reporting on any overages.

`readDistinct` is a slightly higher cost operation, but will return the distinct count of transactions for the key, providing more accuracy. Without this flag, duplicate writes to a transaction ID will be counted.

## Rate Limit Response

The response provided contains the current count on the limiter, and a bool for `over_limit` which if set, will indicate no additional transactions have been written to the limiter.