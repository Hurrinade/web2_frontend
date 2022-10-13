import { defineStore } from 'pinia'

export const useGlobalsStore = defineStore('globals', {
    state: () => {
        return {
            commentsData: [],
            tableData: {},
            fixturesData: {},
            resultsData: {}
        }
    },
    actions: {

    },
})