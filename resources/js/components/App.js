import React, { Component } from "react";
import ReactDOM from 'react-dom';

    export default class App extends Component {
        constructor(props) {
            super(props);
            this.state = {
                title: "",
                content: "",
                commentContent:"",
                posts:[]

            };

                this.handlePostSubmit = this.handlePostSubmit.bind(this);
                this.handleChangePostContent = this.handleChangePostContent.bind(this);
                this.handleChangeTitle = this.handleChangeTitle.bind(this);
                this.submitComment = this.submitComment.bind(this);
                this.showComments = this.showComments.bind(this);
                this.handleChangeCommentContent = this.handleChangeCommentContent.bind(this);

              }



              handleChangePostContent(event){
                this.setState({ content: event.target.value });
              }

              handleChangeTitle(event) {
                this.setState({ title: event.target.value });
              }


              handleChangeCommentContent(event) {
                this.setState({ commentContent: event.target.value });
              }



              showComments(e){
                const post_id=event.target.attributes['data-post-id'].value;
                let comment_field_id =`comment_field${post_id}`;
                let show_less_btn_id = `showLess${post_id}`;
                let show_more_btn_id = `showComent${post_id}`;

                let field = document.getElementById(comment_field_id);
                let hiddeBtn = document.getElementById(show_less_btn_id);
                let showBtn = document.getElementById(show_more_btn_id);
                if(field.style.display==="none"){
                    showBtn.style.display="none";
                    field.style.display ="block";
                    hiddeBtn.style.display="block";


                }else{
                    showBtn.style.display="block";
                    field.style.display ="none";
                    hiddeBtn.style.display="none";


                }


              }
              submitComment(e) {
                    let post_id = e.target.id;
                    if (e.keyCode == 13) {
                      if (e.target.value == "" || !e.target.value.replace(/\s/g, "")) {
                        console.log("empty message");
                      } else {
                        const form = {
                            comment_text: e.target.value,
                            post_id: post_id,
                        };

                         let uri = `${window.siteurl}/new_comment`;

                        axios
                          .post(uri,form)
                          .then((response) => {
                            document.getElementById(post_id).value="";
                            this.setState({
                                posts:response.data
                            });

                            })
                          .catch(function(error) {
                            console.log("error" + error);
                          });
                    }
                  }
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


                console.log(data.posts);
                this.setState({
                    posts:JSON.parse(data.posts)
                });

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

                    <h5>{posts.user_name}</h5>

                    <article className="blog-post">

                    <h1 className="postsTitle">{posts.title}</h1>

                    <p>{posts.content}</p>


                        <button className="myBtnClass" id={"showComent" + posts.id}
                                data-post-id={posts.id}
                                onClick={this.showComments}
                        >
                        Read comments &raquo; &nbsp;&nbsp;
                        {typeof posts.comments[0] !== "undefined" ? `${posts.comments.length}`: 0 }
                            </button>

                    <button className="myBtnClass" id={"showLess" + posts.id} data-post-id={posts.id}
                    style={{display:"none"}}
                    onClick={this.showComments}>
                        hide</button>

                    <div id={"comment_field" + posts.id}
                    style={{display:"none"}}
                    >
                {typeof posts.comments[0] !== "undefined" ? (
                posts.comments.map((comment) => (
                    <div className="commentTextDiv" key={comment.id}>
                        <p className="commentBy">by:<b>{comment.user_name}</b></p>
                        <p className="commentText">{comment.comment_text}</p>
                            <div>
                                <p className="commentDate"><i>{comment.created_at}</i></p>
                            </div>
                    </div>
                ))
                ) : null}




</div>
      <div className="form-group">
                <textarea
                  className="form-control commentFieldTextArea"
                  rows="2"
                  id={posts.id}
                  onKeyDown={this.submitComment}
                  onChange={this.handleChangeCommentContent}
                  onClick={this.handleChangeCommentContent}
                  name="commentContent"
                  maxLength="140"
                  placeholder="add comment..."
                />
              </div>
    </article>

     {posts.created_at}
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
    ReactDOM.render(<App />, document.getElementById('reactApp'));
}
