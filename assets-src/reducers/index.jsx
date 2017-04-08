import {pipe} from 'utilities'
import {getLinksReducer} from './GetLinks'
import {activeUserReducer} from './ActiveUser'
import {deleteLinkReducer} from './DeleteLink'
import {editLinkReducer} from './EditLink'
import {addLinkReducer} from './AddLink'

const reducer = (state,action) =>
    pipe(
        addLinkReducer(action),
        deleteLinkReducer(action),
        editLinkReducer(action),
        getLinksReducer(action),
        activeUserReducer(action),
    )(state)


module.exports = reducer