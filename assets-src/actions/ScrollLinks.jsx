import axios from 'axios'

import {types} from './types'
import {handleHttpError} from './utils'
import {fetchError} from './FetchLinks'

export const scrollLinksBottom = () => (dispatch, getState) => {
    // Extend scroll bar
    dispatch({type: types.SCROLL_LINKS_BOTTOM})

    // Check value of 'next' and if no 'next' - just bail
    const { links } = getState()
    if (!links.next) {
      return
    }

    return axios.get(links.next)
        .then( response => response.data)
        .then( links => dispatch(receivePagedLinks(links)))
        .catch( error => handleHttpError('Fetch paged Links', error, fetchError))
}

const receivePagedLinks = (links) => ({
    type: types.RECEIVE_PAGED_LINKS,
    links: links
})
