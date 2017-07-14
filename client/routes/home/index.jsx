import './styles.scss';

import React, { Component } from 'react';
import CategoryRow from './category-row';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { categories: [] };
  }
  componentDidMount() {
    fetch('https://localhost:3100/api/categories')
      .then((resp) => resp.json())
      .then((jsonData) => {
        let categories = jsonData.data.map((item) => item.category);
        this.setState({ categories });
        return categories;
      })
      .catch((err) => {
        // eslint-disable-next-line
        console.error('Error fetching categories', err);
      });
  }

  render() {
    let categoryRows = this.state.categories.map((c) => <CategoryRow key={c} categoryName={c} className="category-list__item" />)
    return (
      <div className='Home'>
        <ul className="category-list">
          {categoryRows}
        </ul>
      </div>
    )
  }
}



export default Home;