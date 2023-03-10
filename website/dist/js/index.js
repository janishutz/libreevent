/* eslint-disable no-undef */
/*
*				myevent - index.js
*
*	Created by Janis Hutz 03/06/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

$( document ).ready( function () {
    $( '#nav' ).load( '/nav.html' );

    $( '.button' ).mouseenter( function () { 
        $( this ).stop();
        $( this ).animate( { 'border-radius': '5px', 'background-color': 'rgb(60, 85, 140)' }, 200 );
    } );

    $( '.button' ).mouseleave( function () { 
        $( this ).stop();
        $( this ).animate( { 'border-radius': '30px', 'background-color': 'rgb(24, 43, 61)' }, 400 );
    } );
} );