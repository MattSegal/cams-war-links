import React, {PropTypes, PureComponent} from 'react';
import style from 'components/SideNav.scss'
import FaClose from 'react-icons/lib/fa/close'
import FaUser from 'react-icons/lib/fa/user'
import FaCog from 'react-icons/lib/fa/cog'
import FaBook from 'react-icons/lib/fa/book'
import FaTag from 'react-icons/lib/fa/tag'
import FaChain from 'react-icons/lib/fa/chain'
import {Link} from 'react-router-dom'
import {NO_USER_SELECTED} from 'constants'


export default class SideNav extends PureComponent {
  static propTypes = {
    active: PropTypes.bool,
    users: PropTypes.array,
    loggedInName: PropTypes.string,
    isUserLoggedIn: PropTypes.bool,
    isNoActiveUser: PropTypes.bool,
    setActiveUser: PropTypes.func,
    toggleSidebar: PropTypes.func,
  }

  handleEscKeypress = (event) => {
    if (event.key === 'Escape' || event.keyCode === 27) {
      this.props.toggleSidebar()
    }
  }

  render()
  {
    const {
      users, 
      toggleSidebar,
      setActiveUser,
      isNoActiveUser,
      loggedInName,
      isUserLoggedIn,
      active
    } = this.props

    if (active) {
      document.addEventListener('keydown',this.handleEscKeypress)
    } else {
      document.removeEventListener('keydown',this.handleEscKeypress)
    }

    return (
      <div>
        <div onClick={toggleSidebar} className={`${style.sideNavBackground} ${active && style.active}`} />
        <div className={`${style.sideNav} ${active && style.active}`}>
          <div className={style.header}>
            Links - {loggedInName}<FaClose onClick={toggleSidebar} className={style.rightIcon}/>
          </div>
          <Link to="/" onClick={toggleSidebar}>
            <div 
              onClick={() => setActiveUser(NO_USER_SELECTED)}
              className={`${style.row} ${isNoActiveUser && style.active}`}
            >
              <FaChain className={style.leftIcon}/>Latest
            </div>
          </Link>
          <div className={style.parentRow}>
            <FaUser className={style.leftIcon}/>Users
          </div>
          {users.map(user => (
            <Link key={user.id} to="/" onClick={toggleSidebar}>
              <div 
                onClick={() => setActiveUser(user.id)}
                className={`${style.subRow} ${user.isActive && style.active}`}
              >
                {user.username}
              </div>
            </Link>
          ))}
          {isUserLoggedIn &&   
            <Link to="/bookmarks" onClick={toggleSidebar}>
              <div className={style.row}>
                <FaBook className={style.leftIcon}/>Bookmarks
              </div>
            </Link>
          }
          {
          // <div className={style.row}>
          //   <FaTag className={style.leftIcon}/>Tags
          // </div>
          }
          <div className={style.parentRow}>
            <FaCog className={style.leftIcon}/>Account
          </div>
          {isUserLoggedIn &&
            <a href="/change/">
              <div className={style.subRow}>
                Change Password
              </div>
            </a>
          }
          {isUserLoggedIn &&
            <a href="/logout/">
              <div className={style.subRow}>
                Log Out
              </div>
            </a>
          }
          {!isUserLoggedIn &&
            <a href="/signup/">
              <div className={style.subRow}>
                Sign Up
              </div>
            </a>
          }
          {!isUserLoggedIn &&
            <a href="/login/">
              <div className={style.subRow}>
                Log In
              </div>
            </a>
          }
        </div>      
      </div>
    ) 
  }
}
