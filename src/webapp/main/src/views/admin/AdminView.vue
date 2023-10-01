<!--
*				libreevent - AdminView.vue
*
*	Created by Janis Hutz 05/12/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div class="admin-wrapper">
        <div class="top-bar">
            <h1>Admin panel</h1>
        </div>
        <button class="hideNav navHidden" @click="navMenu( 'toggle' );">&#9776</button>
        <nav class="side-nav">
            <div class="side-nav-wrapper">
                <img src="@/assets/logo.png" alt="libreevent logo" style="width: 80%; margin-left: 10%; margin-bottom: 5%;">
                <router-link to="/admin" class="admin-menu" @click="navMenu( 'hide' )" title="The home page of the admin panel">Home</router-link>
                <router-link to="/admin/pages" class="admin-menu" @click="navMenu( 'hide' )" title="Modify your landing page">Pages</router-link>
                <router-link to="/admin/events" class="admin-menu" @click="navMenu( 'hide' )" title="Change and view everything about your events">Events</router-link>
                <router-link to="/admin/locations" class="admin-menu" @click="navMenu( 'hide' )" title="Change settings about your event locations">Locations</router-link>
                <router-link to="/admin/plugins" class="admin-menu" @click="navMenu( 'hide' )" title="Manage plugins">Plugins</router-link>
                <router-link to="/admin/settings" class="admin-menu" @click="navMenu( 'hide' )" title="Change global settings for libreevent">Settings</router-link>
                <button to="/admin/login" class="admin-menu" @click="logout()" title="Log out of the admin panel">Logout</button>
            </div>
        </nav>
        <div class="backdrop" @click="navMenu( 'hide' )"></div>
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
        display: block;
        height: 100%;
    }

    .top-bar {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 10vh;
    }

    .main-view {
        grid-area: main;
        height: 90vh;
        width: 100vw;
        min-height: 80vh;
        overflow: scroll;
    }

    .backdrop {
        width: 100vw;
        height: 100vh;
        z-index: 1;
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgba( 0, 0, 0, 0.7 );
    }

    .side-nav {
        position: fixed;
        display: none;
        height: 100vh;
        top: 0;
        width: 70vw;
        padding: 0;
        margin: 0;
        background-color: var( --accent-background );
        z-index: 3;
    }

    .side-nav-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        overflow: scroll;
        height: 100%;
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

    .hideNav {
        border: none;
        font-size: 300%;
        color: var( --secondary-color );
        width: fit-content;
        background-color: rgba( 0, 0, 0, 0 );
        position: fixed;
        cursor: pointer;
        top: 1vw;
        left: 2vw;
        z-index: 5;
    }

    .navHidden {
        color: var( --primary-color );
    }

    @media only screen and (min-width: 1299px) {
        .hideNav, .backdrop {
            display: none;
        }

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
            width: 80vw;
            min-height: 80vh;
            overflow: scroll;
        }

        .side-nav {
            position: initial;
            grid-area: sidebar;
            display: flex;
            flex-direction: column;
            height: 100%;
            width: 20vw;
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
        };
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
        },
        navMenu ( action ) {
            if ( screen.width < 1300 ) {
                if ( action === 'toggle' ) {
                    $( '.side-nav' ).toggle( 300 );
                    $( '.hideNav' ).toggleClass( 'navHidden' );
                    $( '.backdrop' ).toggle( 300 );
                } else if ( action === 'show' ) {
                    $( '.backdrop' ).show( 300 );
                    $( '.side-nav' ).show( 300 );
                    $( '.hideNav' ).removeClass( 'navHidden' );
                } else {
                    $( '.side-nav' ).hide( 300 );
                    $( '.backdrop' ).hide( 300 );
                    $( '.hideNav' ).addClass( 'navHidden' );
                }
            }
        }
    }
};
</script>

