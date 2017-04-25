import axios from 'axios'
import Cookies from 'js-cookie'
import {types} from './types'
import {handleHttpError} from './utils'

export const deleteLink = (link_id) => (dispatch) => {
    dispatch(requestDeleteLink(link_id))
    let csrftoken = Cookies.get('csrftoken')
    return axios.delete(`/api/link/${link_id}/`, {headers:{'X-CSRFToken': csrftoken}})
        .then( response => dispatch(receiveDeleteLink(link_id)))
        .catch( error => {
            handleHttpError('Delete Link', error)
            dispatch(errorDeleteLink)
        })
}

export const requestDeleteLink = (link_id) => ({
    type: types.REQUEST_DELETE_LINK,
    link_id,
})


export const receiveDeleteLink = (link_id) => ({
    type: types.RECEIVE_DELETE_LINK,
    link_id,
})


export const errorDeleteLink = () => ({
    type: types.ERROR_DELETE_LINK,
})