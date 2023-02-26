module.exports = {
    'env': {
        'browser': true,
        'commonjs': true,
        'es2021': true,
        'node': true
    },
    'extends': 'eslint:recommended',
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
        ]
    }
};
