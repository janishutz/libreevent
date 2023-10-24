/* eslint-disable no-undef */
const { createApp } = Vue;

createApp( {
    data() {
        return {
            entries: {},
            newSuggestion: {},
            votingDetails: {},
            votedOn: {},
            hasLoadedBasics: false,
            hasLoadedVotes: false,
            sorting: 'newest',
        };
    },
    computed: {
        orderedVotes() {
            if ( this.sorting === 'oldest' ) {
                return Object.values( this.entries );
            } else if ( this.sorting === 'newest' ) {
                const ent = Object.keys( this.entries ).reverse();
                let ret = [];
                for ( let entry in ent ) {
                    ret.push( this.entries[ ent[ entry ] ] );
                }
                return ret;
            } else {
                let ent = Object.keys( this.entries ).sort( ( a, b ) => {
                    if ( this.sorting === 'nameUp' ) {
                        return this.entries[ a ].title.localeCompare( this.entries[ b ].title );
                    } else if ( this.sorting === 'nameDown' ) {
                        return this.entries[ b ].title.localeCompare( this.entries[ a ].title );
                    } else if ( this.sorting === 'mostVoted' ) {
                        return this.entries[ b ].count - this.entries[ a ].count;
                    } else if ( this.sorting === 'leastVoted' ) {
                        return this.entries[ a ].count - this.entries[ b ].count;
                    }
                } );
                console.log( ent );
                let ret = [];
                for ( let entry in ent ) {
                    ret.push( this.entries[ ent[ entry ] ] );
                }
                return ret;
            }
        }
    },
    methods: {
        getData() {
            fetch( '/polls/get/' + location.pathname.substring( 7 ) ).then( response => {
                response.json().then( data => {
                    this.entries = data;
                    this.hasLoadedVotes = true;
                } );
            } );
            fetch( '/polls/getDetails/' + location.pathname.substring( 7 ) ).then( response => {
                response.json().then( data => {
                    this.votingDetails = data;
                    this.hasLoadedBasics = true;
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
