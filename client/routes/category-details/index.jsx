import './styles.scss';
import GroceryItem from '../../components/grocery-item';

import React, { Component } from 'react';

class CategoryDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groceryItems: []
    };
  }
  _updateGroceryItems() {
    this.props.groceryItemStore.itemsForCategory(this.props.match.params.id).then((groceryItems) => {
      this.setState({ groceryItems });
    });
  }
  componentDidMount() {
    this._itemUpdateListener = () => {
      this._updateGroceryItems();
    };
    this.props.groceryItemStore.itemListeners.register(this._itemUpdateListener);
    this.props.groceryItemStore.updateItemsForCategory(this.props.match.params.id, 100);
  }

  componentWillUnmount() {
    this.props.groceryItemStore.itemListeners.unregister(this._itemUpdateListener);
  }

  render() {
    let itemComponents = this.state.groceryItems.map((item) => <GroceryItem cartStore={this.props.cartStore} groceryItemStore={this.props.groceryItemStore} key={item.id} item={item}/>)

    return (
      <div className='CategoryDetails mui--text-center'>
        <h4 className='category-name'>{this.props.match.params.id}</h4>
        {itemComponents.length ? itemComponents : <div className='loading'>Loading...</div>}
      </div>
    )
  }
}



export default CategoryDetails;