<!--
*				myevent - properties.vue
*
*	Created by Janis Hutz 05/12/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div id="trapezoidSeatplan">
        <div v-for="row in seats">
            <span class="material-symbols-outlined seats" v-for="seat in row" :style="seat.style">living</span>
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
            for ( let row = 0; row < count; row++ ) {
                let nn = 2 + ( row - 1 ) * 2; 
                this.seats[ row ] = {};
                for ( let n = 0; n < nn; n++ ) {
                    let side = n * sideOffset;
                    if ( this.origin === 1 ) {
                        this.seats[ row ][ n ] = { 'style': `font-size: ${this.scaleFactor * 200}%; bottom: ${ ( side + 5 ) * this.scaleFactor }px; left: ${ ( row * sideOffset * 2 - side ) * this.scaleFactor }px; rotate: ${ angle }rad` };
                    } else if ( this.origin === 2 ) {
                        this.seats[ row ][ n ] = { 'style': `font-size: ${this.scaleFactor * 200}%; bottom: ${ ( side + 5 ) * this.scaleFactor }px; right: ${ ( row * size - side ) * this.scaleFactor }px; rotate: ${ Math.PI * 2 - angle }rad` };
                    } else if ( this.origin === 3 ) {
                        this.seats[ row ][ n ] = { 'style': `font-size: ${this.scaleFactor * 200}%; top: ${ ( side + 5 ) * this.scaleFactor }px; right: ${ ( row * size - side ) * this.scaleFactor }px; rotate: ${ angle + Math.PI }rad` };
                    } else if ( this.origin === 4 ) {
                        this.seats[ row ][ n ] = { 'style': `font-size: ${this.scaleFactor * 200}%; top: ${ ( side + 5 ) * this.scaleFactor }px; left: ${ ( row * size - side ) * this.scaleFactor }px; rotate: ${ Math.PI - angle }rad` };
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

