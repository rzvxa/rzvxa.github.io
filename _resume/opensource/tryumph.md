---
title: Tryumph
---

#### Bring the "Umph" back to the JavaScript error handling!

Tryumph is a cool little library written in __TypeScript__, Which can improve the error handling of both __async__ and __sync__ operations throughout your application.

Here is a quick peek!

```js
  const result = await try$(itMayThrow(a, b, c));
  result.match(
    when(Ok, consumeResult),
    when(Err, handleError)
  );
```
Or even better, You can use the `.dwait` function call on the returned promise of `try$` to get a `DeferredPromise` built using [dwait library](https://github.com/rzvxa/dwait):
```js
  const result = await try$(itMayThrow(a, b, c)).dwait().match(
    when(Ok, consumeResult),
    when(Err, handleError)
  ).await;
```
With the use of `DeferredPromise` we can keep chaining functions instead of awaiting each result, And we can defer all awaits to the last operation.

Does that seem too Rusty to you? What about something like this? Let's Go!
```js
  const [res, err] = await try$(itMayThrow(a, b, c));
  if (!!err) {
    handleError(err);
    return;
  }
  consumeResult(res);
```

You may say these are all async, What about sync operations? Here are the examples above but this time as sync functions.
```js
  const result = tryFn$(itMayThrow, a, b, c);
  result.match(
    when(Ok, consumeResult),
    when(Err, handleError)
  );
```
Or
```js
  const [res, err] = tryFn$(itMayThrow, a, b, c);
  if (!!err) {
    handleError(err);
    return;
  }
  consumeResult(res);
```

<a class="button" href="https://www.npmjs.com/package/tryumph" target="_blank" rel="noopener noreferrer">View on NPM</a>
