/*
*				libreevent - setupRoutes.js
*
*	Created by Janis Hutz 05/14/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

export default {
    path: '/setup',
    name: 'setup',
    component: () => import( '../views/SetupView.vue' ),
    meta: {
        title: 'Setup :: Admin - libreevent',
        setupAuthRequired: true,
    },
    children: [
        {
            path: '',
            name: 'setupStart',
            component: () => import( '../views/SetupStartView.vue' ),
            meta: {
                title: 'Start :: Setup - libreevent',
                setupAuthRequired: true,
            }
        },
        {
            path: 'basics',
            name: 'setupBasics',
            component: () => import( '../views/BasicSetupView.vue' ),
            meta: {
                title: 'Basic setup :: Setup - libreevent',
                setupAuthRequired: true,
            }
        },
        {
            path: 'root',
            name: 'setupRoot',
            component: () => import( '../views/SetupRootView.vue' ),
            meta: {
                title: 'Root account :: Setup - libreevent',
                setupAuthRequired: true,
            }
        },
        {
            path: 'page',
            name: 'setupPage',
            component: () => import( '../views/SetupPageView.vue' ),
            meta: {
                title: 'Landing page :: Setup - libreevent',
                setupAuthRequired: true,
            }
        },
        {
            path: 'complete',
            name: 'setupComplete',
            component: () => import( '../views/SetupCompleteView.vue' ),
            meta: {
                title: 'Setup complete :: Setup - libreevent',
                setupAuthRequired: true,
            }
        },
    ]
}