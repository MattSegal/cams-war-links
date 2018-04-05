import {expect} from 'chai'
import {NO_USER_SELECTED, CLOSED, OPEN} from 'constants'
import {setActiveUser} from 'actions'
import {activeUserReducer} from 'reducers/ActiveUser'

describe("active user reducer", () => 
{
    context("when no user is selected", () => 
    {
        let initial = {
            users: {
                activeUserId: NO_USER_SELECTED,
                items: [{id: 1, username: 'matt'}]
            },
            links: {
                add: OPEN,
            }
        }

        let action = setActiveUser(12)
        let result = activeUserReducer(action)(initial)

        it("selects a new user", () => 
        expect(result['users']['activeUserId'])
        .to.equal(12))

        it("doesn't destroy users", () => 
        expect(result['users']['items'])
        .to.deep.equal(initial['users']['items']))

        it("closes add links dialogue", () => 
        expect(result['links'])
        .to.deep.equal({
            add: CLOSED
        }))
    })

    context("when a user is selected", () => 
    {
        let initial = {
            users: {
                activeUserId: 12,
                items: [{id: 1, username: 'matt'}]
            }
        }

        let action = setActiveUser(7)
        let result = activeUserReducer(action)(initial)

        it("selects a new user", () => 
        expect(result['users']['activeUserId'])
        .to.equal(7))
    })

    context("when a user is re-selected", () => 
    {
        let initial = {
            users: {
                activeUserId: 12,
                items: [{id: 1, username: 'matt'}]
            }
        }

        let action = setActiveUser(12)
        let result = activeUserReducer(action)(initial)

        it("unselects the current user", () => 
        expect(result['users']['activeUserId'])
        .to.equal(NO_USER_SELECTED))

    })
})