import React, { Component } from 'react';
import Appbar from 'muicss/lib/react/appbar';
import './App.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { drawerShowing: false };
    this.toggleSideDrawer = this.toggleSideDrawer.bind(this);
  }
  toggleSideDrawer() {
    this.setState({ drawerShowing: !this.state.drawerShowing });
  }

  render() {
    return (
      <div className={this.state.drawerShowing ? "frontend-grocer" : "frontend-grocer hide-sidedrawer"}>
        <div id="sidedrawer" className={this.state.drawerShowing ? 'mui--no-user-select active' : 'mui--no-user-select'}>
          <div id="sidedrawer-brand" className="mui--appbar-line-height">
            <span className="mui--text-title">Frontend Grocer</span>
          </div>
          <div className="mui-divider"></div>
          <ul>
            <li>
              <strong>Category 1</strong>
              <ul>
                <li><a href="#">Item 1</a></li>
                <li><a href="#">Item 2</a></li>
                <li><a href="#">Item 3</a></li>
              </ul>
            </li>
            <li>
              <strong>Category 2</strong>
              <ul>
                <li><a href="#">Item 1</a></li>
                <li><a href="#">Item 2</a></li>
                <li><a href="#">Item 3</a></li>
              </ul>
            </li>
            <li>
              <strong>Category 3</strong>
              <ul>
                <li><a href="#">Item 1</a></li>
                <li><a href="#">Item 2</a></li>
                <li><a href="#">Item 3</a></li>
              </ul>
            </li>
          </ul>
        </div>
        <header id="header">
          <Appbar className='mui--appbar-line-height'>
            <div className="mui-container-fluid">
              <a className="sidedrawer-toggle mui--visible-xs-inline-block mui--visible-sm-inline-block js-show-sidedrawer" onClick={this.toggleSideDrawer}>☰</a>
              <a className="sidedrawer-toggle mui--hidden-xs mui--hidden-sm js-hide-sidedrawer" onClick={this.toggleSideDrawer}>☰</a>
              <span className="mui--text-title mui--visible-xs-inline-block">Frontend Grocer</span>
            </div>
          </Appbar>
        </header>
        <div id="content-wrapper">

          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
            sollicitudin volutpat molestie. Nullam id tempor nulla. Aenean sit amet
            urna et elit pharetra consequat. Aliquam fringilla tortor vitae lectus
            tempor, tempor bibendum nunc elementum. Etiam ultrices tristique diam,
            vitae sodales metus bibendum id. Suspendisse blandit ligula eu fringilla
            pretium. Mauris dictum gravida tortor eu lacinia. Donec purus purus,
            ornare sit amet consectetur sed, dictum sitamet ex. Vivamus sit amet
            imperdiet tellus. Quisque ultrices risus a massa laoreet, vitae tempus sem
            congue. Maecenas nec eros ut lectus vehicula rutrum. Donec consequat
            tincidunt arcu non faucibus. Duis elementum, ante venenatis lacinia
            cursus, turpis massa congue magna, sed dapibus felis nibh sed tellus. Nam
            consectetur non nibh vitae sodales. Pellentesque malesuada dolor nec mi
            volutpat, eget vehicula eros ultrices.
          </p>
          <p>
            Aenean vehicula tortor a tellus porttitor, id elementum est tincidunt.
            Etiam varius odio tortor. Praesent vel pulvinar sapien. Praesent ac
            sodales sem. Phasellus id ultrices massa. Sed id erat sit amet magna
            accumsan vulputate eu at quam. Etiam feugiat semper imperdiet. Sed a sem
            vitae massa condimentum vestibulum. In vehicula, quam vel aliquet aliquam,
            enim elit placerat libero, at pretium nisi lorem in ex. Vestibulum lorem
            augue, semper a efficitur in, dictum vitae libero. Donec velit est,
            sollicitudin a volutpat quis, iaculis sit amet metus. Nulla at ante nec
            dolor euismod mattis cursus eu nisl.
          </p>
          <p>
            Quisque interdum facilisis consectetur. Nam eu purus purus. Curabitur in
            ligula quam. Nam euismod ligula eu tellus pellentesque laoreet. Aliquam
            erat volutpat. Curabitur eu bibendum velit. Cum sociis natoque penatibus
            et magnis dis parturient montes, nascetur ridiculus mus. Nunc efficitur
            lorem sit amet quam porta pharetra. Cras ultricies pellentesque eros sit
            amet semper.
          </p>
        </div>
        <footer id="footer">
          <div className="mui-container-fluid">
            <br />
            🙌 I built this in a <a href="https://frontendmasters.com" rel="noopener noreferrer" target="_blank">Frontend Masters</a> PWA course.
          </div>
        </footer>
        {this.state.drawerShowing
          ? <div id="mui-overlay" onClick={this.toggleSideDrawer}></div>
          : ''}
      </div>
    );
  }
}

export default App;