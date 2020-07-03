import React, { Component } from "react";
import ReactDOM from 'react-dom';

    export default class Example extends Component {
        constructor(props) {
            super(props);
            this.state = {
                title: "",
                content: "",
                posts:[]

            };

                this.handlePostSubmit = this.handlePostSubmit.bind(this);
                this.handleChangePostContent = this.handleChangePostContent.bind(this);
                this.handleChangeTitle = this.handleChangeTitle.bind(this);
                this.submitComment = this.submitComment.bind(this);
                this.showComments = this.showComments.bind(this);

              }



              handleChangePostContent(event){
                this.setState({ content: event.target.value });
              }

              handleChangeTitle(event) {
                this.setState({ title: event.target.value });
              }



              showComments(e){
                let field = document.getElementById("comment_field1");
                let showLessBtn = document.getElementById("showLess1");
                console.log(showLessBtn);
                if(field.style.display="none"){
                    e.target.style.display = "none";
                    field.style.display = "none";
                    showLessBtn.style.visibility="visible";

                }else{
                    alert("AAA");
                }


              }
              submitComment(e) {

console.log(e);
            }



          componentDidMount() {
            axios
            .get(`${window.siteurl}/getPosts`)
            .then((response) => {
                console.log(response);
              this.setState({ posts: response.data });
            })
            .catch(function(error) {
              console.log("error" + error);
            });

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

          <div className="container bckClr">
<div className="rightSection">
<h1 className="formHeader">New post</h1>
    <form onSubmit={this.handlePostSubmit}>

                <input
                required
                  type="text"
                  className="form-control"
                  onChange={this.handleChangeTitle}
                  id="post_title"
                  name="title"
                  value={this.state.title}

                  placeholder="Title"
                />
    <div className="form-group">
                <textarea
                  className="form-control"
                  rows="6"
                  id="message"
                  onChange={this.handleChangePostContent}
                  value={this.state.content}
                  name="message"
                  maxLength="140"
                  placeholder="Content"
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

<div className="leftSection" >
    <h3>New Feed</h3>

    {this.state.posts.length == 0
              ? null
              : this.state.posts.map((posts) => (
                  <div className="postDivider" key={posts.id}>
<section className="main-content">
    <article className="blog-post">
    <h1>{posts.title}</h1>
      <p>{posts.content}</p>
      <a id="showComent1" onClick={this.showComments}
><b>2</b>&nbsp; Read comments &raquo;</a>
<a id="showLess1" style={{visibility:"hidden"}}>show Less</a>
<div id="comment_field1">
    <p>kometar jedan</p>
</div>
      <div className="form-group">
                <textarea
                  className="form-control"
                  rows="2"
                  id="commentContent"
                  onKeyDown={this.submitComment}
                //   onChange={this.handleChangePostContent}
                  value={this.state.content}
                  name="commentContent"
                  maxLength="140"
                  placeholder="add comment..."
                />
              </div>
    </article>
  </section></div>
                  ))}

</div>
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
              console.log(response.data);
            this.setState({
                 posts: response.data.postData,
                 content: '',
                 title: ""

                });

        })
          .catch(function(error) {
            console.log("error" + error);
          });
      }

    }


if (document.getElementById('reactApp')) {
    ReactDOM.render(<Example />, document.getElementById('reactApp'));
}
