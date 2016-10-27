(function () {
    var React = require('react'),
        ReactDOM = require('react-dom'),
        App = require('./components/main.jsx');

    // Render the main app react component into the document body.
    // For more details see: https://facebook.github.io/react/docs/top-level-api.html#react.render
    ReactDOM.render(<App />, document.getElementById('app'));
})();
