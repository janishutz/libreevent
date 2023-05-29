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
        title: 'Login :: Admin - libreevent',
        adminAuthRequired: true,
    },
    children: [
        {
            path: '',
            name: 'setupStart',
            component: () => import( '../views/setup/SetupStartView.vue' ),
            meta: {
                title: 'Start :: Setup - libreevent',
                adminAuthRequired: true,
            }
        },
        {
            path: 'root',
            name: 'setupRoot',
            component: () => import( '../views/setup/SetupRootView.vue' ),
            meta: {
                title: 'Root account :: Setup - libreevent',
                adminAuthRequired: true,
            }
        },
        {
            path: 'page',
            name: 'setupPage',
            component: () => import( '../views/setup/SetupPageView.vue' ),
            meta: {
                title: 'Landing page :: Setup - libreevent',
                adminAuthRequired: true,
            }
        },
        {
            path: 'payments',
            name: 'setupPayments',
            component: () => import( '../views/setup/SetupPaymentsView.vue' ),
            meta: {
                title: 'Payments :: Setup - libreevent',
                adminAuthRequired: true,
            }
        },
        {
            path: 'events',
            name: 'setupEvents',
            component: () => import( '../views/setup/SetupEventsView.vue' ),
            meta: {
                title: 'Events :: Setup - libreevent',
                adminAuthRequired: true,
            }
        },
        {
            path: 'tos',
            name: 'setupTOS',
            component: () => import( '../views/setup/SetupTOSView.vue' ),
            meta: {
                title: 'TOS (Optional) :: Setup - libreevent',
                adminAuthRequired: true,
            }
        },
        {
            path: 'complete',
            name: 'setupComplete',
            component: () => import( '../views/setup/SetupCompleteView.vue' ),
            meta: {
                title: 'Setup complete :: Setup - libreevent',
                adminAuthRequired: true,
            }
        },
    ]
}