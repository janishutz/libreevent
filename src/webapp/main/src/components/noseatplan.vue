<template>
    <div class="seatingWrapper">
        <sideCartView :cart="cart" ref="cart"></sideCartView>
        <div class="noseatplan">
            <h3>Available tickets</h3>
            <div class="wrapper">
                <div v-for="ticket in tickets">
                    {{ event[ 'categories' ][ ticket.category ][ 'name' ] }}
                    <table>
                        <tr v-for="ticketOption in event[ 'ageGroups' ]">
                            <td>
                                {{ ticketOption.name }} <div style="display: inline" v-if="ticketOption.age">({{ ticketOption.age }})</div> 
                            </td>
                            <td>
                                {{ event.currency }} {{ event[ 'categories' ][ ticket.category ][ 'price' ][ ticketOption.id ] }} 
                            </td>
                            <td>
                                <span class="material-symbols-outlined controls" @click="selectTicket( ticket.id, ticketOption.id )">add</span> 
                                {{ cart[ event.name ] ? ( cart[ event.name ][ 'tickets' ][ ticket.id + '_' + ticketOption.id ] ? cart[ event.name ][ 'tickets' ][ ticket.id + '_' + ticketOption.id ][ 'count' ] : 0 ) : 0 }}
                                <span class="material-symbols-outlined controls" @click="deselectTicket( ticket.id, ticketOption.id )">remove</span>
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
            tickets: { 'ticket1': { 'name': 'Ticket 1', 'id': 'ticket1', 'category': 1, 'free': 20 }, 'ticket2': { 'name': 'Ticket 2', 'id': 'ticket2', 'category': 2, 'free': 20 } },
            event: { 'name': 'TestEvent', 'location': 'TestLocation', 'date': 'TestDate', 'RoomName': 'TestRoom', 'currency': 'CHF', 'categories': { '1': { 'price': { '1':25, '2':35 }, 'bg': 'black', 'fg': 'white', 'name': 'Category 1' }, '2': { 'price': { '1':15, '2':20 }, 'bg': 'green', 'fg': 'white', 'name': 'Category 2' } }, 'ageGroups': { '1':{ 'id': 1, 'name':'Child', 'age':'0 - 15.99 years' }, '2':{ 'id': 2, 'name': 'Adult', 'age': null } }, 'stage': true },
            cart: {},
        }
    },
    methods: {
        selectTicket( id, option ) {
            let totalTicketsPerID = 0;
            if ( this.cart[ this.event.name ] ) {
                if ( this.cart[ this.event.name ][ 'tickets' ][ id + '_' + option ] ) {
                    const tickets = this.cart[ this.event.name ][ 'tickets' ];
                    for ( let ticket in tickets ) {
                        if ( tickets[ ticket ][ 'id' ].split( '_' )[ 0 ] === id ) {
                            totalTicketsPerID += this.cart[ this.event.name ][ 'tickets' ][ tickets[ ticket ][ 'id' ] ][ 'count' ];
                        }
                    }
                    if ( totalTicketsPerID < this.tickets[ id ].free ) {
                        this.cartHandling( 'select', this.tickets[ id ], option );
                    }
                } else {
                    this.cartHandling( 'select', this.tickets[ id ], option );
                }
            } else {
                this.cartHandling( 'select', this.tickets[ id ], option );
            }
        },
        cartHandling ( operation, data, option ) {
            if ( operation === 'select' ) {
                if ( this.cart[ this.event.name ] ) {
                    if ( this.cart[ this.event.name ][ 'tickets' ][ data.id + '_' + option ] ) {
                        this.cart[ this.event.name ][ 'tickets' ][ data.id + '_' + option ][ 'count' ] += 1;
                    } else {
                        this.cart[ this.event.name ][ 'tickets' ][ data.id + '_' + option ] = { 'displayName': data.name + ' (' + this.event.ageGroups[ option ].name + ')', 'price': this.event.categories[ data.category ].price[ option ], 'id': data.id + '_' + option, 'count': 1 };
                    }
                } else {
                    this.cart[ this.event.name ] = { 'displayName': this.event.name, 'tickets': {} };
                    this.cart[ this.event.name ][ 'tickets' ][ data.id + '_' + option ] = { 'displayName': data.name + ' (' + this.event.ageGroups[ option ].name + ')', 'price': this.event.categories[ data.category ].price[ option ], 'id': data.id + '_' + option, 'count': 1 };
                }
            } else if ( operation === 'deselect' ) {
                if ( this.cart[ this.event.name ][ 'tickets' ][ data + '_' + option ][ 'count' ] === 1 ) {
                    delete this.cart[ this.event.name ][ 'tickets' ][ data + '_' + option ];
                } else {
                    this.cart[ this.event.name ][ 'tickets' ][ data + '_' + option ][ 'count' ] -= 1;
                }
                if ( Object.keys( this.cart[ this.event.name ][ 'tickets' ] ).length < 1 ) {
                    delete this.cart[ this.event.name ];
                }
            }
            this.$refs.cart.calculateTotal();
            localStorage.setItem( 'cart', JSON.stringify( this.cart ) );
        },
        deselectTicket( id, option ) {
            if ( this.cart[ this.event.name ] ) {
                if ( this.cart[ this.event.name ][ 'tickets' ][ id + '_' + option ] ) {
                    if ( this.cart[ this.event.name ][ 'tickets' ][ id + '_' + option ][ 'count' ] > 0 ) {
                        this.cartHandling( 'deselect', id, option );
                    }
                }
            }
        },
        loadTickets () {
            // TODO: Load from server
        }
    },
    created () {
        this.cart = localStorage.getItem( 'cart' ) ? JSON.parse( localStorage.getItem( 'cart' ) ): {};
        // this.loadTickets();
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

    .controls {
        user-select: none;
        cursor: pointer;
        font-size: 100%;
        font-weight: bold;
        border: solid var( --primary-color ) 1px;
        border-radius: 100%;
    }
</style>
