/* eslint-disable no-undef */

fetch( '/admin/panel/modules' ).then( res => {
    res.json().then( data => {
        const Home = { template: data[ 'home' ] };
        const About = { template: '<div>About</div>' };

        const routes = [
            { path: '/', component: Home },
            { path: '/about', component: About }
        ];

        const router = VueRouter.createRouter( {
            history: VueRouter.createWebHashHistory(),
            routes,
        } );

        const app = Vue.createApp( {
            data() {
                return {

                };
            },
            watch: {
                $route ( to, from ) {
                    console.log( 'changing route' );
                }
            },
        } );

        app.use( router );

        app.mount( '#app' );
    } );
} );