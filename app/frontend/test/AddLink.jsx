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

    context("cancel adding a link", () => 
    {
        let initial = {
            links: {
                add: OPEN,
                items: [{
                    status: {edit: CLOSED, delete: CLOSED, details: CLOSED},
                    bookmark: ACTIVE
                }]
            }
        }

        let action = cancelAddLink()
        let result = addLinkReducer(action)(initial)

        it("closes add links dialogue", () => 
        expect(result['links']['add'])
        .to.equal(CLOSED))

        it("doesn't remove link dialogues", () => 
        expect(result['links']['items'][0])
        .to.deep.equal(initial['links']['items'][0]))
    })

    context("request adding a link", () => 
    {
        let initial = {
            links: {
                add: OPEN,
                items: [{
                    status: {edit: CLOSED, delete: CLOSED, details: CLOSED},
                    bookmark: ACTIVE
                }]
            }
        }
       
        let action = requestAddLink()
        let result = addLinkReducer(action)(initial)

        it("enters closed state", () => 
        expect(result['links']['add'])
        .to.equal(WAITING))
    })

    context("get response from adding a link", () => 
    {
        let initial = {
            links: {
                add: WAITING,
                items: [{
                    id: 1,
                    status: {edit: CLOSED, delete: CLOSED, details: CLOSED},
                    bookmark: ACTIVE
                }]
            }
        }
        let newLink = {
            id: 2,
            title: 'Test Link',
            url: 'http://www.example.com',
            description: '',
        }

        let action = receiveAddLink(newLink)
        let result = addLinkReducer(action)(initial)

        it("enters closed state", () => 
        expect(result['links']['add'])
        .to.equal(CLOSED))

        it("doesn't remove link dialogues", () => 
        expect(result['links']['items'][0])
        .to.deep.equal(initial['links']['items'][0]))

        it("adds a new link", () => 
        expect(result['links']['items'][1])
        .to.deep.equal({
            ...newLink,
            status: {edit: CLOSED, delete: CLOSED, details: CLOSED},
            bookmark: INACTIVE // TODO: Fix this
        }))
    })

    context("error when adding a link", () => 
    {
        let initial = {
            links: {
                add: WAITING,
                items: [{
                    status: {edit: CLOSED, delete: CLOSED, details: CLOSED},
                    bookmark: ACTIVE
                }]
            }
        }
       
        let action = errorAddLink()
        let result = addLinkReducer(action)(initial)

        it("enters closed state", () => 
        expect(result['links']['add'])
        .to.equal(CLOSED))
    })
})
