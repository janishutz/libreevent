export default {
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
            name: 'adminHome',
            component: () => import( '../views/admin/HomeView.vue' ),
            meta: {
                title: 'Home :: Admin - myevent',
                adminAuthRequired: true,
            }
        },
        {
            path: 'admin-accounts',
            name: 'adminAccounts',
            component: () => import( '../views/admin/AccountView.vue' ),
            meta: {
                title: 'Accounts :: Admin - myevent',
                adminAuthRequired: true,
                permissions: 'root'
            }
        },
        {
            path: 'pages',
            name: 'adminPages',
            component: () => import( '../views/admin/PagesView.vue' ),
            meta: {
                title: 'Pages :: Admin - myevent',
                adminAuthRequired: true,
            }
        },
        {
            path: 'events',
            name: 'adminEvents',
            component: () => import( '../views/admin/EventsView.vue' ),
            meta: {
                title: 'Events :: Admin - myevent',
                adminAuthRequired: true,
            }
        },
        {
            path: 'plugins',
            name: 'adminPlugins',
            component: () => import( '../views/admin/PluginsView.vue' ),
            meta: {
                title: 'Plugins :: Admin - myevent',
                adminAuthRequired: true,
            }
        },
        {
            path: 'settings',
            name: 'adminSettings',
            component: () => import( '../views/admin/SettingsView.vue' ),
            meta: {
                title: 'Admin - myevent',
                adminAuthRequired: true,
            }
        },
    ]
}