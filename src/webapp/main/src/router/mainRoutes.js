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
            title: 'Home - '
        }
    },
    {
        path: '/tickets',
        name: 'tickets',
        component: () => import( '../views/purchasing/OrderView.vue' ),
        meta: {
            title: 'Order ticket - '
        }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import( '../views/user/LoginView.vue' ),
        meta: {
            title: 'Login - '
        }
    },
    {
        path: '/admin/login',
        name: 'adminLogin',
        component: () => import( '../views/admin/AdminLoginView.vue' ),
        meta: {
            title: 'Login :: Admin - '
        }
    },
    {
        path: '/admin/twoFactors',
        name: 'admin2FA',
        component: () => import( '../views/admin/TwoFA.vue' ),
        meta: {
            title: 'Two Factor Authentication :: Admin - '
        }
    },
    {
        path: '/signup',
        name: 'signup',
        component: () => import( '../views/user/SignupView.vue' ),
        meta: {
            title: 'Signup - '
        }
    },
    {
        path: '/account',
        name: 'account',
        component: () => import( '../views/user/AccountView.vue' ),
        meta: {
            title: 'Account - '
        }
    },
    {
        path: '/twoFactors',
        name: '2fa',
        component: () => import( '../views/user/TwoFA.vue' ),
        meta: {
            title: 'Two Factor Authentication - '
        }
    },
    {
        path: '/tickets/details',
        name: 'ticketDetails',
        component: () => import( '../views/purchasing/TicketsDetailsView.vue' ),
        meta: {
            title: 'Details - ',
            transition: 'scale'
        }
    },
    {
        path: '/tickets/order',
        name: 'ticketOrder',
        component: () => import( '../views/purchasing/TicketsOrderingView.vue' ),
        meta: {
            title: 'Order ticket - ',
            transition: 'scale'
        }
    },
    {
        path: '/cart',
        name: 'cart',
        component: () => import( '../views/purchasing/CartView.vue' ),
        meta: {
            title: 'Cart - ',
            transition: 'scale'
        }
    },
    {
        path: '/purchase',
        name: 'purchase',
        component: () => import( '@/views/purchasing/PurchaseView.vue' ),
        meta: {
            title: 'Purchase - ',
            transition: 'scale'
        }
    },
    {
        path: '/guest',
        name: 'guestPurchase',
        component: () => import( '@/views/purchasing/GuestPurchaseView.vue' ),
        meta: {
            title: 'Guest purchase - ',
            transition: 'scale'
        }
    },
    {
        path: '/admin/seatplan',
        name: 'adminSeatplanEditor',
        component: () => import( '@/views/admin/events/EditorView.vue' ),
        meta: {
            title: 'Seatplan Editor :: Admin - ',
            adminAuthRequired: true,
        }
    },
    {
        path: '/admin/ticketEditor',
        name: 'adminTicketEditor',
        component: () => import( '@/views/admin/events/TicketEditorView.vue' ),
        meta: {
            title: 'Ticket Editor :: Admin - ',
            adminAuthRequired: true,
        }
    },
    { 
        path: '/:pathMatch(.*)*', 
        name: 'NotFound', 
        component: () => import( '@/views/404.vue' ),
        meta: {
            title: '404 - Page not found :: ',
            transition: 'scale',
        }
    },
]