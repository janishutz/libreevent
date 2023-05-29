<!--
*				libreevent - 404.vue
*
*	Created by Janis Hutz 05/14/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div class="notFound">
        <h1 class="code">404</h1>
        <h2 class="message">The page you are looking for was not found on the server!</h2>
        <router-link to="/">Return to home page</router-link>
        <a href="https://libreevent.janishutz.com/docs/errors#404">More information on this error</a>
    </div>
</template>

<style scoped>
    .notFound {
        font-family: monospace;
        color: var( --primary-color );
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        height: 100%;
        width: 100%;
    }

    .code {
        font-size: 2500%;
        margin: 0;
        padding: 0;
    }

    .message {
        font-size: 200%;
    }

    .small {
        font-style: italic;
    }
</style>
