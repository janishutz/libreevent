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
    </div>
</template>

<style scoped>
    .details {
        flex-grow: 1;
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
                hasSeatplan: true,
                eventID: '',
            }
        },
        created () {
            if ( !sessionStorage.getItem( 'selectedTicket' ) ) {
                this.$router.push( '/tickets' );
            }
            this.eventID = sessionStorage.getItem( 'selectedTicket' );
            // if ( this.eventID == 'test2' ) {
            //     this.hasSeatplan = false;
            // }
        }
    };
</script>

