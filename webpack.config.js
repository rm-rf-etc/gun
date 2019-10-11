const path = require('path');

module.exports = [
	{
		entry: './src/index.js',
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: 'gun.js',
			library: 'Gun',
			libraryTarget: 'umd',
			globalObject: 'this',
		},
	},
	{
		entry: './sea/index.js',
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: 'sea.js',
			library: 'SEA',
			libraryTarget: 'umd',
			globalObject: 'this',
		},
	},
	{
		entry: './axe/index.js',
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: 'axe.js',
			library: 'AXE',
			libraryTarget: 'umd',
			globalObject: 'this',
		},
	},
];
