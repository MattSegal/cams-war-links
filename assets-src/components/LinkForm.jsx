import React, {PropTypes, Component} from 'react'
import {Link} from 'react-router-dom'
import FaPencil from 'react-icons/lib/fa/pencil'
import FaClose from 'react-icons/lib/fa/close'

// Wrong style
import style from 'components/LinkModal.scss'


export default class LinkForm extends Component 
{
  static propTypes = {
    state: PropTypes.object,
    backToURL: PropTypes.string,
    setState: PropTypes.func,
    action: PropTypes.func,
  }

  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        push: PropTypes.func.isRequired,
      }).isRequired
    }).isRequired
  }

  constructor(props) 
  {
    super(props)
    this.cancelDialogue = this.cancelDialogue.bind(this)
    this.submitAction = this.submitAction.bind(this)
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleUrlChange = this.handleUrlChange.bind(this)
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
  }

  submitAction() {
    const { history } = this.context.router
    this.props.action()
    // TODO: dispatch this in react-redux-router
    history.push(this.props.backToURL)
  }

  cancelDialogue(event) {
    const { history } = this.context.router
    if (event.key === 'Escape' || event.keyCode === 27) {
      event.stopPropagation()
      // TODO: dispatch this in react-redux-router
      history.push(this.props.backToURL)
    }
  }

  handleTitleChange(event) 
  {
    this.props.setState({
        ...this.props.state,
        title: event.target.value
    })
  }

  handleUrlChange(event) 
  {
    this.props.setState({
        ...this.props.state,
        url: event.target.value
    })
  }

  handleDescriptionChange(event) 
  {
    this.props.setState({
        ...this.props.state,
        description: event.target.value
    })
  }

  render() {
    const {backToURL} = this.props
    const confirmWithEnter = e => e.key === 'Enter' && this.submitAction()
    return (
      <div>
        <div className={style.btnWrapper}>
          <button className={style.btn} onClick={this.submitAction}><FaPencil />&nbsp;Submit</button>
          <Link to={backToURL}>
            <button className={style.btn}><FaClose />&nbsp;Cancel</button>
          </Link>
        </div>
        <div className={style.form}>
          <div className={style.input}>
              <input 
                  autoFocus
                  type="text" 
                  placeholder="Title"
                  value={this.props.state.title} 
                  onChange={this.handleTitleChange}
                  onKeyPress={confirmWithEnter}
                  onKeyDown={this.cancelDialogue}
              />
          </div>
          <div className={style.input}>
              <input 
                  type="text"
                  placeholder="URL"
                  value={this.props.state.url} 
                  onChange={this.handleUrlChange} 
                  onKeyPress={confirmWithEnter}
                  onKeyDown={this.cancelDialogue}
              />
          </div>
          <div className={style.input}>
              <textarea 
                  type="text"
                  rows="3"
                  placeholder="Description (Optional)"
                  value={this.props.state.description} 
                  onChange={this.handleDescriptionChange} 
                  onKeyPress={confirmWithEnter}
                  onKeyDown={this.cancelDialogue}
              />
          </div>
        </div>   
      </div> 
    )
  }
}

