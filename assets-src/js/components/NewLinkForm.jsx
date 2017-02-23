import React, {PropTypes, Component} from 'react';
import {NO_USER_SELECTED} from 'constants'

class NewLinkForm extends Component
{
    constructor(props) {
        super(props)
        this.state = {title: '', url: ''}

        this.handleTitleChange = this.handleTitleChange.bind(this)
        this.handleUrlChange = this.handleUrlChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    static propTypes = {
        onAddLink: PropTypes.func,
        activeUserId: PropTypes.number,
    }

    handleTitleChange(event) {
        this.setState({
            ...this.state,
            title: event.target.value
        })
    }

    handleUrlChange(event) {
        this.setState({
            ...this.state,
            url: event.target.value
        })
    }

    handleSubmit(event) {
        this.props.onAddLink({
            'title': this.state.title,
            'url': this.state.url,
            'user': this.props.activeUserId,
        })
        this.state = {title: '', url: ''}
        event.preventDefault()
    }

    render()
    {
        return (
            <form onSubmit={this.handleSubmit}>
                <br />
                <label>
                    Title
                    <input type="text" value={this.state.title} onChange={this.handleTitleChange} />
                </label>
                <br />
                <label>
                    URL
                    <input type="text" value={this.state.url} onChange={this.handleUrlChange} />
                </label>
                 <br />
            <input type="submit" value="Submit" />
            </form>
        )
    }
}

module.exports = NewLinkForm