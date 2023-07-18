<!--
*				libreevent - LocationsView.vue
*
*	Created by Janis Hutz 06/05/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div>
        <h2>Locations</h2>
        <p>Here you can change everything regarding event locations. All locations can have a seating plan.</p>
        <button @click="addLocation();">Add new location</button>
        <div class="location-app" v-if="Object.keys( locations ).length">
            <ul>
                <li v-for="location in locations">
                    <div class="location" @click="selectLocation( location.locationID );" title="Edit this location">
                        <div class="location-name">
                            <h3>{{ location.name }}</h3>
                            <p v-if="location['seatplan-enabled']">This location has a seatplan.</p>
                            <p v-else>This location has NO seatplan.</p>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div v-else class="no-location-hint">
            No locations configured, please <b @click="addLocation();" style="cursor: pointer;">add</b> one
        </div>
        <popups ref="popup" size="big"></popups>
        <popups ref="popup2" size="huge"></popups>
    </div>
</template>

<script>
    import popups from '@/components/notifications/popups.vue';

    export default {
        data () {
            return {
                locations: { 'test':{ 'name':'TestLocation', 'locationID':'test', 'seatplan-enabled': true, 'seatplan': {} } },
            }
        },
        components: {
            popups,
        },
        methods: {
            selectLocation ( locationID ) {
                sessionStorage.setItem( 'locationID', locationID );
                this.$refs.popup.openPopup( 'Settings for ' + this.locations[ locationID ][ 'name' ], {
                    'locationName': { 
                        'display': 'Location name', 
                        'id': 'locationName', 
                        'tooltip':'Give the location the event takes place a name. This name will also be shown to customers', 
                        'value': '',
                        'type': 'text',
                    },
                    'usesSeatplan': { 
                        'display': 'Use seat plan?', 
                        'id': 'usesSeatplan', 
                        'tooltip':'With this toggle you may specify whether or not this location has a seat plan or not.', 
                        'value': true,
                        'type': 'toggle',
                    },
                    'seatplanEditor': { 
                        'display': 'Seat plan editor', 
                        'id': 'seatplanEditor', 
                        'tooltip':'The seat plan editor allows you to create a seat plan that closely resembles the location you host the event in.', 
                        'type': 'link',
                        'restrictions': {
                            'to': '/admin/seatplan',
                            'displayName': 'Edit seat plan'
                        }
                    },
                }
            , 'settings' );
            },
            addLocation () {
                this.$refs.popup.openPopup( 'Add a new location', {
                    'locationName': {
                        'display': 'Location name', 
                        'id': 'locationName', 
                        'tooltip':'Give the location the event takes place a name. This name will also be shown to customers', 
                        'value': '',
                        'type': 'text',
                    },
                    'usesSeatplan': { 
                        'display': 'Use seat plan?', 
                        'id': 'usesSeatplan', 
                        'tooltip':'With this toggle you may specify whether or not this location has a seat plan or not.', 
                        'value': true,
                        'type': 'toggle',
                    },
                    'seatplanEditor': { 
                        'display': 'Seat plan editor', 
                        'id': 'seatplanEditor', 
                        'tooltip':'The seat plan editor allows you to create a seat plan that closely resembles the location you host the event in.', 
                        'type': 'link',
                        'restrictions': {
                            'to': '/admin/seatplan',
                            'displayName': 'Edit seat plan'
                        }
                    },
                }
            , 'settings' );
            },
        }
    };
</script>


<style scoped>
    .location-app {
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

    .location {
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
        cursor: pointer;
    }

    .location:hover {
        background-color: var( --hover-color );
        transition: 0.4s;
    }

    .location-name {
        margin-right: auto;
        max-width: 35%;
    }
</style>
