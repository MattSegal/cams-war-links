import axios from 'axios'
import Cookies from 'js-cookie'
import {types} from './types'
import {ACTIVE, INACTIVE} from 'constants'
import {handleHttpError} from './utils'

import {addLink} from './AddLink'
import {deleteLink} from './DeleteLink'
import {editLink} from './EditLink'
import {fetchLinks} from './FetchLinks'
import {bookmarkLink} from './BookmarkLink'
import {toggleSidebar} from './ToggleSidebar'
import {scrollLinksBottom} from './ScrollLinks'


const setActiveUser = (user_id) => ({
    type: types.SET_ACTIVE_USER,
    user_id: user_id
})

module.exports = {
    types,
    setActiveUser,
    addLink,
    deleteLink,
    editLink,
    fetchLinks,
    bookmarkLink,
    toggleSidebar,
    scrollLinksBottom,
}