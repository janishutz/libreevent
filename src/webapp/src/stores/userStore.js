import { defineStore } from "pinia";

export const useUserStore = defineStore ( 'user', {
    state: () => ( { 'isUserAuth': false, 'isAdminAuth': false } ),
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