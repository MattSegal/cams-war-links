import axios from 'axios'
import Cookies from 'js-cookie'

module.exports = {
  link: {
    search: query => axios({
      url: '/api/search/?query=' + encodeURIComponent(query),
      method: 'get',
    }),
    fetch: () => axios({
      url: '/api/link/',
      method: 'get',
    }),
    add: link => axios({
      url: '/api/link/',
      method: 'post',
      data: link,
      headers: {'X-CSRFToken': Cookies.get('csrftoken')},
    }),
    delete: link => axios({
      url: `/api/link/${link.id}/`,
      method: 'delete',
      data: {},
      headers: {'X-CSRFToken': Cookies.get('csrftoken')},
    }),
    edit: link => axios({
      url: `/api/link/${link.id}/`,
      method: 'put',
      data: link,
      headers: {'X-CSRFToken': Cookies.get('csrftoken')},
    }),
  },
  bookmark: {
    add: link => axios({
      url: `/api/bookmark/${link.id}/`,
      method: 'post',
      data: {},
      headers: {'X-CSRFToken': Cookies.get('csrftoken')},
    }),
    delete: link => axios({
      url: `/api/bookmark/${link.id}/`,
      method: 'delete',
      data: {},
      headers: {'X-CSRFToken': Cookies.get('csrftoken')},
    }),
  }
}
