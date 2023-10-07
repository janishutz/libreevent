<!--
*				libreevent - App.vue
*
*	Created by Janis Hutz 05/14/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <nav>
        <!-- <p class="beta">LIBREEVENT BETA! Although this is a very late beta, bugs may still appear</p> -->
        <a href="/">Home</a> |
        <router-link to="/tickets">Tickets</router-link> |
        <router-link to="/cart">Cart</router-link> |
        <router-link to="/account">Account</router-link> |
        <button @click="changeTheme();" v-html="theme" id="themeSelector"></button>
    </nav>
    <router-view v-slot="{ Component, route }">
        <transition :name="route.meta.transition || 'fade'" mode="out-in">
            <component :is="Component" />
        </transition>
    </router-view>
</template>

<style>
    .beta {
        color: red;
        padding: 0;
        margin: 0;
        font-weight: bold;
    }

    body {
        background-color: var( --background-color );
    }

    :root, :root.light {
        --primary-color: #2c3e50;
        --accent-background: rgb(30, 30, 82);
        --secondary-color: white;
        --background-color: white;
        --popup-color: rgb(224, 224, 224);
        --accent-color: #42b983;
        --hover-color: rgb(165, 165, 165);
        --accent-background-hover: #648cab;
        --overlay-color: rgba(0, 0, 0, 0.7);
        --inactive-color: rgb(100, 100, 100);
        --hint-color: rgb(174, 210, 221);
        --PI: 3.14159265358979;
    }

    :root.dark {
        --primary-color: white;
        --accent-background: rgb(20, 20, 116);
        --secondary-color: white;
        --background-color: rgb(32, 32, 32);
        --popup-color: rgb(58, 58, 58);
        --accent-color: #42b983;
        --hover-color: rgb(83, 83, 83);
        --accent-background-hover: #648cab;
        --overlay-color: rgba(104, 104, 104, 0.575);
        --inactive-color: rgb(190, 190, 190);
        --hint-color: rgb(88, 91, 110);
    }

    @media ( prefers-color-scheme: dark ) {
        :root {
            --primary-color: white;
            --accent-background: rgb(20, 20, 116);
            --secondary-color: white;
            --background-color: rgb(32, 32, 32);
            --popup-color: rgb(58, 58, 58);
            --accent-color: #42b983;
            --hover-color: rgb(83, 83, 83);
            --accent-background-hover: rgb(124, 140, 236);
            --overlay-color: rgba(104, 104, 104, 0.575);
            --inactive-color: rgb(190, 190, 190);
            --hint-color: rgb(88, 91, 110);
        }
    }

    ::selection {
        background-color: #7c8cec;
        color: var( --secondary-color );
    }

    #themeSelector {
        background-color: rgba( 0, 0, 0, 0 );
        color: var( --primary-color );
        font-size: 130%;
        padding: 0;
        margin: 0;
        border: none;
        cursor: pointer;
    }

    html,
    body {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
    }

    #app {
        transition: 0.5s;
        background-color: var( --background-color );
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: var( --primary-color );
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    nav {
        padding: 30px;
    }

    nav a {
        font-weight: bold;
        color: var( --primary-color );
    }

    nav a.router-link-exact-active {
        color: #42b983;
    }

    .scale-enter-active,
    .scale-leave-active {
        transition: all 0.5s ease;
    }

    .scale-enter-from,
    .scale-leave-to {
        opacity: 0;
        transform: scale(0.9);
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.4s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }

    .material-symbols-outlined {
        font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 0,
        'opsz' 48
    }

    .clr-open {
        border: black solid 1px !important;
    }
</style>

<script>
export default {
    name: 'app',
    data () {
        return {
            theme: '',
        };
    },
    methods: {
        changeTheme () {
            if ( this.theme === '&#9788;' ) {
                document.documentElement.classList.remove( 'dark' );
                document.documentElement.classList.add( 'light' );
                localStorage.setItem( 'theme', '&#9789;' );
                this.theme = '&#9789;';
            } else if ( this.theme === '&#9789;' ) {
                document.documentElement.classList.remove( 'light' );
                document.documentElement.classList.add( 'dark' );
                localStorage.setItem( 'theme', '&#9788;' );
                this.theme = '&#9788;';
            }
        }
    },
    created () {
        this.theme = localStorage.getItem( 'theme' ) ?? '';
        if ( window.matchMedia( '(prefers-color-scheme: dark)' ).matches || this.theme === '&#9788;' ) {
            document.documentElement.classList.add( 'dark' );
            this.theme = '&#9788;';
        } else {
            document.documentElement.classList.add( 'light' );
            this.theme = '&#9789;';
        }
        console.log( `
                 _ _ _                                   _   
                | (_) |                                 | |  
                | |_| |__  _ __ ___  _____   _____ _ __ | |_ 
                | | | '_ \\| '__/ _ \\/ _ \\ \\ / / _ \\ '_ \\| __|
                | | | |_) | | |  __/  __/\\ V /  __/ | | | |_ 
                |_|_|_.__/|_|  \\___|\\___| \\_/ \\___|_| |_|\\__|

You opened the developer tools. Know some coding? Want to help make this software even better?
Then come and join the development team of libreevent, the free and open source event management
solution. Your help is greatly appreciated by the team as well as all its users!

=> https://github.com/simplePCBuilding/libreevent
=> https://libreevent.janishutz.com/
        ` );
    }
};
</script>
