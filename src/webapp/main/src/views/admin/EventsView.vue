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
        <button @click="addEvent()">Create new event</button>
        <div class="order-app" v-if="events">
            <ul v-for="timeframe in eventList">
                <h3>{{ timeframe.name }}</h3>
                <li v-for="event in timeframe.content">
                    <router-link to="/admin/events/view" class="ticket" @click="setActiveTicket( event.eventID );" v-if="new Date( event.date ).getTime() > currentDate || timeframe.name === 'Drafts'">
                        <div class="ticket-name">
                            <h3>{{ event.name }}</h3>
                            <p>{{ event.description }}</p>
                            <b>{{ event.date }}</b>
                        </div>
                        <img :src="event.logo" alt="event logo" class="ticket-logo">
                    </router-link>
                    <router-link to="/admin/events/analytics" class="ticket" @click="setActiveTicket( event.eventID );" v-else="new Date( event.date ).getTime() > currentDate">
                        <div class="ticket-name">
                            <h3>{{ event.name }}</h3>
                            <p>{{ event.description }}</p>
                            <b>{{ event.date }}</b>
                        </div>
                        <img :src="event.logo" alt="event logo" class="ticket-logo">
                    </router-link>
                </li>
            </ul>
        </div>
        <div class="order-app" v-else>
            No events are available!
        </div>
        <popups ref="popup" size="big" @data="( data ) => {
            handleData( data );
        }"></popups>
        <rightClickMenu ref="rclk" @command="( command ) => { executeCommand( command ) }"></rightClickMenu>
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
    import popups from '@/components/notifications/popups.vue';
    import rightClickMenu from '@/components/settings/rightClickMenu.vue';

    export default {
        name: 'OrderView',
        components: {
            popups,
            rightClickMenu,
        },
        data () {
            return {
                events: { 'test':{ 'name': 'TestEvent', 'description': 'This is a description for the TestEvent to test multiline support and proper positioning of the Fields', 'freeSeats': 2, 'maxSeats': 2, 'date':'2023-08-15', 'startingPrice':15, 'location': 'TestLocation', 'eventID': 'test', 'currency': 'CHF', 'logo': new URL( '/src/assets/logo.png', import.meta.url ).href }, 'test2':{ 'name': 'TestEvent2', 'description': 'This is a description for the TestEvent to test multiline support and proper positioning of the Fields', 'freeSeats': 2, 'maxSeats': 2, 'date':'2023-06-13', 'startingPrice':15, 'location': 'TestLocation', 'eventID': 'test2', 'currency': 'CHF', 'logo': new URL( '/src/assets/logo.png', import.meta.url ).href } },
                currentDate: new Date().getTime(),
                eventList: { 'upcoming': { 'name': 'Upcoming', 'content': {} }, 'past': { 'name': 'Past', 'content': {} }, 'drafts': { 'name': 'Drafts', 'content': {} } },
                currentlyOpenMenu: '',
            }
        },
        created() {
            this.loadData();
        },
        methods: {
            loadData () {
                fetch( '/admin/getAPI/getAllEvents' ).then( res => {
                res.json().then( dat => {
                    this.events = dat[ 'live' ] ?? {};
                    this.eventList.drafts[ 'content' ] = dat[ 'drafts' ] ?? {};
                    let sortable = [];
                    for ( let event in this.events ) {
                        sortable.push( [ this.events[ event ][ 'eventID' ], new Date( this.events[ event ][ 'date' ] ).getTime() ] );
                    }
                    sortable.sort( function( a, b ) {
                        return a[ 1 ] - b[ 1 ];
                    } );

                    for ( let element in sortable ) {
                        if ( sortable[ element ][ 1 ] > this.currentDate ) {
                            this.eventList.upcoming.content[ sortable[ element ][ 0 ] ] = this.events[ sortable[ element ][ 0 ] ];
                        } else {
                            this.eventList.past.content[ sortable[ element ][ 0 ] ] = this.events[ sortable[ element ][ 0 ] ];
                        }
                    }
                } );
            } );
            },
            openRightClickMenu( id, event ) {
                this.$refs.rclk.openRightClickMenu( event, { 'edit': { 'command': 'editEvent', 'symbol': 'edit', 'display': 'Edit event' }, 'delete': { 'command': 'deleteEvent', 'symbol': 'delete', 'display': 'Delete event' } } )
                this.currentlyOpenMenu = id;
            },
            executeCommand( command ) {
                if ( command === 'editEvent' ) {
                    sessionStorage.setItem( 'selectedTicket', this.currentlyOpenMenu );
                    this.$router.push( '/admin/events/view' );
                } else if ( command === 'deleteEvent' ) {
                    this.$refs.popup.openPopup( 'Do you really want to delete the event ' + this.currentlyOpenMenu + '?', {}, 'confirm' );
                    this.currentPopup = 'delete';
                }
            },
            addEvent () {
                this.currentPopup = 'add';
                this.$refs.popup.openPopup( 'Please give the new event a name for internal use', {}, 'text' );
            },
            setActiveTicket ( id ) {
                sessionStorage.setItem( 'selectedTicket', id );
            },
            handleData ( data ) {
                if ( this.currentPopup === 'delete' ) {
                    this.currentPopup = '';
                    if ( data.status === 'ok' ) {
                        delete this.events[ this.currentlyOpenMenu ];
                    }
                } else if ( this.currentPopup === 'add' ) {
                    if ( data.status === 'ok' ) {
                        const options = {
                            method: 'post',
                            body: JSON.stringify( { 'event': data.data } ),
                            headers: {
                                'Content-Type': 'application/json',
                                'charset': 'utf-8'
                            }
                        };
                        fetch( localStorage.getItem( 'url' ) + '/admin/api/createEvent', options ).then( res => {
                            if ( res.status === 200 ) {
                                res.text().then( () => {
                                    this.currentlyOpenMenu = '';
                                    this.loadData();
                                } );
                            } else if ( res.status === 409 ) {
                                this.$refs.popup.openPopup( 'This event does already exist. Please choose a different identifier!', {}, 'string' );
                            }
                        } );
                    }
                } else if ( this.currentPopup === 'delete' ) {
                    if ( data.status === 'ok' ) {
                        const options = {
                            method: 'post',
                            body: JSON.stringify( { 'event': data.data } ),
                            headers: {
                                'Content-Type': 'application/json',
                                'charset': 'utf-8'
                            }
                        };
                        fetch( localStorage.getItem( 'url' ) + '/admin/api/deleteEvent', options ).then( res => {
                            if ( res.status === 200 ) {
                                res.text().then( text => {
                                    this.currentlyOpenMenu = '';
                                    console.log( text );
                                } );
                            }
                        } );
                    }
                }
            },
        }
    };
</script>
