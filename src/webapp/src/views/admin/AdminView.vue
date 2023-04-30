<template>
    <div class="admin-wrapper">
        <div class="top-bar">
            <h1>Admin panel</h1>
        </div>
        <nav class="side-nav">
            <router-link to="/admin" class="admin-menu">Home</router-link>
            <router-link to="/admin/admin-accounts" class="admin-menu">Admin Accounts</router-link>
            <router-link to="/admin/pages" class="admin-menu">Pages</router-link>
            <router-link to="/admin/events" class="admin-menu">Events</router-link>
            <router-link to="/admin/plugins" class="admin-menu">Plugins</router-link>
            <router-link to="/admin/settings" class="admin-menu">Settings</router-link>
            <button to="/admin/login" class="admin-menu" @click="logout()">Logout</button>
        </nav>
        <div class="main-view">
            <router-view v-slot="{ Component, route }">
                <transition :name="route.meta.transition || 'fade'" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </div>
    </div>
</template>

<style scoped>
    .admin-wrapper {
        display: grid;
        grid-template-areas:
        'sidebar top top top'
        'sidebar main main main'
        'sidebar main main main'
        'sidebar main main main'
        'sidebar main main main'
        'sidebar main main main'
        'sidebar main main main'
        'sidebar main main main'
        'sidebar main main main';
        height: 100%;
    }

    .top-bar {
        grid-area: top;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    }

    .main-view {
        grid-area: main;
        height: 100%;
        min-height: 80vh;
        overflow: scroll;
    }

    .side-nav {
        grid-area: sidebar;
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 0;
        margin: 0;
        background-color: var( --accent-background );
        justify-content: center;
        overflow: scroll;
    }

    .admin-menu {
        padding: 4% 0%;
        width: 100%;
        background-color: rgba( 0, 0, 0, 0 );
        color: var( --secondary-color );
        cursor: pointer;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        font-weight: bold;
        text-decoration: none;
        transition: 1s;
        font-size: 100%;
        border-style: none;
    }

    nav a.router-link-exact-active {
        background-color: var( --accent-background-hover );
    }

    .admin-menu:hover {
        background-color: var( --accent-background-hover );
        transition: 0.4s;
    }

</style>

<style>
    nav {
        display: none;
    }
</style>

<script>
    import { useUserStore } from '@/stores/userStore';
    import { mapStores } from 'pinia';

    export default {
        data () {
            return {
                formData: {}
            }
        },
        computed: {
            ...mapStores( useUserStore )
        },
        methods: {
            logout () {
                if ( confirm( 'Do you really want to log out?' ) ) {
                    fetch( '/admin/logout' ).then( _ => {
                        this.userStore.setAdminAuth( false );
                        this.$router.push( '/admin/login' );
                    } );
                }
            }
        }
    };
</script>

