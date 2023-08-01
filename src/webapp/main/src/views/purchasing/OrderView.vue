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
            <ul>
                <li v-for="event in orderedEvents">
                    <router-link to="/tickets/details" class="ticket" @click="setActiveTicket( event.eventID );">
                        <div class="ticket-name">
                            <h3>{{ event.name }}</h3>
                            <p>{{ event.description }}</p>
                        </div>
                        <div class="ticket-info">
                            <p>Free seats: {{ event.freeSeats }} / {{ event.maxSeats }}</p>
                            <p>{{ event.location }}, {{ event.dateString }}</p>
                            <h4>Starting at {{ event.currency }} {{ event.startingPrice }}</h4>
                        </div>
                        <img :src="event.logo" alt="event logo" class="ticket-logo">
                    </router-link>
                </li>
            </ul>
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

    ul {
        list-style: none;
        width: 80%;
    }

    .ticket {
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        color: var( --primary-color );
        border-color: var( --primary-color );
        border-width: 1px;
        height: fit-content;
        border-style: solid;
        padding: 10px;
        transition: 0.4s;
    }

    .ticket:hover {
        background-color: var( --hover-color );
        transition: 0.4s;
    }

    .ticket-logo {
        height: 20vh;
        width: auto;
        margin-left: auto;
    }

    .ticket-name {
        margin-right: auto;
        max-width: 35%;
    }

    .ticket-info {
        margin-left: auto;
        margin-right: auto
    }
</style>

<script>
    export default {
        name: 'OrderView',
        methods: {
            setActiveTicket ( id ) {
                sessionStorage.setItem( 'selectedTicket', id );
            }
        },
        data () {
            return {
                events: { 'test':{ 'name': 'TestEvent', 'description': 'This is a description for the TestEvent to test multiline support and proper positioning of the Fields', 'freeSeats': 2, 'maxSeats': 2, 'date':'2023-08-31T09:00:00Z', 'startingPrice':15, 'location': 'TestLocation', 'eventID': 'test', 'currency': 'CHF', 'logo': new URL( '/src/assets/logo.png', import.meta.url ).href }, 'test2':{ 'name': 'TestEvent2', 'description': 'This is a description for the TestEvent to test multiline support and proper positioning of the Fields', 'freeSeats': 2, 'maxSeats': 2, 'date':'2023-08-15T09:00:00Z', 'startingPrice':15, 'location': 'TestLocation', 'eventID': 'test2', 'currency': 'CHF', 'logo': new URL( '/src/assets/logo.png', import.meta.url ).href } },
                today: new Date().getTime()
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
