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
    name: 'rectangularSeatplanComponent',
    props: {
        h: {
            type: Number,
            'default': 100,
        },
        w: {
            type: Number,
            'default': 200,
        },
        scaleFactor: {
            type: Number,
            'default': 1,
        },
        origin: {
            type: Number,
            'default': 1,
        },
        id: {
            type: Number,
            'default': 1
        }
    },
    data () {
        return {
            seats: {},
        };
    },
    methods: {
        calculateChairs () {
            // Size of seat at scale 1 is 32px
            // w & h are normalised
            let w = Math.floor( this.w / this.scaleFactor );
            let h = Math.floor( this.h / this.scaleFactor );
            const size = 33;
            this.seats = {};
            let details = { 'data': {}, 'id': this.id };
            for ( let row = 0; row < Math.floor( h / size ); row++ ) {
                this.seats[ row ] = {};
                details.data[ row ] = Math.floor( w / size );
                for ( let n = 0; n < Math.floor( w / size ); n++ ) {
                    if ( this.origin === 1 ) {
                        this.seats[ row ][ n ] = { 'style': `font-size: ${this.scaleFactor * 200}%; bottom: ${ row * size * this.scaleFactor }px; left: ${ n * size * this.scaleFactor }px; rotate: ${ this.origin / 4 - 0.25 }turn;` };
                    } else if ( this.origin === 2 ) {
                        this.seats[ row ][ n ] = { 'style': `font-size: ${this.scaleFactor * 200}%; bottom: ${ row * size * this.scaleFactor }px; right: ${ n * size * this.scaleFactor }px; rotate: ${ this.origin / 4 - 0.25 }turn;` };
                    } else if ( this.origin === 3 ) {
                        this.seats[ row ][ n ] = { 'style': `font-size: ${this.scaleFactor * 200}%; top: ${ row * size * this.scaleFactor }px; right: ${ n * size * this.scaleFactor }px; rotate: ${ this.origin / 4 - 0.25 }turn;` };
                    } else if ( this.origin === 4 ) {
                        this.seats[ row ][ n ] = { 'style': `font-size: ${this.scaleFactor * 200}%; top: ${ row * size * this.scaleFactor }px; left: ${ n * size * this.scaleFactor }px; rotate: ${ this.origin / 4 - 0.25 }turn;` };
                    }
                }
            }

            this.$emit( 'seatingInfo', details );
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
};
</script>

