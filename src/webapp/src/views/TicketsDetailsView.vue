<template>
    <div class="details">
        <h1>Details</h1>
        <h3>{{ event.name }}</h3>
        <p>{{ event.description }}</p>
        <router-link to="/tickets/order">Order tickets</router-link>
    </div>
</template>

<style scoped>
    .details {
        flex-grow: 1;
    }
</style>

<script>
    export default {
        name: 'TicketsDetailsView',
        created () {
            if ( !sessionStorage.getItem( 'selectedTicket' ) ) {
                this.$router.push( '/tickets' );
            }
            this.eventID = !sessionStorage.getItem( 'selectedTicket' );
        },
        data() {
            return {
                event: { 'name': 'TestEvent', 'description': 'This is a description for the TestEvent to test multiline support and proper positioning of the Fields', 'freeSeats': 2, 'maxSeats': 2, 'date':'TestDate', 'startingPrice':15, 'location': 'TestLocation', 'eventID': 'test', 'currency': 'CHF', 'logo': 'logo.png' },
            }
        }
    };
</script>

