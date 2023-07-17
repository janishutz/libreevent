<!--
*				libreevent - sideCartView.vue
*
*	Created by Janis Hutz 07/17/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div id="sideCartView">
        <h2>Cart</h2>
        <div v-for="event in cart">
            <h3>{{ event.displayName }}</h3>
            <table>
                <tr v-for="ticket in event.tickets">
                    <td>
                        <h4>{{ ticket.displayName }}: </h4>
                    </td>
                    <td>
                        {{ event.currency }} {{ ticket.price }}
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    name: 'sideCartView',
    props: {
        'cart': {
            type: Object,
            default: { 'TestEvent2': { 'displayName': 'TestEvent2', 'tickets': { 'secAr1s1': { 'displayName': 'Row 1, Seat 1', 'price': 20 } }, 'currency': 'CHF' } },
            total: 0
        }
    },
    watch: {
        cart() {
            this.calculateTotal();
        }
    },
    methods: {
        calculateTotal () {
            console.log( 'cart updated' );
        }
    },
    created() {
        this.calculateTotal();
    }
}
</script>