import path from 'path';
import fs from 'fs';
import ts from 'typescript';

import * as JSONC from 'jsonc-parser';

export function build(rootDirectoryPath: string, sourceDirectoryPath: string, scriptDirectoryPath: string, outputDirectoryPath: string, isProduction: boolean) {
	const inputScriptFilePath = path.join(scriptDirectoryPath, 'script.ts');
	const outputScriptFilePath = path.join(outputDirectoryPath, 'script.js');
	const tsconfigPath = path.join(rootDirectoryPath, 'tsconfig.json');

	console.log('tsconfigPath', tsconfigPath);

	const baseOptions: ts.CompilerOptions = JSONC.parse(fs.readFileSync(tsconfigPath).toString());
	const overwriteOptions: ts.CompilerOptions = {
		module: ts.ModuleKind.CommonJS ,
		outFile: path.join(outputDirectoryPath, 'scriptaaaa.js'),
		sourceRoot: scriptDirectoryPath,
		inlineSourceMap: true,
	};
	const options = Object.assign(
		baseOptions,
		overwriteOptions,
	)

	const sourceTypeScript = fs.readFileSync(inputScriptFilePath).toString();
	//sourceJavaScript
	const aaa = ts.transpileModule(sourceTypeScript, {
compilerOptions: options,
	});

	//fs.writeFileSync(outputScriptFilePath, sourceJavaScript);
	fs.writeFileSync(outputScriptFilePath, aaa .outputText);
}
