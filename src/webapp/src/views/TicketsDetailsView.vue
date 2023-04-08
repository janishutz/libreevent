<template>
    <div class="details">
        <!-- Load correct component depending on what the event's config is -->
        <seatplan ticketID="haoag"></seatplan>
    </div>
</template>

<style scoped>
    .details {
        flex-grow: 1;
    }
</style>

<script>
    import seatplan from '@/components/seatplan.vue';

    export default {
        name: 'TicketsDetailsView',
        components: {
            seatplan
        }
    };
</script>

