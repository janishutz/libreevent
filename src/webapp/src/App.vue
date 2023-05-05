<template>
    <nav>
        <router-link to="/">Home</router-link> |
        <router-link to="/tickets">Tickets</router-link> |
        <router-link to="/cart">Cart</router-link> |
        <router-link to="/login">Account</router-link> |
        <button @click="changeTheme();" v-html="theme" id="themeSelector"></button>
    </nav>
    <router-view v-slot="{ Component, route }">
        <transition :name="route.meta.transition || 'fade'" mode="out-in">
            <component :is="Component" />
        </transition>
    </router-view>
</template>

<style>
:root, :root.light {
    --primary-color: #2c3e50;
    --accent-background: rgb(30, 30, 82);
    --secondary-color: white;
    --background-color: white;
    --accent-color: #42b983;
    --hover-color: rgb(165, 165, 165);
    --accent-background-hover: #4380a8;
    --overlay-color: rgba(37, 37, 37, 0.575);
    --inactive-color: rgb(100, 100, 100);
    --highlight-backdrop: rgb(143, 134, 192);
}

:root.dark {
    --primary-color: white;
    --accent-background: rgb(100, 100, 190);
    --secondary-color: black;
    --background-color: rgb(32, 32, 32);
    --accent-color: #42b983;
    --hover-color: rgb(83, 83, 83);
    --accent-background-hover: #4380a8;
    --overlay-color: rgba(104, 104, 104, 0.575);
    --inactive-color: rgb(190, 190, 190);
    --highlight-backdrop: rgb(85, 63, 207);
}

@media ( prefers-color-scheme: dark ) {
    :root {
        --primary-color: white;
        --accent-background: rgb(100, 100, 190);
        --secondary-color: black;
        --background-color: rgb(32, 32, 32);
        --accent-color: #42b983;
        --hover-color: rgb(83, 83, 83);
        --accent-background-hover: #4380a8;
        --overlay-color: rgba(104, 104, 104, 0.575);
        --inactive-color: rgb(190, 190, 190);
        --highlight-backdrop: rgb(85, 63, 207);
    }
}

::selection {
    background-color: var( --highlight-backdrop );
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
</style>

<script>
export default {
    name: 'app',
    data () {
        return {
            theme: '',
        }
    },
    methods: {
        changeTheme () {
            if ( this.theme === '&#9788;' ) {
                document.documentElement.classList.remove( 'dark' );
                document.documentElement.classList.add( 'light' );
                sessionStorage.setItem( 'theme', '&#9789;' );
                this.theme = '&#9789;';
            } else if ( this.theme === '&#9789;' ) {
                document.documentElement.classList.remove( 'light' );
                document.documentElement.classList.add( 'dark' );
                sessionStorage.setItem( 'theme', '&#9788;' );
                this.theme = '&#9788;';
            }
        }
    },
    created () {
        this.theme = sessionStorage.getItem( 'theme' ) ? sessionStorage.getItem( 'theme' ) : '';
        if ( window.matchMedia( '(prefers-color-scheme: dark)' ).matches || this.theme === '&#9788;' ) {
            document.documentElement.classList.add( 'dark' );
            this.theme = '&#9788;';
        } else {
            document.documentElement.classList.add( 'light' );
            this.theme = '&#9789;';
        }
    }
}
</script>
