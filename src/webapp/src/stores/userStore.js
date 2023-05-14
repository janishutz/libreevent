/*
*				myevent - userStore.js
*
*	Created by Janis Hutz 05/14/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
*/

import { defineStore } from "pinia";

export const useUserStore = defineStore ( 'user', {
    state: () => ( { 'isUserAuth': false, 'isAdminAuth': true, 'userPermissions': {} } ),
    getters: {
        getUserAuthenticated: ( state ) => state.isUserAuth,
        getAdminAuthenticated: ( state ) => state.isAdminAuth,
    },
    actions: { 
        setUserAuth ( auth ) {
            this.isUserAuth = auth;
        },
        setAdminAuth ( auth ) {
            this.isAdminAuth = auth;
        }
    }
} );