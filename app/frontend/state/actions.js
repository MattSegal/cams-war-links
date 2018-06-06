import axios from 'axios'

import api from './api'


const handleHttpError = (actionName, error) => {
    console.warn(`${actionName} Error: `)
    if (error.response) {
      console.warn('HTTP Error')
      console.warn('Data: ', error.response.data)
      console.warn('Status: ', error.response.status)
      console.warn('Headers: ', error.response.headers)
      console.warn('Config: ', error.config)
    }
    else {
      throw error
    }
}


module.exports = {
  // Redux's store.dispatch is aliased to 'd' for brevity
  searchLinks: query => d => {
    d({type: 'REQUEST_SEARCH'})
    return api.link.search(query)
      .then( r => r.data)
      .then( data => d({type: 'RECEIVE_SEARCH', data: data}))
      .catch( error => {
        handleHttpError('Search', error)
        d({type: 'ERROR_SEARCH'})
      })
  },
  scrollLinksBottom: () => (d, getState) => {
    // Extend scroll bar
    d({type: 'SCROLL_LINKS_BOTTOM'})

    // Check value of 'next' and if no 'next' - just bail
    const { links } = getState()
    if (!links.next) {
      return
    }
    return axios.get(links.next)
      .then( r => r.data)
      .then( links => d({type: 'RECEIVE_PAGED_LINKS', links: links}))
      .catch( error => handleHttpError('Fetch paged Links', error))
  },
  fetchLinks: () => d => {
    d({type: 'REQUEST_LINKS'})
    return api.link.fetch()
      .then( response => response.data)
      .then( links => d({type: 'RECEIVE_LINKS', links: links}))
      .catch( error => {
        handleHttpError('Fetch Links', error)
        d({type: 'ERROR_LINK_LIST'})
      })
  },
  addLink: link => d => {
    d({type: 'REQUEST_LINKS'})
    return api.link.add(link)
      .then(r => r.data)
      .then(link => d({type: 'RECEIVE_ADD_LINK', link: link}))
      .catch(error => {
        handleHttpError('Add Link', error)
        d({type: 'ERROR_LINK_LIST'})
      })
  },
  deleteLink: link => d => {
    d({type: 'REQUEST_LINK', link})
    return api.link.delete(link)
      .then( response => d({type: 'RECEIVE_DELETE_LINK', link}))
      .catch( error => {
        handleHttpError('Delete Link', error)
        d({type: 'ERROR_LINK_SPECIFIC', link})
      })
  },
  editLink: link => d => {
    d({type: 'REQUEST_LINK', link})
    return api.link.edit(link)
      .then( response => d({type: 'RECEIVE_EDIT_LINK', link}))
      .catch( error => {
          handleHttpError('Edit Link', error)
          d({type: 'ERROR_LINK_SPECIFIC', link})
      })
  },
  addBookmark: link => d => {
    d({type: 'REQUEST_BOOKMARK_LINK', link})
    return api.bookmark.add(link)
    .then(r => d({
      type: 'RECEIVE_BOOKMARK_LINK',
      user: r.data,
      link,
    }))
    .catch(error => {
      handleHttpError('Bookmark Link', error)
      d({type: 'ERROR_BOOKMARK_LINK', link})
    })
  },
  removeBookmark: link => d => {
    d({type: 'REQUEST_BOOKMARK_LINK', link})
    return api.bookmark.delete(link)
    .then(r => d({
      type: 'RECEIVE_BOOKMARK_LINK',
      user: r.data,
      link,
    }))
    .catch(error => {
      handleHttpError('Bookmark Link', error)
      d({type: 'ERROR_BOOKMARK_LINK', link})
    })
  },
}
