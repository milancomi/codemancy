import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import ReactImageAppear from "react-image-appear";

export default class ModalComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // APP depended states
      loading: props.loading,
      users:[],
      user_id:props.userId,

      // POST STATES
      modal: false,
      title: "",
      posts: [],
      image: "",
      content: "",
      price: "",
      upload_file: [],
      file: '',
      imagePreviewUrl:'',

      

      // MESSAGE STATES
      modalMessage: false,
      messageFrom:props.userId,
      messageForUserId:"",
      messageForUserName:"",
      messageForPostId:"",
      messageForPostName:"",
      message:""

    };

    this.modalPost = this.modalPost.bind(this);
    this.modalAskMessage = this.modalAskMessage.bind(this);
    this.showPostsById = this.showPostsById.bind(this);

    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeContent = this.handleChangeContent.bind(this);
    this.handleChangePrice = this.handleChangePrice.bind(this);
    this.handleChangeFile = this.handleChangeFile.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);


    this.loadingStatus = this.loadingStatus.bind(this);
    this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
    this.handleChangeMessage = this.handleChangeMessage.bind(this);

  }

  
  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let upload_file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        upload_file: upload_file,
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(upload_file)
  }

  loadingStatus(bool) {
    this.props.onChange(bool);
    this.setState({ loading: bool.value });
  }
  


  setAvailableUsers(users) {
    this.props.setAvailableUsers(users);
    this.setState({ users: users });
  }


  modalPost() {
    this.setState({
      modal: !this.state.modal,
    });
  }
  showPostsById(id){

    axios.post(`${window.siteurl}/posts_by_id/${id}`).then((response) => {
      this.setState({ posts: response.data.postData });
    })
    .catch(function(error) {
      console.log("error" + error);
    });
  }

  modalAskMessage(event) {
    // toogle prevention
    if(typeof event.target.attributes['data-msg-post-id'] !== "undefined" )
    {
    const postId=event.target.attributes['data-msg-post-id'].value;
    const postName=event.target.attributes['data-msg-post-name'].value;
    const msgForUserId=event.target.attributes['data-msg-for-user-id'].value;
    const msgForUserName=event.target.attributes['data-msg-for-user-name'].value;

     this.setState({
      messageForUserId:msgForUserId,
      messageForUserName:msgForUserName,
      messageForPostId:postId,
      messageForPostName:postName
    });
    }

    this.setState({
      modalMessage: !this.state.modalMessage,
    });
  }

  handleChangeTitle(event) {
    this.setState({ title: event.target.value });
  }
  handleChangeContent(event) {
    this.setState({ content: event.target.value });
  }
  handleChangePrice(event) {
    this.setState({ price: event.target.value });
  }
  handleChangeFile(event) {
    this.setState({ upload_file: event.target.files[0] });
  }

  handleChangeMessage(event){
    this.setState({ message: event.target.value });
  }

  handleMessageSubmit(event) {
    event.preventDefault();


    this.loadingStatus(true);
    const form = {
      message: this.state.message,
      from_user_id: this.state.messageFrom,
      for_post_id: this.state.messageForPostId,
      to_user_id: this.state.messageForUserId,
    };

    this.setState({
      modalMessage: !this.state.modalMessage,
    });

     let uri=`${window.siteurl}/new_message`;

    axios
      .post(uri,form)
      .then((response) => {
        console.log(response);
        this.setAvailableUsers(response.data);
        this.loadingStatus(false);
      })
      .catch(function(error) {
        console.log("error" + error);
      });
  }
  handleSubmit(event) {
    event.preventDefault();

    this.loadingStatus(true);
    let formData = new FormData(); //formdata object
    formData.append("title", this.state.title);
    formData.append("content", this.state.content);
    formData.append("price", this.state.price);
    formData.append("upload_file", this.state.upload_file);

    const config = {
      headers: { "content-type": "multipart/form-data" },
    };


    this.setState({
      modal: !this.state.modal,
    });

    let uri =`${window.siteurl}/posts`;

    axios
      .post(uri, formData, config)
      .then((response) => {
        this.setState({ posts: response.data.postData });

        this.loadingStatus(false);
      })
      .catch(function(error) {
        console.log("error" + error);
      });
  }

  componentDidMount() {

    const id = document.getElementById("app").attributes["data-user-id"].value;

    let postChannel = Echo.channel("posts");

    postChannel.listen(".postE", (data) => {
      this.loadingStatus(true);
      console.log(data.post);
      this.setState({ posts: [data.post, ...this.state.posts] });
      this.loadingStatus(false);
    });


    axios
      .get(`${window.siteurl}/get_all_posts`)
      .then((response) => {
        this.setState({ posts: response.data });
        this.loadingStatus(false);
      })
      .catch(function(error) {
        console.log("error" + error);
      });
  }
  render() {

    let btn = document.getElementById("prikOglase");
  if(btn !== null)
  {
    btn.onclick = (e) =>{
      e.preventDefault();
      console.log("BTN RADI")
      let user_id = btn.attributes["data-id"].value;
      console.log(user_id);
       this.showPostsById(user_id);
    }
  }



  let {imagePreviewUrl} = this.state;
  let $imagePreview = null;
  if (imagePreviewUrl) {
    $imagePreview = (<img className="previewImageInput" src={imagePreviewUrl} />);
  } else {
    $imagePreview = (<div className="previewText"></div>);
  }




    return (
      <div>
        <Button
          className="col-md-3 offset-md-5 mt-2 bg-grayGradient text-dark font-weight-bold"
          onClick={this.modalPost}
        >
          <i className="fa fa-newspaper-o" aria-hidden="true"></i>
          &nbsp;&nbsp; Dodaj Oglas
        </Button>

        
        <div className="row pt-3">
          <div className="container-fluid">
            {this.state.posts.length == 0
              ? null
              : this.state.posts.map((posts) => (
                  <div key={posts.id}>
                    <div className="card col col-sm-9 mt-4 mb-2 offset-sm-2 divider ">
                      {posts.newMessage == true ? (
                        <div className="alert alert-success alert-block">
                          <button
                            type="button"
                            className="close"
                            data-dismiss="alert"
                          >
                            ×
                          </button>
                          <strong>Nov oglas</strong>
                        </div>
                      ) : null}
                      <div className="card-body">

                        <h1>{posts.user.name}</h1>
                        {typeof posts.files[0] !== "undefined" ? (
                        <ReactImageAppear
                          placeholder
                          src={posts.files[0].file_title}
                          className="post_img mx-auto d-block"
                          placeholderClass="mx-auto d-block"
                        />
                      ) : null}
                         <h3 className="card-title cntrAlgn">{posts.title}</h3>

                        <p className="card-text">Opis: {posts.content}</p>
                        <p className="card-text">Cena: <strong>{posts.price} </strong></p>

        
        {posts.user.id == this.state.user_id ?
                 null
                        :
                        <Button
                        data-msg-post-id={posts.id}
                        data-msg-post-name={posts.title}
                        data-msg-for-user-id={posts.user.id}
                        data-msg-for-user-name={posts.user.name}
                          className="col-md-3 bg-redPretty"
                          onClick={this.modalAskMessage}
                        >
                         <i className="fa fa-comments icon-4x" aria-hidden="true"></i>
                        </Button>                        }
                  </div>
                  </div>
                  </div>

                ))}
          </div>
        </div>
        <Modal isOpen={this.state.modal}>
          <form onSubmit={this.handleSubmit}>
            <ModalHeader>Kreiraj Oglas</ModalHeader>

            <ModalBody>
              <div className="row">
              <div className="form-group col-sm-6">
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
              </div>
              <div className="form-group col-sm-6">
                <label htmlFor="post_price">Cena</label>
                <input
                  type="text"
                  className="form-control"
                  onChange={this.handleChangePrice}
                  id="post_price"
                  name="price"
                  placeholder="0"
                />
              </div>
              </div>

              <div className="form-group">
                <label htmlFor="post_content">Opis</label>
                <textarea
                  className="form-control"
                  rows="4"
                  onChange={this.handleChangeContent}
                  id="post_content"
                  name="content"
                  placeholder="Opisi detaljno proizvod..."
                />
              </div>
              {/* <div className="form-group mb-3">
                <label htmlFor="exampleFormControlFile1">Add image</label>
                <input
                  type="file"
                  name="upload_file"
                  onChange={this.handleChangeFile}
                  className="form-control-file"
                  id="exampleFormControlFile1"
                />
              </div> */}
              <div className="row">
              <div className="form-group col-sm-4">
                <label htmlFor="">Dodaj sliku</label>
                <input
                  type="file"
                  name="upload_file"
                  className="form-control-file"
                  onChange={(e)=>this._handleImageChange(e)}                  className="form-control-file"
                  id="exampleFormControlFile2"
                />
              </div>
              <div className="imgPreview form-group col-sm-8">
          {$imagePreview}
        </div>
        </div>
            </ModalBody>
            <ModalFooter>
              <input
                type="submit"
                onClick={this.handleSubmit}
                value="Sačuvaj"
                color="primary"
                className="btn btn-primary"
              />
              <Button color="danger" onClick={this.modalPost}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </Modal>

        {/* modal message */}
        <Modal isOpen={this.state.modalMessage}>
          <form onSubmit={this.handleMessageSubmit}>
            <ModalHeader>Poruka za: <strong>{this.state.messageForUserName} {this.state.messageForUserId}</strong></ModalHeader>
            <ModalBody>
              <h4>Proizvod: <strong> {this.state.messageForPostName} {this.state.messageForPostId}</strong></h4>
    <div className="form-group">
                <textarea
                  className="form-control"
                  rows="6"
                  id="message"
                  onChange={this.handleChangeMessage}
                  name="message"
                  placeholder="Postavi pitanja"
                />
              </div>
              <input
                  type="hidden"
                  name="from_user_id"
                  className="form-control-file"
                  value={this.state.messageFrom}
                />
                     <input
                  type="hidden"
                  name="for_post_id"
                  className="form-control-file"
                  value={this.state.messageForPostId}
                />
                     <input
                  type="hidden"
                  name="to_user_id"
                  className="form-control-file"
                  value={this.state.messageForUserId}
                />
            </ModalBody>
            <ModalFooter>
              <input
                type="submit"
                onClick={this.handleMessageSubmit}
                value="Pošalji"
                color="primary"
                className="btn btn-primary"
              />
              <Button color="danger" onClick={this.modalAskMessage}>
                Odustani
              </Button>
            </ModalFooter>
          </form>
        </Modal>

        {/* Modal message */}
      </div>
    );
  }
}
