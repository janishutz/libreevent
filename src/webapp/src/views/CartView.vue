<template>
    <div class="cart">
        <h1>Cart</h1>
        <div v-if="cartNotEmpty" class="cart-list">
            <h3>Your tickets</h3>
            <ul v-for="event in tickets" class="cart-list">
                <li>{{ event.name }}
                    <ul v-for="ticket in event.selectedSeats">
                        <li>{{ ticket.name }} ({{ ticket.category.name }}, {{ ticket.ageGroup }}) {{ event.currency }} {{ ticket.price }} <span class="material-symbols-outlined deleteButton" @click="deleteEntry( ticket.name, event.name )" title="Delete ticket">delete</span></li>
                    </ul>
                </li>
            </ul>
            <div class="tool-wrapper">
                <h4>Total: {{ backend.currency }} {{ backend.total }}</h4>
                <router-link to="/purchase">Purchase now</router-link>
            </div>
        </div>
        <div v-else>
            Cart is empty. Please add tickets <router-link to="/tickets">here</router-link>
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
                tickets: {},
                backend: {},
                cartNotEmpty: false,
            }
        },
        methods: {
            loadCart () {
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
            deleteEntry( id, eventName ) {
                if ( confirm( 'Do you really want to delete this ticket?' ) ) {
                    let tickets = JSON.parse( sessionStorage.getItem( 'cart' ) );
                    for ( let event in tickets ) {
                        let ev = tickets[ event ];
                        if ( ev.name == eventName ) {
                            for ( let ticket in ev[ 'selectedSeats' ] ) {
                                if ( ev[ 'selectedSeats' ][ ticket ].name ) {
                                    delete tickets[ event ][ 'selectedSeats' ][ ticket ];
                                }
                            }
                        }
                    }
                    sessionStorage.setItem( 'cart', JSON.stringify( tickets ) );
                    this.sumUp();
                    this.loadCart();
                };
            },
            sumUp () {
                // This function calculates the total price of the tickets for this event.
                let cart = sessionStorage.getItem( 'cart' ) ? JSON.parse( sessionStorage.getItem( 'cart' ) ) : {};

                let price = 0;
                for ( let i in cart ) {
                    for ( let entry in cart[ i ][ 'selectedSeats' ] ) {
                        price += parseInt( cart[ i ][ 'selectedSeats' ][ entry ][ 'price' ] );
                    }
                }

                let back = {};

                back[ 'total' ] = price;
                back[ 'currency' ] = this.backend.currency;

                sessionStorage.setItem( 'backend', JSON.stringify( back ) );

                this.total = price;
                
                sessionStorage.setItem( 'cart', JSON.stringify( cart ) );
            },
        },
        created () {
            this.loadCart();
        }
    }
</script>
