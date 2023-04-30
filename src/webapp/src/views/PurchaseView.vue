<template>
    <div class="purchase">
        <h1>Purchase</h1>
        <div class="purchase-app">
            <div v-if="!isAuthenticated" class="wrapper">
                <router-link to="/login" class="option-button">Log in with an existing account</router-link><br>
                <router-link to="/signup" class="option-button">Create new account</router-link><br>
                <router-link to="/guest" v-if="!settings.accountRequired" class="option-button">Purchase as guest</router-link>
            </div>
            <div v-else class="wrapper">
                <h3>Order summary</h3>
                <div v-if="cartNotEmpty" class="cart-list">
                    <h3>Your tickets</h3>
                    <ul v-for="event in tickets" class="cart-list">
                        <li>{{ event.name }}
                            <ul v-for="ticket in event.selectedSeats">
                                <li>{{ ticket.name }} ({{ ticket.category.name }}, {{ ticket.ageGroup }}) {{ event.currency }} {{ ticket.price }}</li>
                            </ul>
                        </li>
                    </ul>
                    <div class="tool-wrapper wrapper-loggedIn">
                        <h4>Total: {{ backend.currency }} {{ backend.total }}</h4>
                        <router-link to="/pay">Buy now</router-link>
                    </div>
                </div>
                <div v-else>
                    Cart is empty. Please add tickets <router-link to="/tickets">here</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .purchase {
        height: 100%;
    }
    .purchase-app {
        text-align: justify;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 80%;
    }

    .option-button {
        border-style: solid;
        border-color: var( --primary-color );
        border-radius: 20px;
        padding: 6% 7%;
        display: block;
        width: 100%;
        text-align: center;
        margin: 0.5%;
        color: var( --primary-color );
        text-decoration: none;
    }

    .option-button:hover {
        background-color: var( --hover-color );
        color: var( --secondary-color )
    }

    .wrapper {
        width: 40%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        height: 100%;
    }

    .wrapper-loggedIn {
        width: 70%;
    }

    ul {
        list-style: none;
        text-align: justify;
    }

    .cart-list {
        width: 100%;
    }

    .tool-wrapper {
        display: flex;
        width: 100%;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>

<script>
export default {
    name: 'PurchaseView',
    data () {
        return {
            settings: { 'accountRequired': true },
            isAuthenticated: true,
            tickets: {},
            backend: {},
            cartNotEmpty: false,
        }
    },
    methods: {
        loadData () {
            this.cartNotEmpty = false;
            let tickets = JSON.parse( sessionStorage.getItem( 'cart' ) );

            for ( let event in tickets ) {
                if ( Object.keys( tickets[ event ][ 'selectedSeats' ] ).length  ) {
                    this.cartNotEmpty = true;
                };
            }

            this.tickets = tickets;
            this.backend = JSON.parse( sessionStorage.getItem( 'backend' ) );
        },
    },
    created () {
        this.loadData();
    }
};
</script>
