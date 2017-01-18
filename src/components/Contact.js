import React from 'react';
import ContactInfo from './ContactInfo';
import ContactDetails from './ContactDetails';
import ContactCreate from './ContactCreate';
import update from 'react-addons-update';

export default class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword : '',
      selectedKey : -1,
      contactData: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  componentDidMount() {
    fetch("/jsonList.json")
        .then( (response) => {
            return response.json() })
                .then( (json) => {
                  this.setState({ contactData: json.contactData});
                });

  }

  componentDidUpdate(prevProps, prevState) {
    if(JSON.stringify(prevState) != JSON.stringify(this.state.contactData)){
      localStorage.contactData = JSON.stringify(this.state.contactData);
    }
  }

  handleChange(e){
    this.setState({
      keyword : e.target.value
    });
  }

  handleClick(key){
    this.setState({
      selectedKey : key
    });
    console.log(key, 'is selected');
  }

  handleCreate(contact){
    this.setState({
        contactData : update(this.state.contactData, {$push : [contact]})
      }
    );

  }

  handleRemove(){
    if(this.state.selectedKey < 0) {
      return;
    }

    this.setState({
      contactData : update(
        this.state.contactData,
          { $splice : [[this.state.selectedKey, 1]]}
        ),
        selectedKey : -1
    });
  }

  handleEdit(name, phone){
    if(this.state.selectedKey < 0) {
      return;
    }
    this.setState({
      contactData: update(this.state.contactData, {
        [this.state.selectedKey] : {
          name : {$set: name},
          phone : {$set: phone}
        }
      })
    });
  }


  render() {
    const mapToComponent = (data) => {
      data.sort();
      data = data.filter(
          (contact) => {
            return contact.name.toLowerCase().indexOf(this.state.keyword.toLowerCase()) > -1;
          }
        )
      return data.map((contact, i) => {
        return (<ContactInfo contact={contact} key={i} onClick={()=>{this.handleClick(i)}} />)
      });
    };

    return (
      <div>
        <h1>Contacts List</h1>
        <input name="keyword" placeholder='Search 이름' value={this.state.keyword} onChange={this.handleChange} />
        <div>{mapToComponent(this.state.contactData)}</div>
        <ContactDetails
          isSelected={this.state.selectedKey != -1}
          contact={this.state.contactData[this.state.selectedKey]}
          onRemove={this.handleRemove}
          onEdit={this.handleEdit}
        />
        <ContactCreate onCreate={this.handleCreate}/>
        </div>
    )
  }
}
