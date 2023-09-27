<!--
*				libreevent - OrderView.vue
*
*	Created by Janis Hutz 05/14/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div class="order">
        <h1>Order tickets</h1>
        <div class="order-app" v-if="Object.keys( orderedEvents ).length">
            <div v-for="event in orderedEvents" style="width: 80%;">
                <router-link to="/tickets/details" class="ticket" @click="setActiveTicket( event.eventID );">
                    <img :src="event.logo" alt="event logo" class="ticket-logo">
                    <div class="ticket-name">
                        <h3>{{ event.name }}</h3>
                        <p v-html="event.shortDescription"></p>
                    </div>
                    <div class="ticket-info">
                        <p>Free seats: {{ event.free }} / {{ event.totalSeats }}</p>
                        <p>{{ event.locationName }}, {{ event.dateString }}</p>
                        <h4>Starting at {{ event.currency }} {{ event.startingPrice }}</h4>
                    </div>
                </router-link>
            </div>
        </div>
        <div class="order-app" v-else>
            No future events are available!
        </div>
    </div>
</template>

<style scoped>
    .order-app {
        text-align: justify;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    .ticket {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        justify-content: center;
        text-decoration: none;
        color: var( --primary-color );
        border-color: var( --primary-color );
        border-width: 1px;
        height: fit-content;
        border-style: solid;
        padding: 10px;
        transition: 0.4s;
        flex-direction: column;
    }

    .ticket-logo {
        height: 20vh;
        width: 20vh;
        min-width: 20vh;
        margin-right: 3%;
    }

    .ticket:hover {
        background-color: var( --hover-color );
        transition: 0.4s;
    }

    .ticket-name {
        text-align: center;
    }

    .ticket-info {
        text-align: center;
    }

    @media only screen and (min-width: 999px) {

        .ticket {
            flex-direction: row;
        }

        .ticket-name {
            flex-shrink: 0;
            margin-right: 3%;
            width: 40%;
            text-align: justify;
        }

        .ticket-info {
            margin-right: auto;
            text-align: justify;
        }   
    }
</style>

<script>
    export default {
        name: 'OrderView',
        methods: {
            setActiveTicket ( id ) {
                sessionStorage.setItem( 'selectedTicket', id );
                sessionStorage.setItem( 'ticketData', JSON.stringify( { 'description': this.events[ id ][ 'description' ], 'name': this.events[ id ][ 'name' ], 'locationName': this.events[ id ][ 'locationName' ], 'date': this.events[ id ][ 'date' ] } ) );
                sessionStorage.setItem( 'hasSeatplan', this.events[ id ][ 'hasSeatplan' ] );
            },
            loadEvents () {
                fetch( '/getAPI/getAllEvents' ).then( res => {
                    res.json().then( dat => {
                        this.events = dat ?? {};
                        for ( let event in dat ) {
                            if ( this.events[ event ][ 'description' ].length > 200 ) {
                                this.events[ event ][ 'shortDescription' ] = this.events[ event ][ 'description' ].slice( 0, 200 ) + '...';
                            } else {
                                this.events[ event ][ 'shortDescription' ] = this.events[ event ][ 'description' ];
                            }
                            this.events[ event ][ 'logo' ] = new URL( location.protocol + '//' + location.hostname + ':' + location.port + '/eventAssets/' + this.events[ event ].eventID + 'Logo.jpg' );
                        }
                    } );
                } );
            }
        },
        created() {
            this.loadEvents();
        },
        data () {
            return {
                events: { 'test':{ 'name': 'TestEvent', 'description': 'This is a description for the TestEvent to test multiline support and proper positioning of the Fields', 'free': 2, 'maxTickets': 2, 'date':'2023-08-31T09:00:00Z', 'startingPrice':15, 'location': 'TestLocation', 'eventID': 'test', 'currency': 'CHF', 'logo': new URL( '/src/assets/logo.png', import.meta.url ).href }, 'test2':{ 'name': 'TestEvent2', 'description': 'This is a description for the TestEvent to test multiline support and proper positioning of the Fields', 'freeSeats': 2, 'maxSeats': 2, 'date':'2023-08-15T09:00:00Z', 'startingPrice':15, 'location': 'TestLocation', 'eventID': 'test2', 'currency': 'CHF', 'logo': new URL( '/src/assets/logo.png', import.meta.url ).href } },
                today: new Date().getTime(),
                locations: {},
            }
        },
        computed: {
            orderedEvents () {
                let sorted = Object.keys( this.events ).sort( ( a, b ) => {
                    return new Date( this.events[ a ].date ).getTime() - new Date( this.events[ b ].date ).getTime();
                } );
                let rt = {};
                for ( let element in sorted ) {
                    if ( new Date( this.events[ sorted[ element ] ].date ) > this.today ) {
                        rt[ sorted[ element ] ] = this.events[ sorted[ element ] ];
                        rt[ sorted[ element ] ][ 'dateString' ] = new Date( rt[ sorted[ element ] ][ 'date' ] ).toLocaleString();
                    }
                }
                return rt;
            }
        },
    };
</script>


<style>
    nav {
        display: initial;
    }
</style>
