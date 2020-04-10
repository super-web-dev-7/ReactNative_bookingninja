

const RoomStore = {
    stateTypes: {
        DIRTY_ROOMS: 'Dirty',
        CLEAN_ROOMS: 'Clean',
    },
    cleanList: undefined,
    dirtyList: undefined,

    isAllCleanDataLoaded: false,
    nextCleanUrl: undefined,

    isAllDirtyDataLoaded: false,
    nextDirtyUrl: undefined,

    requestCleenData: function () {

    },
    requestDirtyData: function () {

    }
};

export default RoomStore