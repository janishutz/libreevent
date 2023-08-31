var theme = localStorage.getItem( 'theme' ) ?? '';
if ( window.matchMedia( '(prefers-color-scheme: dark)' ).matches || theme === '&#9788;' ) {
    document.documentElement.classList.add( 'dark' );
    document.getElementById( 'themeSelector' ).innerHTML = '&#9788;';
    theme = '&#9788;';
} else {
    document.documentElement.classList.add( 'light' );
    document.getElementById( 'themeSelector' ).innerHTML = '&#9789;';
    theme = '&#9789;';
}

function changeTheme () {
    if ( theme === '&#9788;' ) {
        document.documentElement.classList.remove( 'dark' );
        document.documentElement.classList.add( 'light' );
        localStorage.setItem( 'theme', '&#9789;' );
        document.getElementById( 'themeSelector' ).innerHTML = '&#9789;';
        theme = '&#9789;';
    } else if ( theme === '&#9789;' ) {
        document.documentElement.classList.remove( 'light' );
        document.documentElement.classList.add( 'dark' );
        localStorage.setItem( 'theme', '&#9788;' );
        document.getElementById( 'themeSelector' ).innerHTML = '&#9788;';
        theme = '&#9788;';
    }
}