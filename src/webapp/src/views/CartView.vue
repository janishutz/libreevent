<template>
    <div class="order">
        <h1>Cart</h1>
        <h3>Your tickets</h3>
        <ul>
            <li>Ticket</li>
        </ul>
        <router-link to="/purchase">Purchase now</router-link>
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
        color: black;
        border-color: black;
        border-width: 1px;
        height: fit-content;
        border-style: solid;
        padding: 10px;
        transition: 0.4s;
    }

    .ticket:hover {
        background-color: rgb(165, 165, 165);
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
