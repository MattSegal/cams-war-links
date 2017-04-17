import axios from 'axios'
import Cookies from 'js-cookie'
import {types} from './types'
import {handleHttpError} from './utils'

export const bookmarkLink = (link, user, value) => (dispatch) => {
  const updatedUser = {
    ...user,
    bookmarks: value
      ? [...(user.bookmarks), link.id]
      : user.bookmarks.filter(id => id !== link.id)
  }

  dispatch(requestBookmarkLink(link.id))
  let csrftoken = Cookies.get('csrftoken')
  return axios
  .put(`/api/user/${user.id}/`, updatedUser, {headers:{'X-CSRFToken': csrftoken}})
  .then( response => {
    dispatch(receiveBookmarkLink(link, updatedUser))
  })
  .catch( error => {
    handleHttpError('Bookmark Link', error)
    dispatch(errorBookmarkLink(link.id))
  })
}

export const requestBookmarkLink = (link_id) => ({
  type: types.REQUEST_BOOKMARK_LINK,
  link_id,
})


export const receiveBookmarkLink = (link, user) => ({
  type: types.RECEIVE_BOOKMARK_LINK,
  link,
  user,
})


export const errorBookmarkLink = (link_id) => ({
  type: types.ERROR_BOOKMARK_LINK,
})