<!--
*				libreevent - TicketsDetailsView.vue
*
*	Created by Janis Hutz 05/14/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div class="details">
        <h2>{{ event.name }}</h2>
        <div class="general-settings">
            <textarea v-model="event.description" class="big-text"></textarea>
            <input v-model="event.location" class="small-text">
            <input v-model="event.date" class="small-text" type="date">
        </div>
        <div class="ticket-settings">
            <h3>Ticket Settings</h3>
        </div>
        <div class="special-settings">
            <h3>Special Settings</h3>
            <settings v-model:settings="specialSettings"></settings>
        </div>
    </div>
</template>

<style scoped>
    .details {
        flex-grow: 1;
    }
</style>

<script>
    import settings from '@/components/settings/settings.vue';

    export default {
        name: 'TicketsDetailsView',
        components: {
            settings,
        },
        created () {
            if ( !sessionStorage.getItem( 'selectedTicket' ) ) {
                this.$router.push( '/tickets' );
            }
            this.eventID = sessionStorage.getItem( 'selectedTicket' );
        },
        data() {
            return {
                event: { 'name': 'TestEvent', 'description': 'This is a description for the TestEvent to test multiline support and proper positioning of the Fields', 'freeSeats': 2, 'maxSeats': 2, 'date':'TestDate', 'startingPrice':15, 'location': 'TestLocation', 'eventID': 'test', 'currency': 'CHF', 'logo': 'logo.png' },
                specialSettings: {
                    'guest-purchase': { 
                        'display': 'Enable guest purchase', 
                        'id': 'guest-purchase', 
                        'tooltip':'Allowing guest purchase means that a user does not have to create an account in order for them to be able to make a purchase. Default: On', 
                        'value': true,
                        'type': 'toggle'
                    },
                    'overbooking': { 
                        'display': 'Enable overbooking of event', 
                        'id': 'overbooking', 
                        'tooltip':'Allow more ticket reservations than you have tickets available. Currently only available for events without seatplans. Default: Off', 
                        'value': false,
                        'type': 'toggle'
                    },
                    'maxTickets': { 
                        'display': 'Maximum ticket count per account', 
                        'id': 'maxTickets', 
                        'tooltip':'With this setting you can control how many tickets a person can buy. Defaults to 0, which means do not limit.', 
                        'value': 0,
                        'type': 'number',
                        'restrictions': {
                            'min': 0,
                            'max': 100,
                        }
                    },
                }
            }
        }
    };
</script>

