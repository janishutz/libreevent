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
        <div class="category-wrapper">
            <table class="category">
                <tr>
                    <td>Location name</td>
                    <td>
                        <input type="text" v-model="event.name">
                    </td>
                </tr>
                <tr>
                    <td>Seat plan editor</td>
                    <router-link to="/admin/seatplan">Edit seat plan</router-link>
                </tr>
            </table>
        </div>
        <popups ref="popup"></popups>
        <notifications ref="notification" location="topright"></notifications>
    </div>
</template>

<style scoped>
    .details {
        flex-grow: 1;
    }

    .ticket-settings {
        width: 100%;
    }

    .category-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        flex-direction: column;
    }

    .category {
        width: 50%;
        text-align: justify;
    }

    .category-details {
        margin-left: 7%;;
    }
</style>

<script>
    import settings from '@/components/settings/settings.vue';
    import notifications from '@/components/notifications/notifications.vue';
    import popups from '@/components/notifications/popups.vue';

    export default {
        name: 'TicketsDetailsView',
        components: {
            settings,
            notifications,
            popups,
        },
        created () {
            if ( !sessionStorage.getItem( 'selectedTicket' ) ) {
                this.$router.push( '/admin/events' );
            }
            this.eventID = sessionStorage.getItem( 'selectedTicket' );
        },
        data() {
            return {
                event: { 'name': 'TestEvent', 'description': 'This is a description for the TestEvent to test multiline support and proper positioning of the Fields', 'freeSeats': 2, 'maxSeats': 2, 'date':'TestDate', 'startingPrice':15, 'location': 'TestLocation', 'eventID': 'test', 'currency': 'CHF', 'logo': 'logo.png', 'categories': { '1': { 'price': { '1': { 'price':25, 'name':'Child (0-15.99 years)'}, '2': { 'price':35, 'name':'Adult'} }, 'bg': 'black', 'fg': 'white', 'name': 'Category 1' }, '2': { 'price': { '1': { 'price':25, 'name':'Child (0-15.99 years)' }, '2': { 'price':35, 'name':'Adult'} }, 'bg': 'green', 'fg': 'white', 'name': 'Category 2' } } },
            }
        }
    };
</script>

