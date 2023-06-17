$( document ).ready( function () {
    $( '#nav' ).load( '/nav.html' );
    $( '#side-bar' ).load( '/docs/side-bar.html' );
    $( '#footer' ).load( '/footer.html' );
} );

let btn = document.getElementById( 'backToTop' );

function backToTop () {
    if ( document.body.scrollTop > 500 || document.documentElement.scrollTop > 500 ) {
        window.scrollTo( { top: 0, behavior: 'smooth' } );
    }
}

window.onscroll = function () {
    if ( document.body.scrollTop > 500 || document.documentElement.scrollTop > 500 ) {
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
    } else {
        btn.style.opacity = '0';
        btn.style.cursor = 'default';
    }
};