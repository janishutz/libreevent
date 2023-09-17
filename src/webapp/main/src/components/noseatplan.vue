<template>
    <div class="seatingWrapper">
        <sideCartView :cart="cart" :name="event.name" ref="cart"></sideCartView>
        <div class="noseatplan">
            <h2>Available tickets</h2>
            <button @click="cartHandling()">Add selected tickets to cart</button>
            <div class="wrapper">
                <div v-for="ticket in event.categories">
                    {{ event[ 'categories' ][ ticket.id ][ 'name' ] }}
                    <table>
                        <tr v-for="ticketOption in event[ 'ageGroups' ]">
                            <td>
                                {{ ticketOption.name }} <div style="display: inline" v-if="ticketOption.age">({{ ticketOption.age }} years)</div> 
                            </td>
                            <td>
                                {{ event.currency }} {{ event[ 'categories' ][ ticket.id ][ 'price' ][ ticketOption.id ] }} 
                            </td>
                            <td>
                                <span class="material-symbols-outlined controls" @click="ticketHandling( 'ticket' + ticket.id, ticketOption.id, 'select' )">add</span> 
                                {{ selectedTickets[ 'ticket' + ticket.id + '_' + ticketOption.id ] ?? 0 }}
                                <span class="material-symbols-outlined controls" @click="ticketHandling( 'ticket' + ticket.id, ticketOption.id, 'deselect' )">remove</span>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <popups ref="popups" size="normal"></popups>
    </div>
</template>

<script>
import sideCartView from '@/components/sideCartView.vue';
import popups from '@/components/notifications/popups.vue';

export default {
    name: 'noseatplan',
    props: {
        ticketID: String
    },
    components: {
        sideCartView,
        popups,
    },
    data () {
        return {
            tickets: { 'ticket1': 20, 'ticket2': 20 },
            event: { 'name': 'TestEvent2', 'location': 'TestLocation2', 'eventID': 'test2', 'date': '2023-07-15', 'currency': 'CHF', 'categories': { '1': { 'price': { '1':25, '2':35 }, 'bg': 'black', 'fg': 'white', 'name': 'Category 1', 'id': 1 }, '2': { 'price': { '1':15, '2':20 }, 'bg': 'green', 'fg': 'white', 'name': 'Category 2', 'id': 2 } }, 'ageGroups': { '1':{ 'id': 1, 'name':'Child', 'age':'0 - 15.99' }, '2':{ 'id': 2, 'name': 'Adult' } }, 'maxTickets': 2 },
            cart: {},
            selectedTickets: {},
            maxTickets: 10,
        }
    },
    methods: {
        ticketHandling( id, option, operation ) {
            if ( operation === 'select' ) {
                let totalTicketsPerID = {};
                // sum up total of tickets per category (based on a sliced ID of the ticket selected,
                // as ticketID is based on category and ageGroup)
                for ( let ticket in this.selectedTickets ) {
                    if ( !totalTicketsPerID[ ticket.slice( 0, ticket.indexOf( '_' ) ) ] ) {
                        totalTicketsPerID[ ticket.slice( 0, ticket.indexOf( '_' ) ) ] = 0;
                    }
                    totalTicketsPerID[ ticket.slice( 0, ticket.indexOf( '_' ) ) ] += this.selectedTickets[ ticket ];
                }

                if ( !totalTicketsPerID[ id ] ) {
                    totalTicketsPerID[ id ] = 0;
                }
                totalTicketsPerID[ id ] += 1;

                let totalTickets = 0;
                for ( let category in totalTicketsPerID ) {
                    totalTickets += totalTicketsPerID[ category ];
                }

                if ( totalTickets <= this.maxTickets ) {
                    if ( totalTicketsPerID[ id ] <= this.tickets[ id ] ) {
                        if ( !this.selectedTickets[ id + '_' + option ] ) {
                            this.selectedTickets[ id + '_' + option ] = 0;
                        }
                        this.selectedTickets[ id + '_' + option ] += 1;
                    }
                } else {
                    this.$refs.popups.openPopup( 'We are sorry, but you have already selected the maximum amount of tickets you can buy at once.', {}, 'string' );
                }
            } else {
                if ( !this.selectedTickets[ id + '_' + option ] || this.selectedTickets[ id + '_' + option ] === 0 ) {
                    this.selectedTickets[ id + '_' + option ] = 0;
                } else {
                    this.selectedTickets[ id + '_' + option ] -= 1;
                }
            }
        },
        seatChecks () {
                let self = this;
                let allSeatsAvailable = true;

                fetch( localStorage.getItem( 'url' ) + '/getAPI/getReservedSeats?event=' + this.event.eventID ).then( res => {
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
                            if ( this.cart[ this.event.eventID ] ) {
                                tickets = this.cart[ this.event.eventID ][ 'tickets' ];
                            }

                            if ( data.user ) {
                                for ( let element in tickets ) {
                                    if ( !data.user[ element ] ) {
                                        allSeatsAvailable = false;
                                        if ( Object.keys( this.cart[ this.event.eventID ][ 'tickets' ] ).length > 1 ) {
                                            delete this.cart[ this.event.eventID ][ 'tickets' ][ element ];
                                        } else {
                                            delete this.cart[ this.event.eventID ];
                                        }
                                    }
                                }
                            } else {
                                delete this.cart[ this.event.eventID ];
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
        cartHandling () {
            for ( let ticket in this.selectedTickets ) {
                let category = '';
                const ticketSlice = ticket.slice( 0, ticket.indexOf( '_' ) );
                for ( let letter in ticketSlice ) {
                    if ( !isNaN( ticketSlice[ letter ] ) ) {
                        category += parseInt( ticketSlice[ letter ] );
                    }
                }
                const options = {
                    method: 'post',
                    body: JSON.stringify( { 
                        'id': ticket, 
                        'component': 1, 
                        'ticketOption': ticket.substring( ticket.indexOf( '_' ) + 1 ), 
                        'eventID': this.event.eventID, 
                        'count': this.selectedTickets[ ticket ], 
                        'category': category,
                        'name': this.event.categories[ category ].name + ' (' + this.event.ageGroups[ ticket.substring( ticket.indexOf( '_' ) + 1 ) ].name + ')',
                    } ),
                    headers: {
                        'Content-Type': 'application/json',
                        'charset': 'utf-8'
                    }
                };
                fetch( localStorage.getItem( 'url' ) + '/API/reserveTicket', options ).then( res => {
                    if ( !this.cart[ this.event.eventID ] ) {
                        this.cart[ this.event.eventID ] = { 'displayName': this.event.name, 'tickets': {}, 'eventID': this.event.eventID };
                    }
                    if ( res.status === 200 ) {
                        // add item to cart
                        if ( this.selectedTickets[ ticket ] < 1 ) {
                            if ( Object.keys( this.cart[ this.event.eventID ][ 'tickets' ] ).length < 1 ) {
                                try {
                                    delete this.cart[ this.event.eventID ];
                                } catch {}
                            } else {
                                delete this.cart[ this.event.eventID ][ 'tickets' ][ ticket ];
                            }
                        } else {
                            this.cart[ this.event.eventID ][ 'tickets' ][ ticket ] = { 
                                'displayName': this.event.categories[ ticket.slice( ticket.indexOf( '_' ) - 1, ticket.indexOf( '_' ) ) ].name + ' (' + this.event.ageGroups[ ticket.substring( ticket.indexOf( '_' ) + 1 ) ].name + ')', 
                                'price': this.event.categories[ ticket.slice( ticket.indexOf( '_' ) - 1, ticket.indexOf( '_' ) ) ].price[ ticket.substring( ticket.indexOf( '_' ) + 1 ) ], 
                                'id': ticket, 
                                'count': this.selectedTickets[ ticket ], 
                                'comp': 1,
                            };
                        }
                    } else if ( res.status === 409 ) {
                        res.json().then( dat => {
                            this.cart[ this.event.eventID ][ 'tickets' ][ ticket ] = { 
                                'displayName': this.event.categories[ ticket.slice( ticket.indexOf( '_' ) - 1, ticket.indexOf( '_' ) ) ].name + ' (' + this.event.ageGroups[ ticket.substring( ticket.indexOf( '_' ) + 1 ) ].name + ')', 
                                'price': this.event.categories[ ticket.slice( ticket.indexOf( '_' ) - 1, ticket.indexOf( '_' ) ) ].price[ ticket.substring( ticket.indexOf( '_' ) + 1 ) ], 
                                'id': ticket,
                                'count': dat.count, 
                                'comp': 1,
                            };
                        } );
                        setTimeout( () => {
                            this.$refs.popups.openPopup( 'Unfortunately, you have selected more tickets than were still available. The maximum amount of tickets that are available have been selected for you automatically. We are sorry for the inconvenience.', {}, 'string' );
                        }, 300 );
                    } else if ( res.status === 418 ) {
                        setTimeout( () => {
                            this.$refs.popups.openPopup( 'We are sorry, but you have already selected the maximum amount of tickets you can buy at once.', {}, 'string' );
                        }, 300 );
                    }
                    if ( Object.keys( this.cart[ this.event.eventID ][ 'tickets' ] ).length < 1 ) {
                        delete this.cart[ this.event.eventID ];
                    }

                    this.$refs.cart.calculateTotal();
                    localStorage.setItem( 'cart', JSON.stringify( this.cart ) );
                } );
            }
        },
        loadTickets () {
            fetch( '/getAPI/getEvent?event=' + sessionStorage.getItem( 'selectedTicket' ) ).then( res => {
                if ( res.status === 200 ) {
                    res.json().then( json => {
                        this.event = json ?? {};
                    } );
                }
            } );
        }
    },
    created () {
        window.addEventListener( 'visibilitychange', ( e ) => {
            this.cart = localStorage.getItem( 'cart' ) ? JSON.parse( localStorage.getItem( 'cart' ) ): {};
        }, 1 );
        this.cart = localStorage.getItem( 'cart' ) ? JSON.parse( localStorage.getItem( 'cart' ) ): {};
        this.loadTickets();
        this.seatChecks();
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
