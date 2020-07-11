const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function(moduleName) {
  let target = moduleName;
  if (moduleName === '@/router') {
    return {
      default: {
        push: () => console.log('Router.push called on server')
      }
    };
  } else if (moduleName.endsWith('.vue')) {
    console.log(`Requiring vue file ${moduleName}. should be fixed.`);
    return {};
  } else if (moduleName.indexOf('@/') === 0) {
    target = process.env.PWD + '/src' + moduleName.slice(1);
  } else if (moduleName.indexOf('~/') === 0) {
    target = process.env.PWD + moduleName.slice(1);
  }
  return originalRequire.call(this, target);
};
