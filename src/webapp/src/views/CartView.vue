<template>
    <div class="order">
        <h1>Cart</h1>
        <h3>Your tickets</h3>
        <ul v-for="ticket in tickets">
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

<script>
    export default {
        data() {
            return {
                tickets: {}
            }
        },
        methods: {
            loadCart () {
                sessionStorage.getItem( 'selectedSeats' );
            }
        },
    }
</script>
