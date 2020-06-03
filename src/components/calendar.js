import React from 'react';
import moment from 'moment';
import {format, addMonths, subMonths, startOfWeek, addDays, startOfMonth, endOfMonth, endOfWeek, isSameDay, isSameMonth, parse, toDate} from 'date-fns';
import EventBar from './eventBar';

export default class Calendar extends React.Component {
    constructor() {
        super()
        this.state = {
            currentDate: new Date(),
            setDate: new Date(),
            selected:  new Date()
        }
    }
    prevMonth = () => {
        var prev = this.state.setDate
        this.setState({
            setDate: subMonths(prev, 1)
        })
    }
    nextMonth = () => {
        var prev = this.state.setDate
        this.setState({
            setDate: addMonths(prev, 1)
        })
    }
    clickDate(temp){
        this.setState({
            selected: temp
        })
        console.log(temp)
    }
    getWeekdays = () => {
        var startOfMonth = startOfWeek(this.state.setDate)
        var days = []

        for (var i = 0; i < 7; i++) {
            days.push(<div className="topbar-days" key={i}>{format(addDays(startOfMonth,i),'E')}</div>)
        }
        return <div className="calendar-topbar">{days}</div>
    }
    getCalendar = () => {
        var som = startOfMonth(this.state.setDate)
        var eom = endOfMonth(this.state.setDate)
        var sow = startOfWeek(som)
        var eow = endOfWeek(eom)

        var days = [], rows = [], start = sow;
        while (start <= eow) {
            for (var i = 0; i < 7; i++) {
                const temp = toDate(start)
                var eclass = isSameDay(start, this.state.currentDate)? "today": 
                               !isSameMonth(start, this.state.setDate)? "inactive": ""
                days.push(<div className={`calendar-date ${eclass}`} key={toDate(temp)} 
                               onClick={() => this.clickDate(temp)}>{format(start,"dd")}</div>)
                start = addDays(start,1);
            }
            rows.push(<div className="calendar-week">{days}</div>)
            days = []
            console.log(rows)
        }
        return <div>{rows}</div>
    }

    render() {
        return (
            <div className="calendar-contain">
                <div className="header">
                        <div className="material-icons" onClick={this.prevMonth}>
                            chevron_left
                        </div>
                    <div className="col col-center">
                            {format(this.state.setDate,'MMMM yyyy')}
                    </div>
                    <div className="material-icons" onClick={this.nextMonth}>
                        <div className="icon">chevron_right</div>
                    </div>
                </div>
                <div className="calendar-main">
                    <div>{this.getWeekdays()}</div>
                    <div>{this.getCalendar()}</div>
                </div>
                <div className="eventbar">
                    <EventBar date={this.state.selected}/>
                </div>
            </div>
        );
    }
}

