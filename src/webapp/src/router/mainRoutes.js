/*
*				libreevent - mainRoutes.js
*
*	Created by Janis Hutz 05/12/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

import HomeView from '../views/HomeView.vue';

/* 
    This file contains all the routes for all pages accessible to a normal
    user. It also includes some pages that require sign in.
*/


export default [
    {
        path: '/',
        name: 'home',
        component: HomeView,
        meta: {
            title: 'Home - libreevent'
        }
    },
    {
        path: '/tickets',
        name: 'tickets',
        component: () => import( '../views/OrderView.vue' ),
        meta: {
            title: 'Order ticket - libreevent'
        }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import( '../views/LoginView.vue' ),
        meta: {
            title: 'Login - libreevent'
        }
    },
    {
        path: '/admin/login',
        name: 'adminLogin',
        component: () => import( '../views/AdminLoginView.vue' ),
        meta: {
            title: 'Login :: Admin - libreevent'
        }
    },
    {
        path: '/signup',
        name: 'signup',
        component: () => import( '../views/SignupView.vue' ),
        meta: {
            title: 'Signup - libreevent'
        }
    },
    {
        path: '/account',
        name: 'account',
        component: () => import( '../views/AccountView.vue' ),
        meta: {
            title: 'Account - libreevent'
        }
    },
    {
        path: '/tickets/details',
        name: 'ticketDetails',
        component: () => import( '../views/TicketsDetailsView.vue' ),
        meta: {
            title: 'Details - libreevent',
            transition: 'scale'
        }
    },
    {
        path: '/tickets/order',
        name: 'ticketOrder',
        component: () => import( '../views/TicketsOrderingView.vue' ),
        meta: {
            title: 'Order ticket - libreevent',
            transition: 'scale'
        }
    },
    {
        path: '/cart',
        name: 'cart',
        component: () => import( '../views/CartView.vue' ),
        meta: {
            title: 'Cart - libreevent',
            transition: 'scale'
        }
    },
    {
        path: '/purchase',
        name: 'purchase',
        component: () => import( '@/views/PurchaseView.vue' ),
        meta: {
            title: 'Pay - libreevent',
            transition: 'scale'
        }
    },
    {
        path: '/pay',
        name: 'pay',
        component: () => import( '@/views/PaymentView.vue' ),
        meta: {
            title: 'Pay - libreevent',
            transition: 'scale',
        }
    },
    { 
        path: '/:pathMatch(.*)*', 
        name: 'NotFound', 
        component: () => import( '@/views/404.vue' ),
        meta: {
            title: '404 - Page not found :: libreevent',
            transition: 'scale',
        }
    },
    {
        path: '/admin/seatplan',
        name: 'adminSeatplanEditor',
        component: () => import( '@/views/admin/events/EditorView.vue' ),
        meta: {
            title: 'Seatplan Editor :: Admin - libreevent',
            adminAuthRequired: true,
        }
    },
]