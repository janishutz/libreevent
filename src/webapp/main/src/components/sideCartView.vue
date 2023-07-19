<!--
*				libreevent - sideCartView.vue
*
*	Created by Janis Hutz 07/17/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div id="sideCartView" :style="'width: ' + width + 'vw; top: ' + height + 'vh;'">
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
                <router-link to="/cart">To Cart</router-link>
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
            default: {},
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
        'height': {
            type: Number,
            default: 17
        }
    },
    data() {
        return {
            total: 0,
        }
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
}
</script>

<style scoped>
    #sideCartView {
        position: fixed;
        right: 0;
        height: 100vh;
        background-color: var( --accent-background );
        color: var( --secondary-color );
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
</style>