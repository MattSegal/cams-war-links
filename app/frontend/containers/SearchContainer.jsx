import React, {Component} from 'react';
import {connect} from 'react-redux'

import style from 'scss/search.scss'
import listStyle from 'scss/LinkList.scss'

import { actions } from 'state'
import { debounce } from 'utilities'
import HyperLink from 'components/HyperLink'


class SearchContainer extends Component
{
  debounce = debounce(300)

  handleInput = e => {
    this.debounce(this.props.searchLinks)(e.target.value)
  }

  render() {
    const { results, updating } = this.props
    return  (
      <div>
        <div className={style.inputBox}>
          <input type="text" onChange={this.handleInput} placeholder="Search links"/>
          <div className={style.status}>
            {updating && 'Searching...'}
          </div>
        </div>
        {results.length > 0 &&
          <ul className={style.list}>
            {results.map(link => <HyperLink key={link.id} link={link}/>)}
          </ul>
        }
      </div>
    )
  }
}

let mapStateToProps = (state) => ({
  results: state.search.items,
  updating: state.search.updating,
})

let mapDispatchToProps = (dispatch) => ({
    searchLinks: query => dispatch(actions.searchLinks(query))
})

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchContainer)
