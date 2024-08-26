/*
*				libreevent - backendStore.js
*
*	Created by Janis Hutz 05/14/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

import { defineStore } from 'pinia';

export const useBackendStore = defineStore( 'backend', {
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