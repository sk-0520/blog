import path from 'path';
import fs from 'fs';

import sass from 'sass';

export function build(rootDirectoryPath: string, sourceDirectoryPath: string, styleDirectoryPath: string, outputDirectoryPath: string, isProduction: boolean) {
	const inputStyleFilePath = path.join(styleDirectoryPath, 'style.scss');
	const outputStyleFilePath = path.join(outputDirectoryPath, 'style.css');

	const result = sass.compile(inputStyleFilePath);

	fs.writeFileSync(outputStyleFilePath, result.css);
}
