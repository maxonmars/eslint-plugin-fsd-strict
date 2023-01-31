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
			errors: [{message: 'Absolute import is allowed only from Public API'}],
			options: aliasOptions,
		},
		{
			filename:
				'/Users/userName/WebStormProjects/blog/src/shared/lib/storybook/StoreDecorator.tsx',
			code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing/file.tsx'",
			errors: [{message: 'Absolute import is allowed only from Public API'}],
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
				'/Users/userName/WebStormProjects/blog/src/entities/forbidden.ts',
			code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
			errors: [
				{message: 'Test data must be imported from publicApi/testing.ts'},
			],
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
});
