import {expect} from 'chai'
import {NO_USER_SELECTED, OPEN, WAITING, CLOSED, ACTIVE, INACTIVE} from 'constants'
import {tryAddLink, cancelAddLink, requestAddLink, receiveAddLink, errorAddLink} from 'actions'
import {addLinkReducer} from 'reducers/AddLink'

describe("add link reducer", () => 
{
    context("try add a link", () => 
    {
        let initial = {
            links: {
                add: CLOSED,
                items: [{
                    status: {edit: OPEN, delete: OPEN, details: OPEN},
                    bookmark: ACTIVE
                }]
            }
        }

        let action = tryAddLink()
        let result = addLinkReducer(action)(initial)

        it("opens add links dialogue", () => 
        expect(result['links']['add'])
        .to.equal(OPEN))

        it("closes all link dialogues", () => 
        expect(result['links']['items'][0])
        .to.deep.equal({
            status: {edit: CLOSED, delete: CLOSED, details: CLOSED},
            bookmark: ACTIVE
        }))

    })
})