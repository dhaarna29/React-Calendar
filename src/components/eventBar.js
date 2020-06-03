import React from 'react';
import { format, getTime } from 'date-fns'
import moment from 'moment';

export default class EventBar extends React.Component {
    eventData;
    constructor(props) {
        super(props);
        this.state = {
            form: false,
            eLoad: false,
            name: '',
            start: '',
            reminder: false
        }
    }
    componentDidMount() {
        this.getNewLS();
    }
    componentWillReceiveProps(nextProps) {
        if (this.props != nextProps)
            this.getNewLS(nextProps);
    }
    getNewLS(nextProps = this.props) {
        console.log(nextProps)
        this.eventData = []
        var fetched = JSON.parse(localStorage.getItem(`${format(nextProps.date, 'dd MM yy')}`))
        if (localStorage.getItem(`${format(nextProps.date, 'dd MM yy')}`)) {
            this.eventData = fetched
            console.log(this.eventData)
        }
        this.setState({ eload: true })
    }
    formShow = () => {
        this.setState({ form: !this.state.form })
    }
    onChangeName = (e) => {
        this.setState({ name: e.target.value })
    }
    onChangeStart = (e) => {
        this.setState({ start: e.target.value })
    }
    onChangeReminder = (e) => {
        this.setState({ reminder: e.target.value })
    }
    onSubmit = (e) => {
        e.preventDefault()
        this.eventData.push({
            name: this.state.name,
            start: this.state.start,
            reminder: this.state.reminder
        })
        this.eventData.sort((a, b) => { return a.start > b.start ? 1 : -1 })
        localStorage.setItem(`${format(this.props.date, 'dd MM yy')}`, JSON.stringify(this.eventData))
        this.setState({
            name: '',
            start: '',
            reminder: false,
            eload: true
        })
        this.formShow()
    }
    onDelete = (e) =>{
        for(var i=0; i<this.eventData.length; i++){
            if(e==this.eventData[i]){
                this.eventData.splice(i,1)
                break;
            }
        }
        localStorage.setItem(`${format(this.props.date, 'dd MM yy')}`, JSON.stringify(this.eventData))
        this.setState({
            eLoad: false
        })
    }
    onEdit = (e)=>{
        this.setState({
            name: e.name,
            start: e.start,
            reminder: e.reminder
        })
        this.formShow()
        this.onDelete(e)
    }
    render() {
        console.log(getTime(this.props.date))
        if (this.eventData)
            var eventList = this.eventData.map((e) =>
                <div className={`sidebar-list`}>
                    <li>{e.start} : {e.name}</li>
                    <div className="ic">
                        <div className="material-icons" onClick={()=>this.onEdit(e)}>create</div>
                        <div className="material-icons" onClick={()=>this.onDelete(e)}>delete</div>
                    </div>
                </div>
            )
        else
            var eventList = ""

        var formCode = this.state.form ? (
            <form onSubmit={this.onSubmit}>
                <div className="form-group">
                    <label> Name</label>
                    <input type="text" className="form-control" defaultValue={this.state.name} onChange={this.onChangeName} />
                </div>
                <div className="form-group">
                    <label>Start time</label>
                    <input type="time" className="form-control" defaultValue={this.state.start} onChange={this.onChangeStart} />
                </div>
                <div className="form-group">
                    <label>Add Reminder?</label>
                    <input type="checkbox" className="form-control" defaultValue={this.state.reminder} onChange={this.onChangeReminder} />
                </div>
                <button type="submit" className="form-group submit">ADD</button>
            </form>
        ) : "";

        return (
            <div>
                <h2>{format(this.props.date, 'EEEE, MMMM d')}</h2>
                <div className="sidebar">{eventList}</div>
                {formCode}
                <h2 onClick={this.formShow}>New Appointment</h2>
            </div>
        )
    }
}