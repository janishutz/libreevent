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

                    <router-link to="/pay">Buy now</router-link>
                </div>
                <div class="cart">
                    <div class="cart-list">
                        <h2>Order summary</h2>
                        <h3>Your tickets</h3>
                        <ul v-for="event in tickets">
                            <li>{{ event.name }}
                                <ul v-for="ticket in event.selectedSeats">
                                    <li>{{ ticket.name }} ({{ ticket.category.name }}, {{ ticket.ageGroup }}) {{ event.currency }} {{ ticket.price }}</li>
                                </ul>
                            </li>
                        </ul>
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

    ul {
        list-style: none;
        text-align: justify;
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
</style>

<script>
import { useUserStore } from '@/stores/userStore';
import { useBackendStore } from '@/stores/backendStore';
import { mapStores } from 'pinia';

export default {
    name: 'PurchaseView',
    data () {
        return {
            settings: { 'accountRequired': true, 'requiresAddress': true, 'requiresAge': true, 'requiresSpecialNumber': true, 'specialNumberDisplayName': { 'de': '', 'en': 'id number' } },
            isAuthenticated: false,
            tickets: {},
            backend: {},
            cartNotEmpty: false,
        }
    },
    computed: {
        ...mapStores( useUserStore ),
        ...mapStores( useBackendStore )
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

            if ( this.cartNotEmpty ) {
                this.tickets = tickets;
                this.backend = JSON.parse( sessionStorage.getItem( 'backend' ) );
                this.isAuthenticated = this.userStore.getUserAuthenticated;
                this.settings.accountRequired = !this.backendStore.getIsGuestPurchaseAllowed;
            } else {
                this.$router.push( '/tickets' );
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
