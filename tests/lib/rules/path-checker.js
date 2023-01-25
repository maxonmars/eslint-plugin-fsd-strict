/**
 * @fileoverview FSD relative path checker
 * @author maxonmars
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/path-checker"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {ecmaVersion: 6, sourceType: 'module'}
});
ruleTester.run("path-checker", rule, {
  valid: [
    {
      filename: '/Users/userName/WebStormProjects/blog/src/entities/Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from '../../model/slices/addCommentFormSlice'",
      errors: [],
    },
  ],

  invalid: [
    {
      filename: '/Users/userName/WebStormProjects/blog/src/entities/Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/model/slices/addCommentFormSlice'",
      errors: [{ message: 'Within a slice, all imports must be relative!'}],
      options: [
        {
          alias: '@'
        }
      ]
    },
    {
      filename: '/Users/userName/WebStormProjects/blog/src/entities/Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from 'entities/Article/model/slices/addCommentFormSlice'",
      errors: [{ message: 'Within a slice, all imports must be relative!'}],
    },
  ],
});
