<!--
*				libreevent - properties.vue
*
*	Created by Janis Hutz 05/12/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div id="trapezoidSeatplan">
        <div v-for="row in seats">
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
    name: 'trapezoidSeatplanComponent',
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
        startingRow: {
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
            let w = Math.round( this.w / this.scaleFactor );
            let h = Math.round( this.h / this.scaleFactor );
            const size = 33;
            let side = Math.min( w, h ) + 20;
            let heightTriangle = Math.floor( Math.sqrt( side ** 2 - ( Math.sqrt( side ** 2 * 2 ) / 2 ) ) )
            let sideOffset = size / Math.sqrt( 2 );
            let count = Math.floor( heightTriangle / ( sideOffset * 2 ) );
            const angle = Math.PI / 4;
            this.seats = {};
            for ( let row = this.startingRow; row < count; row++ ) {
                let nn = 2 + ( row - 1 ) * 2; 
                this.seats[ row ] = {};
                for ( let n = 0; n < nn; n++ ) {
                    this.seats[ row ][ n ] = { 'style': '', 'id': 'sec' + this.data.sector + 'r' + row + 's' + n, 'displayName': ( this.data.sectorCount > 1 ? 'Sector ' + this.data.sector + ', ' : '' ) + 'Row ' + row + ', Seat ' + ( n + 1 ), 'status': 'av', 'row': row, 'seat': n };
                    let side = n * sideOffset;
                    if ( this.origin === 1 ) {
                        this.seats[ row ][ n ][ 'style' ] = `bottom: ${ ( side + 5 ) * this.scaleFactor }px; left: ${ ( row * sideOffset * 2 - side ) * this.scaleFactor }px; rotate: ${ angle }rad`;
                    } else if ( this.origin === 2 ) {
                        this.seats[ row ][ n ][ 'style' ] = `bottom: ${ ( side + 5 ) * this.scaleFactor }px; right: ${ ( row * sideOffset * 2 - side ) * this.scaleFactor }px; rotate: ${ Math.PI * 2 - angle }rad`;
                    } else if ( this.origin === 3 ) {
                        this.seats[ row ][ n ][ 'style' ] = `top: ${ ( side + 5 ) * this.scaleFactor }px; right: ${ ( row * sideOffset * 2 - side ) * this.scaleFactor }px; rotate: ${ angle + Math.PI }rad`;
                    } else if ( this.origin === 4 ) {
                        this.seats[ row ][ n ][ 'style' ] = `top: ${ ( side + 5 ) * this.scaleFactor }px; left: ${ ( row * sideOffset * 2 - side ) * this.scaleFactor }px; rotate: ${ Math.PI - angle }rad`;
                    }

                    this.seats[ row ][ n ][ 'scaling' ] = `font-size: ${this.scaleFactor * 200}%; `;

                    if ( this.data.categoryInfo.color ) {
                        this.seats[ row ][ n ][ 'style' ] += `color: ${ this.data.categoryInfo.color.fg ? this.data.categoryInfo.color.fg : 'black' }; background-color: ${ this.data.categoryInfo.color.bg ? this.data.categoryInfo.color.bg : 'rgba( 0, 0, 0, 0 )' }`;
                    }

                    if ( this.data.unavailableSeats ) {
                        if ( this.data.unavailableSeats[ this.seats[ row ][ n ][ 'id' ] ] ) {
                            this.seats[ row ][ n ][ 'status' ] = this.data.unavailableSeats[ this.seats[ row ][ n ][ 'id' ] ];
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
            console.log( seatObject );
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
        startingRow() {
            this.calculateChairs();
        }
    },
    created() {
        this.calculateChairs();
    }
}
</script>

