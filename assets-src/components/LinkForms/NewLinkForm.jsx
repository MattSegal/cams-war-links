import React, {PropTypes, Component} from 'react';
import {OPEN, WAITING, CLOSED} from 'constants'
import {connect} from 'react-redux'
import LinkForm from 'components/LinkForms/LinkForm'


class NewLinkForm extends Component
{
    static propTypes = {
        addLink: PropTypes.object,
        addFormStatus: PropTypes.string,
    }

    render()
    {
        if (this.props.addFormStatus === 'OPEN') 
        {
            return (<LinkForm formStatus={this.props.addFormStatus} {...this.props.addLink} />)
        }
        else
        {
            return null
        }
    }
}

let mapStateToProps = (state) => ({
    newLinkFormStatus: state.links.add,
})

module.exports = connect(
    mapStateToProps
)(NewLinkForm)