/* eslint-disable no-console */
import React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Carousel from './Carousel';
import LeftArrow from './arrows/LeftArrow';
import RightArrow from './arrows/RightArrow';
import WishList from './WishList';

const AppWrapper = styled.div`
  width: 100vw;
  overflow: hidden;
`;

const Title = styled.h2`
  font-family: Roboto, sans-serif;
  font-weight: 700;
  padding: 15px 30px;
  position: relative;
`;

const CarouselContainer = styled.div`
  display: flex;
  width: 100vw;
  height: 425px;
  position: relative;
`;

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      products: [],
      carouselIndex: 0,
      productTracker: 0,
      leftArrow: false,
      rightArrow: true,
      wishList: [],
    };

    this.onLeftArrowClick = this.onLeftArrowClick.bind(this);
    this.onRightArrowClick = this.onRightArrowClick.bind(this);
    this.addToWishList = this.addToWishList.bind(this);
  }

  componentDidMount() {
    let products;
    axios.get('http://localhost:3000/api/products/96')
      .then((res) => {
        products = res.data;
      })
      .then(() => axios.get('http://localhost:3000/api/wishlist'))
      .then((res) => {
        this.setState({
          products,
          wishList: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onLeftArrowClick() {
    this.updateCarouselView('left');
  }

  onRightArrowClick() {
    this.updateCarouselView('right');
  }

  updateCarouselView(moveDirection) {
    let {
      carouselIndex,
      productTracker,
      leftArrow,
      rightArrow,
    } = this.state;

    const { products } = this.state;
    const carouselLength = products.length * 320;
    const windowLength = window.innerWidth;

    // first checks if the carousel is all the way to the right
    // corrects it if so, and if not, then checks for normal leftward movement
    if (carouselLength - carouselIndex < windowLength && moveDirection === 'left') {
      carouselIndex = productTracker * 320;
      rightArrow = true;
    } else if (moveDirection === 'left') {
      carouselIndex -= 320;
      productTracker -= 1;
    }

    if (moveDirection === 'right') {
      carouselIndex += 320;
      productTracker += 1;
    }

    if (carouselIndex === 0) {
      leftArrow = false;
    } else {
      leftArrow = true;
    }

    // catches an overshoot to the right and corrects it
    if (carouselLength - carouselIndex < windowLength && moveDirection === 'right') {
      carouselIndex = carouselLength - windowLength + 22;
      productTracker -= 1;
      rightArrow = false;
    } else {
      rightArrow = true;
    }

    this.setState({
      carouselIndex,
      productTracker,
      leftArrow,
      rightArrow,
    });
  }

  // this method adds a product to the database
  // and re-renders the wishlist component upon successful post request
  addToWishList(product) {
    axios.post('http://localhost:3000/api/wishlist', product)
      .then((res) => {
        this.setState({
          wishList: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  renderLeftArrow() {
    const { leftArrow } = this.state;
    if (leftArrow) {
      return <LeftArrow onClick={this.onLeftArrowClick} />;
    }
    return null;
  }

  renderRightArrow() {
    const { rightArrow } = this.state;
    if (rightArrow) {
      return <RightArrow onClick={this.onRightArrowClick} />;
    }
    return null;
  }

  render() {
    const { products, carouselIndex, wishList } = this.state;
    return (
      <AppWrapper>
        <Title>Similar to this Product</Title>
        <CarouselContainer>
          {this.renderLeftArrow()}
          <Carousel
            products={products}
            index={carouselIndex}
            wishList={wishList}
            addToWishList={this.addToWishList}
          />
          {this.renderRightArrow()}
        </CarouselContainer>
        <Title>Wish List</Title>
        <WishList wishList={wishList} />
      </AppWrapper>
    );
  }
}

export default App;
