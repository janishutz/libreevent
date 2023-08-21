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
        <div class="top-container" :style="`background-image: url( ${ event.banner } ); background-repeat: no-repeat; background-size: cover;`">
            <img :src="event.logo" alt="Event Logo" class="event-logo">
            <h1 class="eventTitle">{{ event.name }}</h1>
            <router-link to="/tickets" class="back-button"><span class="material-symbols-outlined" style="font-size: 100%;">arrow_back</span></router-link>
        </div>
        <div class="main">
            <p>{{ event.description }}</p>
        </div>
        <aside>
            <p>{{ event.location }}</p>
            <p>{{ new Date( event.date ).toLocaleString() }}</p>
        </aside>
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

    .event-logo {
        position: absolute;
        left: 10px;
        top: calc( 87px + 2.5vh );
        height: 40vh;
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
            this.event[ 'banner' ] = localStorage.getItem( 'url' ) + '/eventAssets/' + this.eventID + 'Banner.jpg';
            this.event[ 'logo' ] = localStorage.getItem( 'url' ) + '/eventAssets/' + this.eventID + 'Logo.jpg';
            const eventData = JSON.parse( sessionStorage.getItem( 'ticketData' ) );
            this.event.name = eventData[ 'name' ];
            this.event.date = eventData[ 'date' ];
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

