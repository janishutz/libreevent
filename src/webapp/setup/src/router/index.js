import { createRouter, createWebHistory } from 'vue-router';
import { useBackendStore } from '@/stores/backendStore';
import HomeView from '../views/HomeView.vue';
import setupRoutes from './setupRoutes';

let routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
        meta: {
            title: 'Welcome to libreevent!'
        }
    },
]

routes.push( setupRoutes );

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
} )

router.beforeEach( ( to ) => {
    let backendStore = useBackendStore();
    backendStore.loadVisitedSetupPages();
    if ( to.name.substring( 0, 5 ) === 'setup' && !backendStore.getVisitedSetupPages[ to.name.substring( 5 ).toLowerCase() ] && to.name.substring( 5 ).toLowerCase() !== 'start' && to.name.substring( 5 ).toLowerCase() !== 'root' ) {
        return { name: 'setupStart' };
    }
} );

router.afterEach( ( to ) => {
    document.title = to.meta.title ? to.meta.title : 'libreevent';
} );

export default router
