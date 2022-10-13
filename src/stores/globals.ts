import { defineStore } from 'pinia'

export const useGlobalsStore = defineStore('globals', {
    state: () => {
        return {
            tableData: {},
            fixturesData: {},
            resultsData: {}
        }
    },
    actions: {

    },
})