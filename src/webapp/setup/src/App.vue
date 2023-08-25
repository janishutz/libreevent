<template>
    <router-view v-slot="{ Component, route }">
        <transition :name="route.meta.transition || 'scale'" mode="out-in">
            <component :is="Component" />
        </transition>
    </router-view>
</template>

<style>
    :root {
        --primary-color: #2c3e50;
        --accent-background: rgb(30, 30, 82);
        --secondary-color: white;
        --background-color: white;
        --popup-color: rgb(224, 224, 224);
        --accent-color: #42b983;
        --hover-color: rgb(165, 165, 165);
        --accent-background-hover: rgb(124, 140, 236);
        --overlay-color: rgba(0, 0, 0, 0.7);
        --inactive-color: rgb(100, 100, 100);
        --highlight-backdrop: rgb(143, 134, 192);
        --hint-color: rgb(174, 210, 221);
        --PI: 3.14159265358979;
    }

    @media ( prefers-color-scheme: dark ) {
        :root {
            --primary-color: white;
            --accent-background: rgb(56, 56, 112);
            --secondary-color: white;
            --background-color: rgb(32, 32, 32);
            --popup-color: rgb(58, 58, 58);
            --accent-color: #42b983;
            --hover-color: rgb(83, 83, 83);
            --accent-background-hover: #4380a8;
            --overlay-color: rgba(104, 104, 104, 0.575);
            --inactive-color: rgb(190, 190, 190);
            --highlight-backdrop: rgb(85, 63, 207);
            --hint-color: rgb(88, 91, 110);
        }
    }

    ::selection {
        background-color: var( --highlight-backdrop );
        color: var( --secondary-color );
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

    .button {
        margin-top: 2%;
        background: linear-gradient(90deg, rgb(30, 36, 131), rgb(87, 66, 184), rgb(105, 115, 214), rgb(30, 36, 131), rgb(41, 128, 109), rgb(146, 50, 47));
        background-size: 300px;
        padding: 10px 20px;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        transition: all 3s;
        font-size: 75%;
        color: white;
        margin-bottom: 5vh;
        font-size: 125%;
    }

    .button:hover {
        background-size: 200%;
        background-position: -100%;
    }

    input {
        width: 50%;
        padding: 10px;
        border-radius: 500px;
        border-style: solid;
        text-align: center;
        margin-bottom: 20px;
    }

    select {
        width: 50%;
        text-align: center;
        padding: 10px;
        border-radius: 500px;
        border-style: solid;
        background-color: #b4d9ff;
    }

    .wrapper {
        width: 100vw;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .content {
        width: 60vw;
        font-size: 110%;
    }
</style>

<script>
export default {
    created () {
        this.theme = localStorage.getItem( 'theme' ) ? localStorage.getItem( 'theme' ) : '';
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