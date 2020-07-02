import React, { Component } from "react";
import ReactDOM from 'react-dom';

    export default class Example extends Component {
        constructor(props) {
            super(props);
            this.state = {
                title: "",
                content: "",
                posts:{}

            };

                this.handlePostSubmit = this.handlePostSubmit.bind(this);
                this.handleChangePostContent = this.handleChangePostContent.bind(this);
                this.handleChangeTitle = this.handleChangeTitle.bind(this);


              }

              handleChangePostContent(event){
                this.setState({ content: event.target.value });
              }

              handleChangeTitle(event) {
                this.setState({ title: event.target.value });
              }

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
    <form onSubmit={this.handlePostSubmit}>

    <label htmlFor="post_title">Naziv</label>
                <input
                required
                  type="text"
                  className="form-control"
                  onChange={this.handleChangeTitle}
                  id="post_title"
                  name="title"
                  placeholder=""
                />
    <div className="form-group">
                <textarea
                  className="form-control"
                  rows="6"
                  id="message"
                  onChange={this.handleChangePostContent}
                  name="message"
                  maxLength="140"
                  placeholder="Post content"
                />
              </div>
              <input
                type="submit"
                onClick={this.handlePostSubmit}
                value="Add post"
                color="primary"
                className="btn btn-primary"
              />
                      </form>

        </div>
    );
}




    handlePostSubmit(event) {
        event.preventDefault();


        const form = {
          title: this.state.title,
          content: this.state.content,

        };



         let uri=`${window.siteurl}/new_post`;

        axios
          .post(uri,form)
          .then((response) => {
            this.setState({ posts: response.data.postData });

        })
          .catch(function(error) {
            console.log("error" + error);
          });
      }

    }


if (document.getElementById('reactApp')) {
    ReactDOM.render(<Example />, document.getElementById('reactApp'));
}
