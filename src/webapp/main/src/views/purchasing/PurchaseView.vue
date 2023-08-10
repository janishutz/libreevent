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
                <router-link to="/guest" v-if="!settings.accountRequired" class="option-button" @click="setRedirect()">Purchase as guest</router-link>
            </div>
            <div v-else class="wrapper">
                <div class="data">
                    <h2>Billing</h2>
                    <table class="billing-info-table">
                        <tr v-if="settings.requiresAddress">
                            <td>Street and house number</td>
                            <td><input type="text" name="street" id="street" v-bind="userData.street" placeholder="Street"> <input type="text" name="houseNumber" id="houseNumber" v-bind="userData.houseNumber" placeholder="House number"></td>
                        </tr>
                        <tr v-if="settings.requiresAddress">
                            <td>Zip Code and City</td>
                            <td><input type="text" name="zip" id="zip" v-bind="userData.zip" placeholder="Zip Code"> <input type="text" name="city" id="city" v-bind="userData.city" placeholder="City"></td>
                        </tr>
                        <tr v-if="settings.requiresAddress">
                            <td>Country</td>
                            <td><input type="text" name="country" id="country" v-bind="userData.zip" placeholder="Country"></td>
                        </tr>
                        <tr v-if="settings.requiresAge">
                            <td>Birth date</td>
                            <td><input type="date" name="bday" id="bday" v-bind="userData.bday"></td>
                        </tr>
                    </table>

                    <div v-if="settings.requiresSpecialToken">
                        <!-- TODO: FUTURE: Implement -->
                    </div>
                    <button id="buy-button" @click="preparePayment();">Buy now</button>
                </div>
                <div class="cart">
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
                </div>
            </div>
        </div>
        <div v-else>
            Cart is empty. Please add tickets <router-link to="/tickets">here</router-link>
            <div class="empty-cart-wrapper">
                <span class="material-symbols-outlined empty-cart">remove_shopping_cart</span>
            </div>
        </div>
        <notifications ref="notification" location="topleft" size="bigger"></notifications>
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
        display: flex;
        align-items: center;
        justify-content: center;
        flex-grow: 1;
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

    .data {
        grid-area: main;
        display: flex;
        justify-content: justify;
        align-items: center;
        flex-direction: column;
        flex-grow: 1;
    }    
    
    .option-button:hover {
        background-color: var( --hover-color );
        color: var( --secondary-color )
    }
    
    .cart {
        grid-area: sidebar;
        background-color: var( --accent-background );
        color: var( --secondary-color );
        overflow: scroll;
    }

    .wrapper-buttons {
        width: 40%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        height: 100%;
    }

    .wrapper {
        width: 100%;
        display: grid;
        height: 100%;
        grid-template-areas:
        'main main main sidebar'
        'main main main sidebar'
        'main main main sidebar'
        'main main main sidebar'
        'main main main sidebar'
        'main main main sidebar'
        'main main main sidebar'
        'main main main sidebar'
        'main main main sidebar';
    }

    .cart-list {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
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
    },
    computed: {
        ...mapStores( useUserStore ),
        ...mapStores( useBackendStore )
    },
    methods: {
        loadData () {
            // TODO: Also load the customer data from server!
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
    }
};
</script>
