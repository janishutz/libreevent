<template>
    <div class="cart">
        <h1>Cart</h1>
        <h3>Your tickets</h3>
        <ul v-for="event in tickets" class="cart-list">
            <li>{{ event.name }}
                <ul v-for="ticket in event.selectedSeats">
                    <li>{{ ticket.name }} ({{ ticket.category.name }}, {{ ticket.ageGroup }}) {{ event.currency }} {{ ticket.price }}</li>
                </ul>
            </li>
        </ul>
        <router-link to="/purchase">Purchase now</router-link>
    </div>
</template>

<style scoped>
    .cart {
        text-align: justify;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .cart-list {
        width: 50%;
    }
    
    ul {
        list-style: none;
        text-align: justify;
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
                this.tickets = JSON.parse( sessionStorage.getItem( 'cart' ) );
            }
        },
        created () {
            this.loadCart();
        }
    }
</script>
