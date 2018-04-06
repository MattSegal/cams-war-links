import {expect} from 'chai'
import {NO_USER_SELECTED, OPEN, WAITING, CLOSED, ACTIVE, INACTIVE} from 'constants'
import {requestLinks, receiveLinks, fetchError} from 'actions'
import {getLinksReducer} from 'reducers/GetLinks'

describe("get links reducer", () => 
{
  context("request get links", () => 
  {
    let initial = {
      links: {
        isFetching: false,
      }
    }

    let action = requestLinks()
    let result = getLinksReducer(action)(initial)

    it("enters fetching state", () => 
    expect(result['links']['isFetching'])
    .to.equal(true))
  })

  context("receive get links", () => 
  {
    let initial = {
      links: {
        isFetching: true,
        items: [{
          id: 1,
          user: 68,
          title: "Why We Love (Are) Sociopaths",
          url: "http://thelastpsychiatrist.com/2012/04/why_we_love_sociopaths.html",
          created: "2017-03-09T11:06:30.831000Z",
          description: ""
        }]
      }
    }

    let newLinks = [
      {
        id: 2,
        user: 68,
        title: "Breaking Chestersons Fence",
        url: "http://meteuphoric.wordpress.com/2015/09/06/mistakes-3-breaking-chestertons-fence-in-the-presence-of-bull/",
        created: "2017-03-09T11:06:30.831000Z",
        description: ""
      },
      {
        id: 3,
        user: 68,
        title: "James Mickens, the funniest person in Microsoft Re",
        url: "http://programmingisterrible.com/post/72437339273/james-mickens-the-funniest-person-in-microsoft",
        created: "2017-03-09T11:06:30.831000Z",
        description: ""
      }
    ]

    let action = receiveLinks(newLinks)
    let result = getLinksReducer(action)(initial)

    it("exits fetching state", () => 
    expect(result['links']['isFetching'])
    .to.equal(false))

    it("deletes old link", () => 
    expect(result['links']['items'][0]['id'])
    .to.not.equal(1))

    it("updates new links", () => 
    expect(result['links']['items'])
    .to.deep.equal([
      {
        ...newLinks[0],
        status: {edit: CLOSED, delete: CLOSED, details: CLOSED},
        bookmark: INACTIVE
      },
      {
        ...newLinks[1],
        status: {edit: CLOSED, delete: CLOSED, details: CLOSED},
        bookmark: INACTIVE
      }
    ]))
  })
})