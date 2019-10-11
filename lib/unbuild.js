const fs = require('fs');
const path = require('path');
const rm = require('./fsrm');

const unbuildPattern = /\/* UNBUILD *\//;
const startPattern = /USE\(["'][./\w\d-]+["'],\s*function\s*\((|\w+|\w+,\s*exports)?\)\s*\{/g;
const getFilenamePattern = /USE\s*\(['"]([./\w\d-]+)['"],\s*function\s*\(\s*(|\w+|\w+,\s*exports)\s*\)\s*\{/;
const endPattern = /\}\)\.END\(\)/g;

const arg = process.argv[2] || 'gun';
const rootDir = arg === 'gun' ? '../src' : `../${arg}`;
const files = {};
const srcPath = path.resolve(__dirname, rootDir);

let currentFile = null;
let codeLines = [];


const read = (filepath) => {
	return fs.readFileSync(filepath).toString();
};

const write = (filepath, data) => {
	return fs.writeFileSync(filepath, data);
};

const mk = (filepath) => {
	if (fs.existsSync(filepath)) return;
	fs.mkdirSync(filepath);
};

const unbuildMatched = (line) => {
	if (!currentFile) {
		currentFile = "polyfill/unbuild";
		files[currentFile] = [];
	} else {
		currentFile = null;
	}
};

const sectionMatched = (line) => {
	const filename = line.match(getFilenamePattern)[1];
	currentFile = filename;
	files[currentFile] = [];
};

const nextLine = (line) => {
	if (!currentFile) return;
	files[currentFile].push(line);
};

const sectionEnded = () => {
	currentFile = null;
};

const undent = (codeLines, n) => {
	const regex = n === 1 ? /\n\t/g : /\n\t\t/g;
	return codeLines
		.join('\n')
		.replace(regex, '\n')
		.trim()
		.replace(/(const|let|var)\s+([{\s\w,}]+)\s+=\s+(USE)\s*\((['"][./\w\d-]+['"])\);?/g, "import $2 from $4;")
		.replace(/USE\((['"][./\w\d-]+['"])\);?/g, "import $1;")
		.replace(/exports\.(\w+)\s*=/g, "export const $1 =")
		.replace(/(module\.exports)\s*=\s*(\w+;?)?/g, "export default $2")
		.concat('\n');
};

if ('gun' === arg) {
	rm('./src');
	mk('./src');
} else {
	rm('./'+arg);
	mk('./'+arg);
}

codeLines = read(path.resolve(`${arg}.js`)).split('\n');

codeLines.forEach((line) => {
	if (unbuildPattern.test(line)) unbuildMatched(line);
	else if (startPattern.test(line)) sectionMatched(line);
	else if (endPattern.test(line)) sectionEnded();
	else nextLine(line);
});

Object.entries(files).forEach(([name, lines]) => {
	if (name.match(/unbuild$/)) {
		write(path.resolve(`${srcPath}/${name}.js`), undent(lines, 1));
	} else {
		write(path.resolve(`${srcPath}/${name}.js`), undent(lines));
	}
});
