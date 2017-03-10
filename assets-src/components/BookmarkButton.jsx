import React, {PropTypes, Component} from 'react';
import style from 'components/Link.scss'
import {ACTIVE, INACTIVE} from 'constants'
import FaBookmark from 'react-icons/lib/fa/bookmark'
import FaBookmarkO from 'react-icons/lib/fa/bookmark-o'


class BookmarkButton extends Component 
{
    static propTypes = {
        linkId: React.PropTypes.number,
        status: PropTypes.string,
        mark: PropTypes.func,
        unmark: PropTypes.func,
    }

    render() 
    {
        let mark = () => this.props.mark(this.props.linkId) 
        let unmark = () => this.props.unmark(this.props.linkId) 

        const toRead = this.props.status === ACTIVE
            ? (<span onClick={unmark}><FaBookmark /></span>)
            : null

        const notToRead = this.props.status === INACTIVE
            ? (<span onClick={mark} ><FaBookmarkO /></span>)
            : null

        return (
            <span className={style.button}>
                {toRead}
                {notToRead}
            </span>
        )
    }
}

module.exports = BookmarkButton