import axios from 'axios'
import Cookies from 'js-cookie'
import {types} from './types'
import handleHttpError from './utils'

export const editLink = (link) => (dispatch) => {
    dispatch(requestEditLink(link.id))
    let csrftoken = Cookies.get('csrftoken')
    return axios.put(`/api/link/${link.id}/`, link, {headers: {'X-CSRFToken': csrftoken}})
        .then( response => dispatch(receiveEditLink(link)))
        .catch( error => {
            handleHttpError('Edit Link', error)
            dispatch(errorEditLink)
        })
}

export const requestEditLink = (link_id) => ({
    type: types.REQUEST_EDIT_LINK,
    link_id,
})

export const receiveEditLink = (link) => ({
    type: types.RECEIVE_EDIT_LINK,
    link,
})

export const errorEditLink = () => ({
    type: types.ERROR_EDIT_LINK,
})