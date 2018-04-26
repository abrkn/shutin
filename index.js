const delay = require('delay');

const SHUTDOWN = Symbol();

const shutdown = new Promise(resolve => {
  ['SIGTERM', 'SIGINT'].forEach(signal =>
    process.on(signal, () => {
      shutdown.requested = true;
      resolve(SHUTDOWN);
    })
  );
});

const delayUnlessShutdown = async interval => {
  const winner = await Promise.race([shutdown, delay(interval)]);

  return winner === SHUTDOWN;
};

Object.assign(exports, {
  shutdown,
  delayUnlessShutdown
});
