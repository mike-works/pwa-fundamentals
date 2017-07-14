import './styles.scss';

import React, { Component } from 'react';

import GroceryItem from '../grocery-item';

class CategoryRow extends Component {
  constructor(props) {
    super(props);
    this.state = { groceryItems: [] };
  }
  componentDidMount() {
    fetch(`https://localhost:3100/api/items?category=${this.props.categoryName}`)
      .then((resp) => resp.json())
      .then((jsonData) => {
        let groceryItems = jsonData.data;
        this.setState({ groceryItems });
        return groceryItems;
      })
      .catch((err) => {
        // eslint-disable-next-line
        console.error('Error fetching grocery items', err);
      });
  }

  render() {
    let itemComponents = this.state.groceryItems.map((item) => <GroceryItem key={item.id} item={item}/>)
    return (
      <li className='CategoryRow'>
        <h2 className='category-name'>{this.props.categoryName}</h2>
        <ul className="grocery-item-list">
          {itemComponents}
        </ul>
      </li>
    )
  }
}

export default CategoryRow;