const setActiveUser = (username) => ({
    type: 'SET_ACTIVE_USER',
    username: username
})

module.exports = {
    setActiveUser: setActiveUser,
}