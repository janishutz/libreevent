import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { useUserStore } from '@/stores/userStore';

let app = createApp( App );

app.use( createPinia() );

let userStore = useUserStore();

let prod = false;

if ( prod ) {
    fetch( '/api/getAuth' ).then( res => {
        res.json().then( data => {
            userStore.setUserAuth( data.user );
            userStore.setAdminAuth( data.admin );

            app.use( router );
            app.mount( '#app' );
        } );
    } );
} else {
    // userStore.setUserAuth( true );
    app.use( router );
    app.mount( '#app' );
}
