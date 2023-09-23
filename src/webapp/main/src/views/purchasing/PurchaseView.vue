<!--
*				libreevent - PurchaseView.vue
*
*	Created by Janis Hutz 05/14/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div class="purchase">
        <h1>Purchase</h1>
        <div class="purchase-app" v-if="cartNotEmpty">
            <div v-if="!isAuthenticated" class="wrapper-buttons">
                <router-link to="/login" class="option-button" @click="setRedirect()">Log in with an existing account</router-link><br>
                <router-link to="/signup" class="option-button" @click="setRedirect()">Create new account</router-link><br>
                <!-- <router-link to="/guest" v-if="!settings.accountRequired" class="option-button" @click="setRedirect()">Purchase as guest</router-link> -->
            </div>
            <div v-else class="wrapper">
                <p>Ready to buy? Please once again check that all the right items are in your cart.</p>
                <div class="cart-list">
                    <h2>Order summary</h2>
                    <h3>Your tickets</h3>
                    <div v-for="event in cart">
                        <h3>{{ event.displayName }}</h3>
                        <table class="tickets-table">
                            <tr v-for="ticket in event.tickets">
                                <td>
                                    <h4 class="price"><div style="display: inline;" v-if="ticket.count">{{ ticket.count }}x</div> {{ ticket.displayName }}: </h4>
                                </td>
                                <td>
                                    {{ backend.currency }} {{ ticket.price }}
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="tool-wrapper wrapper-loggedIn">
                        <h4>Total: {{ backend.currency }} {{ backend.total }}</h4>
                    </div>
                </div>
                <button id="buy-button" @click="preparePayment();">Buy now</button>
            </div>
        </div>
        <div v-else>
            Cart is empty. Please add tickets <router-link to="/tickets">here</router-link>
            <div class="empty-cart-wrapper">
                <span class="material-symbols-outlined empty-cart">remove_shopping_cart</span>
            </div>
        </div>
        <notifications ref="notification" location="topleft" size="bigger"></notifications>
        <popups ref="popups" size="small" @data="data => { verifyTicketDelete( data.status ) }"></popups>
    </div>
</template>

<style scoped>
    #buy-button {
        background-color: var( --accent-background );
        padding: 2% 4%;
        border-radius: 50px;
        color: var( --secondary-color );
        text-decoration: none;
        transition: all 0.5s;
        font-size: 100%;
        margin-top: 4%;
        cursor: pointer;
    }

    #buy-button:hover {
        margin-top: 2%;
        border-radius: 20px;
        padding: 3% 6%;
        font-size: 130%;
        background-color: var( --accent-background-hover );
    }

    .purchase {
        height: 100%;
        display: flex;
        flex-grow: 1;
        flex-direction: column;
    }
    
    .purchase-app {
        text-align: justify;
        width: 100%;
    }

    
    .option-button {
        border-style: solid;
        border-color: var( --primary-color );
        border-radius: 20px;
        padding: 6% 7%;
        display: block;
        width: 60%;
        text-align: center;
        margin: 0.5%;
        color: var( --primary-color );
        text-decoration: none;
    }  
    
    .option-button:hover {
        background-color: var( --hover-color );
        color: var( --secondary-color )
    }

    .wrapper-buttons {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        height: 100%;
    }

    .wrapper {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .cart-list {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .tool-wrapper {
        display: flex;
        width: 100%;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .price {
        margin: 0;
        padding: 0;
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
</style>

<script>
import { useUserStore } from '@/stores/userStore';
import { useBackendStore } from '@/stores/backendStore';
import { mapStores } from 'pinia';
import notifications from '@/components/notifications/notifications.vue';
import popups from '@/components/notifications/popups.vue';

export default {
    name: 'PurchaseView',
    data () {
        return {
            settings: { 'accountRequired': true, 'requiresAddress': true, 'requiresAge': true, 'requiresSpecialToken': true, 'specialRequirement': { 'display': { 'de': '', 'en': 'id number' }, 'rules': {} } },
            isAuthenticated: false,
            cart: {},
            backend: { 'currency': 'CHF' },
            cartNotEmpty: false,
            userData: {},
        }
    },
    components: {
        notifications,
        popups,
    },
    computed: {
        ...mapStores( useUserStore ),
        ...mapStores( useBackendStore )
    },
    methods: {
        loadData () {
            this.cartNotEmpty = false;
            let cart = JSON.parse( localStorage.getItem( 'cart' ) );

            for ( let event in cart ) {
                if ( Object.keys( cart[ event ][ 'tickets' ] ).length  ) {
                    this.cartNotEmpty = true;
                };
            }
            
            if ( this.cartNotEmpty ) {
                this.cart = cart;
                this.isAuthenticated = this.userStore.getUserAuthenticated;
                this.settings.accountRequired = !this.backendStore.getIsGuestPurchaseAllowed;
                this.calculateTotal();
            } else {
                this.$router.push( '/tickets' );
            }
            for ( let event in this.cart ) {
                this.seatChecks( event );
            }
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
                                self.$refs.popups.openPopup( 'We are sorry to tell you that an error occurred in the system and all sessions have been reset. You will need to pick the seats again. We are very sorry for the inconvenience', {}, 'string' );
                            }, 500 );
                            localStorage.setItem( 'cart', JSON.stringify( this.cart ) );
                        }
                    } );
                } else {
                    console.error( 'unable to load' );
                }
            } );
        },
        calculateTotal () {
            this.backend[ 'total' ] = 0;
            for ( let event in this.cart ) {
                for ( let ticket in this.cart[ event ][ 'tickets' ] ) {
                    this.backend[ 'total' ] += parseInt( this.cart[ event ][ 'tickets' ][ ticket ][ 'price' ] ) * parseInt( this.cart[ event ][ 'tickets' ][ ticket ][ 'count' ] ?? 1 );
                }
            }
        },
        setRedirect () {
            sessionStorage.setItem( 'redirect', '/purchase' );
        },
        preparePayment () {
            /* 
                How it works: Request to payment handling route of server -> get URL for payment
                -> Redirect to that URL -> On completion payment provider redirects to complete
                route (plain HTML document) which then awaits processing completion and gives the
                user a link to download the ticket. A mail has been sent to user automatically.
            */
            let prep = this.$refs.notification.createNotification( 'Preparing payment...', 20, 'progress', 'normal' );

            let fetchOptions = {
                method: 'post',
                body: JSON.stringify( this.userData ),
                headers: {
                    'Content-Type': 'application/json',
                    'charset': 'utf-8'
                }
            };

            fetch( '/payments/prepare', fetchOptions ).then( res => {
                if ( res.status === 200 ) {
                    this.$refs.notification.cancelNotification( prep );
                    this.$refs.notification.createNotification( 'Payment prepared, redirecting...', 5, 'progress', 'high' );
                    res.text().then( text => {
                        setTimeout( () => {
                            window.location.href = text;
                        }, 300 );
                    } );
                } else if ( res.status === 428 ) {
                    res.text().then( text => {
                        if ( text === 'ERR_MAIL_UNCONFIRMED' ) {
                            this.$refs.notification.cancelNotification( prep );
                            this.$refs.notification.createNotification( 'Please confirm your email address to proceed', 10, 'error', 'high' );
                        }
                    } );
                } else {
                    this.$refs.notification.cancelNotification( prep );
                    this.$refs.notification.createNotification( 'An error occurred during preparation of payments. Please try again.', 10, 'error', 'high' );
                }
            } ).catch( err => {
                console.error( err );
                this.$refs.notification.cancelNotification( prep );
                this.$refs.notification.createNotification( 'An error occurred during preparation of payments. Please try again.', 10, 'error', 'high' );
            } );
        }
    },
    created () {
        this.loadData();
        fetch( localStorage.getItem( 'url' ) + '/getAPI/extendTicketDeletion' );
    }
};
</script>
