/*
*				libreevent - .eslintrc.js
*
*	Created by Janis Hutz 02/26/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

module.exports = {
    'env': {
        'browser': true,
        'commonjs': true,
        'es2021': true,
        'node': true
    },
    'extends': [
        'plugin:vue/vue3-essential',
        'eslint:recommended'
    ],
    'overrides': [
    ],
    'parserOptions': {
        'ecmaVersion': 'latest'
    },
    'rules': {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'spaced-comment': [
            'error',
            'always'
        ], 
        'arrow-spacing': [
            'error',
            { 'before': true, 'after': true }
        ], 
        'func-call-spacing': [
            'error',
            'never'
        ], 
        'keyword-spacing': [
            'error',
            { 'before': true, 'after': true }
        ], 
        'key-spacing': [
            'error',
            { 'mode': 'strict' }
        ], 
        'space-before-blocks': [
            'error',
            'always'
        ],
        'space-in-parens': [
            'error', 
            'always'
        ],
        'no-var': 'error'
    }
};
