import axios from 'axios'

const types = {
    SET_ACTIVE_USER: 'SET_ACTIVE_USER',
    REQUEST_LINKS: 'REQUEST_LINKS',
    RECEIVE_LINKS: 'RECEIVE_LINKS',
    POST_NEW_LINK: 'POST_NEW_LINK',
    RECEIVE_NEW_LINK: 'RECEIVE_NEW_LINK',
}

const setActiveUser = (user_id) => ({
    type: types.SET_ACTIVE_USER,
    user_id: user_id
})

// Add Link
const addNewLink = (link) => {
    dispatch(postNewLink())
    return axios.post('api/link/',link)
        .then( response => response.data)
        .then( link => dispatch(receiveNewLink(link)))
        .catch( error => console.log('addLink Error:',error,'Link:',link))
}

const postNewLink = () => ({
    type: types.POST_NEW_LINK
})

const receiveNewLink = (link) => ({
    type: types.RECEIVE_NEW_LINK,
    link: link,
})

// Fetch Links
const fetchLinks = () => (dispatch) => {
    dispatch(requestLinks())
    return axios.get('api/link/')
        .then( response => response.data)
        .then( links => dispatch(receiveLinks(links)))
        .catch( error => console.log('fetchLinks Error:',error))
}

const requestLinks = () => ({
    type: types.REQUEST_LINKS,
})

const receiveLinks = (links) => ({
    type: types.RECEIVE_LINKS,
    links: links
})

module.exports = {
    types: types,
    setActiveUser: setActiveUser,
    fetchLinks: fetchLinks,
    addNewLink: addNewLink,
}