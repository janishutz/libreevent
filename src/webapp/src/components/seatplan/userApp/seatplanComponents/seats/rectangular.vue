<!--
*				libreevent - properties.vue
*
*	Created by Janis Hutz 05/12/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div id="rectangularSeatplan">
        <div v-for="row in seats" class="rows">
            <div class="seats" v-for="seat in row" :style="seat.style" :id="seat.id">
                <span class="material-symbols-outlined" :style="seat.scaling" @click="selectSeat( seat.row, seat.seat )" v-if="seat.status == 'av'" 
                :title="seat.displayName + ', Available'">living</span>
                <span class="material-symbols-outlined" :style="seat.scaling" v-else-if="seat.status == 'nav'"
                :title="seat.displayName + ', Unavailable'">disabled_by_default</span>
                <span class="material-symbols-outlined" :style="seat.scaling" v-else-if="seat.status == 'sel'"
                :title="seat.displayName + ', Selected'" @click="deselectSeat( seat.row, seat.seat )">check_box</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .seats {
        position: absolute;
    }
</style>

<script>
export default {
    name: 'rectangularSeatplanComponent',
    props: {
        h: {
            type: Number,
            "default": 100,
        },
        w: {
            type: Number,
            "default": 200,
        },
        scaleFactor: {
            type: Number,
            "default": 1,
        },
        origin: {
            type: Number,
            "default": 1,
        },
        data: {
            type: Object,
            "default": { 'sector': 'A', 'sectorCount': 1, 'unavailableSeats': { 'secAr0s0': true } }
        }
    },
    data () {
        return {
            seats: {},
        }
    },
    methods: {
        calculateChairs () {
            // Size of seat at scale 1 is 32px
            // w & h are normalised
            let w = Math.floor( this.w / this.scaleFactor );
            let h = Math.floor( this.h / this.scaleFactor );
            const size = 33;
            this.seats = {};
            for ( let row = 0; row < Math.floor( h / size ); row++ ) {
                this.seats[ row ] = {};
                for ( let n = 0; n < Math.floor( w / size ); n++ ) {
                    this.seats[ row ][ n ] = { 'style': '', 'id': 'sec' + this.data.sector + 'r' + row + 's' + n, 'displayName': ( this.data.sectorCount > 1 ? 'Sector ' + this.data.sector + ', ' : '' ) + 'Row ' + ( row + 1 ) + ', Seat ' + ( n + 1 ), 'status': 'av', 'row': row, 'seat': n };
                    // TODO: apply style of category
                    if ( this.origin === 1 ) {
                        this.seats[ row ][ n ][ 'style' ] = `bottom: ${ row * size * this.scaleFactor }px; left: ${ n * size * this.scaleFactor }px; rotate: ${ this.origin / 4 - 0.25 }turn;`;
                    } else if ( this.origin === 2 ) {
                        this.seats[ row ][ n ][ 'style' ] = `bottom: ${ row * size * this.scaleFactor }px; right: ${ n * size * this.scaleFactor }px; rotate: ${ this.origin / 4 - 0.25 }turn;`;
                    } else if ( this.origin === 3 ) {
                        this.seats[ row ][ n ][ 'style' ] = `top: ${ row * size * this.scaleFactor }px; right: ${ n * size * this.scaleFactor }px; rotate: ${ this.origin / 4 - 0.25 }turn;`;
                    } else if ( this.origin === 4 ) {
                        this.seats[ row ][ n ][ 'style' ] = `top: ${ row * size * this.scaleFactor }px; left: ${ n * size * this.scaleFactor }px; rotate: ${ this.origin / 4 - 0.25 }turn;`;
                    }
                    this.seats[ row ][ n ][ 'scaling' ] = `font-size: ${this.scaleFactor * 200}%; `;
                    if ( this.data.unavailableSeats ) {
                        if ( this.data.unavailableSeats[ this.seats[ row ][ n ][ 'id' ] ] ) {
                            this.seats[ row ][ n ][ 'status' ] = 'nav';
                        }
                    }
                }
            }
        },
        setScaleFactor () {
            for ( let row in this.seats ) {
                for ( let seat in this.seats[ row ] ) {
                    let styles = this.seats[ row ][ seat ].style.substring( this.seats[ row ][ seat ].style.indexOf( ';' ) + 1 );
                    this.seats[ row ][ seat ].style = `font-size: ${this.scaleFactor * 200}%;` + styles;
                }
            }
        },
        selectSeat ( row, seat ) {
            this.$emit( 'seatSelected', this.seats[ row ][ seat ] );
        },
        deselectSeat( row, seat ) {
            this.$emit( 'seatDeselected', this.seats[ row ][ seat ] );
            this.seats[ seatObject[ 'row' ] ][ seatObject[ 'seat' ] ][ 'status' ] = 'av';
            // TODO: Make server call to deselect ticket
        },
        validateSeatSelection( seatObject, selectedTicketOption ) {
            this.seats[ seatObject[ 'row' ] ][ seatObject[ 'seat' ] ][ 'status' ] = 'sel';
            this.seats[ seatObject[ 'row' ] ][ seatObject[ 'seat' ] ][ 'ticketOption' ] = selectedTicketOption;
            // TODO: Make server call to reserve ticket
        }
    },
    watch: {
        scaleFactor() {
            this.setScaleFactor();
        },
        h() {
            this.calculateChairs();
        },
        w() {
            this.calculateChairs();
        },
        origin() {
            this.calculateChairs();
        }
    },
    created() {
        this.calculateChairs();
    }
}
</script>

