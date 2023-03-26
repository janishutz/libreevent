let themeSelector2 = document.getElementById( 'theme' );
let languageSelector = document.getElementById( 'lang' );
let mailLabel = document.getElementById( 'mailLabel' );
let pwdLabel = document.getElementById( 'pwdLabel' );
let login = document.getElementById( 'login' );

languageSelector.value = sessionStorage.getItem( 'lang' );

function langUpdate () {
    if ( sessionStorage.getItem( 'lang' ) === 'de' ) {
        themeSelector2.options[0].innerHTML = 'Automatisch';
        themeSelector2.options[1].innerHTML = 'Hellmodus';
        themeSelector2.options[2].innerHTML = 'Dunkelmodus';
        mailLabel.innerHTML = 'Email - Adresse';
        pwdLabel.innerHTML = 'Passwort';
        login.value = 'Anmelden';
    } else {
        themeSelector2.options[0].innerHTML = 'System theme';
        themeSelector2.options[1].innerHTML = 'Light';
        themeSelector2.options[2].innerHTML = 'Dark';
        mailLabel.innerHTML = 'Email address';
        pwdLabel.innerHTML = 'Password';
        login.value = 'Log in';
    }
}

function changeLang () {
    sessionStorage.setItem( 'lang', languageSelector.value );
    langUpdate();
}

langUpdate();