import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useUserStore } from '@/stores/userStore';

/* 
    This is the Vue.js router file. Here, all valid routes are defined.
*/
const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
        meta: {
            title: 'Home - myevent'
        }
    },
    {
        path: '/tickets',
        name: 'tickets',
        component: () => import( '../views/OrderView.vue' ),
        meta: {
            title: 'Order ticket - myevent'
        }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import( '../views/LoginView.vue' ),
        meta: {
            title: 'Login - myevent'
        }
    },
    {
        path: '/admin/login',
        name: 'adminLogin',
        component: () => import( '../views/AdminLoginView.vue' ),
        meta: {
            title: 'Login :: Admin - myevent'
        }
    },
    {
        path: '/admin',
        name: 'admin',
        component: () => import( '../views/admin/AdminView.vue' ),
        meta: {
            title: 'Admin - myevent',
            adminAuthRequired: true,
        },
        children: [
            {
                path: '',
                name: 'adminMain',
                component: () => import( '../views/admin/HomeView.vue' ),
                meta: {
                    title: 'Home :: Admin - myevent',
                    adminAuthRequired: true,
                }
            },
            {
                path: 'admin-accounts',
                name: 'adminAccounts',
                component: () => import( '../views/AdminLoginView.vue' ),
                meta: {
                    title: 'Accounts :: Admin - myevent',
                    adminAuthRequired: true,
                }
            },
            {
                path: 'pages',
                name: 'adminPages',
                component: () => import( '../views/AdminLoginView.vue' ),
                meta: {
                    title: 'Pages :: Admin - myevent',
                    adminAuthRequired: true,
                }
            },
            {
                path: 'events',
                name: 'adminEvents',
                component: () => import( '../views/AdminLoginView.vue' ),
                meta: {
                    title: 'Events :: Admin - myevent',
                    adminAuthRequired: true,
                }
            },
            {
                path: 'plugins',
                name: 'adminPlugins',
                component: () => import( '../views/AdminLoginView.vue' ),
                meta: {
                    title: 'Plugins :: Admin - myevent',
                    adminAuthRequired: true,
                }
            },
            {
                path: 'settings',
                name: 'adminSettings',
                component: () => import( '../views/AdminLoginView.vue' ),
                meta: {
                    title: 'Admin - myevent',
                    adminAuthRequired: true,
                }
            },
        ]
    },
    {
        path: '/signup',
        name: 'signup',
        component: () => import( '../views/SignupView.vue' ),
        meta: {
            title: 'Signup - myevent'
        }
    },
    {
        path: '/tickets/details',
        name: 'ticketDetails',
        component: () => import( '../views/TicketsDetailsView.vue' ),
        meta: {
            title: 'Details - myevent',
            transition: 'scale'
        }
    },
    {
        path: '/cart',
        name: 'cart',
        component: () => import( '../views/CartView.vue' ),
        meta: {
            title: 'Cart - myevent',
            transition: 'scale'
        }
    },
    {
        path: '/purchase',
        name: 'purchase',
        component: () => import( '@/views/PurchaseView.vue' ),
        meta: {
            title: 'Pay - myevent',
            transition: 'scale'
        }
    },
    {
        path: '/pay',
        name: 'pay',
        component: () => import( '@/views/PaymentView.vue' ),
        meta: {
            title: 'Pay - myevent',
            transition: 'scale',
        }
    }
]

const router = createRouter( {
    history: createWebHistory( process.env.BASE_URL ),
    routes,
} );


router.afterEach( ( to, from ) => {
    document.title = to.meta.title ? to.meta.title : 'myevent';
} );

/* 
    TODO: Get auth status from server on reload
*/

let AdminPages = [ 'admin', 'adminMain' ];

let UserAccountPages = [ 'account' ];

let authRequired = false;

router.beforeEach( ( to, from ) => {
    let userStore = useUserStore();
    let isUserAuthenticated = userStore.getUserAuthenticated;
    let isAdminAuthenticated = userStore.getAdminAuthenticated;

    if ( to.meta.adminAuthRequired && !isAdminAuthenticated ) {
        return { name: 'adminLogin' };
    } else if ( UserAccountPages.includes( to.name ) && !isUserAuthenticated ) {
        return { name: 'login' };
    } else if ( !isUserAuthenticated && to.name === 'purchase' && authRequired ) {
        return { name: 'login' };
    } else if ( !isUserAuthenticated && to.name === 'pay' ) {
        return { name: 'purchase' };
    }
} );

export default router;
