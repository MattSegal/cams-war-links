import React, {PropTypes} from 'react';
import {OPEN, CLOSED} from 'constants'
import FaBook from 'react-icons/lib/fa/book'
import FaChain from 'react-icons/lib/fa/chain'

const BookmarkPageButton = props => 
{
    if (this.props.addFormStatus === OPEN)
    {
        return (<button onClick={this.props.select}><FaBook /></button>)
    }
    if (this.props.addFormStatus === CLOSED)
    {
        return (<button onClick={this.props.select}><FaChain /></button>)
    }
}
BookmarkPageButton.propTypes = {
    select: PropTypes.func,
    cancel: PropTypes.func,
    addFormStatus: PropTypes.string,
}

module.exports = BookmarkPageButton