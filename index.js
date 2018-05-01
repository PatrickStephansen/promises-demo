const slowLog = any =>
  new Promise(resolve => {
    setTimeout(() => {
      console.log(any);
      resolve();
    }, 1000);
  });

const slowGet = any =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(any);
    }, 1000);
  });
const slowFail = any =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(any);
    }, 1000);
  });

slowGet("1")
  .then(slowLog)
  .then(() => slowLog("2"))
  .then(() => slowGet(slowGet(slowGet("3"))))
  .then(slowLog)
  .then(() => Promise.all([slowGet("a"), slowGet("b"), slowGet("c")]))
  .then(slowLog)
  .then(slowFail)
  .catch(() => slowLog("just a warning"))
  .then()
  .then(()=> console.log('4 synchronous'))
  .then(()=> {throw new Error('rejected with stacktrace')})
  .catch(slowLog)
  .then(()=> Promise.reject('also rejected'))
  .then(()=> slowLog('skip this'))
  .catch(slowLog)
  .then(() => slowLog("done"));
