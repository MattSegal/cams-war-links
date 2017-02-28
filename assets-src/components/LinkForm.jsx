import React, {PropTypes, Component} from 'react';
import {OPEN, WAITING, CLOSED} from 'constants'
import {connect} from 'react-redux'
import style from 'components/LinkForm.scss'
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

    confirm = () =>
    {
        let link = {
            title: this.state.title,
            url: this.state.url,
            description: this.state.description,
            user: this.props.currentUser.id,
        }
        console.log(link)
        if (this.props.linkId >= 0)
        {
            link['id'] = this.props.linkId
        }

        this.props.confirm(link)
    }

    render()
    {
        let isDialogueOpen = this.props.formStatus === OPEN
        if (!isDialogueOpen) {return null}

        let cancel = () => this.props.cancel(this.props.linkId) 

        return (
            <div className={style.form}>
                <div className={style.input}>
                    <input 
                        type="text" 
                        placeholder="Title"
                        value={this.state.title} 
                        onChange={this.handleTitleChange} 
                    />
                </div>

                <div className={style.input}>
                    <input 
                        type="text"
                        placeholder="URL"
                        value={this.state.url} 
                        onChange={this.handleUrlChange} 
                    />
                </div>
                <div className={style.input}>
                    <textarea 
                        rows="1" 
                        type="text" 
                        placeholder="Description (Optional)"
                        value={this.state.description} 
                        onChange={this.handleDescriptionChange} 
                    />
                </div>
                <div>
                    <div className={style.button} onClick={this.confirm}><FaCheck /></div>
                    <div className={style.button} onClick={cancel}><FaClose /></div>
                </div>
            </div>
        )
    }
}

module.exports = LinkForm

let mapStateToProps = (state) => ({
    currentUser: state.currentUser,
})

module.exports = connect(
    mapStateToProps
)(LinkForm)