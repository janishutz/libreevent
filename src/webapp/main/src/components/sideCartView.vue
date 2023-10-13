<!--
*				libreevent - sideCartView.vue
*
*	Created by Janis Hutz 07/17/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div id="sideCartView" :class="type ? 'seatplan': 'noseatplan'">
        <h1>Seat plan: {{ name }}</h1>
        <h2>Cart</h2>
        <div v-if="Object.keys( cart ).length > 0" style="height: 100%; width: 100%;">
            <div class="scroll-wrapper">
                <div v-for="event in cart">
                    <h3>{{ event.displayName }}</h3>
                    <table class="tickets-table">
                        <tr v-for="ticket in event.tickets">
                            <td>
                                <h4 class="price"><div style="display: inline;" v-if="ticket.count">{{ ticket.count }}x</div> {{ ticket.displayName }}: </h4>
                            </td>
                            <td>
                                {{ currency }} {{ ticket.price }}
                            </td>
                        </tr>
                    </table>
                </div>
                <table class="tickets-table">
                    <tr>
                        <td>
                            <h4>TOTAL:</h4>
                        </td>
                        <td>
                            <h4>{{ currency }} {{ total }}</h4>
                        </td>
                    </tr>
                </table>
                <router-link to="/cart" id="toCartButton">To Cart</router-link>
            </div>
        </div>
        <div v-else>
            Your cart is currently empty
        </div>
    </div>
</template>

<script>
export default {
    name: 'sideCartView',
    props: {
        'cart': {
            type: Object,
            default: {}
            // EXAMPLE: { 'TestEvent2': { 'displayName': 'TestEvent2', 'tickets': { 'secAr1s1': { 'displayName': 'Row 1, Seat 1', 'price': 20 } } } }
        },
        'width': {
            type: Number,
            default: 25
        },
        'currency': {
            type: String,
            default: 'CHF'
        },
        'type': {
            type: Boolean,
            default: true
        },
        'name': {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            total: 0,
        };
    },
    methods: {
        calculateTotal () {
            this.total = 0;
            for ( let event in this.cart ) {
                for ( let ticket in this.cart[ event ][ 'tickets' ] ) {
                    this.total += parseInt( this.cart[ event ][ 'tickets' ][ ticket ][ 'price' ] ) * parseInt( this.cart[ event ][ 'tickets' ][ ticket ][ 'count' ] ?? 1 );
                }
            }
        }
    },
    created() {
        this.calculateTotal();
    }
};
</script>

<style scoped>
    #toCartButton {
        text-decoration: none;
        padding: 5%;
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

    #sideCartView {
        background-color: var( --accent-background );
        color: var( --secondary-color );
        height: 50vh;
    }

    .seatplan {
        width: 100%;
        position: absolute;
        top: calc( 90px + 80vh );
        height: fit-content;
        padding-bottom: 5%;
    }

    .tickets-table {
        width: 80%;
    }

    .scroll-wrapper {
        width: 100%;
        height: 70%;
        overflow: scroll;
    }

    .price {
        margin: 0;
        padding: 0;
    }

    @media only screen and (min-width: 999px) {
        #sideCartView {
            position: fixed;
            right: 0;
            height: 100vh;
            top: 90px;
            width: 25vw;
        }
    }
</style>