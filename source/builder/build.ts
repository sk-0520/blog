import path from 'path';

import * as blog from './blog';

export function execute(rootDirectoryPath: string) {
	const sourceDirectoryPath = path.join(rootDirectoryPath, 'source');
	const outputDirectoryPath = path.join(rootDirectoryPath, 'dist');
	const postDirectoryPath = path.join(sourceDirectoryPath, 'posts');

	blog.build(sourceDirectoryPath, postDirectoryPath, outputDirectoryPath);
}
