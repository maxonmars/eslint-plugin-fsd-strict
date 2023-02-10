/**
 * @fileoverview some desc
 * @author maxonmars
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/public-api-imports'),
	RuleTester = require('eslint').RuleTester;

const publicApiErrorMessage = rule.meta.messages.publicApi;
const testApiErrorMessage = rule.meta.messages.testApi;
//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
	parserOptions: {ecmaVersion: 6, sourceType: 'module'},
});

const aliasOptions = [
	{
		alias: '@',
	},
];

ruleTester.run('public-api-imports', rule, {
	valid: [
		{
			code: "import { addCommentFormActions, addCommentFormReducer } from '../../model/slices/addCommentFormSlice'",
			errors: [],
		},
		{
			code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article'",
			errors: [],
			options: aliasOptions,
		},
		{
			filename:
				'/Users/userName/WebStormProjects/blog/src/entities/file.test.ts',
			code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
			errors: [],
			options: [
				{
					alias: '@',
					testFilesPatterns: [
						'**/*.test.ts',
						'**/*.test.ts',
						'**/StoreDecorator.tsx',
					],
				},
			],
		},
		{
			filename:
				'/Users/userName/WebStormProjects/blog/src/shared/lib/storybook/StoreDecorator.tsx',
			code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
			errors: [],
			options: [
				{
					alias: '@',
					testFilesPatterns: [
						'**/*.test.ts',
						'**/*.test.ts',
						'**/StoreDecorator.tsx',
					],
				},
			],
		},
	],

	invalid: [
		{
			code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/model/file.ts'",
			errors: [{message: publicApiErrorMessage}],
			options: aliasOptions,
			output:
				"import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article'",
		},
		{
			filename:
				'/Users/userName/WebStormProjects/blog/src/shared/lib/storybook/StoreDecorator.tsx',
			code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing/file.tsx'",
			errors: [{message: publicApiErrorMessage}],
			options: [
				{
					alias: '@',
					testFilesPatterns: [
						'**/*.test.ts',
						'**/*.test.ts',
						'**/StoreDecorator.tsx',
					],
				},
			],
			output:
				"import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article'",
		},
		{
			filename:
				'/Users/userName/WebStormProjects/blog/src/entities/forbidden.ts',
			code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
			errors: [{message: testApiErrorMessage}],
			options: [
				{
					alias: '@',
					testFilesPatterns: [
						'**/*.test.ts',
						'**/*.test.ts',
						'**/StoreDecorator.tsx',
					],
				},
			],
			output: null,
		},
	],
});
