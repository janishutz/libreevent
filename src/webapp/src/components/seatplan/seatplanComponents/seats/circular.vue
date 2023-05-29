<!--
*				libreevent - properties.vue
*
*	Created by Janis Hutz 05/12/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div id="circularSeatplan">
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
    name: 'circularSeatplanComponent',
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
            let count = Math.min( Math.floor( w / size ), Math.floor( h / size  ) );
            this.seats = {};
            for ( let row = 0; row < count; row++ ) {
                let nn = row * ( Math.PI / 2 );
                let r = row * size;
                this.seats[ row ] = {};
                for ( let n = 0; n < nn; n++ ) {
                    let phi = n * size / ( row * size );
                    if ( this.origin === 1 ) {
                        this.seats[ row ][ n ] = { 'style': `font-size: ${this.scaleFactor * 200}%; bottom: ${ r * Math.cos( phi ) * this.scaleFactor }px; left: ${ r * Math.sin( phi ) * this.scaleFactor }px; rotate: ${ phi }rad` };
                    } else if ( this.origin === 2 ) {
                        this.seats[ row ][ n ] = { 'style': `font-size: ${this.scaleFactor * 200}%; bottom: ${ r * Math.cos( phi ) * this.scaleFactor }px; right: ${ r * Math.sin( phi ) * this.scaleFactor }px; rotate: ${ Math.PI * 2 - phi }rad` };
                    } else if ( this.origin === 3 ) {
                        this.seats[ row ][ n ] = { 'style': `font-size: ${this.scaleFactor * 200}%; top: ${ r * Math.cos( phi ) * this.scaleFactor }px; right: ${ r * Math.sin( phi ) * this.scaleFactor }px; rotate: ${ phi + Math.PI }rad` };
                    } else if ( this.origin === 4 ) {
                        this.seats[ row ][ n ] = { 'style': `font-size: ${this.scaleFactor * 200}%; top: ${ r * Math.cos( phi ) * this.scaleFactor }px; left: ${ r * Math.sin( phi ) * this.scaleFactor }px; rotate: ${ Math.PI - phi }rad` };
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

