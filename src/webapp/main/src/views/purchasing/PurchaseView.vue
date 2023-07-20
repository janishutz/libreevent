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
        <div class="purchase-app">
            <div v-if="!isAuthenticated" class="wrapper-buttons">
                <router-link to="/login" class="option-button" @click="setRedirect()">Log in with an existing account</router-link><br>
                <router-link to="/signup" class="option-button" @click="setRedirect()">Create new account</router-link><br>
                <router-link to="/guest" v-if="!settings.accountRequired" class="option-button" @click="setRedirect()">Purchase as guest</router-link>
            </div>
            <div v-else class="wrapper">
                <div class="data">
                    <h2>Billing</h2>
                    <table class="billing-info-table">
                        <tr>
                            <td>Street and house number</td>
                            <td><input type="text" name="address" id="address"></td>
                        </tr>
                    </table>
                    <router-link to="/pay" id="buy-button">Buy now</router-link>
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
</style>

<script>
import { useUserStore } from '@/stores/userStore';
import { useBackendStore } from '@/stores/backendStore';
import { mapStores } from 'pinia';

export default {
    name: 'PurchaseView',
    data () {
        return {
            settings: { 'accountRequired': true, 'requiresAddress': true, 'requiresAge': true, 'requiresSpecialNumber': true, 'specialRequirement': { 'display': { 'de': '', 'en': 'id number' }, 'rules': {} } },
            isAuthenticated: false,
            cart: {},
            backend: { 'currency': 'CHF' },
            cartNotEmpty: false,
            userData: {},
        }
    },
    computed: {
        ...mapStores( useUserStore ),
        ...mapStores( useBackendStore )
    },
    methods: {
        loadData () {
            this.cartNotEmpty = false;
            let tickets = JSON.parse( localStorage.getItem( 'cart' ) );

            console.log( tickets );
            for ( let event in tickets ) {
                if ( Object.keys( tickets[ event ][ 'tickets' ] ).length  ) {
                    this.cartNotEmpty = true;
                };
            }

            
            if ( this.cartNotEmpty ) {
                this.cart = tickets;
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
        }
    },
    created () {
        this.loadData();
    }
};
</script>
