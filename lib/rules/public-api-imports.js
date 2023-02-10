/**
 * @fileoverview some desc
 * @author maxonmars
 */
'use strict';

const {isPathRelative} = require('../helpers');
const micromatch = require('micromatch');

const availableLayers = {
	entities: 'entities',
	features: 'features',
	pages: 'pages',
	widgets: 'widgets',
};

const MESSAGES_ID = {
	PUBLIC_API: 'publicApi',
	TEST_API: 'testApi',
};

const MESSAGES = {
	[MESSAGES_ID.PUBLIC_API]: 'Absolute import is allowed only from Public API',
	[MESSAGES_ID.TEST_API]:
		'Test data must be imported from publicApi/testing.ts',
};

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
	meta: {
		messages: {
			[MESSAGES_ID.PUBLIC_API]: MESSAGES[MESSAGES_ID.PUBLIC_API],
			[MESSAGES_ID.TEST_API]: MESSAGES[MESSAGES_ID.TEST_API],
		},
		type: 'problem',
		docs: {
			description: 'some desc',
			recommended: false,
			url: null,
		},
		fixable: 'code',
		schema: [
			{
				type: 'object',
				properties: {
					alias: {
						type: 'string',
					},
					testFilesPatterns: {
						type: 'array',
					},
				},
			},
		],
	},

	create(context) {
		const {alias = '', testFilesPatterns = []} = context.options[0] || {};

		return {
			ImportDeclaration(node) {
				// Example: app/entities/Article
				const value = node.source.value;
				const importTo = alias ? value.replace(`${alias}/`, '') : value;

				// Проверяем является ли путь относительным
				if (isPathRelative(importTo)) {
					return;
				}

				// [entities, article, model, types]
				const segments = importTo.split('/');

				const currentLayer = segments[0];
				const currentSlice = segments[1];

				// Проверяем является ли слой разрешенным для проверки
				if (!availableLayers[currentLayer]) {
					return;
				}

				const isTestingPublicApi =
					segments[2] === 'testing' && segments.length < 4;

				const isImportNotFromPublicApi = segments.length > 2;

				if (isImportNotFromPublicApi && !isTestingPublicApi) {
					context.report({
						node: node,
						messageId: MESSAGES_ID.PUBLIC_API,
						fix: fixer => {
							return fixer.replaceText(
								node.source,
								`'${alias}/${currentLayer}/${currentSlice}'`,
							);
						},
					});
				}

				if (isTestingPublicApi) {
					const currentFilePath = context.getFilename();

					const isCurrentFileTesting = testFilesPatterns.some(pattern =>
						micromatch.isMatch(currentFilePath, pattern),
					);

					if (!isCurrentFileTesting) {
						context.report({node, messageId: MESSAGES_ID.TEST_API});
					}
				}
			},
		};
	},
};
