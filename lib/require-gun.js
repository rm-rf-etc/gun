const Gun = (process.env.TEST_TARGET === 'DIST') ? require('../dist/gun').default : require('../gun');
module.exports = Gun;
