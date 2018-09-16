const assert = require('assert');
const delay = require('delay');
const debug = require('debug')('shutin');

const SHUTDOWN = Symbol();

const shutdown = new Promise(resolve => {
  ['SIGTERM', 'SIGINT'].forEach(signal =>
    process.on(signal, () => {
      debug(`Received ${signal} signal`);
      shutdown.requested = true;
      resolve(SHUTDOWN);
    })
  );
});

const delayUnlessShutdown = async interval => {
  assert(Number.isFinite(interval));

  const winner = await Promise.race([shutdown, delay(interval)]);

  return winner === SHUTDOWN;
};

Object.assign(exports, {
  shutdown,
  delayUnlessShutdown,
});
