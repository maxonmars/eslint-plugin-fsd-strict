/**
 * @fileoverview some desc
 * @author maxonmars
 */
"use strict";

const {isPathRelative} = require('../helpers');

const availableLayers = {
	'entities': 'entities',
	'features': 'features',
	'pages': 'pages',
	'widgets': 'widgets',
};

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    messages: {
      publicApi: 'Absolute import is allowed only from Public API',
    },
    type: 'problem',
    docs: {
      description: "some desc",
      recommended: false,
      url: null,
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string'
          }
        }
      }
    ],
  },

  create(context) {
		const option = context.options[0];
    const alias = option ? option.alias : '';

		return {
			ImportDeclaration(node) {
				// Example: app/entities/Article
				const value = node.source.value
        const importTo = alias ? value.replace(`${alias}/`, '') : value;
        
        // Проверяем является ли путь относительным
            if (isPathRelative(importTo)) {
              return;
            }

            // [entities, article, model, types]
            const segments = importTo.split('/')
            
            const currentLayer = segments[0];
            
            // Проверяем является ли слой разрешенным для проверки
            if (!availableLayers[currentLayer]) {
              return;
            }
            
            const isImportNotFromPublicApi = segments.length > 2;

				if (isImportNotFromPublicApi) {
					context.report({node: node, messageId: 'publicApi'});
				}
			}
		};
	},
};
