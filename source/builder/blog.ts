import path from 'path';
import fs from 'fs';

import glob from 'glob';

type PostExtension = 'md';

interface PostPath {
	path: string,
	extension: PostExtension,
}

interface PostSetting {
	title: string;
	timestamp: Date;
	tags: Array<string>;
}

interface PostItem {
	base: string;
	setting: PostSetting;
	post: PostPath;
}

function getPostPath(directoryPath: string, baseName: string): PostPath {
	const basePath = path.join(directoryPath, baseName);
	const extensions: Array<PostExtension> = [
		'md',
	];

	for (const extension of extensions) {
		const filePath = basePath + '.' + extension;
		if (fs.existsSync(filePath)) {
			return {
				path: filePath,
				extension: extension
			}
		}
	}

	throw new Error('not found: ' + directoryPath);
}

function isPostSetting(arg: unknown): arg is PostSetting {
	const temp = arg as PostSetting;
	return temp
		&& typeof temp?.title === 'string'
		&& typeof temp?.timestamp === 'object' && temp?.timestamp instanceof Date
		&& Array.isArray(temp?.tags)
		;
}

function loadPostSetting(path: string): PostSetting {
	const rawJson = fs.readFileSync(path);
	const json = JSON.parse(rawJson.toString(), (key, value) => {
		if (key === 'timestamp') {
			return new Date(value);
		}

		return value;
	});
	if (isPostSetting(json)) {
		return json;
	}

	throw new Error('type error: ' + path + ' -> ' + json);
}

/**
 * 一覧生成。
 * @param items
 */
function outputList(items: ReadonlyArray<PostItem>, outputDirectoryPath: string) {

}

/**
 * 記事生成。
 * @param items
 */
 function outputPost(items: ReadonlyArray<PostItem>, outputDirectoryPath: string) {

}

/**
 * 記事生成。
 * @param items
 */
function output(items: ReadonlyArray<PostItem>, outputDirectoryPath: string) {
	outputList(items, outputDirectoryPath);
	outputPost(items, outputDirectoryPath);
}

export function build(sourceDirectoryPath: string, postDirectoryPath: string, outputDirectoryPath: string) {
	glob(
		"*/post.json",
		{
			cwd: postDirectoryPath,
		},
		(error, matches) => {
			if (error) {
				throw new Error(JSON.stringify(error));
			}

			const items: Array<PostItem> = matches
				.map(i => path.join(postDirectoryPath, path.dirname(i)))
				.map<PostItem>(i => ({
					base: i,
					setting: loadPostSetting(path.join(i, 'post.json')),
					post: getPostPath(i, 'post'),
				}))
				.sort((a, b) => a.setting.timestamp.getTime() - b.setting.timestamp.getTime())
				;

			console.log(items);

			output(items, outputDirectoryPath);
		}
	);
}
