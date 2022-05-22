export const state = () => ({
    pageTitle: 'Dashboard',
})

export const mutations = {
    setPageTitle(state, title) {
        state.pageTitle = title
    }
}

export const actions = {}