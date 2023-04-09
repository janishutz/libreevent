<template>
    <div class="seatingWrapper">
        <div class="sidebar">
            <h2>{{ eventInfo.name }}</h2>
            <h3>{{ eventInfo.date }}</h3>
            <h3>{{ eventInfo.location }}</h3>
            <h3>Selected tickets</h3>
            <table>
                <tr v-for="ticket in selectedSeats">
                    <td>{{ seating[ ticket[ 1 ] ][ 'content' ][ ticket[ 0 ] ][ 'name' ] }}</td>
                    <td>{{ eventInfo[ 'currency' ] }} {{ eventInfo[ 'categories' ][ seating[ ticket[ 1 ] ][ 'content' ][ ticket[ 0 ] ][ 'category' ] ][ 'price' ][ ticket[ 2 ] ] }}</td>
                </tr>
            </table>
            <h3>Total</h3>
            <router-link to="/cart">To cart</router-link>
        </div>
        <div class="seatingPlan">
            <h3>Seating plan</h3>
            <p>{{ eventInfo.RoomName }}</p>
            <p class="stage" v-if="eventInfo.stage">Stage</p>
            <div class="seating">
                <table>
                    <tr v-for="row in seating">
                        <td>
                            {{ row.name }}
                        </td>
                        <td v-for="place in row.content">
                            <div :class="place.category" class="active" v-if="place.available" @click="selectSeat( place.id, row.id )">
                                <div v-if="place.selected">
                                    <span class="material-symbols-outlined">done</span>
                                </div>
                                <div v-else>
                                    <span class="material-symbols-outlined">living</span>
                                </div>
                            </div>
                            <div v-else class="occupied">
                                <span class="material-symbols-outlined">close</span>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="overlay" id="overlay">
            <div class="popup">
                <div class="popup-content">
                    <div class="close-container">
                        <span class="material-symbols-outlined close-button" @click="closePopup()">close</span>
                    </div>
                    <div class="popup-content-wrapper">
                        <h3>Choose a ticket option</h3>
                        <ul v-for="group in eventInfo.ageGroups">
                            <li @click="storeSeat( group.id )" class="option">{{ group.name }} <i v-if="group.age">(0 - 15.99 years)</i> - {{ eventInfo.currency }} {{ pricingCurrentlySelected[ group.id ] }}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="overlay" id="placeNotAvailable">
            <div class="popup">
                <div class="popup-content">
                    <div class="close-container">
                        <span class="material-symbols-outlined close-button" @click="closePlaceNotAvailablePopup()">close</span>
                    </div>
                    <div class="popup-content-wrapper">
                        <h3>One or more seat(s) you have previously selected are/is no longer available!</h3>
                        <p>Please select another one!</p>
                        <button class="button" @click="closePlaceNotAvailablePopup()">Ok</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
let index = sessionStorage.getItem( 'arrayIndex' ) ? parseInt( sessionStorage.getItem( 'arrayIndex' ) ) : 0;

export default {
    name: 'noseatplan',
    props: {
        ticketID: String
    },
    data () {
        return {
            seating: { 'r1': { 'name': 'Row 1', 'id': 'r1', 'content':{ 'S1':{ 'name': 'Seat 1', 'id': 'S1', 'available': true, 'selected': false, 'category':'1' } } }, 'r2': { 'name': 'Row 2', 'id': 'r2', 'content':{ 'S1':{ 'name': 'S1', 'id': 'S1', 'available': true, 'selected': false, 'category':'2' } } } },
            eventInfo: { 'name': 'TestEvent', 'location': 'TestLocation', 'date': 'TestDate', 'RoomName': 'TestRoom', 'currency': 'CHF', 'categories': { '1': { 'price': { '1':25, '2':35 }, 'bg': 'black', 'fg': 'white' }, '2': { 'price': { '1':15, '2':20 }, 'bg': 'green', 'fg': 'white' } }, 'ageGroups': { '1':{ 'id': 1, 'name':'Child', 'age':'0 - 15.99' }, '2':{ 'id': 2, 'name': 'Adult', 'age': null } }, 'stage': true },
            selectedSeats: {},
            pricingCurrentlySelected: {}
        }
    },
    methods: {
        loadPreviouslySelected () {
            let data = {};
            if ( sessionStorage.getItem( 'selectedSeats' ) ) {
                data = JSON.parse( sessionStorage.getItem( 'selectedSeats' ) );
            }

            let showError = false
            for ( let i in data ) {
                if ( this.seating[ data[ i ][ 1 ] ][ 'content' ][ data[ i ][ 0 ] ][ 'available' ] ) {
                    this.seating[ data[ i ][ 1 ] ][ 'content' ][ data[ i ][ 0 ] ][ 'selected' ] = true;
                } else {
                    showError = true;
                    delete data[ i ];
                }
            }

            if ( showError ) {
                setTimeout( function () {
                    $( '#placeNotAvailable' ).show( 200 );
                    console.log( 'showing error message' );
                }, 500 );
            }

            sessionStorage.setItem( 'selectedSeats', JSON.stringify( data ) );
            
            this.selectedSeats = data;
        },
        sumUp () {
            let data = {};
            if ( sessionStorage.getItem( 'selectedSeats' ) ) {
                data = JSON.parse( sessionStorage.getItem( 'selectedSeats' ) );
            }
        },
        closePlaceNotAvailablePopup () {
            $( '#placeNotAvailable' ).hide( 300 );
        },
        selectSeat( placeID, rowID ) {
            sessionStorage.setItem( 'tempStorage', JSON.stringify( { 1:[ placeID, rowID ] } ) );
            let data = {};
            if ( sessionStorage.getItem( 'selectedSeats' ) ) {
                data = JSON.parse( sessionStorage.getItem( 'selectedSeats' ) );
            }
            
            let isDeleting = false;
                        
            for ( let i in data ) {
                if ( data[ i ][ 0 ] == placeID && data[ i ][ 1 ] == rowID ) {
                    delete data[ i ];
                    isDeleting = true;
                }
            }
            
            this.seating[ rowID ][ 'content' ][ placeID ][ 'selected' ] = !isDeleting;
            
            if ( isDeleting ) {
                sessionStorage.setItem( 'arrayIndex', index );
                sessionStorage.setItem( 'selectedSeats', JSON.stringify( data ) );
                this.selectedSeats = data;
            } else {
                $( '#overlay' ).show( 200 );
            }

            this.pricingCurrentlySelected = this.eventInfo[ 'categories' ][ this.seating[ rowID ][ 'content' ][ placeID ][ 'category' ] ][ 'price' ];
        },
        closePopup () {
            $( '#overlay' ).hide( 200 );
            let seat = JSON.parse( sessionStorage.getItem( 'tempStorage' ) );
            this.seating[ seat[ 1 ][ 1 ] ][ 'content' ][ seat[ 1 ][ 0 ] ][ 'selected' ] = false;
        },
        storeSeat( ticketOption ) {   
            let data = {};
            if ( sessionStorage.getItem( 'selectedSeats' ) ) {
                data = JSON.parse( sessionStorage.getItem( 'selectedSeats' ) );
            }

            let seat = JSON.parse( sessionStorage.getItem( 'tempStorage' ) );
            
            sessionStorage.setItem( 'selectedSeats', JSON.stringify( data ) );
            this.selectedSeats = data;

            data[ index ] = [ seat[ 1 ][ 0 ], seat[ 1 ][ 1 ], String( ticketOption ) ];
            index += 1;

            sessionStorage.setItem( 'arrayIndex', index );
            sessionStorage.setItem( 'selectedSeats', JSON.stringify( data ) );
            this.selectedSeats = data;
            $( '#overlay' ).hide( 200 );
        }
    },
    created() {
        this.loadPreviouslySelected();
    }
}
</script>

<style scoped>
    .seatingWrapper {
        display: grid;
        grid-template-areas:
        'main main main sidebar'
        'main main main sidebar'
        'main main main sidebar'
        'main main main sidebar'
        'main main main sidebar'
        'main main main sidebar'
        'main main main sidebar'
        'main main main sidebar'
        'main main main sidebar';
        height: 100%;
    }

    .sidebar {
        grid-area: sidebar;
        background-color: rgb(30, 30, 82);
        color: white;
        overflow: scroll;
    }

    .seatingPlan {
        grid-area: main;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: justify;
        overflow: scroll;
    }

    .active {
        cursor: pointer;
    }

    .occupied {
        background-color: rgb(177, 177, 177);
        padding: 0.4%;
    }

    .overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(37, 37, 37, 0.575);
        height: 100%;
        width: 100%;
    }

    .popup {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }

    .popup-content {
        background-color: white;
        height: 60%;
        width: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        border-radius: 50px;
    }

    .popup-content-wrapper {
        display: flex;
        height: 90%;
        width: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        overflow: scroll;
    }

    .close-container {
        width: 100%;
        display: flex;
        justify-content: flex-end;
    }
    .close-button {
        cursor: pointer;
        margin-right: 3vh;
        margin-top: 3vh;
    }

    .option {
        list-style: none;
        padding: 7px 15px;
        border-radius: 10px;
        border-color: black;
        border-style: solid;
        border-width: 1px;
        margin: 3px 0px;
        cursor: pointer;
    }

    .stage {
        border-color: black;
        border-style: solid;
        width: 80%;
        height: 7%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .button {
        background-color: rgb(38, 38, 68);
        color: white;
        font-weight: bold;
        font-size: 110%;
        border-radius: 20px;
        border-style: none;
        padding: 10px 40px;
        transition: 0.6s;
    }

    .button:hover {
        background-color: rgb(74, 74, 138);
        transition: 0.3s;
        cursor: pointer;
    }
</style>
