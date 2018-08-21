import React, { Component } from 'react';
import ReactModal from 'react-modal';
import { Link } from 'react-router-dom';

ReactModal.setAppElement('#root');
const customStyles = {
  content : {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

class CategoryTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      showModal: false,
      showCreate: false,
      action: false
    };
  }

  async componentDidMount() {
    try {
      const categoriesResponse = await fetch('https://expense-manager.thinkingpandas.com:443/api/categories')
      const categoriesJson = await categoriesResponse.json();
      this.setState({ 
        categories: categoriesJson
      });
    } catch (error) {
      console.log(error);
    }
  }

  createClick(create) {
    this.setState({
      showCreate: !this.state.showCreate  ,
      create: create
    });
  }
  handleClick(id, action, category) {
    this.setState({
      showModal: !this.state.showModal,
      action: action,
      id: id,
      category: category
    });
  }



// CREATE A CATEGORY
  createCategory() {
    return (
      <div>
        <ReactModal 
           isOpen={this.state.showCreate}
           contentLabel="Category Form"
           style={customStyles}
        >
          <div className="row mx-0 mb-1">
            <h4>Category Form</h4>
          </div>
          <form>
            <div className="form-group">
              <input ref={title => this.title = title} name="title" placeholder="Title" type="text" className="form-control form-control-sm"/>
            </div>
            <div className="form-group">
              <input ref={desc => this.desc = desc} name="desc" placeholder="Description" type="text" className="form-control form-control-sm"/>
            </div>
            <div className="row mx-0 justify-content-end">
              <div className="col-auto">
                <div className="btn btn-success" onClick={() => {this.createConfirm(this.title.value, this.desc.value)}}>Save</div>
              </div>
              <div className="col-auto">
                <div className="btn btn-danger" onClick={() => {this.createClick()}}>Cancel</div>
              </div>
            </div>
          </form>
        </ReactModal>
      </div>
    );
  }
  async createConfirm(ctitle, cdesc) {
    if(ctitle !== '' && cdesc !== '') {
      try {
        const settings = {
            method: 'POST',
            body: JSON.stringify({
              title: ctitle,
              description: cdesc
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
        }
        const response = await fetch('https://expense-manager.thinkingpandas.com:443/api/categories', settings);
        await response.json();
        this.componentDidMount();
        this.setState();
        this.createClick();
        alert('Successfully created a category!');
      } catch (error) {
        console.log(error);
      }
    }
    else if(ctitle === '') {alert('Title is not allowed to be empty');}
    else if(cdesc === '') {alert('Description is not allowed to be empty');}
  }
// CREATE A CATEGORY



// EDIT A CATEGORY
  editCategory(id, category) {
    return (
      <div>
        <ReactModal 
           isOpen={this.state.showModal}
           contentLabel="Category Form"
           style={customStyles}
        >
          <div className="row mx-0 mb-1">
            <h4>Category Form</h4>
          </div>
          <form>
            <div className="form-group">
              <input ref={title => this.title = title} name="title" placeholder="Title" type="text" className="form-control form-control-sm" defaultValue={category.title}/>
            </div>
            <div className="form-group">
              <input ref={desc => this.desc = desc} name="desc" placeholder="Description" type="text" className="form-control form-control-sm" defaultValue={category.description}/>
            </div>
          </form>
          <div className="row mx-0 justify-content-end">
            <div className="col-auto">
              <div className="btn btn-success" onClick={() => {this.editConfirm(id, this.title.value, this.desc.value)}}>Save</div>
            </div>
            <div className="col-auto">
              <div className="btn btn-danger" onClick={() => {this.handleClick()}}>Cancel</div>
            </div>
          </div>
        </ReactModal>
      </div>
    );
  }
  async editConfirm(id, etitle, edesc) {
    try {
      const settings = {
          method: 'PUT',
          body: JSON.stringify({
            title: etitle,
            description: edesc
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
      }
      const response = await fetch('https://expense-manager.thinkingpandas.com:443/api/categories/'+id, settings);
      await response.json();
      this.componentDidMount();
      this.setState();
      this.handleClick();
      alert('Successfully updated a category!');
    } catch (error) {
      console.log(error);
    }
  }
// EDIT A CATEGORY



// DELETE A CATEGORY
  deleteCategory(id) {
    return (
      <div>
        <ReactModal 
           isOpen={this.state.showModal}
           contentLabel="Delete Category"
           style={customStyles}
        >
          <div className="row mx-0 mb-1">
            <h4>Delete Category</h4>
          </div>
          <p>Are you sure you want to delete this category?</p>
          <div className="row mx-0 justify-content-end">
            <div className="col-auto">
              <div className="btn btn-success" onClick={() => {this.deleteConfirm(id)}}>Confirm</div>
            </div>
            <div className="col-auto">
              <div className="btn btn-danger" onClick={() => {this.handleClick()}}>Cancel</div>
            </div>
          </div>
        </ReactModal>
      </div>
    );
  }
  async deleteConfirm(id) {
    try {
      const settings = {
          method: 'DELETE'
      }
      const response = await fetch('https://expense-manager.thinkingpandas.com:443/api/categories/'+id, settings);
      await response.json();
      this.componentDidMount();
      this.setState();
      this.handleClick();
    } catch (error) {
      console.log(error);
    }
  }
// DELETE A CATEGORY



	render() {
    	const { categories } = this.state;
		return (
      		<div className="CategoryTable">
				<div className="title-bar row mx-0">
					<div className="back-btn col-2">
						<Link to="/"><div className="btn arrow"><i className="material-icons">arrow_back</i></div></Link>
					</div>
					<div className="col-8"><span>Expense Manager</span></div>
					<div className="col-2"></div>
				</div>

        		<div className="table-body">
					<div className="category-table row m-3">
						<h4>CATEGORIES</h4>
						<button className="btn btn-success btn-createcat" onClick={() => {this.createClick(true)}}><small>CREATE CATEGORY</small></button>
				        <div className="col-12 px-0 mt-2">
				          {categories.map((categories) => {
				              return (
				                <div className="expense-entry row mx-0 mb-2" key={categories.id}>
				                  <div className="col-md-9 col-9 px-1">
				                    <div className="font-weight-bold">{categories.title}</div>
				                    <div><small>{categories.description}</small></div>
				                  </div>
				                  <div className="col-md-3 col-3 d-flex justify-content-between flex-column px-1">
				                  	{categories.permanent === 0 ?
						                    <div className="text-right">
						                      <i className="material-icons" onClick={() => {this.handleClick(categories.id, false, categories)}}>edit</i>
						                      <i className="material-icons" onClick={() => {this.handleClick(categories.id, true)}}>delete</i>
						                    </div>
				                    : null}
				                  </div>
				                </div>
				              )
				            }
				          )}
	            		  {this.state.showCreate ? (this.state.create ? this.createCategory(): null):(this.state.showModal ? (this.state.action ? this.deleteCategory(this.state.id): this.editCategory(this.state.id, this.state.category)): null)}
				        </div>
			        </div>
		        </div>
			</div>
		);
	}

}

export default CategoryTable;