import axios from 'axios'
import Cookies from 'js-cookie'
import {types} from './types'
import {handleHttpError} from './utils'

export const addLink = (link) => (dispatch) => {
    dispatch(requestAddLink())
    let csrftoken = Cookies.get('csrftoken')
    return axios.post('/api/link/',link, {headers:{'X-CSRFToken': csrftoken}})
        .then( response => response.data)
        .then( link => dispatch(receiveAddLink(link)))
        .catch( error => {
            handleHttpError('Add Link', error)
            dispatch(errorAddLink())
        })
}

export const requestAddLink = () => ({
    type: types.REQUEST_ADD_LINK
})

export const receiveAddLink = (link) => ({
    type: types.RECEIVE_ADD_LINK,
    link: link,
})

export const errorAddLink = () => ({
    type: types.ERROR_ADD_LINK,
}) 
