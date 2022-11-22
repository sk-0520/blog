import path from 'path';
import fs from 'fs';

import * as style from './style';
import * as script from './script';
import * as blog from './blog';

export function execute(rootDirectoryPath: string, isProduction: boolean) {
	const outputDirectoryPath = path.join(rootDirectoryPath, 'dist');
	const sourceDirectoryPath = path.join(rootDirectoryPath, 'source');
	const styleDirectoryPath = path.join(sourceDirectoryPath, 'styles');
	const scriptDirectoryPath = path.join(sourceDirectoryPath, 'scripts');
	const postDirectoryPath = path.join(sourceDirectoryPath, 'posts');

	if (!fs.existsSync(outputDirectoryPath)) {
		fs.mkdirSync(outputDirectoryPath);
	}

	style.build(rootDirectoryPath, sourceDirectoryPath, styleDirectoryPath, outputDirectoryPath, isProduction);
	script.build(rootDirectoryPath, sourceDirectoryPath, scriptDirectoryPath, outputDirectoryPath, isProduction);
	blog.build(rootDirectoryPath, sourceDirectoryPath, postDirectoryPath, outputDirectoryPath, isProduction);
}
