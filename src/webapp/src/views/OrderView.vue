<template>
    <div class="order">
        <h1>Order tickets</h1>
        <div class="order-app">
            <ul v-for="event in events">
                <li>
                    <router-link to="/tickets/details" class="ticket" @click="setActiveTicket( 'test' );">
                        <div class="ticket-name">
                            <h3>{{ event.name }}</h3>
                            <p>{{ event.description }}</p>
                        </div>
                        <div class="ticket-info">
                            <p>Free seats: {{ event.freeSeats }} / {{ event.maxSeats }}</p>
                            <p>{{ event.location }}, {{ event.date }}</p>
                            <h4>Starting at {{ event.currency }} {{ event.startingPrice }}</h4>
                        </div>
                        <img :src="require( '@/assets/' + event.logo )" alt="event logo" class="ticket-logo">
                    </router-link>
                </li>
            </ul>
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
                events: { 'test':{ 'name': 'TestEvent', 'description': 'This is a description for the TestEvent to test multiline support and proper positioning of the Fields', 'freeSeats': 2, 'maxSeats': 2, 'date':'TestDate', 'startingPrice':15, 'location': 'TestLocation', 'eventID': 'test', 'currency': 'CHF', 'logo': 'logo.png' } }
            }
        }
    };
</script>
