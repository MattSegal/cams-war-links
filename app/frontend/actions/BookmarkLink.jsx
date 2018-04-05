import axios from 'axios'
import Cookies from 'js-cookie'
import {types} from './types'
import {handleHttpError} from './utils'

export const addBookmark = link => callBookmarkAPI('post', link)
export const removeBookmark = link => callBookmarkAPI('delete', link)

const callBookmarkAPI = (method, link) => dispatch => {
  dispatch(requestBookmarkLink(link.id))
  return axios({
    url: `/api/bookmark/${link.id}/`,
    method: method,
    data: {},
    headers: {'X-CSRFToken': Cookies.get('csrftoken')},
  })
  .then( response => dispatch(receiveBookmarkLink(link.id, response.data)))
  .catch( error => {
    handleHttpError('Bookmark Link', error)
    dispatch(errorBookmarkLink(link.id))
  })
}

export const requestBookmarkLink = (link_id) => ({
  type: types.REQUEST_BOOKMARK_LINK,
  link_id,
})


export const receiveBookmarkLink = (link_id, user) => ({
  type: types.RECEIVE_BOOKMARK_LINK,
  link_id,
  user,
})


export const errorBookmarkLink = (link_id) => ({
  type: types.ERROR_BOOKMARK_LINK,
  link_id,
})
