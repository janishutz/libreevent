<template>
    <div class="order">
        <h1>Purchase</h1>
        <h3>Please choose a payment option</h3>
    </div>
</template>

<style scoped>
    .order-app {
        text-align: justify;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    ul {
        list-style: none;
        width: 80%;
    }

    .ticket {
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        color: var( --primary-color );
        border-color: var( --primary-color );
        border-width: 1px;
        height: fit-content;
        border-style: solid;
        padding: 10px;
        transition: 0.4s;
    }

    .ticket:hover {
        background-color: var( --hover-color );
        transition: 0.4s;
    }

    .ticket-logo {
        height: 20vh;
        width: auto;
        margin-left: auto;
    }

    .ticket-name {
        margin-right: auto;
    }

    .ticket-info {
        margin-left: auto;
        margin-right: auto
    }
</style>
