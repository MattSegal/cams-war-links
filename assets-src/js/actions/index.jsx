import axios from 'axios'

const types = {
    SET_ACTIVE_USER: 'SET_ACTIVE_USER',

    // Load links
    REQUEST_LINKS: 'REQUEST_LINKS',
    RECEIVE_LINKS: 'RECEIVE_LINKS',

    // Add a new link
    POST_NEW_LINK: 'POST_NEW_LINK',
    RECEIVE_NEW_LINK: 'RECEIVE_NEW_LINK',

    // Delete a link
    TRY_DELETE_LINK: 'TRY_DELETE_LINK',
    CANCEL_DELETE_LINK: 'CANCEL_DELETE_LINK',
    REQUEST_DELETE_LINK: 'REQUEST_DELETE_LINK',
    RECEIVE_DELETE_LINK: 'RECEIVE_DELETE_LINK',

}

const setActiveUser = (user_id) => ({
    type: types.SET_ACTIVE_USER,
    user_id: user_id
})

// Add Link
const addNewLink = (link) => (dispatch) => {
    dispatch(postNewLink())
    return axios.post('api/link/',link)
        .then( response => response.data)
        .then( link => dispatch(receiveNewLink(link)))
        .catch( error => handleHttpError(types.POST_NEW_LINK, error))
}

const postNewLink = () => ({
    type: types.POST_NEW_LINK
})

const receiveNewLink = (link) => ({
    type: types.RECEIVE_NEW_LINK,
    link: link,
})

// Delete Link
const tryDeleteLink = (link_id) => ({
    type: types.TRY_DELETE_LINK,
    link_id: link_id,
})

const cancelDeleteLink = (link_id) => ({
    type: types.CANCEL_DELETE_LINK,
    link_id: link_id,
})

const confirmDeleteLink = (link_id) => (dispatch) => {
    dispatch(requestDeleteLink(link_id))
    return axios.delete(`api/link/${link_id}/`)
        .then( response => dispatch(receiveDeleteLink(link_id)))
        .catch( error => handleHttpError(types.DELETE_LINK, error))
}

const requestDeleteLink = (link_id) => ({
    type: types.REQUEST_DELETE_LINK,
    link_id,
})

const receiveDeleteLink = (link_id) => ({
    type: types.RECEIVE_DELETE_LINK,
    link_id,
})

// Fetch Links
const fetchLinks = () => (dispatch) => {
    dispatch(requestLinks())
    return axios.get('api/link/')
        .then( response => response.data)
        .then( links => dispatch(receiveLinks(links)))
        .catch( error => handleHttpError(types.REQUEST_LINKS,error))
}

const requestLinks = () => ({
    type: types.REQUEST_LINKS,
})

const receiveLinks = (links) => ({
    type: types.RECEIVE_LINKS,
    links: links
})

const handleHttpError = (actionName, error) => {
    console.log(`#{actionName} Error`)
    if (error.response) 
    {
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)
    } 
    else 
    {
        console.log(error.message)
    }
    console.log(error.config)
}

module.exports = {
    types,
    setActiveUser,
    fetchLinks,
    addNewLink,
    tryDeleteLink,
    cancelDeleteLink,
    confirmDeleteLink,
}