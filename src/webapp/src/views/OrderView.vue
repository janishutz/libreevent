<template>
    <div class="order">
        <h1>Order tickets</h1>
        <div class="order-app">
            <ul>
                <li>
                    <router-link to="/tickets/details" class="ticket" @click="setActiveTicket( 'test' );">
                        <div class="ticket-name">
                            <h3>Event name</h3>
                            <p>Event description</p>
                        </div>
                        <div class="ticket-info">
                            <p>Free seats / max seats</p>
                            <p>Date & time of event</p>
                            <h4>Starting at CHF 20.00</h4>
                        </div>
                        <img src="../assets/logo.png" alt="event logo" class="ticket-logo">
                    </router-link>
                </li>
            </ul>
        </div>
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
        name: 'OrderView',
        methods: {
            setActiveTicket ( id ) {
                sessionStorage.setItem( 'selectedTicket', id );
            }
        }
    };
</script>
