import axios from 'axios'
import Cookies from 'js-cookie'
import {types} from './types'
import {handleHttpError} from './utils'

export const fetchLinks = () => (dispatch) => {
    dispatch(requestLinks())
    return axios.get('api/link/')
        .then( response => response.data)
        .then( links => dispatch(receiveLinks(links)))
        .catch( error => handleHttpError('Fetch Links', error, fetchError))
}

export const requestLinks = () => ({
    type: types.REQUEST_LINKS,
})

export const receiveLinks = (links) => ({
    type: types.RECEIVE_LINKS,
    links: links
})

export const fetchError = () => ({
    type: types.ERROR_LINKS,
})