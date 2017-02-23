import {pipe} from 'utilities'
import { requestNewLinkReducer, receiveNewLinkReducer } from './NewLink'
import { requestLinksReducer, receiveLinksReducer } from './GetLinks'
import {activeUserReducer} from './ActiveUser'
import {deleteLinkReducer} from './DeleteLink'


const reducer = (state,action) =>
    pipe(
        requestNewLinkReducer(action),
        receiveNewLinkReducer(action),
        deleteLinkReducer(action),
        requestLinksReducer(action),
        receiveLinksReducer(action),
        activeUserReducer(action)
    )(state)


module.exports = reducer