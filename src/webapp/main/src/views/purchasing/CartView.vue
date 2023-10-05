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
                            <h4 class="price"><div style="display: inline;" v-if="ticket.count">{{ ticket.count }}x</div> {{ ticket.displayName }}: </h4>
                        </td>
                        <td>
                            {{ backend.currency }} {{ ticket.price }} <span class="material-symbols-outlined deleteButton" @click="deleteTicket( ticket.id, event.eventID, ticket.comp )" title="Delete ticket">delete</span>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="tool-wrapper">
                <h4>Total: {{ backend.currency }} {{ backend.total }}</h4>
                <router-link to="/purchase" id="toCartButton">Purchase now</router-link>
            </div>
        </div>
        <div v-else>
            Cart is empty. Please add tickets <router-link to="/tickets">here</router-link>
            <div class="empty-cart-wrapper">
                <span class="material-symbols-outlined empty-cart">remove_shopping_cart</span>
            </div>
        </div>
        <popups ref="popups" size="small" @data="data => { verifyTicketDelete( data.status ) }"></popups>
    </div>
</template>

<style scoped>
    #toCartButton {
        text-decoration: none;
        padding: 2%;
        width: fit-content;
        background-color: var( --accent-color );
        color: var( --secondary-color );
        transition: all 1s;
        border-radius: 50px;
        margin-top: 2%;
    }

    #toCartButton:hover {
        background-color: var( --accent-background-hover );
        border-radius: 10px;
    }

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
        width: 90%;
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

    .tickets-table {
        margin-left: 3%;
    }

    @media only screen and (min-width: 999px) {
        .cart-list {
            width: 50%;
        }
    }
</style>

<script>
import popups from '@/components/notifications/popups.vue';
    
export default {
    data() {
        return {
            cart: {},
            backend: { 'currency': 'CHF' },
            ticketToDelete: {},
        };
    },
    components: {
        popups,
    },
    methods: {
        calculateTotal () {
            this.backend[ 'total' ] = 0;
            for ( let event in this.cart ) {
                for ( let ticket in this.cart[ event ][ 'tickets' ] ) {
                    this.backend[ 'total' ] += parseInt( this.cart[ event ][ 'tickets' ][ ticket ][ 'price' ] ) * parseInt( this.cart[ event ][ 'tickets' ][ ticket ][ 'count' ] ?? 1 );
                }
            }
        },
        deleteTicket ( ticketID, event, component ) {
            this.ticketToDelete[ 'event' ] = event;
            this.ticketToDelete[ 'id' ] = ticketID;
            this.ticketToDelete[ 'component' ] = component;
            this.$refs.popups.openPopup( 'Do you really want to delete this ticket?', {}, 'confirm' );
        },
        verifyTicketDelete ( status ) {
            if ( status === 'ok' ) {
                if ( Object.keys( this.cart[ this.ticketToDelete.event ][ 'tickets' ] ).length > 1 ) {
                    delete this.cart[ this.ticketToDelete.event ][ 'tickets' ][ this.ticketToDelete.id ];
                } else {
                    delete this.cart[ this.ticketToDelete.event ];
                }
                const options = {
                    method: 'post',
                    body: JSON.stringify( { 'id': this.ticketToDelete[ 'id' ], 'eventID': this.ticketToDelete[ 'event' ], 'component': this.ticketToDelete[ 'component' ] } ),
                    headers: {
                        'Content-Type': 'application/json',
                        'charset': 'utf-8'
                    }
                };
                fetch( localStorage.getItem( 'url' ) + '/API/deselectTicket', options );
            }
            localStorage.setItem( 'cart', JSON.stringify( this.cart ) );
        },
        seatChecks ( event ) {
            let self = this;
            let allSeatsAvailable = true;

            fetch( localStorage.getItem( 'url' ) + '/getAPI/getReservedSeats?event=' + event ).then( res => {
                if ( res.status === 200 ) {
                    let unavailableSeats = {};
                    res.json().then( data => {
                        for ( let seat in data.reserved ) {
                            if ( data.reserved[ seat ] ) {
                                if ( !unavailableSeats[ data.reserved[ seat ].component ] ) {
                                    unavailableSeats[ data.reserved[ seat ].component ] = {};
                                }
                                unavailableSeats[ data.reserved[ seat ].component ][ data.reserved[ seat ].id ] = 'nav';
                            }
                        }
                        for ( let seat in data.user ) {
                            if ( data.user[ seat ] ) {
                                if ( !unavailableSeats[ data.user[ seat ].component ] ) {
                                    unavailableSeats[ data.user[ seat ].component ] = {};
                                }
                                unavailableSeats[ data.user[ seat ].component ][ data.user[ seat ].id ] = 'sel';
                            }
                        }

                        let tickets = {};
                        if ( this.cart[ event ] ) {
                            tickets = this.cart[ event ][ 'tickets' ];
                        }

                        if ( data.user ) {
                            for ( let element in tickets ) {
                                if ( !data.user[ element ] ) {
                                    allSeatsAvailable = false;
                                    if ( Object.keys( this.cart[ event ][ 'tickets' ] ).length > 1 ) {
                                        delete this.cart[ event ][ 'tickets' ][ element ];
                                    } else {
                                        delete this.cart[ event ];
                                    }
                                }
                            }
                        } else {
                            delete this.cart[ event ];
                            allSeatsAvailable = false;
                        }

                        this.unavailableSeats = unavailableSeats;

                        if ( !allSeatsAvailable ) {
                            setTimeout( () => {
                                self.$refs.popups.openPopup( 'We are sorry to tell you that since the last time the seat plan was refreshed, one or more of the seats you have selected has/have been taken.', {}, 'string' );
                            }, 500 );
                            localStorage.setItem( 'cart', JSON.stringify( this.cart ) );
                        }
                    } );
                } else {
                    console.error( 'unable to load' );
                }
            } );
        },
    },
    created () {
        window.addEventListener( 'visibilitychange', () => {
            this.cart = localStorage.getItem( 'cart' ) ? JSON.parse( localStorage.getItem( 'cart' ) ): {};
            this.calculateTotal();
        }, 1 );
        this.cart = localStorage.getItem( 'cart' ) ? JSON.parse( localStorage.getItem( 'cart' ) ): {};
        this.calculateTotal();
        for ( let event in this.cart ) {
            this.seatChecks( event );
        }
    }
};
</script>


<style>
    nav {
        display: initial;
    }

    .price {
        margin: 0;
        padding: 0;
    }
</style>