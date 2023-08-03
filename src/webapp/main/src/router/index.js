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
    history: createWebHistory( import.meta.env.BASE_URL ),
    routes,
} );

router.afterEach( ( to, from ) => {
    let userStore = useUserStore();
    document.title = to.meta.title ? to.meta.title + userStore.getPageName : 'libreevent';
} );

let UserAccountPages = [ 'account' ];


router.beforeEach( ( to, from ) => {
    let userStore = useUserStore();
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
    } else if ( to.name === '2fa' && !userStore.getUserTwoFACompliant ) {
        return { name: 'login' };
    } else if ( to.name === 'Admin2fa' && !userStore.getAdminTwoFACompliant ) {
        return { name: 'adminLogin' };
    }
} );


export default router;
