/**
 * @fileoverview FSD relative path checker
 * @author maxonmars
 */
'use strict';

const path = require('path');
const {isPathRelative} = require('../helpers');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
	meta: {
		messages: {
			slice: 'Within a slice, all imports must be relative!',
		},
		type: 'problem', // `problem`, `suggestion`, or `layout`
		docs: {
			description: 'FSD relative path checker',
			recommended: false,
			url: null, // URL to the documentation page for this rule
		},
		fixable: 'code', // Or `code` or `whitespace`
		schema: [
			{
				type: 'object',
				properties: {
					alias: {
						type: 'string',
					},
				},
			},
		], // Add a schema if the rule has options
	},

	create(context) {
		// variables should be defined here
		const option = context.options[0];
		const alias = option ? option.alias : '';

		//----------------------------------------------------------------------
		// Helpers
		const layers = {
			entities: 'entities',
			features: 'features',
			shared: 'shared',
			pages: 'pages',
			widgets: 'widgets',
		};

		const getNormalizedCurrentFilePath = (currentFilePath) => {
			return currentFilePath.split('src')[1]; // /entities/Article
		}

		const shouldBeRelative = (from, to) => {
			if (isPathRelative(to)) {
				return false;
			}

			// example entities/Article
			const toArray = to.split('/');
			const toLayer = toArray[0]; // entities
			const toSlice = toArray[1]; // Article

			if (!toLayer || !toSlice || !layers[toLayer]) {
				return false;
			}

			// Example: /Users/maxonmars/WebStormProjects/blog/src/entities/Article
			const projectFrom = getNormalizedCurrentFilePath(from); // /entities/Article
			const fromArray = projectFrom.split(path.sep); // ['', entities, Article]

			const fromLayer = fromArray[1]; // entities
			const fromSlice = fromArray[2]; // Article

			if (!fromLayer || !fromSlice || !layers[fromLayer]) {
				return false;
			}

			return fromSlice === toSlice && toLayer === fromLayer;
		};

		// console.log(shouldBeRelative('/Users/maxonmars/WebStormProjects/blog/src/entities/Article', 'entities/Article/index.ts'));

		//----------------------------------------------------------------------

		// any helper functions should go here or else delete this section

		//----------------------------------------------------------------------
		// Public
		//----------------------------------------------------------------------

		return {
			ImportDeclaration(node) {
				try {
						// Example: app/entities/Article
				const value = node.source.value;
				const importTo = alias ? value.replace(`${alias}/`, '') : value;

				// Example: /Users/maxonmars/WebStormProjects/blog/src/entities/Article
				const fromFileName = context.getFilename();

				if (shouldBeRelative(fromFileName, importTo)) {
					context.report({
						node: node,
						messageId: 'slice',
						fix: (fixer) => {
							const normalizedPath = getNormalizedCurrentFilePath(fromFileName) // /entities/Article/Article.tsx
								.split(path.sep)
								.slice(0, -1)
								.join(path.sep);
							let relativePath = path.relative(normalizedPath, `/${importTo}`)
								.split(path.sep)
								.join('/');

							if (!relativePath.startsWith('.')) {
								relativePath = './' + relativePath;
							}

							return fixer.replaceText(node.source, `'${relativePath}'`)
						}
					});
				}
				} catch(e) {
					console.log(e);
				}
			},
		};
	},
};
