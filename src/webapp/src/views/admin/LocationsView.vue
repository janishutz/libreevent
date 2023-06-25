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
        <div class="location-app" v-if="Object.keys( locations ).length">
            <ul>
                <li v-for="location in locations">
                    <router-link to="/admin/locations/view" class="location" @click="selectLocation( location.locationID );">
                        <div class="location-name">
                            <h3>{{ location.name }}</h3>
                            <p v-if="location['seatplan-enabled']">This location has a seatplan.</p>
                            <p v-else>This location has NO seatplan.</p>
                        </div>
                    </router-link>
                </li>
            </ul>
        </div>
        <div v-else class="no-location-hint">
            No locations configured, please <b @click="addLocation();" style="cursor: pointer;">add</b> one
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                locations: { 'test':{ 'name':'TestLocation', 'locationID':'test', 'seatplan-enabled': true, 'seatplan': {} } },
            }
        },
        methods: {
            selectLocation ( locationID ) {
                sessionStorage.setItem( 'locationID', locationID );
            },
            addLocation () {

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
