import { defineStore } from 'pinia'

export const useGlobalsStore = defineStore('globals', {
    state: () => {
        return {
            localUrl: process.env.PRODUCTION_URL != null ? process.env.PRODUCTION_URL : "https://localhost:4080",
            deployUrl: "https://web2-labs.onrender.com",
            commentsData: [],
            tableData: {},
            fixturesData: {},
            resultsData: {},
            userRole: "",
        }
    },
    actions: {

    },
})