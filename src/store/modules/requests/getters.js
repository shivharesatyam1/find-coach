export default {
    requests(state, getters, rootState, rootGetters) {
        const coachId = rootGetters.userId;
        return state.requests.filter(req => req.coachId === coachId);
    },
    hasRequests(state, getter) {
        return getter.requests && getter.requests.length > 0;
    }
};