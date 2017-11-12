import axios from 'axios'
import Cookies from 'js-cookie'
import {types} from './types'
import {handleHttpError} from './utils'

export const fetchLinks = () => (dispatch, getState) => {
    // check value of 'next'
    // if no 'next' - just bail
    const { links } = getState()
    if (!links.next) {
      dispatch(resetLinkPagination())
      return
    }

    dispatch(requestLinks())
    return axios.get(links.next)
        .then( response => response.data)
        .then( links => dispatch(receiveLinks(links)))
        .then(() => dispatch(fetchLinks()))
        .catch( error => handleHttpError('Fetch Links', error, fetchError))
}

export const requestLinks = () => ({
    type: types.REQUEST_LINKS,
})

export const resetLinkPagination = () => ({
    type: types.RESET_LINKS_PAGINATION,
})

export const receiveLinks = (links) => ({
    type: types.RECEIVE_LINKS,
    links: links
})

export const fetchError = () => ({
    type: types.ERROR_LINKS,
})