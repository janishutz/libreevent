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
            <p>Event Description</p>
            <textarea v-model="event.description" class="big-text" cols="70" rows="3" placeholder="Event description..."></textarea>
            <table class="category">
                <tr>
                    <td>Event location</td>
                    <td>
                        <select v-model="event.location" class="small-text">
                            <option value="TestLocation">TestLocation</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Event date</td>
                    <td><input v-model="event.date" class="small-text" type="date"></td>
                </tr>
                <tr>
                    <td>Ticket editor</td>
                    <router-link to="/admin/ticketEditor">Edit ticket layout</router-link>
                </tr>
            </table>
        </div>
        <div class="ticket-settings">
            <h3>Ticket Settings</h3>
            <p>The foreground and background colours of the seats are used to show the customer to which category the seats belong.</p>
            <div class="category-wrapper">
                <table class="category" v-for="category in event.categories">
                    {{ category.name }}
                    <tr v-for="price in category.price">
                        <td>
                            <div class="category-details">{{ price.name }}:</div>
                        </td>
                        <td>
                            <input type="number" v-model="price.price">
                        </td>
                    </tr>
                    <tr>
                        <td><div class="category-details">Foreground colour:</div></td>
                        <td>
                            <input type="text" data-coloris v-model="category.fg" onkeydown="return false;">
                        </td>
                    </tr>
                    <tr>
                        <td><div class="category-details">Background colour:</div></td>
                        <td>
                            <input type="text" data-coloris v-model="category.bg" onkeydown="return false;">
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="special-settings">
            <h3>General Settings</h3>
            <p>Currency codes used must be valid ISO 4217 codes. Read more on <a href="https://libreevent.janishutz.com/docs/admin-panel/events#currency" target="_blank">this page</a> of the documentation <!-- https://en.wikipedia.org/wiki/ISO_4217#List_of_ISO_4217_currency_codes"--></p>
            <settings v-model:settings="specialSettings"></settings>
        </div>
        <div>
            <p>Please read into the documentation of this section if you want to use the requirements. It requires specific syntax to work. See <a href="https://libreevent.janishutz.com/docs/admin-panel/events#special-requirements" target="_blank">here</a> for more information</p>
        </div>
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

    // TODO: When loading data form server, also load categories of this seat plan 
    // and from it construct the array, if not set already.

    export default {
        name: 'TicketsDetailsView',
        components: {
            settings,
            notifications,
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
                specialSettings: {
                    'currency': { 
                        'display': 'Currency', 
                        'id': 'currency', 
                        'tooltip':'Specify a currency in which the prices are displayed to the customer. Defaults to USD. Please use valid currency codes.', 
                        'value': 'USD',
                        'type': 'text',
                    },
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
                    'requiredParameter': { 
                        'display': 'Special requirements', 
                        'id': 'requiredParameter', 
                        'tooltip':'Set this parameter to require the user to provide a certain email domain, a special number or special string of characters. Defaults to None', 
                        'value': 'none',
                        'type': 'select',
                        'restrictions': {
                            'none': { 
                                'displayName':'None',
                                'value': 'none'
                            },
                            'email': { 
                                'displayName':'Email domain',
                                'value': 'email'
                            },
                            'numbers': { 
                                'displayName':'Number sequence',
                                'value': 'numbers'
                            },
                            'string': { 
                                'displayName':'Text sequence',
                                'value': 'string'
                            },
                        }
                    },
                    'requiredParameterValue': { 
                        'display': 'Special requirements values ', 
                        'id': 'requiredParameterValue', 
                        'tooltip':'Put a filter here, corresponding to your selection above. Please read the documentation on our website. See link below!', 
                        'value': '',
                        'type': 'text',
                    },
                }
            }
        },
        methods: {
            save () {
                
            }
        }
    };
</script>

