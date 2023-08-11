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
                    <div class="location" @click="selectLocation( location.locationID );" title="Edit this location" @contextmenu="( e ) => { e.preventDefault(); openRightClickMenu( location.locationID, e, location['seatplan-enabled'] ); }">
                        <div class="location-name">
                            <h3>{{ location.locationID }} ({{ location.name }})</h3>
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
        <popups ref="popup" size="big" @data="( data ) => {
            handleData( data );
        }"></popups>
        <rightClickMenu ref="rclk" @command="( command ) => { executeCommand( command ) }"></rightClickMenu>
    </div>
</template>

<script>
    import popups from '@/components/notifications/popups.vue';
    import rightClickMenu from '@/components/settings/rightClickMenu.vue';

    export default {
        data () {
            return {
                locations: { 'test':{ 'name':'TestLocation', 'locationID':'test', 'seatplan-enabled': true, 'seatplan': {} } },
                currentlyOpenMenu: '',
                currentPopup: '',
                updatedLocations: {}
            }
        },
        components: {
            popups,
            rightClickMenu,
        },
        methods: {
            selectLocation ( locationID ) {
                sessionStorage.setItem( 'locationID', locationID );
                this.currentlyOpenMenu = locationID;
                this.$refs.popup.openPopup( 'Settings for ' + this.locations[ locationID ][ 'name' ], {
                    'locationID': { 
                        'display': 'Internal location name', 
                        'id': 'locationID', 
                        'tooltip':'Give the location where the event takes place a name. This name will not be shown to the customers and is used for the backend and admin portal. Has to be unique', 
                        'value': locationID,
                        'type': 'text',
                    },
                    'name': { 
                        'display': 'Public location name', 
                        'id': 'name', 
                        'tooltip':'The name of the location that is shown to the customers.', 
                        'value': this.locations[ locationID ][ 'name' ],
                        'type': 'text',
                    },
                    'seatplan-enabled': { 
                        'display': 'Use seat plan?', 
                        'id': 'seatplan-enabled', 
                        'tooltip':'With this toggle you may specify whether or not this location has a seat plan or not.', 
                        'value': this.locations[ locationID ][ 'seatplan-enabled' ],
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
                    'locationID': { 
                        'display': 'Internal location name', 
                        'id': 'locationID', 
                        'tooltip':'Give the location where the event takes place a name. This name will not be shown to the customers and is used for the backend and admin portal. Has to be unique', 
                        'value': '',
                        'type': 'text',
                    },
                    'name': { 
                        'display': 'Public location name', 
                        'id': 'name', 
                        'tooltip':'The name of the location that is shown to the customers.', 
                        'value': '',
                        'type': 'text',
                    },
                    'seatplan-enabled': { 
                        'display': 'Use seat plan?', 
                        'id': 'seatplan-enabled', 
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
            openRightClickMenu( id, event, hasSeatplan ) {
                if ( hasSeatplan ) {
                    this.$refs.rclk.openRightClickMenu( event, { 'edit': { 'command': 'editLocation', 'symbol': 'edit', 'display': 'Edit location' }, 'editor': { 'command': 'openEditor', 'symbol': 'tune', 'display': 'Edit seatplan' }, 'delete': { 'command': 'deleteLocation', 'symbol': 'delete', 'display': 'Delete location' } } )
                } else {
                    this.$refs.rclk.openRightClickMenu( event, { 'edit': { 'command': 'editLocation', 'symbol': 'edit', 'display': 'Edit location' }, 'delete': { 'command': 'deleteLocation', 'symbol': 'delete', 'display': 'Delete location' } } )
                }
                this.currentlyOpenMenu = id;
            },
            executeCommand( command ) {
                if ( command === 'editLocation' ) {
                    this.selectLocation( this.currentlyOpenMenu );
                } else if ( command === 'deleteLocation' ) {
                    this.$refs.popup.openPopup( 'Do you really want to delete the location ' + this.currentlyOpenMenu + '?', {}, 'confirm' );
                    this.currentPopup = 'delete';
                } else if ( command === 'openEditor' ) {
                    sessionStorage.setItem( 'locationID', this.currentlyOpenMenu );
                    this.$router.push( '/admin/seatplan' );
                }
            },
            handleData ( data ) {
                if ( this.currentPopup === 'delete' ) {
                    this.currentPopup = '';
                    if ( data.status === 'ok' ) {
                        delete this.locations[ this.currentlyOpenMenu ];
                        const options = {
                            method: 'post',
                            body: JSON.stringify( { 'location': this.currentlyOpenMenu } ),
                            headers: {
                                'Content-Type': 'application/json',
                                'charset': 'utf-8'
                            }
                        };
                        fetch( localStorage.getItem( 'url' ) + '/admin/api/deleteLocation', options ).then( res => {
                            if ( res.status === 200 ) {
                                res.text().then( text => {
                                    console.log( text );
                                } );
                            }
                        } );
                    }
                } else {
                    if ( data.status === 'settings' ) {
                        if ( data.data.locationID !== this.currentlyOpenMenu && this.currentlyOpenMenu !== '' ) {
                            delete this.locations[ this.currentlyOpenMenu ];
                            this.updatedLocations[ this.currentlyOpenMenu ] = data.data.locationID;
                        }
                        this.locations[ data.data.locationID ] = data.data;
                        this.currentlyOpenMenu = '';
                        const options = {
                            method: 'post',
                            body: JSON.stringify( { 'updated': this.updatedLocations, 'data': this.locations } ),
                            headers: {
                                'Content-Type': 'application/json',
                                'charset': 'utf-8'
                            }
                        };
                        fetch( localStorage.getItem( 'url' ) + '/admin/api/saveLocations', options ).then( res => {
                            if ( res.status === 200 ) {
                                res.text().then( text => {
                                    console.log( text );
                                } );
                            }
                        } );
                    }
                }
            },
        },
        created () {
            fetch( localStorage.getItem( 'url' ) + '/admin/getAPI/getLocations' ).then( res => {
                res.json().then( data => {
                    this.locations = data;
                } ).catch( error => {
                    console.error( error );
                } );
            } );
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

    .no-location-hint {
        margin-top: 5%;
    }
</style>
