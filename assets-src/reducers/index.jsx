import {pipe} from 'utilities'
import {getLinksReducer} from './GetLinks'
import {activeUserReducer} from './ActiveUser'
import {deleteLinkReducer} from './DeleteLink'
import {editLinkReducer} from './EditLink'
import {addLinkReducer} from './AddLink'
import {linkDetailsReducer} from './ShowDetails'

const reducer = (state,action) =>
    pipe(
        addLinkReducer(action),
        deleteLinkReducer(action),
        editLinkReducer(action),
        getLinksReducer(action),
        activeUserReducer(action),
        linkDetailsReducer(action)
    )(state)


module.exports = reducer