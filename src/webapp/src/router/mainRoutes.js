import HomeView from '../views/HomeView.vue';

export default [
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
        path: '/tickets/order',
        name: 'ticketOrder',
        component: () => import( '../views/TicketsOrderingView.vue' ),
        meta: {
            title: 'Order ticket - myevent',
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
    },
    { 
        path: '/:pathMatch(.*)*', 
        name: 'NotFound', 
        component: () => import( '@/views/404.vue')
    },
]