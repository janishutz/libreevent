<template>
    <div class="seatingWrapper">
        <div class="sidebar">
            <h2>{{ eventInfo.name }}</h2>
            <h3>{{ eventInfo.date }}</h3>
            <h3>{{ eventInfo.location }}</h3>
            <h3>Selected tickets</h3>
            <ul v-for="ticket in selectedSeats">
                <li>{{ seating[ ticket[ 1 ] ][ 'content' ][ ticket[ 0 ] ][ 'name' ] }} {{ eventInfo[ 'categories' ][ seating[ ticket[ 1 ] ][ 'content' ][ ticket[ 0 ] ][ 'category' ] ][ 'price' ] }}</li>
            </ul>
            <h3>Total</h3>
            <router-link to="/cart">To cart</router-link>
        </div>
        <div class="seatingPlan">
            <h3>Seating plan</h3>
            <p>{{ eventInfo.RoomName }}</p>
            <div class="seating">
                <table>
                    <tr v-for="row in seating">
                        <td>
                            {{ row.name }}
                        </td>
                        <td v-for="place in row.content">
                            <div :class="place.category" class="active" v-if="!place.available" @click="selectSeat( place.id, row.id )">
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
            seating: { 'r1': { 'name': 'Row 1', 'id': 'r1', 'content':{ 'S1':{ 'name': 'Seat 1', 'id': 'S1', 'available': true, 'selected': false, 'category':'2' } } }, 'r2': { 'name': 'Row 2', 'id': 'r2', 'content':{ 'S1':{ 'name': 'S1', 'id': 'S1', 'available': false, 'selected': false, 'category':'2' } } } },
            eventInfo: { 'name': 'TestEvent', 'location': 'TestLocation', 'date': 'TestDate', 'RoomName': 'TestRoom', 'currency': 'CHF', 'categories': { '1': { 'price': 20, 'bg': 'black', 'fg': 'white' }, '2': { 'price': 20, 'bg': 'green', 'fg': 'white' } } },
            selectedSeats: {}
        }
    },
    methods: {
        selectSeat( placeID, rowID ) {
            let data = {};
            if ( sessionStorage.getItem( 'selectedSeats' ) ) {
                data = JSON.parse( sessionStorage.getItem( 'selectedSeats' ) );
            }
            
            let isDeleting = false;
            
            for ( let i in data ) {
                if ( data[ i ][ 0 ] == placeID, data[ i ][ 1 ] == rowID ) {
                    delete data[ i ];
                    isDeleting = true;
                }
            }
            
            this.seating[ rowID ][ 'content' ][ placeID ][ 'selected' ] = !isDeleting;
            
            if ( !isDeleting ) {
                data[ index ] = [ placeID, rowID ];
                index += 1;
            }
            sessionStorage.setItem( 'arrayIndex', index );
            sessionStorage.setItem( 'selectedSeats', JSON.stringify( data ) );
            this.selectedSeats = data;
        }
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
    }

    .seatingPlan {
        grid-area: main;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: justify;
    }

    .seating {
        width: 90%;
    }

    .active {
        cursor: pointer;
    }

    .occupied {
        background-color: rgb(177, 177, 177);
        padding: 0.4%;
    }
</style>
