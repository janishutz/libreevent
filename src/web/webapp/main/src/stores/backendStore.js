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
    state: () => ( { 'guestPurchase': false, 'guestPurchaseAllowed': false } ),
    getters: {
        getIsGuestPurchase: ( state ) => state.guestPurchase,
        getIsGuestPurchaseAllowed: ( state ) => state.guestPurchaseAllowed,
    },
    // actions: { 
        
    // }
} );