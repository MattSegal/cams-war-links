import React, {PropTypes, Component} from 'react';

class NewLinkForm extends Component
{
    static propTypes = {
        onAddLink: PropTypes.func,
    }

    render()
    {
        return (<button>Submit</button>)
    }
}

module.exports = NewLinkForm