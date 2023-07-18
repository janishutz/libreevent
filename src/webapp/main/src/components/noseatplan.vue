<template>
    <div class="seatingWrapper">
        <sideCartView :cart="cart" ref="cart"></sideCartView>
        <div class="noseatplan">
            <h3>Available tickets</h3>
            <div class="wrapper">
                <div v-for="ticket in tickets">
                    {{ eventInfo[ 'categories' ][ ticket.category ][ 'name' ] }}
                    <table>
                        <tr v-for="ticketOption in eventInfo[ 'ageGroups' ]">
                            <td>
                                {{ ticketOption.name }} <div style="display: inline" v-if="ticketOption.age">({{ ticketOption.age }})</div> 
                            </td>
                            <td>
                                {{ eventInfo.currency }} {{ eventInfo[ 'categories' ][ ticket.category ][ 'price' ][ ticketOption.id ] }} <span class="material-symbols-outlined">add</span> Selected <span class="material-symbols-outlined">remove</span>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import sideCartView from '@/components/sideCartView.vue';

export default {
    name: 'noseatplan',
    props: {
        ticketID: String
    },
    components: {
        sideCartView,
    },
    data () {
        return {
            tickets: { 'ticket1': { 'name': 'Ticket 1', 'id': 'ticket1', 'category': 1 }, 'ticket2': { 'name': 'Ticket 2', 'id': 'ticket2', 'category': 2 } },
            eventInfo: { 'name': 'TestEvent', 'location': 'TestLocation', 'date': 'TestDate', 'RoomName': 'TestRoom', 'currency': 'CHF', 'categories': { '1': { 'price': { '1':25, '2':35 }, 'bg': 'black', 'fg': 'white', 'name': 'Category 1' }, '2': { 'price': { '1':15, '2':20 }, 'bg': 'green', 'fg': 'white', 'name': 'Category 2' } }, 'ageGroups': { '1':{ 'id': 1, 'name':'Child', 'age':'0 - 15.99 years' }, '2':{ 'id': 2, 'name': 'Adult', 'age': null } }, 'ageGroupCount':2, 'stage': true },
            cart: {},
        }
    },
    methods: {
        cartHandling ( operation, data ) {
            if ( operation === 'select' ) {
                if ( this.cart[ this.event.name ] ) {
                    this.cart[ this.event.name ][ 'tickets' ][ this.selectedSeat.id ] = { 'displayName': this.selectedSeat.displayName, 'price': this.selectedSeat.option[ data ].price, 'id': this.selectedSeat.id };
                } else {
                    this.cart[ this.event.name ] = { 'displayName': this.event.name, 'tickets': {} };
                    this.cart[ this.event.name ][ 'tickets' ][ this.selectedSeat.id ] = { 'displayName': this.selectedSeat.displayName, 'price': this.selectedSeat.option[ data ].price, 'id': this.selectedSeat.id };
                }
            } else if ( operation === 'deselect' ) {
                if ( Object.keys( this.cart[ this.event.name ][ 'tickets' ] ).length > 1 ) {
                    delete this.cart[ this.event.name ][ 'tickets' ][ this.selectedSeat.id ];
                } else {
                    delete this.cart[ this.event.name ];
                }
            }
            this.$refs.cart.calculateTotal();
            localStorage.setItem( 'cart', JSON.stringify( this.cart ) );
        },
    },
    created() {
        console.log( 'Hello World' );
    }
}
</script>

<style scoped>
    .seatingWrapper {
        display: grid;
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
        height: 100%;
    }

    .sidebar {
        grid-area: sidebar;
        background-color: var( --accent-background );
        color: var( --secondary-color );
        overflow: scroll;
    }

    .noseatplan {
        grid-area: main;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: justify;
        overflow: scroll;
    }

    .wrapper {
        width: 30%;
        display: flex;
        flex-direction: column;
        align-items: justify;
        justify-content: justify;
        text-align: justify;
    }

    .ticket {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var( --overlay-color );
        height: 100%;
        width: 100%;
    }

    .popup {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }

    .popup-content {
        background-color: var( --background-color );
        height: 60%;
        width: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        border-radius: 50px;
    }

    .popup-content-wrapper {
        display: flex;
        height: 90%;
        width: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        overflow: scroll;
    }

    .close-container {
        width: 100%;
        display: flex;
        justify-content: flex-end;
    }
    .close-button {
        cursor: pointer;
        margin-right: 3vh;
        margin-top: 3vh;
    }

    .button {
        background-color: var( --accent-background );
        color: var( --secondary-color );
        font-weight: bold;
        font-size: 110%;
        border-radius: 20px;
        border-style: none;
        padding: 10px 40px;
        transition: 0.6s;
    }

    .button:hover {
        background-color: var( --accent-background-hover );
        transition: 0.3s;
        cursor: pointer;
    }

    .price-table {
        width: 100%;
    }
</style>
