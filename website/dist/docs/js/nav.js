function toggleList( element ) {
    $( '#' + element + '-dropdown' ).slideToggle();
}

$( document ).ready( function () {
    if ( location.pathname.substring( 6 ) ) {
        let id = '';
        let path = location.pathname.substring( 6, location.pathname.length - 1 );
        for ( let letter in path ) {
            if ( path[ letter ] === '/' ) {
                id += '-';
            } else {
                id += path[ letter ];
            }
        }

        if ( path.lastIndexOf( '/' ) >= 0 ) {
            $( '#' + path.slice( 0, path.lastIndexOf( '/' ) ) + '-dropdown' ).slideDown();
            $( '#' + path.slice( 0, path.lastIndexOf( '/' ) ) + 'Nav' ).addClass( 'active' );
        } else {
            $( '#' + path + '-dropdown' ).slideDown();
            $( '#' + path + 'Nav' ).addClass( 'active' );
        }
        $( '#' + id ).addClass( 'active' );
    } else {
        $( '#docs-home' ).addClass( 'active' );
    }
} );