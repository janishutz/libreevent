/*
*				libreevent - index.js
*
*	Created by Janis Hutz 05/12/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore';
import { useBackendStore } from '@/stores/backendStore';
import adminRoutes from '@/router/adminRoutes';
import mainRoutes from '@/router/mainRoutes';

/* 
    This is the Vue.js router file. All valid routes get imported from other files to
    improve code legibility. Only router logic and importing logic is defined here.
*/

const routes = mainRoutes;

routes.push( adminRoutes );

const router = createRouter( {
    history: createWebHistory( process.env.BASE_URL ),
    routes,
} );


router.afterEach( ( to, from ) => {
    document.title = to.meta.title ? to.meta.title : 'libreevent';
} );

let UserAccountPages = [ 'account' ];

let authRequired = false;

router.beforeEach( ( to, from ) => {
    let userStore = useUserStore();
    let backendStore = useBackendStore();
    backendStore.loadVisitedSetupPages();
    let isUserAuthenticated = userStore.getUserAuthenticated;
    let isAdminAuthenticated = userStore.getAdminAuthenticated;

    if ( to.meta.adminAuthRequired && !isAdminAuthenticated ) {
        return { name: 'adminLogin' };
    } else if ( to.name === 'adminLogin' && isAdminAuthenticated ) {
        return { name: 'adminHome' };
    } else if ( UserAccountPages.includes( to.name ) && !isUserAuthenticated ) {
        return { name: 'login' };
    } else if ( isUserAuthenticated && to.name === 'login' ) {
        return { name: 'account' };
    } else if ( !isUserAuthenticated && to.name === 'pay' ) {
        return { name: 'purchase' };
    } else if ( to.name.substring( 0, 5 ) === 'setup' && !backendStore.getVisitedSetupPages[ to.name.substring( 5 ).toLowerCase() ] && to.name.substring( 5 ).toLowerCase() !== 'start' && to.name.substring( 5 ).toLowerCase() !== 'root' ) {
        return { name: 'setupStart' };
    }
} );

let doSetup = true;

if ( doSetup ) {
    import( '@/router/setupRoutes' ).then( data => {
        router.addRoute( data.default );
        setTimeout( function () {
            router.replace( window.location.pathname );
        }, 200 );
    } );
}


export default router;
