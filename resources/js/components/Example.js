import React, { Component } from "react";
import ReactDOM from 'react-dom';

    export default class Example extends Component {

          componentDidMount() {


            let postChannel = Echo.channel("post-event");
            console.log(postChannel);
            postChannel.listen(".post.event", (data) => {
                alert("SASDASD");
                console.log("test");
                console.log(data);
            });
        }
          render() {

            return (
          <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">Example2  Component</div>

                        <div className="card-body">I'm an example component!</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

    }



if (document.getElementById('reactApp')) {
    ReactDOM.render(<Example />, document.getElementById('reactApp'));
}
