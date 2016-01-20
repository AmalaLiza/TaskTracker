"use strict";
/// <reference path="../typings/react/react.d.ts" />
/// <reference path="../typings/react/react-dom.d.ts" />
/// <reference path="../typings/react-redux/react-redux.d.ts" />
/// <reference path="../typings/immutable/immutable.d.ts" />

import * as React from "react";
import * as Immutable from "immutable";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import Header from "../src/components/header/header.tsx";
import Board from "../src/components/board/board.tsx";
import AddBoard from "../src/components/add-board/add-board.tsx"
import TaskTracker from "../src/components/task-tracker/task-tracker.tsx";
import Actions from "./actions.ts";
import Description from "./components/description/description.tsx"
import StateType from "./models/StateType";
import TaskType from "./models/TaskType";
import BoardType from "./models/BoardType";
import './stylesheets/base.scss';
import './stylesheets/common.scss';
import './stylesheets/layout.scss';
import './fonts/flaticon.scss';

interface AppProps {
    actions:any;
    data:StateType;
}

interface AppState {
    progress:number;
    displayTaskDescription:Boolean;
}

export class App extends React.Component<AppProps, AppState> {
    constructor(props, context) {
        super(props, context);
        this.state = {
            displayTaskDescription : false
        };
        this.startTaskTracker = this.startTaskTracker.bind(this);
        this.expandTask = this.expandTask.bind(this);
    }

    expandTask(boardId, taskId) {
        let {actions} = this.props;
        this.setState({
            displayTaskDescription : true
        });
        actions.expandTask(boardId, taskId)
    }

    startTaskTracker(boardId, taskId, isPlaying) {
        let {data, actions} = this.props;
        this.setState({
            progress: data.getIn(['boardList', boardId, 'taskList', 'taskId', 'progress'])
        });

        let myTimer = () => {
            this.setState({
                progress: this.state.progress + 0.5
            });
        }
        if (isPlaying) {
            actions.pauseTask(boardId, data.get("activeTask"), this.state.progress)
            clearInterval(this.timer);
        } else {
            actions.playTask(boardId, taskId);
            if (data.getIn(["activeTask", "isPlaying"]))
                actions.pauseTask(boardId, data.get("activeTask"), this.state.progress, true);
            this.timer = setInterval(myTimer, 1000);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data.getIn(["activeTask", "progress"]))
            this.setState({
                progress: nextProps.data.getIn(["activeTask", "progress"])
            });
    }

    render() {
        let {data, actions} = this.props;
        let boardList:Immutable.List<BoardType> = data.get("boardList");
        let activeTask:TaskType = data.get("activeTask");
        let expandedTask:TaskType = data.get("expandedTask");
        let searchText:string = data.get('searchText');
        let filteredList = Immutable.List();
        if (searchText) {
            filteredList = Immutable.List(boardList
                .filter(board => board.get('taskList')
                    .filter(task => task.get('title').toLowerCase().indexOf(searchText.toLowerCase()) > -1).size > 0));
        } else {
            filteredList = Immutable.List(boardList);
        }
        let boardListElements = filteredList
            .map((board:BoardType, index:number) => (
                <Board
                    key={index}
                    id={board.get('id')}
                    index={index}
                    data={board}
                    filterBy={searchText}
                    onTaskCompletion={actions.taskCompleted}
                    onPlayOrPauseTask={this.startTaskTracker}
                    onEditBoardTitle={actions.editBoardTitle}
                    onEditTaskTitle={actions.editTaskTitle}
                    onAddTask={actions.addTask}
                    setDescriptiveTask={this.expandTask}
                />
            ));

        return <div className="tr-wrapper">
            <Header
                onSearch={actions.searchTask}
                searchText={searchText}
            />
            <div className="main-body">
                <div className="width-container">
                    <div className="task-list clearfix">
                        {boardListElements}
                        <AddBoard
                            handleClick={actions.addBoard}
                        />
                    </div>
                </div>
            </div>
            <div className="footer">
                {activeTask.get('isPlaying')? <TaskTracker
                    activeTask={activeTask}
                    progress={this.state.progress}
                /> : null}
            </div>
            <Description
                task={expandedTask}
                display={this.state.displayTaskDescription}
            />
        </div>
    }
}

function mapStateToProps(state) {
    return {data: state};
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators(Actions, dispatch)};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);