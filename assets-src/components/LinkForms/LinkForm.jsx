import React, {PropTypes, Component} from 'react';
import {OPEN, WAITING, CLOSED} from 'constants'
import {connect} from 'react-redux'
import style from 'components/LinkForms/LinkForm.scss'
import FaClose from 'react-icons/lib/fa/close'
import FaCheck from 'react-icons/lib/fa/check'


class LinkForm extends Component
{
    constructor(props) 
    {
        super(props)
        this.state = {title: this.props.title, url: this.props.url, description: this.props.description}
        this.handleTitleChange = this.handleTitleChange.bind(this)
        this.handleUrlChange = this.handleUrlChange.bind(this)
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
    }

    static propTypes = {
        linkId: PropTypes.number,
        title: PropTypes.string,
        url: PropTypes.string,
        description: PropTypes.string,
        formStatus: PropTypes.string,
        cancel: PropTypes.func,
        confirm: PropTypes.func,
    }

    static defaultProps = {
        linkId: -1,
        title: '',
        url: '',
        description: '',
    }

    confirm = () =>
    {
        let link = {
            title: this.state.title,
            url: this.state.url,
            description: this.state.description,
            user: this.props.loggedInUser.id,
        }
        console.log(link)
        if (this.props.linkId >= 0)
        {
            link['id'] = this.props.linkId
        }

        this.props.confirm(link)
    }

    handleTitleChange(event) 
    {
        this.setState({
            ...this.state,
            title: event.target.value
        })
    }

    handleUrlChange(event) 
    {
        this.setState({
            ...this.state,
            url: event.target.value
        })
    }

    handleDescriptionChange(event) 
    {
        this.setState({
            ...this.state,
            description: event.target.value
        })
    }

    render()
    {
        let isDialogueOpen = this.props.formStatus === OPEN
        if (!isDialogueOpen) {return null}

        const cancel = () => this.props.cancel(this.props.linkId) 
        const confirmWithEnter = e => e.key === 'Enter' && this.confirm()
        const cancelWithEnter = e => e.key === 'Enter' && this.props.cancel(this.props.linkId) 
        const cancelwithEsc = e => e.keyCode === 27 && this.props.cancel(this.props.linkId) 

        return (
            <div className={style.form}>
                <div className={style.input}>
                    <input 
                        autoFocus
                        type="text" 
                        placeholder="Title"
                        value={this.state.title} 
                        onChange={this.handleTitleChange}
                        onKeyPress={confirmWithEnter}
                        onKeyDown={cancelwithEsc}
                    />
                </div>

                <div className={style.input}>
                    <input 
                        type="text"
                        placeholder="URL"
                        value={this.state.url} 
                        onChange={this.handleUrlChange} 
                        onKeyPress={confirmWithEnter}
                        onKeyDown={cancelwithEsc}
                    />
                </div>
                <div className={style.input}>
                    <input 
                        type="text"
                        placeholder="Description (Optional)"
                        value={this.state.description} 
                        onChange={this.handleDescriptionChange} 
                        onKeyPress={confirmWithEnter}
                        onKeyDown={cancelwithEsc}
                    />
                </div>
                <div>
                    <div 
                        tabIndex="0" 
                        className={style.button} 
                        onClick={this.confirm}
                        onKeyPress={confirmWithEnter}
                    ><FaCheck /></div>
                    <div 
                        tabIndex="0" 
                        className={style.button} 
                        onClick={cancel}
                        onKeyPress={cancelWithEnter}
                    ><FaClose /></div>
                </div>
            </div>
        )
    }
}

module.exports = LinkForm

let mapStateToProps = (state) => ({
    loggedInUser: state.loggedInUser,
})

module.exports = connect(
    mapStateToProps
)(LinkForm)