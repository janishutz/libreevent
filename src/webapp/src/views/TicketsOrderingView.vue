<template>
    <div class="details">
        <!-- Load correct component depending on what the event's config is -->
        <seatplan ticketID="haoag" v-if="hasSeatplan"></seatplan>
        <noseatplan ticketID="haoag" v-else></noseatplan>
    </div>
</template>

<style scoped>
    .details {
        flex-grow: 1;
    }
</style>

<script>
    import seatplan from '@/components/seatplan.vue';
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
            }
        },
        created () {
            if ( !sessionStorage.getItem( 'selectedTicket' ) ) {
                this.$router.push( '/tickets' );
            }
        }
    };
</script>

