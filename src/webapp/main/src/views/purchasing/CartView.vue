<!--
*				libreevent - CartView.vue
*
*	Created by Janis Hutz 05/14/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div class="cart">
        <h1>Cart</h1>
        <div v-if="Object.keys( cart ).length > 0" class="cart-list">
            <h3>Your tickets</h3>
            <div v-for="event in cart">
                <h3>{{ event.displayName }}</h3>
                <table class="tickets-table">
                    <tr v-for="ticket in event.tickets">
                        <td>
                            <h4 class="price">{{ ticket.displayName }}: </h4>
                        </td>
                        <td>
                            {{ backend.currency }} {{ ticket.price }} <span class="material-symbols-outlined deleteButton" @click="deleteTicket( ticket.id, event.displayName )" title="Delete ticket">delete</span>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="tool-wrapper">
                <h4>Total: {{ backend.currency }} {{ backend.total }}</h4>
                <router-link to="/purchase">Purchase now</router-link>
            </div>
        </div>
        <div v-else>
            Cart is empty. Please add tickets <router-link to="/tickets">here</router-link>
            <div class="empty-cart-wrapper">
                <span class="material-symbols-outlined empty-cart">remove_shopping_cart</span>
            </div>
        </div>
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

    .empty-cart-wrapper {
        width: 100%;
        height: 70vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .empty-cart {
        display: block;
        font-size: 20rem;
    }

    .cart-list {
        width: 50%;
    }
    
    ul {
        list-style: none;
        text-align: justify;
    }

    .tool-wrapper {
        display: flex;
        width: 100%;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .deleteButton {
        cursor: pointer;
        font-size: 110%;
        margin: 0;
    }
</style>

<script>
    export default {
        data() {
            return {
                cart: {},
                backend: { 'currency': 'CHF' },
            }
        },
        methods: {
            calculateTotal () {
                this.backend.total = 0;
                for ( let event in this.cart ) {
                    for ( let ticket in this.cart[ event ][ 'tickets' ] ) {
                        this.backend.total += parseInt( this.cart[ event ][ 'tickets' ][ ticket ][ 'price' ] );
                    }
                }
            },
            deleteTicket ( ticketID, event ) {
                console.log( ticketID, event );
            }
        },
        created () {
            this.cart = localStorage.getItem( 'cart' ) ? JSON.parse( localStorage.getItem( 'cart' ) ): {};
            this.calculateTotal();
        }
    }
</script>


<style>
    nav {
        display: initial;
    }
</style>