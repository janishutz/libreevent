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
        startingRow: {
            type: Number,
            "default": 1,
        },
        origin: {
            type: Number,
            "default": 1,
        },
        data: {
            type: Object,
            "default": { 'sector': 'A', 'sectorCount': 1, 'unavailableSeats': { 'secAr0s0': 'nav' }, 'categoryInfo': { 'pricing': { '1': { 'displayName': 'Adults - CHF 20.-', 'value': '1', 'price': 20 }, '2': { 'displayName': 'Child (0 - 15.99y) - CHF 15.-', 'value': '2', 'price': 15 } } } }
        },
        id: {
            type: Number,
            "default": 1,
        },
        unavailable: {
            type: Object,
            "default": {}
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
            let offsets = {};
            if ( this.data.seatInfo ) {
                for ( let element in this.data.seatInfo.data ) {
                    if ( this.data.seatInfo.data[ element ] > this.data.seatNumbering ) {
                        for ( let row in this.data.seatInfo.data[ element ] ) {
                            offsets[ row ] += this.data.seatInfo.data[ element ][ row ];
                        }
                    }
                }
            }
            let w = Math.floor( this.w / this.scaleFactor );
            let h = Math.floor( this.h / this.scaleFactor );
            const size = 33;
            this.seats = {};
            for ( let row = 0; row < Math.floor( h / size ); row++ ) {
                this.seats[ row ] = {};
                for ( let n = ( offsets[ row ] ?? 0 ); n < ( Math.floor( w / size ) + ( offsets[ row ] ?? 0 ) ); n++ ) {
                    const seatNumber = this.data.numberingDirection === 'right' ? ( Math.floor( w / size ) + ( offsets[ row ] ?? 0 ) ) - n: n;
                    this.seats[ row ][ n ] = { 
                        'style': '', 
                        'id': 'comp' + this.id + 'sec' + this.data.sector + 'r' + row + 's' + seatNumber, 
                        'displayName': ( this.data.sectorCount > 1 ? 'Sector ' + this.data.sector + ', ' : '' ) + 'Row ' + ( row + 1 ) + ', Seat ' + ( seatNumber + 1 ), 
                        'status': 'av', 
                        'row': row, 
                        'seat': n
                    };
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
                    
                    if ( this.data.categoryInfo.color ) {
                        this.seats[ row ][ n ][ 'style' ] += `color: ${ this.data.categoryInfo.color ?? 'black' };`;
                    }

                    if ( this.unavailable[ this.id ] ) {
                        if ( this.unavailable[ this.id ][ this.seats[ row ][ n ][ 'id' ] ] ) {
                            this.seats[ row ][ n ][ 'status' ] = this.unavailable[ this.id ][ this.seats[ row ][ n ][ 'id' ] ];
                        }
                    }
                }
            }
        },
        setScaleFactor () {
            for ( let row in this.seats ) {
                for ( let seat in this.seats[ row ] ) {
                    this.seats[ row ][ seat ].scaling = `font-size: ${this.scaleFactor * 200}%;`;
                }
            }
        },
        selectSeat ( row, seat ) {
            let selectedSeat = this.seats[ row ][ seat ];
            selectedSeat[ 'sector' ] = this.data.sector;
            selectedSeat[ 'option' ] = this.data.categoryInfo.pricing;
            selectedSeat[ 'componentID' ] = this.id;
            this.$emit( 'seatSelected', selectedSeat );
        },
        deselectSeat( row, seat ) {
            this.$emit( 'seatDeselected', this.seats[ row ][ seat ] );
            this.seats[ row ][ seat ][ 'status' ] = 'av';
        },
        validateSeatSelection( seatObject, selectedTicketOption ) {
            this.seats[ seatObject[ 'row' ] ][ seatObject[ 'seat' ] ][ 'status' ] = 'sel';
            this.seats[ seatObject[ 'row' ] ][ seatObject[ 'seat' ] ][ 'ticketOption' ] = selectedTicketOption;
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
        },
        unavailable() {
            this.calculateChairs();
        }
    },
    created() {
        this.calculateChairs();
    }
}
</script>

