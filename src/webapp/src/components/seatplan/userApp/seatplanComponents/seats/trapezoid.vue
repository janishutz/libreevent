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
                :title="seat.displayName + ', Unavailable'">close</span>
                <span class="material-symbols-outlined" :style="seat.scaling" v-else-if="seat.status == 'sel'"
                :title="seat.displayName + ', Selected'">done</span>
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
                    this.seats[ row ][ n ] = { 'style': '', 'id': 'sec' + this.data.sector + 'r' + row + 's' + n, 'displayName': ( this.data.sectorCount > 1 ? 'Sector ' + this.data.sector + ', ' : '' ) + 'Row ' + ( row + 1 ) + ', Seat ' + ( n + 1 ), 'status': 'av', 'row': row, 'seat': n };
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
            console.log( row + ' ' + seat );
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

