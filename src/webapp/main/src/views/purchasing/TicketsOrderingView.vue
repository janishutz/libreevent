<!--
*				libreevent - TicketsOrderingView.vue
*
*	Created by Janis Hutz 05/14/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div class="details">
        <!-- Load correct component depending on what the event's config is -->
        <seatplan :ticketID="eventID" v-if="hasSeatplan"></seatplan>
        <noseatplan :ticketID="eventID" v-else></noseatplan>
        <router-link to="/tickets/details" class="back-button"><span class="material-symbols-outlined" style="font-size: 200%;">arrow_back</span></router-link>
    </div>
</template>

<style scoped>
    .details {
        flex-grow: 1;
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
        bottom: 2vh;
    }

    @media only screen and (min-width: 999px) {
        .back-button {
            position: fixed;
            left: 2vh;
            top: 2vh;
        }   
    }
</style>

<script>
import seatplan from '@/components/seatplan/userApp/userWindow.vue';
import noseatplan from '@/components/noseatplan.vue';

export default {
    name: 'TicketsDetailsView',
    components: {
        seatplan,
        noseatplan
    },
    data() {
        return {
            hasSeatplan: false,
            eventID: '',
        };
    },
    created () {
        if ( !sessionStorage.getItem( 'selectedTicket' ) ) {
            this.$router.push( '/tickets' );
        }
        this.eventID = sessionStorage.getItem( 'selectedTicket' );
        if ( sessionStorage.getItem( 'hasSeatplan' ) === 'false' ) {
            this.hasSeatplan = false;
        } else {
            this.hasSeatplan = true;
        }
    }
};
</script>

