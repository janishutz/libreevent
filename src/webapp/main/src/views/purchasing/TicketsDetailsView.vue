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
        <div class="top-container" :style="`background-image: url( ${ event.banner } ); background-repeat: no-repeat; background-size: cover; background-position: center;`">
            <img :src="event.logo" alt="Event Logo" class="event-logo">
            <h1 class="eventTitle">{{ event.name }}</h1>
            <router-link to="/tickets" class="back-button"><span class="material-symbols-outlined" style="font-size: 100%;">arrow_back</span></router-link>
        </div>
        <div class="container">
            <div class="main">
                <p v-for="line in event.description.split( '\n' )">{{ line }}</p>
            </div>
            <div class="aside">
                <h3>{{ event.location }}</h3>
                <p>{{ new Date( event.date ).toLocaleString() }}</p>
                <router-link to="/tickets/order" class="ticket-button">Order tickets</router-link>
            </div>
        </div>
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
        flex-direction: column;
        font-size: 200%;
        margin-bottom: 2.5%;
    }

    .eventTitle {
        background-color: rgba(0, 0, 0, 0.6);
        color: white;
        padding: 1.5% 3%;
        margin: 0;
    }

    .event-logo {
        display: block;
        height: 20vh;
        width: 20vh;
        margin-bottom: 5%;
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
        position: absolute;
        left: 2vh;
        top: calc( 87px + 1vh );
    }

    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap-reverse;
        width: 100%;
        flex-direction: row;
    }

    .main {
        width: 100%;
        margin-top: 5%;
    }

    .aside {
        width: 80%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background-color: gray;
        padding-bottom: 2%;
        margin-top: 2.5%;
    }

    .ticket-button {
        display: block;
        text-decoration: none;
        padding: 5%;
        width: fit-content;
        background-color: var( --accent-color );
        color: var( --secondary-color );
        transition: all 1s;
        border-radius: 50px;
    }

    .ticket-button:hover {
        background-color: var( --accent-background-hover );
        border-radius: 10px;
    }

    @media only screen and (min-width: 999px) {
        .aside {
            width: 25%;
            display: flex;
            justify-content: flex-start !important;
            margin: 0;
            margin-right: auto;
        }
        
        .main {
            margin: 0;
            width: 50%;
            height: 100%;
            margin-right: auto;
            margin-left: auto;
            text-align: left;
        }

        .container {
            align-items: flex-end;
        }

        .event-logo {
            position: absolute;
            left: 20px;
            top: calc( 87px + 2.5vh );
            height: 40vh;
            width: 40vh;
        }

        .top-container {
            height: 45vh;
            flex-direction: row;
            font-size: 200%;
        }
        
        .back-button {
            position: fixed;
            left: 2vh;
            top: 2vh;
        }
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
        };
    }
};
</script>

