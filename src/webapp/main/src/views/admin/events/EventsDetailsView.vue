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
        <button @click="save( 'draft' )">Save as draft</button>
        <div class="category-wrapper">
            <h3>Event Details</h3>
            <table class="category">
                <tr>
                    <td>Event name</td>
                    <td><input type="text" v-model="event.name"></td>
                </tr>
                <tr>
                    <td>Event location</td>
                    <td v-if="Object.keys( locations ).length > 0">
                        <select v-model="event.location" class="small-text" @change="handleLocationChange()">
                            <option v-for="location in locations" :value="location.locationID">{{ location.locationID }} ({{ location.name }})</option>
                        </select>
                    </td>
                    <td v-else>No locations configured yet. Configure one <router-link to="/admin/locations">here</router-link></td>
                </tr>
                <tr>
                    <td>Event date and time</td>
                    <td><input v-model="event.date" class="small-text" type="date"><input v-model="event.time" class="small-text" type="time"></td>
                </tr>
                <tr>
                    <td>Ticket editor</td>
                    <router-link to="/admin/ticketEditor">Edit ticket layout</router-link>
                </tr>
            </table>
            <h4>Event description</h4>
            <textarea v-model="event.description" class="big-text" cols="70" rows="3" placeholder="Event description..."></textarea>
        </div>
        <div class="ticket-settings">
            <h3>Age Groups</h3>
            <button @click="addNew( 'ageGroup' )">Add another age group</button>
            <p>With these settings you can manage and create different age categories which have to be set for every ticket.</p>
            <div class="category-wrapper">
                <table class="category" v-for="ageGroup in event.ageGroups">
                    {{ ageGroup.name }} <span class="material-symbols-outlined deleteButton" @click="deleteObject( 'ageGroup', ageGroup.id )" title="Delete age group">delete</span>
                    <tr class="category-details">
                        <td>
                            <div class="category-details">Group name: </div>
                        </td>
                        <td>
                            <input type="text" v-model="ageGroup.name">
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="category-details">Age (Leave empty for no age info): </div>
                        </td>
                        <td>
                            <input type="text" v-model="ageGroup.age">
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="ticket-settings">
            <h3>Categories</h3>
            <button @click="addNew( 'category' )">Add another category</button>
            <p>The foreground and background colours of the seats are used to show the customer to which category the seats belong.</p>
            <div class="category-wrapper">
                <table class="category" v-for="category in event.categories">
                    {{ category.name }} <span class="material-symbols-outlined deleteButton" @click="deleteObject( 'category', category.id )" title="Delete category">delete</span>
                    <tr v-for="ageGroup in event.ageGroups">
                        <td>
                            <div class="category-details">{{ ageGroup.name }}<div style="display: inline;" v-if="ageGroup.age"> ({{ ageGroup.age }})</div>:</div>
                        </td>
                        <td>
                            {{ event.currency }} <input type="number" v-model="category.price[ ageGroup.id ]">
                        </td>
                    </tr>
                    <tr>
                        <td><div class="category-details">Colour:</div></td>
                        <td>
                            {{ event.currency }} <input type="text" data-coloris v-model="category.fg" onkeydown="return false;">
                        </td>
                    </tr>
                    <tr v-if="!hasSeatPlan">
                        <td><div class="category-details">Total tickets for this category</div></td>
                        <td>
                            <input type="number" v-model="category.ticketCount">
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <div>
            <h3>Assets</h3>
            <p>Here you can change all the marketing images for your event. All assets have to be jpg images.</p>
            <div style="display: flex;">
                <picture-input
                    ref="logo"
                    :width="200"
                    :removable="false"
                    removeButtonClass="ui red button"
                    :height="200"
                    accept="image/jpeg"
                    buttonClass="ui button primary"
                    :customStrings="{
                        upload: '<h1>Upload your image!</h1>',
                        drag: 'Drag and drop your event logo here'
                    }">
                </picture-input>
                <picture-input
                    ref="banner"
                    :width="355"
                    :removable="false"
                    removeButtonClass="ui red button"
                    :height="200"
                    accept="image/jpeg"
                    buttonClass="ui button primary"
                    :customStrings="{
                        upload: '<h1>Upload your image!</h1>',
                        drag: 'Drag and drop your event banner here'
                    }">
                </picture-input>
            </div>
            <button @click="saveImages()">Upload</button>
        </div>
        <div class="special-settings">
            <h3>General Settings</h3>
            <settings v-model:settings="specialSettings"></settings>
        </div>
        <button @click="save( 'draft' )">Save as draft</button>
        <div>
            <h3>Danger Zone</h3>
            <button @click="dangerZone( 'deploy' )">Go Live</button>
            <button @click="dangerZone( 'undeploy' )" v-if="hasLiveVersion">Unpublish event</button>
            <button @click="dangerZone( 'delete' )">Delete Event</button>
            <br><br><br>
        </div>
        <!-- <div>
            <p>Please read the documentation of this section if you want to use the requirements. It requires specific syntax to work. See <a href="https://libreevent.janishutz.com/docs/admin-panel/events#special-requirements" target="_blank">here</a> for more information</p>
        </div> -->
        <notifications ref="notification" location="topright"></notifications>
        <popups ref="popups" size="normal" @data="( data ) => { handlePopup( data ) }"></popups>
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

    .deleteButton {
        cursor: pointer;
        font-size: 110%;
        margin: 0;
    }
</style>

<script>
    import settings from '@/components/settings/settings.vue';
    import notifications from '@/components/notifications/notifications.vue';
    import popups from '@/components/notifications/popups.vue';
    import PictureInput from 'vue-picture-input';

    export default {
        name: 'TicketsDetailsView',
        components: {
            settings,
            notifications,
            PictureInput,
            popups,
        },
        data() {
            return {
                locations: {},
                event: { 'name': 'Unnamed event', 'description': '', 'location': '', 'date': '', 'categories': {}, 'ageGroups': { '1':{ 'id': 1, 'name':'Child', 'age':'0 - 15.99' }, '2':{ 'id': 2, 'name': 'Adult' } }, 'maxTickets': 2, 'eventID': 'untitled' },
                specialSettings: {
                    // 'guest-purchase': { 
                    //     'display': 'Enable guest purchase', 
                    //     'id': 'guest-purchase', 
                    //     'tooltip':'Allowing guest purchase means that a user does not have to create an account in order for them to be able to make a purchase. Default: On', 
                    //     'value': true,
                    //     'type': 'toggle'
                    // },
                    // 'overbooking': { 
                    //     'display': 'Enable overbooking of event', 
                    //     'id': 'overbooking', 
                    //     'tooltip':'Allow more ticket reservations than you have tickets available. Currently only available for events without seatplans. Default: Off', 
                    //     'value': false,
                    //     'type': 'toggle'
                    // },
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
                    // 'requiredParameter': { 
                    //     'display': 'Special requirements', 
                    //     'id': 'requiredParameter', 
                    //     'tooltip':'Set this parameter to require the user to provide a certain email domain, a special number or special string of characters. Defaults to None', 
                    //     'value': 'none',
                    //     'type': 'select',
                    //     'restrictions': {
                    //         'none': { 
                    //             'displayName':'None',
                    //             'value': 'none'
                    //         },
                    //         'email': { 
                    //             'displayName':'Email domain',
                    //             'value': 'email'
                    //         },
                    //         'numbers': { 
                    //             'displayName':'Number sequence',
                    //             'value': 'numbers'
                    //         },
                    //         'string': { 
                    //             'displayName':'Text sequence',
                    //             'value': 'string'
                    //         },
                    //     }
                    // },
                    // 'requiredParameterValue': { 
                    //     'display': 'Special requirements values ', 
                    //     'id': 'requiredParameterValue', 
                    //     'tooltip':'Put a filter here, corresponding to your selection above. Please read the documentation on our website. See link below!', 
                    //     'value': '',
                    //     'type': 'text',
                    // },
                },
                command: '',
                currentLocation: '',
                toDelete: '',
                currency: 'USD',
                hasLiveVersion: false,
                hasSeatPlan: true,
                totalSeats: 0,
            }
        },
        created () {
            this.loadData();
        },
        methods: {
            loadData () {
                fetch( localStorage.getItem( 'url' ) + '/admin/getAPI/getCurrency' ).then( res => {
                    res.text().then( currency => {
                        this.currency = currency;
                    } );
                } );
                if ( !sessionStorage.getItem( 'selectedTicket' ) ) {
                    this.$router.push( '/admin/events' );
                }
                fetch( localStorage.getItem( 'url' ) + '/admin/getAPI/getEventStatus' ).then( res => {
                    res.text().then( status => {
                        this.hasLiveVersion = Boolean( status );
                    } );
                } );
                this.eventID = sessionStorage.getItem( 'selectedTicket' );
                fetch( localStorage.getItem( 'url' ) + '/admin/getAPI/getLocations' ).then( res => {
                    res.json().then( data => {
                        this.locations = data;
                        fetch( localStorage.getItem( 'url' ) + '/admin/getAPI/getEvent?event=' + this.eventID ).then( res => {
                            if ( res.status === 200 ) {
                                res.json().then( data => {
                                    this.event = data;
                                    this.currentLocation = this.event.location;
                                    const dt = this.event.date.split( 'T' );
                                    this.event.date = dt[ 0 ];
                                    this.event.time = dt[ 1 ].slice( 0, dt[ 1 ].length - 1 );
                                    this.hasSeatPlan = this.locations[ this.event.location ] ? ( this.locations[ this.event.location ][ 'seatplan-enabled' ] ?? false ) : false;
                                } ).catch( error => {
                                    console.error( error );
                                } );
                            } else if ( res.status === 404 ) {
                                this.$router.push( '/admin/events' );
                            }
                        } );
                    } ).catch( error => {
                        console.error( error );
                    } );
                } );
            },
            saveImages() {
                if ( this.$refs.logo.file && this.$refs.banner.file ) {
                    let fd = new FormData();
                    console.log( this.$refs.logo.file );
                    fd.append( 'image', this.$refs.logo.file );
                    fd.append( 'image', this.$refs.banner.file );
                    fd.append( 'logo', this.$refs.logo.file.name );
                    let fetchOptions = {
                        method: 'post',
                        body: fd,
                    };
                    fetch( localStorage.getItem( 'url' ) + '/admin/events/uploadImages?event=' + sessionStorage.getItem( 'selectedTicket' ) + '&image=' + 'logo', fetchOptions ).then( res => {
                        if ( res.status === 200 ) {
                            this.$refs.notification.createNotification( 'Images saved successfully!', 5, 'ok', 'normal' );
                        }
                    } ).catch( err => {
                        console.error( err );
                    } );
                } else {
                    this.$refs.notification.createNotification( 'No image selected!', 5, 'error', 'normal' );
                }
            },
            save ( action ) {
                if ( Object.keys( this.event.ageGroups ).length > 0 && Object.keys( this.event.categories ).length > 0 ) {
                    for ( let ageGroup in this.event.ageGroups ) {
                        if ( this.event.ageGroups[ ageGroup ].name == '' ) {
                            this.$refs.popups.openPopup( 'One or more age groups are missing their names. Please ensure that all age groups have a name and try again!', {}, 'string' );
                            return;
                        }
                    }

                    let lowestPrice = 1000000;
                    let totalSeats = parseInt( this.locations[ this.event.location ].totalSeats ?? 0 );
                    for ( let category in this.event.categories ) {
                        for ( let price in this.event.categories[ category ].price ) {
                            if ( this.event.categories[ category ].price[ price ] < 0.5 || ( !this.event.categories[ category ].ticketCount && this.hasSeatPlan ) ) {
                                this.$refs.popups.openPopup( 'At least one of the prices for at least one of the categories is below the minimum of ' + this.currency + ' 0.5', {}, 'string' );
                                return;
                            }
                            if ( this.event.categories[ category ].price[ price ] < lowestPrice ) {
                                lowestPrice = this.event.categories[ category ].price[ price ];
                            };
                        }
                        totalSeats += parseInt( this.event.categories[ category ].ticketCount ?? 0 );
                    }

                    this.event[ 'startingPrice' ] = lowestPrice;
                    this.event[ 'currency' ] = this.currency;
                    this.event[ 'locationName' ] = this.locations[ this.event.location ].name;
                    this.event[ 'hasSeatplan' ] = this.hasSeatPlan;
                    this.event[ 'totalSeats' ] = totalSeats;
                    const fullDate = new Date( this.event.date + 'T' + this.event.time +'Z' );
                    this.event.date = fullDate.toISOString();
                    if ( !this.event.maxTickets ) {
                        this.event.maxTickets = this.totalSeats;
                    }
                    this.event.maxTickets = this.specialSettings[ 'maxTickets' ].value;
                    let url = localStorage.getItem( 'url' ) + '/admin/api/saveEvent';
                    if ( action === 'deploy' ) {
                        url = localStorage.getItem( 'url' ) + '/admin/api/deployEvent';
                    }
                    const options = {
                        method: 'post',
                        body: JSON.stringify( { 'event': this.event.eventID, 'eventData': this.event } ),
                        headers: {
                            'Content-Type': 'application/json',
                            'charset': 'utf-8'
                        }
                    };
                    fetch( url, options ).then( res => {
                        if ( res.status === 200 ) {
                            if ( action === 'deploy' ) {
                                this.$refs.notification.createNotification( 'Your event has been published successfully.', 5, 'ok', 'normal' );
                                fetch( '/getAPI/reloadData' ).catch( () => {} );
                                this.hasLiveVersion = true;
                            } else {
                                this.$refs.notification.createNotification( 'Saved as draft successfully!', 5, 'ok', 'normal' );
                            }
                            this.loadData();
                        }
                    } );
                } else {
                    this.$refs.popups.openPopup( 'Please ensure that you have at least one age group and one category defined!', {}, 'string' );
                }
            },
            addNew( type ) {
                if ( type === 'ageGroup' ) {
                    this.$refs.popups.openPopup( 'Choose a name for the age group', {}, 'text' );
                    this.command = 'addAgeGroup';
                } else if ( type === 'category' ) {
                    this.$refs.popups.openPopup( 'Choose a name for the new category', {}, 'number', Object.keys( this.event.categories ).length + 1 );
                    this.command = 'addCategory';
                }
            },
            deleteObject( type, data ) {
                if ( type === 'ageGroup' ) {
                    this.$refs.popups.openPopup( 'Do you really want to delete this age group?', {}, 'confirm' );
                    this.command = 'deleteAgeGroup';
                    this.toDelete = data;
                } else if ( type === 'category' ) {
                    this.$refs.popups.openPopup( 'Do you really want to delete this category', {}, 'confirm' );
                    this.command = 'deleteCategory';
                    this.toDelete = data;
                }
            },
            handleLocationChange() {
                if ( Object.keys( this.event.categories ).length > 1 && this.locations[ this.event.location ][ 'seatplan-enabled' ] ) {
                    this.command = 'locationChange';
                    this.$refs.popups.openPopup( 'You have edited the categories of this location. Changing the location now leads to data loss.', {}, 'confirm' );
                } else {
                    this.command = 'locationChange';
                    this.handlePopup( { 'status': 'ok' } );
                }
            },
            handlePopup( data ) {
                if ( data.status === 'ok' ) {
                    if ( this.command === 'addCategory' ) {
                        this.command = '';
                        if ( !this.event.categories[ data.data ] ) {
                            this.event.categories[ data.data ] = { 'price': {}, 'bg': '#FFFFFF', 'fg': '#000000', 'name': 'Category ' + data.data, 'id': data.data, 'ticketCount': 1 };
                            for ( let ageGroup in this.event.ageGroups ) {
                                this.event.categories[ data.data ][ 'price' ][ ageGroup ] = 0;
                            }
                        } else {
                            this.$refs.popups.openPopup( 'That category already exists!', {}, 'string' );
                        }
                    } else if ( this.command === 'addAgeGroup' ) {
                        this.command = '';
                        for ( let ageGroup in this.event.ageGroups ) {
                            if ( this.event.ageGroups[ ageGroup ].name === data.data ) {
                                this.$refs.popups.openPopup( 'That age group exists already', {}, 'string' );
                                return;
                            }
                        }
                        this.event.ageGroups[ Object.keys( this.event.categories ).length + 1 ] = { 'id': Object.keys( this.event.categories ).length + 1, 'name': data.data };
                        for ( let ageGroup in this.event.ageGroups ) {
                            for ( let category in this.event.categories ) {
                                if ( !this.event.categories[ category ][ 'price' ][ ageGroup ] ) {
                                    this.event.categories[ category ][ 'price' ][ ageGroup ] = 0;
                                }
                            }
                        }
                    } else if ( this.command === 'deleteCategory' ) {
                        delete this.event.categories[ this.toDelete ];
                    } else if ( this.command === 'deleteAgeGroup' ) {
                        delete this.event.ageGroups[ this.toDelete ];
                    } else if ( this.command === 'locationChange' ) {
                        this.currentLocation = this.event.location;
                        if ( this.locations[ this.event.location ][ 'seatplan-enabled' ] ) {
                            fetch( '/admin/getAPI/getSeatplan?location=' + this.event.location ).then( res => {
                                if ( res.status === 200 ) {
                                    res.json().then( json => {
                                        this.hasSeatPlan = this.locations[ this.event.location ][ 'seatplan-enabled' ] ?? false;
                                        this.event.categories = {};
                                        this.totalSeats = json.seatInfo.count;
                                        // TODO: Make sure ticket counting actually works from the seat plan editor
                                        for ( let element in json.data ) {
                                            if ( json.data[ element ][ 'type' ] === 'seat' || json.data[ element ][ 'type' ] === 'stand' ) {
                                                this.event.categories[ json.data[ element ][ 'category' ] ] = { 'price': {}, 'bg': '#FFFFFF', 'fg': '#000000', 'name': 'Category ' + json.data[ element ][ 'category' ], 'id': json.data[ element ][ 'category' ], 'ticketCount': 1 };
                                                for ( let ageGroup in this.event.ageGroups ) {
                                                    this.event.categories[ json.data[ element ][ 'category' ] ][ 'price' ][ ageGroup ] = 0;
                                                }
                                            }
                                        }
                                    } );
                                }
                            } )
                        }
                    } else if ( this.command === 'deployEvent' ) {
                        this.save( 'deploy' );
                    } else if ( this.command === 'undeployEvent' ) {
                        const options = {
                            method: 'post',
                            body: JSON.stringify( { 'event': sessionStorage.getItem( this.event.eventID ) } ),
                            headers: {
                                'Content-Type': 'application/json',
                                'charset': 'utf-8'
                            }
                        };
                        fetch( url, options ).then( res => {
                            if ( res.status === 200 ) {
                                this.hasLiveVersion = false;
                                this.$refs.notification.createNotification( 'Your event is no longer publicly visible!', 5, 'ok', 'normal' );
                            } else {
                                this.$refs.notification.createNotification( 'There was an error hiding your event', 5, 'error', 'normal' );
                            }
                        } );
                    } else if ( this.command === 'deleteEvent' ) {
                        const options = {
                            method: 'post',
                            body: JSON.stringify( { 'event': sessionStorage.getItem( this.event.eventID ) } ),
                            headers: {
                                'Content-Type': 'application/json',
                                'charset': 'utf-8'
                            }
                        };
                        fetch( url, options ).then( res => {
                            if ( res.status === 200 ) {
                                this.$refs.notification.createNotification( 'Your event has been deleted successfully!', 5, 'ok', 'normal' );
                                setTimeout( () => {
                                    this.$router.push( '/admin/events' );
                                }, 5000 );
                            } else {
                                this.$refs.notification.createNotification( 'There was an error deleting your event', 5, 'error', 'normal' );
                            }
                        } );
                    }
                } else if ( data.status === 'cancel' ) {
                    if ( this.command === 'locationChange' ) {
                        this.event.location = this.currentLocation;
                    }
                }
            },
            dangerZone( action ) {
                if ( action === 'deploy' ) {
                    this.$refs.popups.openPopup( 'Do you really want to go live with this event?', {}, 'confirm' );
                    this.command = 'deployEvent';
                } else if ( action === 'undeploy' ) {
                    this.$refs.popups.openPopup( 'Do you really want to remove this event from the event listings?', {}, 'confirm' );
                    this.command = 'undeployEvent';
                } else if ( type === 'delete' ) {
                    this.$refs.popups.openPopup( 'Do you really want to delete this event? This action cannot be undone', {}, 'confirm' );
                    this.command = 'deleteEvent';
                }
            }
        }
    };
</script>

