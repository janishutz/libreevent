<!--
*				libreevent - EventsView.vue
*
*	Created by Janis Hutz 05/14/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div class="order">
        <h2>Events</h2>
        <div class="order-app" v-if="events">
            <ul v-for="timeframe in eventList">
                <h3>{{ timeframe.name }}</h3>
                <li v-for="event in timeframe.content">
                    <router-link to="/admin/events/view" class="ticket" @click="setActiveTicket( event.eventID );" v-if="new Date( event.date ).getTime() > currentDate">
                        <div class="ticket-name">
                            <h3>{{ event.name }}</h3>
                            <p>{{ event.description }}</p>
                            <b>{{ event.date }}</b>
                        </div>
                        <img :src="require( '@/assets/' + event.logo )" alt="event logo" class="ticket-logo">
                    </router-link>
                    <router-link to="/admin/events/analytics" class="ticket" @click="setActiveTicket( event.eventID );" v-else="new Date( event.date ).getTime() > currentDate">
                        <div class="ticket-name">
                            <h3>{{ event.name }}</h3>
                            <p>{{ event.description }}</p>
                            <b>{{ event.date }}</b>
                        </div>
                        <img :src="require( '@/assets/' + event.logo )" alt="event logo" class="ticket-logo">
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
        max-width: 60%;
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
                events: { 'test':{ 'name': 'TestEvent', 'description': 'This is a description for the TestEvent to test multiline support and proper positioning of the Fields', 'freeSeats': 2, 'maxSeats': 2, 'date':'2023-07-15', 'startingPrice':15, 'location': 'TestLocation', 'eventID': 'test', 'currency': 'CHF', 'logo': 'logo.png' }, 'test2':{ 'name': 'TestEvent2', 'description': 'This is a description for the TestEvent to test multiline support and proper positioning of the Fields', 'freeSeats': 2, 'maxSeats': 2, 'date':'2023-06-14', 'startingPrice':15, 'location': 'TestLocation', 'eventID': 'test2', 'currency': 'CHF', 'logo': 'logo.png' } },
                currentDate: new Date().getTime(),
                eventList: { 'upcoming': { 'name': 'Upcoming', 'content': {} }, 'past': { 'name': 'Past', 'content': {} } },
            }
        },
        created() {
            // Sort events object such that events closest to today are displayed first and past events displayed last
            let sortable = [];
            for ( let event in this.events ) {
                sortable.push( [ this.events[ event ][ 'eventID' ], new Date( this.events[ event ][ 'date' ] ).getTime() ] );
            }
            sortable.sort( function( a, b ) {
                return a[ 1 ] - b [ 1 ];
            } );

            for ( let element in sortable ) {
                if ( sortable[ element ][ 1 ] > this.currentDate ) {
                    this.eventList.upcoming.content[ sortable[ element ][ 0 ] ] = this.events[ sortable[ element ][ 0 ] ];
                } else {
                    this.eventList.past.content[ sortable[ element ][ 0 ] ] = this.events[ sortable[ element ][ 0 ] ];
                }
            }
        }
    };
</script>
