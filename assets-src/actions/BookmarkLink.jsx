// Bookmark links
// const tryBookmarkLink = (link) => (dispatch) => {
//     dispatch(requestBookmarkLink(link.id))
//     let csrftoken = Cookies.get('csrftoken')
//     return axios.post(`api/link/${link.id}/bookmark`, newBookmarkStatus, {headers: {'X-CSRFToken': csrftoken}})
//         .then( response => dispatch(receiveBookmarkLink(link)))
//         .catch( error => {
//             handleHttpError('Bookmark Link', error)
//             dispatch(errorBookmarkLink)
//         })
// }

// const requestBookmarkLink = (link_id) => ({
//     type: types.REQUEST_BOOKMARK_LINK,
//     link_id,
// })

// const receiveBookmarkLink = (link) => ({
//     type: types.RECEIVE_BOOKMARK_LINK,
//     link,
// })

// const errorBookmarkLink = () => ({
//     type: types.ERROR_BOOKMARK_LINK,
// })
