# A+ Promises

* Standard documented at https://promisesaplus.com/
* Check if something conforms at https://promisesaplus.com/implementations
* ES 6 promises are compliant, so no packages are really needed
* some common extras like the `finally()` method are not part of the standard, but are proposed for future ES standards
  * Chrome supports `finally()`, but node doesn't

## Construction

```js
new Promise((resolve, reject) =>
/* do something */
if (allWentWell) {
    resolve(anyValue)
} else {
    reject(reason)
})
```

## then function

This is the core of what promises are about

```js
promise.then(result => nextStep(result), reason => handleError(reason));
```

Cases:

* promise succeeded (`resolve` called)
  * run next step using result
  * if the result was a promise returning a promise returning a promise ... wait for all those to resolve, and pass the final result to nextStep
* if the promise failed (`reject` called, or returned a rejected promise, or `throw` called)
  * run the handleError function

Equivalent functions:

* `.catch(reason => handle(reason))` is equivalent to `.then(undefined, reason => handle(reason))`
* `.finally(cleanup)` is equivalent to `.then(() => cleanup(), () => cleanup())`
  * finally is not part of the standard yet, so don't count on it being available

## Chaining

The `then` function returns another promise, so you can call `then` again on that result. Some cases to keep in mind:

* handing an error returns a resolved promise
  * if you want to chain errors, your `catch` function must return a rejected promise or throw an error
* not returning anything is the same as returning undefined

## Parallel promises

```js
Promise.all([promise0, promise1, ...morePromises]).then(
  ([result0, result1, ...moreResults]) => ...
);
```

## Complications

### Nested promises

Should be refactored to chained promises. They are difficult to read, and even harder to change.

### Forks in logic

Sometimes, different operations need to be performed depending on intermediate results. In these cases, try to keep the flow of control as obvious as possible by extracting related operations to function that returns a single function.

```js
getData(args).then(
  result => (isTypeA(result) ? 
    pathA(results) : pathB(results))
).then(finishUp);
```

### Early returns

Sometimes one forked path is much shorter than the other. Don't treat this any differently from the forks above. If a function sometimes returns a promise, it should always return a promise.

### Using results from an earlier step

Sometimes, you need results from an earlier step, but chained promises only pass through the most recent value. You can capture values to use later using closures, but be very careful to scope them correctly. Variables scoped too widely can interfere with parallel calls.

TODO example