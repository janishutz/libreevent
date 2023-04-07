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
            title: 'Admin - myevent'
        }
    },
    {
        path: '/signup',
        name: 'signup',
        component: () => import( '../views/SignupView.vue' ),
        meta: {
            title: 'Signup - myevent'
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

export default router;
