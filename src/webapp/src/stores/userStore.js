/*
*				libreevent - userStore.js
*
*	Created by Janis Hutz 05/14/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

import { defineStore } from "pinia";

export const useUserStore = defineStore ( 'user', {
    state: () => ( { 'isUserAuth': false, 'isAdminAuth': false, 'userData': {}, 'isTwoFACompliantUser': false, 'isTwoFACompliantAdmin': false } ),
    getters: {
        getUserAuthenticated: ( state ) => state.isUserAuth,
        getAdminAuthenticated: ( state ) => state.isAdminAuth,
        getUserTwoFACompliant: ( state ) => state.isTwoFACompliantUser,
        getAdminTwoFACompliant: ( state ) => state.isTwoFACompliantAdmin,
    },
    actions: { 
        setUserAuth ( auth ) {
            this.isUserAuth = auth;
        },
        setAdminAuth ( auth ) {
            this.isAdminAuth = auth;
        },
        setUser2fa ( auth ) {
            this.isTwoFACompliantUser = auth;
        },
        setAdmin2fa ( auth ) {
            this.isTwoFACompliantAdmin = auth;
        }
    }
} );