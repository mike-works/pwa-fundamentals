import './styles.scss';
import GroceryItem from '../../components/grocery-item';

import React, { Component } from 'react';

class CategoryDetails extends Component {
  constructor(props) {
    super(props);
    this.state = { groceryItems: [] };
  }
  componentDidMount() {
    fetch(`https://localhost:3100/api/items?limit=100&category=${this.props.match.params.id}`)
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
      <div className='CategoryDetails mui--text-center'>
        <h4 className='category-name'>{this.props.match.params.id}</h4>
        {itemComponents.length ? itemComponents : <div className='loading'>Loading...</div>}
      </div>
    )
  }
}



export default CategoryDetails;