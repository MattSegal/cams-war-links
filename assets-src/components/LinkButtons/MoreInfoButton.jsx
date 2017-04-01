import React, {PropTypes, Component} from 'react';
import style from 'components/Link.scss'
import {OPEN, WAITING, CLOSED} from 'constants'
import FaEyeSlash from 'react-icons/lib/fa/eye-slash'
import FaEye from 'react-icons/lib/fa/eye'

class MoreInfoButton extends Component 
{
    static propTypes = {
        linkId: React.PropTypes.number,
        status: PropTypes.string,
        show: PropTypes.func,
        hide: PropTypes.func,
    }

    render() 
    {
        let select = () => this.props.show(this.props.linkId) 
        let close = () => this.props.hide(this.props.linkId) 

        const seeMoreInfoButton = this.props.status === CLOSED
            ? (<span onClick={select}><FaEye /></span>)
            : null

        const closeMoreInfoButton = this.props.status === OPEN
            ? (<span onClick={close} ><FaEyeSlash /></span>)
            : null

        return (
            <span title="Description" className={style.button}>
                {seeMoreInfoButton}
                {closeMoreInfoButton}
            </span>
        )
    }
}

module.exports = MoreInfoButton