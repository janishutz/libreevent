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
            path: 'payments',
            name: 'setupPayments',
            component: () => import( '../views/SetupPaymentsView.vue' ),
            meta: {
                title: 'Payments :: Setup - libreevent',
                setupAuthRequired: true,
            }
        },
        {
            path: 'events',
            name: 'setupEvents',
            component: () => import( '../views/SetupEventsView.vue' ),
            meta: {
                title: 'Events :: Setup - libreevent',
                setupAuthRequired: true,
            }
        },
        {
            path: 'tos',
            name: 'setupTOS',
            component: () => import( '../views/SetupTOSView.vue' ),
            meta: {
                title: 'TOS (Optional) :: Setup - libreevent',
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