const Gun = (process.env.TEST_TARGET === 'DIST') ? require('../dist/sea').default : require('../sea');
module.exports = Gun;
