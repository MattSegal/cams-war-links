/*
    State Tree

    store {
        links {
            items: [link]
            updating: bool
        }

        users {
            items: [user]
            activeUserId: int
        }

        nav {
            scrollCount: int
            sidebar: bool
        }
        loggedInUser: user
    }

    link {
        id: int
        created: string
        description: string
        title: string
        url: string
        user: int
        updating: bool
    }

    user {
        id: int
        username: string
        bookmarks: [int]
    }
*/

import {NO_USER_SELECTED, SCROLL_COUNT_INITIAL} from 'constants'

const initialiseState = (state) => ({
    ...state,

    links: {
      ...(state.links),
      updating: false,
      items: state.links.items.map(link => ({
        ...link,
        updating: false,
      })),
    },

    users: {
        ...(state.users),
        activeUserId: NO_USER_SELECTED,
    },

    nav: {
        scrollCount: SCROLL_COUNT_INITIAL,
        sidebar: false,
    }

})

module.exports = initialiseState
