import { defineStore } from "pinia";

export const useBackendStore = defineStore ( 'backend', {
    state: () => ( { 'visitedSetupPages': {} } ),
    getters: {
        getVisitedSetupPages: ( state ) => state.visitedSetupPages,
    },
    actions: { 
        addVisitedSetupPages ( page, data ) {
            this.visitedSetupPages[ page ] = data;
            sessionStorage.setItem( 'visitedSetupPages', JSON.stringify( this.visitedSetupPages ) );
        },
        loadVisitedSetupPages () {
            this.visitedSetupPages = sessionStorage.getItem( 'visitedSetupPages' ) ? JSON.parse( sessionStorage.getItem( 'visitedSetupPages' ) ) : {};
        }
    }
} );