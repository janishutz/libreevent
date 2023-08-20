<!--
*				libreevent - TicketsDetailsView.vue
*
*	Created by Janis Hutz 05/14/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div class="details">
        <div class="top-container" :style="`background: url( ${ event.banner } ); background-repeat: no-repeat; background-size: cover;`">
            <h1 class="eventTitle">{{ event.name }}</h1>
            <router-link to="/tickets" class="back-button"><span class="material-symbols-outlined" style="font-size: 100%;">arrow_back</span></router-link>
        </div>
        <p>{{ event.description }}</p>
        <router-link to="/tickets/order">Order tickets</router-link>
    </div>
</template>

<style scoped>
    .details {
        height: 100%;
    }
    
    .top-container {
        height: 45vh;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 200%;
    }

    .eventTitle {
        background-color: rgba(0, 0, 0, 0.6);
        color: white;
        padding: 1.5% 3%;
        margin: 0;
    }

    .back-button {
        color: white;
        background-color: rgb(31, 31, 31);
        padding: 10px;
        border-radius: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        width: fit-content;
        height: fit-content;
        text-decoration: none;
        position: fixed;
        left: 2vh;
        top: 2vh;
    }
</style>

<script>
    export default {
        name: 'TicketsDetailsView',
        created () {
            if ( !sessionStorage.getItem( 'selectedTicket' ) ) {
                this.$router.push( '/tickets' );
            }
            this.eventID = sessionStorage.getItem( 'selectedTicket' );
            this.event[ 'banner' ] = localStorage.getItem( 'url' ) + '/eventAssets/' + this.eventID + '-banner.jpg';
            this.event[ 'logo' ] = localStorage.getItem( 'url' ) + '/eventAssets/' + this.eventID + '-logo.jpg';
            this.event[ 'banner' ] = localStorage.getItem( 'url' ) + '/otherAssets/logo.png';
            const eventData = JSON.parse( sessionStorage.getItem( 'ticketData' ) );
            this.event.name = eventData[ 'name' ];
            this.event.description = eventData[ 'description' ];
            this.event.location = eventData[ 'locationName' ];
        },
        data() {
            return {
                event: {},
            }
        }
    };
</script>

