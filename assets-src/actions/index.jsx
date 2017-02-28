import axios from 'axios'
import Cookies from 'js-cookie'
import {types} from './types'

const setActiveUser = (user_id) => ({
    type: types.SET_ACTIVE_USER,
    user_id: user_id
})

// Link details
const showLinkDetails = (link_id) => ({
    type: types.SHOW_LINK_DETAILS,
    link_id,
})


const hideLinkDetails = (link_id) => ({
    type: types.HIDE_LINK_DETAILS,
    link_id,
})


// Add Link
const tryAddLink = () => ({
    type: types.TRY_ADD_LINK,
})


const cancelAddLink = () => ({
    type: types.CANCEL_ADD_LINK,
})


const confirmAddLink = (link) => (dispatch) => {
    dispatch(requestAddLink())
    let csrftoken = Cookies.get('csrftoken')
    return axios.post('api/link/',link, {headers:{'X-CSRFToken': csrftoken}})
        .then( response => response.data)
        .then( link => dispatch(receiveAddLink(link)))
        .catch( error => {
            handleHttpError('Add Link', error)
            dispatch(errorAddLink())
        })
}


const requestAddLink = () => ({
    type: types.REQUEST_ADD_LINK
})


const receiveAddLink = (link) => ({
    type: types.RECEIVE_ADD_LINK,
    link: link,
})


const errorAddLink = () => ({
    type: types.ERROR_ADD_LINK,
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
    let csrftoken = Cookies.get('csrftoken')
    return axios.delete(`api/link/${link_id}/`, {headers:{'X-CSRFToken': csrftoken}})
        .then( response => dispatch(receiveDeleteLink(link_id)))
        .catch( error => {
            handleHttpError('Delete Link', error)
            dispatch(errorDeleteLink)
        })
}


const requestDeleteLink = (link_id) => ({
    type: types.REQUEST_DELETE_LINK,
    link_id,
})


const receiveDeleteLink = (link_id) => ({
    type: types.RECEIVE_DELETE_LINK,
    link_id,
})


const errorDeleteLink = () => ({
    type: types.ERROR_DELETE_LINK,
})

// Edit Link
const tryEditLink = (link_id) => ({
    type: types.TRY_EDIT_LINK,
    link_id,
})

const cancelEditLink = (link_id) => ({
    type: types.CANCEL_EDIT_LINK,
    link_id,
})

const confirmEditLink = (link) => (dispatch) => {
    dispatch(requestEditLink(link.id))
    let csrftoken = Cookies.get('csrftoken')
    return axios.put(`api/link/${link.id}/`, link, {headers: {'X-CSRFToken': csrftoken}})
        .then( response => dispatch(receiveEditLink(link)))
        .catch( error => {
            handleHttpError('Edit Link', error)
            dispatch(errorEditLink)
        })
}

const requestEditLink = (link_id) => ({
    type: types.REQUEST_EDIT_LINK,
    link_id,
})

const receiveEditLink = (link) => ({
    type: types.RECEIVE_EDIT_LINK,
    link,
})

const errorEditLink = () => ({
    type: types.ERROR_EDIT_LINK,
})


// Fetch Links
const fetchLinks = () => (dispatch) => {
    dispatch(requestLinks())
    return axios.get('api/link/')
        .then( response => response.data)
        .then( links => dispatch(receiveLinks(links)))
        .catch( error => handleHttpError('Fetch Links', error, fetchError))
}

const requestLinks = () => ({
    type: types.REQUEST_LINKS,
})

const receiveLinks = (links) => ({
    type: types.RECEIVE_LINKS,
    links: links
})

const fetchError = () => ({
    type: types.ERROR_LINKS,
})

const handleHttpError = (actionName, error,) => {
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

    // Add
    tryAddLink,
    cancelAddLink,
    confirmAddLink,

    // Delete
    tryDeleteLink,
    cancelDeleteLink,
    confirmDeleteLink,

    // Edit
    tryEditLink,
    cancelEditLink,
    confirmEditLink,

    // Link Details
    showLinkDetails,
    hideLinkDetails,
}