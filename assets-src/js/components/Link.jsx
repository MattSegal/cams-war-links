import React, {PropTypes, Component} from 'react';

class Link extends Component 
{
    static propTypes = {
        id: PropTypes.number,
        title: PropTypes.string,
        url: PropTypes.string,
        user: PropTypes.string
    }

    render() 
    {
        return (
            <li>
                <a href={this.props.url}>
                    {this.props.title}
                </a>
            </li>
        )
    }
}

module.exports = Link