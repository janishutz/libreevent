import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

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
        component: () => import( '../views/HomeView.vue' ),
        meta: {
            title: 'Admin - myevent'
        },
        children: [
            {
                path: 'settings',
                name: 'adminSettings',
                component: () => import( '../views/AdminLoginView.vue' ),
                meta: {
                    title: 'Admin - myevent'
                }
            },
            {
                path: '',
                name: 'adminMain',
                component: () => import( '../views/AdminLoginView.vue' ),
                meta: {
                    title: 'Admin - myevent'
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
            title: 'Purchase - myevent',
            transition: 'scale'
        }
    }
]

const router = createRouter( {
    history: createWebHistory( process.env.BASE_URL ),
    routes,
    
} );


router.afterEach( ( to, from ) => {
    document.title = to.meta.title ? to.meta.title : 'default title';
} );

let disallowed = [ 'admin', 'adminMain' ];
let isAuthenticated = true;

router.beforeEach( ( to, from ) => {
    if ( disallowed.includes( to.name ) && !isAuthenticated ) {
        return { name: 'adminLogin' };
    }
} );

export default router;
