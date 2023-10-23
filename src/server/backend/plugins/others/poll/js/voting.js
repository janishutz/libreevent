/* eslint-disable no-undef */
const { createApp } = Vue;

createApp( {
    data() {
        return {
            entries: {},
            newSuggestion: {},
            votingDetails: {},
            votedOn: {},
        };
    },
    methods: {
        getData() {
            fetch( '/polls/get/' + location.pathname.substring( 7 ) ).then( response => {
                response.json().then( data => {
                    this.entries = data;
                } );
            } );
            fetch( '/polls/getDetails/' + location.pathname.substring( 7 ) ).then( response => {
                response.json().then( data => {
                    this.votingDetails = data;
                } );
            } );
            this.votedOn = JSON.parse( localStorage.getItem( 'itemsVotedOn' ) ?? '{}' );
        },
        save() {
            if ( this.newSuggestion.comment && this.newSuggestion.title ) {
                let alreadyExists = false;
                for ( let el in this.entries ) {
                    if ( this.entries[ el ][ 'title' ] === this.newSuggestion.title ) {
                        alreadyExists = true;
                    } 
                }
                if ( alreadyExists ) {
                    if ( confirm( 'An element with the same title exists already. Do you really want to add another one?' ) ) {
                        if ( confirm( 'Are you really sure?' ) ) {
                            alreadyExists = true;
                        }  else {
                            alreadyExists = false;
                        }
                    }
                }
                if ( !alreadyExists ) {
                    let fetchOptions = {
                        method: 'post',
                        body: JSON.stringify( this.newSuggestion ),
                        headers: {
                            'Content-Type': 'application/json',
                            'charset': 'utf-8'
                        },
                    };
                    fetch( '/voting/add/' + location.pathname.substring( 8 ), fetchOptions ).then( response => {
                        if ( response.status !== 200 ) {
                            alert( 'there was an error updating' );
                        }
                    } );
                    this.closePopup();
                    this.getData();
                }
            } else {
                alert( 'Not all required fields are filled out!' );
            }
        },
        vote( type, suggestionID ) {
            let voteType = type;
            let didDeactivate = false;
            if ( this.votedOn[ suggestionID ] === type ) {
                didDeactivate = true;
                if ( type === 'up' ) {
                    voteType = 'down';
                } else {
                    voteType = 'up';
                }
            } else if ( this.votedOn[ suggestionID ] ) {
                return;
            }
            let fetchOptions = {
                method: 'post',
                body: JSON.stringify( { 'voteType': voteType, 'id': suggestionID } ),
                headers: {
                    'Content-Type': 'application/json',
                    'charset': 'utf-8'
                },
            };
            fetch( '/polls/vote/' + location.pathname.substring( 7 ), fetchOptions ).then( response => {
                if ( response.status !== 200 ) {
                    alert( 'there was an error updating' );
                } else {
                    this.votedOn[ suggestionID ] = didDeactivate ? undefined : voteType;
                    localStorage.setItem( 'itemsVotedOn', JSON.stringify( this.votedOn ) );
                    this.getData();
                }
            } );
        },
        closePopup() {
            $( '#popup' ).fadeOut( 500 );
            $( 'body' ).removeClass( 'menuOpen' );
            this.getData();
        },
        addSuggestion () {
            $( '#popup' ).fadeIn( 500 );
            $( 'body' ).addClass( 'menuOpen' );
        }
    }, 
    mounted() {
        this.getData();
    }
} ).mount( '#app' );
