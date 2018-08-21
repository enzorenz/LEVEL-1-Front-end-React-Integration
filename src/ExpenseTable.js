import React, { Component } from 'react';
import ReactModal from 'react-modal';
import { Link } from 'react-router-dom'

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

class ExpenseTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: 0,
      expenses: [],
      categories: [],
      showModal: false,
      showCreate: false,
      action: false,
      create: false,
      id: 0,
      title: null,
      category_id: null,
      date: null,
      value: null
    };
  }

  async componentDidMount() {
    try {
      const expensesResponse = await fetch('https://expense-manager.thinkingpandas.com:443/api/expenses')
      const expensesJson = await expensesResponse.json();

      const categoriesResponse = await fetch('https://expense-manager.thinkingpandas.com:443/api/categories')
      const categoriesJson = await categoriesResponse.json();

      const totalExpensesResponse = await fetch('https://expense-manager.thinkingpandas.com:443/api/total_expenses')
      const totalExpensesJson = await totalExpensesResponse.json();
      
      this.setState({ 
        expenses: expensesJson,
        categories: categoriesJson,
        data: totalExpensesJson.data.totalExpenses,
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
  handleClick(id, action, expense) {
    this.setState({
      showModal: !this.state.showModal,
      action: action,
      id: id,
      expense: expense
    });
  }



// CREATE AN EXPENSE
  createExpense() {
    const { categories } = this.state;
    var dt = new Date();
    return (
      <div>
        <ReactModal 
           isOpen={this.state.showCreate}
           contentLabel="Expense Form"
           style={customStyles}
        >
          <div className="row mx-0 mb-1">
            <h4>Expense Form</h4>
          </div>
          <form>
            <div className="form-group">
              <input ref={title => this.title = title} name="title" placeholder="Title" type="text" className="form-control form-control-sm"/>
            </div>
            <div className="form-group">
              <select ref={category_id => this.category_id = category_id} name="category_id" className="form-control form-control-sm" defaultValue="48234870-5389-445f-8b41-c61a52bf27dc">
                {categories.map((categories) => {
                      return (
                        <option key={categories.id} value={categories.id}>{categories.title}</option>
                      )
                    }
                  )
                }
              </select>
            </div>
            <div className="form-group">
              <input ref={date => this.date = date} name="date" type="datetime-local" defaultValue={dt.toISOString().slice(0, 11)+dt.toTimeString().slice(0, 5)}/>
            </div>
            <div className="form-group">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">₱</span>
                </div>
                <input ref={number => this.number = number} type="number" name="value" className=" form-control" placeholder="0.00" defaultValue='0'/>
              </div>
            </div>
            <div className="row mx-0 justify-content-end">
              <div className="col-auto">
                <div className="btn btn-success" onClick={() => {this.createConfirm(this.title.value, this.category_id.value, this.date.value, this.number.value)}}>Save</div>
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
  async createConfirm(ctitle, ccategory_id, cdate, cvalue) {
    cdate = new Date(cdate).toISOString();
    if(cvalue > 0 && ctitle !== '') {
      try {
        const settings = {
            method: 'POST',
            body: JSON.stringify({
              title: ctitle,
              category_id: ccategory_id,
              date: cdate,
              value: cvalue
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
        }
        const response = await fetch('https://expense-manager.thinkingpandas.com:443/api/expenses', settings);
        await response.json();
        this.componentDidMount();
        this.setState();
        this.createClick();
        alert('Successfully created an expense!');
      } catch (error) {
        console.log(error);
      }
    }
    else if(ctitle === '') {alert('Title is not allowed to be empty');}
    else if(cvalue <= 0) {alert('Value must be larger than or equal to 1');}
  }
// CREATE AN EXPENSE



// EDIT AN EXPENSE
  editExpense(id, expense) {
    const { categories } = this.state;
    expense.date = new Date(expense.date);

    return (
      <div>
        <ReactModal 
           isOpen={this.state.showModal}
           contentLabel="Expense Form"
           style={customStyles}
        >
          <div className="row mx-0 mb-1">
            <h4>Expense Form</h4>
          </div>
          <form>
            <div className="form-group">
              <input ref={title => this.title = title} name="title" placeholder="Title" type="text" className="form-control form-control-sm" defaultValue={expense.title}/>
            </div>
            <div className="form-group">
              <select ref={category_id => this.category_id = category_id} name="category_id" className="form-control form-control-sm" defaultValue={expense.category_id}>
                {categories.map((categories) => {
                      return (
                        <option key={categories.id} value={categories.id}>{categories.title}</option>
                      )
                    }
                  )
                }
              </select>
            </div>
            <div className="form-group">
              <input ref={date => this.date = date} name="date" type="datetime-local" defaultValue={expense.date.toISOString().slice(0, 11)+expense.date.toTimeString().slice(0, 5)}/>
            </div>
            <div className="form-group">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">₱</span>
                </div>
                <input ref={number => this.number = number} type="number" name="value" className=" form-control" placeholder="0.00" defaultValue={expense.value}/>
              </div>
            </div>
          </form>
          <div className="row mx-0 justify-content-end">
            <div className="col-auto">
              <div className="btn btn-success" onClick={() => {this.editConfirm(id, this.title.value, this.category_id.value, this.date.value, this.number.value)}}>Save</div>
            </div>
            <div className="col-auto">
              <div className="btn btn-danger" onClick={() => {this.handleClick()}}>Cancel</div>
            </div>
          </div>
        </ReactModal>
      </div>
    );
  }
  async editConfirm(id, etitle, ecategory_id, edate, evalue) {
    edate = new Date(edate).toISOString();
    try {
      const settings = {
          method: 'PUT',
          body: JSON.stringify({
            title: etitle,
            category_id: ecategory_id,
            date: edate,
            value: evalue
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
      }
      const response = await fetch('https://expense-manager.thinkingpandas.com:443/api/expenses/'+id, settings);
      await response.json();
      this.componentDidMount();
      this.setState();
      this.handleClick();
      alert('Successfully updated an expense!');
    } catch (error) {
      console.log(error);
    }
  }
// EDIT AN EXPENSE



// DELETE AN EXPENSE
  deleteExpense(id) {
    return (
      <div>
        <ReactModal 
           isOpen={this.state.showModal}
           contentLabel="Delete Expense"
           style={customStyles}
        >
          <div className="row mx-0 mb-1">
            <h4>Delete Expense</h4>
          </div>
          <p>Are you sure you want to delete this expense?</p>
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
      const response = await fetch('https://expense-manager.thinkingpandas.com:443/api/expenses/'+id, settings);
      await response.json();
      this.componentDidMount();
      this.setState();
      this.handleClick();
    } catch (error) {
      console.log(error);
    }
  }
// DELETE AN EXPENSE




  render () {
    const { expenses } = this.state;
    const { data } = this.state;

    return (
      <div className="ExpenseTable">
        <div className="title-bar">Expense Manager</div>

        <div className="table-body">
          <div className="expense-table row m-3">
            <div className="header">
              <div className="total-expense mt-2">
                <h2>{new Intl.NumberFormat('fil-PH', {style: 'currency', currency: 'PHP'}).format(data)}</h2>
                <small>TOTAL EXPENSE</small>
                <div className="action-buttons row mx-0 my-2">
                  <div className="btn col-sm-6 d-flex justify-content-center">
                    <Link to="/categories"><div className="btn btn-success"><small>CATEGORIES</small></div></Link>
                    </div>
                  <div className="btn col-sm-6 d-flex justify-content-center em-expense">
                    <div className="btn btn-success" onClick={() => {this.createClick(true)}}><small>CREATE EXPENSE</small></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 px-0 mt-2">
              <h4>Expense List</h4>
              {expenses.map((expenses) => {
                  var date = new Date(expenses.date);
                  return (
                    <div className="expense-entry row mx-0 mb-2" key={expenses.id}>
                      <div className="col-md-9 col-9 px-1">
                        <div className="font-weight-bold">{expenses.title}</div>
                        <div><span className="expense-category">{expenses.category['title']}</span>{new Intl.DateTimeFormat('en-US', {year:'numeric',month:'short',day:'2-digit'}).format(date)}</div>
                      </div>
                      <div className="col-md-3 col-3 d-flex justify-content-between flex-column px-1">
                        <h6 className="text-right">{new Intl.NumberFormat('fil-PH', {style: 'currency', currency: 'PHP'}).format(expenses.value)}</h6>
                        <div className="text-right">
                          <i className="material-icons" onClick={() => {this.handleClick(expenses.id, false, expenses)}}>edit</i>
                          <i className="material-icons" onClick={() => {this.handleClick(expenses.id, true)}}>delete</i>
                        </div>
                      </div>
                    </div>
                  )
                }
              )}
              {this.state.showCreate ? (this.state.create ? this.createExpense(): null):(this.state.showModal ? (this.state.action ? this.deleteExpense(this.state.id): this.editExpense(this.state.id, this.state.expense)): null)}
            </div>
          </div>
        </div>
      </div>
    );
  }

}





export default ExpenseTable;