<template>
    <div class="seatingWrapper">
        <div class="sidebar">
            <h2>{{ eventInfo.name }}</h2>
            <h3>{{ eventInfo.date }}</h3>
            <h3>{{ eventInfo.location }}</h3>
            <h3>Selected tickets</h3>
            <table class="price-table" v-for="event in selectedSeats">
                <tr v-if="Object.keys( event.selectedSeats ).length">
                    <h4>{{ event.name }}</h4>
                </tr>
                <tr v-for="ticket in event.selectedSeats">
                    <td>{{ ticket.name }} ({{ ticket.ageGroup }})</td>
                    <td>{{ eventInfo[ 'currency' ] }} {{ ticket[ 'price' ] }}</td>
                </tr>
            </table>
            <h3>Total: {{ eventInfo[ 'currency' ] }} {{ total }}</h3>
            <router-link to="/cart">To cart</router-link>
        </div>
        <div class="noseatplan">
            <h3>Available tickets</h3>
            <div class="wrapper">
                <div v-for="ticket in tickets">
                    {{ eventInfo[ 'categories' ][ ticket.category ][ 'name' ] }}<br>
                    <div v-for="ticketOption in eventInfo[ 'ageGroups' ]" class="ticket">
                        <div>
                            {{ ticketOption.name }} <div style="display: inline" v-if="ticketOption.age">({{ ticketOption.age }})</div> {{ eventInfo.currency }} {{ eventInfo[ 'categories' ][ ticket.category ][ 'price' ][ ticketOption.id ] }} <span class="material-symbols-outlined">add</span> Selected <span class="material-symbols-outlined">remove</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'noseatplan',
    props: {
        ticketID: String
    },
    data () {
        return {
            tickets: { 'ticket1': { 'name': 'Ticket 1', 'id': 'ticket1', 'category': 1 }, 'ticket2': { 'name': 'Ticket 2', 'id': 'ticket2', 'category': 2 } },
            eventInfo: { 'name': 'TestEvent', 'location': 'TestLocation', 'date': 'TestDate', 'RoomName': 'TestRoom', 'currency': 'CHF', 'categories': { '1': { 'price': { '1':25, '2':35 }, 'bg': 'black', 'fg': 'white', 'name': 'Category 1' }, '2': { 'price': { '1':15, '2':20 }, 'bg': 'green', 'fg': 'white', 'name': 'Category 2' } }, 'ageGroups': { '1':{ 'id': 1, 'name':'Child', 'age':'0 - 15.99 years' }, '2':{ 'id': 2, 'name': 'Adult', 'age': null } }, 'ageGroupCount':2, 'stage': true },
            selectedSeats: {},
            pricingCurrentlySelected: {},
            total: 0,
        }
    },
    methods: {
        loadPreviouslySelected () {
            /* 
                This function is called whenever the data on the webpage is to be reloaded
            */
           
            // load data from cart and set up cart if not available
            let cart = sessionStorage.getItem( 'cart' ) ? JSON.parse( sessionStorage.getItem( 'cart' ) ) : {};
            cart[ this.ticketID ?? 'default' ] = cart[ this.ticketID ?? 'default' ] ? cart[ this.ticketID ?? 'default' ] : { 'name': this.eventInfo.name, 'date': this.eventInfo.date, 'location': this.eventInfo.location, 'currency': this.eventInfo.currency };
            cart[ this.ticketID ?? 'default' ][ 'selectedSeats' ] = cart[ this.ticketID ?? 'default' ][ 'selectedSeats' ] ? cart[ this.ticketID ?? 'default' ][ 'selectedSeats' ] : {};

            let data = cart[ this.ticketID ?? 'default' ][ 'selectedSeats' ] ? cart[ this.ticketID ?? 'default' ][ 'selectedSeats' ] : {};
            
            let showError = false
            for ( let i in data ) {
                if ( this.seating[ data[ i ][ 'row' ] ][ 'content' ][ data[ i ][ 'seat' ] ][ 'available' ] ) {
                    this.seating[ data[ i ][ 'row' ] ][ 'content' ][ data[ i ][ 'seat' ] ][ 'selected' ] = true;
                } else {
                    showError = true;
                    delete data[ i ];
                }
            }

            if ( showError ) {
                // TODO: Show popup that no more tickets in a category are available
            }


            // check if no ticket selected and prevent writing if no ticket
            // selected to not show too many events
            let isEmpty = sessionStorage.getItem( 'selectedTicket' ) ? false : true;

            if ( !isEmpty ) {
                cart[ this.ticketID ?? 'default' ][ 'selectedSeats' ] = data;
                sessionStorage.setItem( 'cart', JSON.stringify( cart ) );
            }

            this.selectedSeats = cart;
            this.sumUp();
        },
        sumUp () {
            // This function calculates the total price of the tickets for this event.
            let cart = sessionStorage.getItem( 'cart' ) ? JSON.parse( sessionStorage.getItem( 'cart' ) ) : {};

            let price = 0;
            for ( let i in cart ) {
                for ( let entry in cart[ i ][ 'selectedSeats' ] ) {
                    price += parseInt( cart[ i ][ 'selectedSeats' ][ entry ][ 'price' ] );
                }
            }

            let back = {};

            back[ 'total' ] = price;
            back[ 'currency' ] = this.eventInfo.currency;

            this.total = price;


            // check if no ticket selected and prevent writing if no ticket
            // selected to not show too many events
            let isEmpty = sessionStorage.getItem( 'selectedTicket' ) ? false : true;

            if ( !isEmpty ) {
                sessionStorage.setItem( 'backend', JSON.stringify( back ) );            
                sessionStorage.setItem( 'cart', JSON.stringify( cart ) );
            }
        },
        selectSeat( placeID, rowID ) {
            /* 
                This function allows the user to select a seat and deselect it, if it has previously
                been selected.
            */
            sessionStorage.setItem( 'tempStorage', JSON.stringify( { 1:[ placeID, rowID ] } ) );
            let cart = sessionStorage.getItem( 'cart' ) ? JSON.parse( sessionStorage.getItem( 'cart' ) ) : {};
            cart[ this.ticketID ?? 'default' ] = cart[ this.ticketID ?? 'default' ] ? cart[ this.ticketID ?? 'default' ] : {};
            cart[ this.ticketID ?? 'default' ][ 'selectedSeats' ] = cart[ this.ticketID ?? 'default' ][ 'selectedSeats' ] ? cart[ this.ticketID ?? 'default' ][ 'selectedSeats' ] : {};
            
            let data = cart[ this.ticketID ?? 'default' ][ 'selectedSeats' ] ? cart[ this.ticketID ?? 'default' ][ 'selectedSeats' ] : {};

            let isDeleting = false;
                        
            for ( let i in data ) {
                if ( data[ i ][ 'seat' ] == placeID && data[ i ][ 'row' ] == rowID ) {
                    delete data[ i ];
                    isDeleting = true;
                }
            }
            
            this.seating[ rowID ][ 'content' ][ placeID ][ 'selected' ] = !isDeleting;
            
            if ( isDeleting ) {
                cart[ this.ticketID ?? 'default' ][ 'selectedSeats' ] = data;
                sessionStorage.setItem( 'cart', JSON.stringify( cart ) );
                this.selectedSeats = cart;
                this.sumUp();
            } else {
                if ( this.eventInfo.ageGroupCount > 1 ) {
                    $( '#overlay' ).show( 200 );
                } else {
                    this.storeSeat( '1' );
                }
            }

            this.pricingCurrentlySelected = this.eventInfo[ 'categories' ][ this.seating[ rowID ][ 'content' ][ placeID ][ 'category' ] ][ 'price' ];
        },
        closePopup () {
            // This function closes the popup and sets the seat to not selected
            $( '#overlay' ).hide( 200 );
            let seat = JSON.parse( sessionStorage.getItem( 'tempStorage' ) );
            this.seating[ seat[ 1 ][ 1 ] ][ 'content' ][ seat[ 1 ][ 0 ] ][ 'selected' ] = false;
        },
        storeSeat( ticketOption ) {
            /* 
                This function stores a ticket into the event's selected seat sessionStorage.
            */

            let cart = sessionStorage.getItem( 'cart' ) ? JSON.parse( sessionStorage.getItem( 'cart' ) ) : {};
            cart[ this.ticketID ?? 'default' ] = cart[ this.ticketID ?? 'default' ] ? cart[ this.ticketID ?? 'default' ] : { 'name': this.eventInfo.name, 'date': this.eventInfo.date, 'location': this.eventInfo.location, 'currency': this.eventInfo.currency };
            cart[ this.ticketID ?? 'default' ][ 'selectedSeats' ] = cart[ this.ticketID ?? 'default' ][ 'selectedSeats' ] ? cart[ this.ticketID ?? 'default' ][ 'selectedSeats' ] : {};

            let data = cart[ this.ticketID ?? 'default' ][ 'selectedSeats' ] ? cart[ this.ticketID ?? 'default' ][ 'selectedSeats' ] : {};

            let seat = JSON.parse( sessionStorage.getItem( 'tempStorage' ) );

            let ticket = this.seating[ seat[ 1 ][ 1 ] ][ 'content' ][ seat[ 1 ][ 0 ] ];
            let ticketData = { 'name': ticket[ 'name' ], 'categoryID': ticketOption, 'category': this.eventInfo[ 'categories' ][ ticket[ 'category' ] ], 'price': this.eventInfo[ 'categories' ][ this.seating[ seat[ 1 ][ 1 ] ][ 'content' ][ seat[ 1 ][ 0 ] ][ 'category' ] ][ 'price' ][ ticketOption ], 'row':seat[ 1 ][ 1 ], 'seat':seat[ 1 ][ 0 ], 'ageGroup': this.eventInfo[ 'ageGroups' ][ ticketOption ][ 'name' ] };
            data[ String( seat[ 1 ][ 1 ] ) + String( seat[ 1 ][ 0 ] ) ] = ticketData;

            cart[ this.ticketID ?? 'default' ][ 'selectedSeats' ] = data;

            
            sessionStorage.setItem( 'cart', JSON.stringify( cart ) );
            $( '#overlay' ).hide( 200 );
            this.selectedSeats = cart;
            this.sumUp();
        },
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
        background-color: var( --accent-background );
        color: var( --secondary-color );
        overflow: scroll;
    }

    .noseatplan {
        grid-area: main;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: justify;
        overflow: scroll;
    }

    .wrapper {
        width: 30%;
        display: flex;
        flex-direction: column;
        align-items: justify;
        justify-content: justify;
        text-align: justify;
    }

    .ticket {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var( --overlay-color );
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
        background-color: var( --background-color );
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

    .button {
        background-color: var( --accent-background );
        color: var( --secondary-color );
        font-weight: bold;
        font-size: 110%;
        border-radius: 20px;
        border-style: none;
        padding: 10px 40px;
        transition: 0.6s;
    }

    .button:hover {
        background-color: var( --accent-background-hover );
        transition: 0.3s;
        cursor: pointer;
    }

    .price-table {
        width: 100%;
    }
</style>
