/*
*				myevent - build.js
*
*	Created by Janis Hutz 03/09/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

const prompt = require( 'prompt-sync' );
const markdownIt = require( 'markdown-it' );
const md2html = new markdownIt();


if ( prompt( 'Do you want to rebuild the ' ).toLowercase === 'y' ) {
    buildDocs();
    buildNav();
} 

function buildNav () {
}

function buildDocs () {
    md2html.render( '#Test' );
}