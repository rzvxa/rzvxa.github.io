---
title: dwait
---

#### Deferred async operation made easy in JavaScript.

`dwait` is an alternative way of handling async tasks. The name stands for `Deferred Await` and it basically lets you defer multiple `await` operations to the end of the function chain, So you can stop writing things like this:

```js
  const resp = await getUserAsync();
  const json = await resp.body.toJson();
  const username = json.username.trim();
```

And instead, write more readable(in my opinion) code like this:

```js
  const username = await dwait(getUserAsync())
    .body
    .toJson()
    .username
    .trim()
    .await; // or .toPromise();
```

Or you can pass the function itself to the `dwait` function and get a deferred function you can use directly!

```js
  const getUserDeferred = dwait(getUserAsync);
  const username = await getUserDeferred()
    .body
    .toJson()
    .username
    .trim()
    .await; // or .toPromise();
```

<a class="button" href="https://www.npmjs.com/package/dwait" target="_blank" rel="noopener noreferrer">View on NPM</a>
