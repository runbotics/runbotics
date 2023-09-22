const { register } = require('ts-node');

const initializeContentfulCache = async () => {
    register();

    const compiledCacheTS = require('./blog-main/cache.ts');

    await compiledCacheTS.recreateCache();
};

module.exports = { initializeContentfulCache };
