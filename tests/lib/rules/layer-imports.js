/**
 * @fileoverview some desc
 * @author maxonmars
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/layer-imports'),
	RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const aliasOptions = [
	{
		alias: '@',
	},
];
const ruleTester = new RuleTester({
	parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});
ruleTester.run('layer-imports', rule, {
	valid: [
		{
			filename: '/Users/userName/WebStormProjects/blog/src/features/Article',
			code: "import { addCommentFormActions, addCommentFormReducer } from '@/shared/Button.tsx'",
			errors: [],
			options: aliasOptions,
		},
		{
			filename: '/Users/userName/WebStormProjects/blog/src/features/Article',
			code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article'",
			errors: [],
			options: aliasOptions,
		},
		{
			filename: '/Users/userName/WebStormProjects/blog/src/app/providers',
			code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Articl'",
			errors: [],
			options: aliasOptions,
		},
		{
			filename: '/Users/userName/WebStormProjects/blog/src/widgets/pages',
			code: "import { useLocation } from 'react-router-dom'",
			errors: [],
			options: aliasOptions,
		},
		{
			filename: '/Users/userName/WebStormProjects/blog/src/app/providers',
			code: "import { addCommentFormActions, addCommentFormReducer } from 'redux'",
			errors: [],
			options: aliasOptions,
		},
		{
			filename: '/Users/userName/WebStormProjects/blog/src/index.tsx',
			code: "import { StoreProvider } from '@/app/providers/StoreProvider';",
			errors: [],
			options: aliasOptions,
		},
		{
			filename:
				'/Users/userName/WebStormProjects/blog/src/entities/Article.tsx',
			code: "import { StateSchema } from '@/app/providers/StoreProvider'",
			errors: [],
			options: [
				{
					alias: '@',
					ignoreImportPatterns: ['**/StoreProvider'],
				},
			],
		},
	],

	invalid: [
		{
			filename: '/Users/userName/WebStormProjects/blog/src/entities/providers',
			code: "import { addCommentFormActions, addCommentFormReducer } from '@/features/Articles'",
			errors: [
				{
					message:
						'A layer can only import underlying layers into itself (shared, entities, features, widgets, pages, app)',
				},
			],
			options: aliasOptions,
		},
		{
			filename: '/Users/userName/WebStormProjects/blog/src/features/providers',
			code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Articles'",
			errors: [
				{
					message:
						'A layer can only import underlying layers into itself (shared, entities, features, widgets, pages, app)',
				},
			],
			options: aliasOptions,
		},
		{
			filename: '/Users/userName/WebStormProjects/blog/src/entities/providers',
			code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Articles'",
			errors: [
				{
					message:
						'A layer can only import underlying layers into itself (shared, entities, features, widgets, pages, app)',
				},
			],
			options: aliasOptions,
		},
	],
});
