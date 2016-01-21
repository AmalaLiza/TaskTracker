"use strict";
///<reference path='../../typings/immutable/immutable.d.ts'/>
import * as Immutable from 'immutable';

export default function taskReducer(state, action) {
    switch (action.type) {

        case "ADD_TASK":
            let newTask = Immutable.fromJS({
                id: (String(+(new Date()) + Math.random())),
                title: action.title,
                description: "",
                estimatedTime: "",
                priority: 0,
                progress: '0',
                due_date: "",
                dependencies: "",
                notes: "",
                activity: "",
                createdAt: "",
                taskList: Immutable.List(),
                isPlaying:false,
                isExpanded:false,
                completed: false
            });
            state = state.updateIn(['boardList', action.boardIndex, 'taskList'],
                taskList => taskList.push(newTask));
            return state;

        case "TASK_COMPLETED":
            state = state.updateIn(['boardList', action.boardIndex, 'taskList', action.taskId, 'completed'],
                completed => !completed);
            return state;

        case "PLAY_TASK":
            state = state.updateIn(['boardList', action.boardId, 'taskList', action.taskId, 'isPlaying'],
                isPlaying => true);
            state = state.set('activeTask', state.getIn(['boardList', action.boardId, 'taskList', action.taskId]));
            state = state.setIn(['activeTask', 'boardId'], action.boardId);
            return state;

        case "PAUSE_TASK":
            state = state.updateIn(['boardList', action.boardId, 'taskList', action.taskId, 'progress'],
                progress => action.progress);
            state = state.updateIn(['boardList', action.boardId, 'taskList', action.taskId, 'isPlaying'],
                isPlaying => false);
            state = state.updateIn(['activeTask','progress'], progress => action.progress);
            return state;

        case "EXPAND_TASK":
            state = state.updateIn(['boardList', state.getIn(['expandedTask', 'boardId']), 'taskList', state.getIn(['expandedTask', 'id']), 'isExpanded'],
                isExpanded => false);
            state = state.updateIn(['boardList', action.boardId, 'taskList', action.taskId, 'isExpanded'],
                isExpanded => !action.isExpanded);
            state = state.set('expandedTask', state.getIn(['boardList', action.boardId, 'taskList', action.taskId]));
            state = state.setIn(['expandedTask', 'boardId'], action.boardId);
            return state;

        case "DELETE_TASK":
            console.log("DELETE_TASK");
            state = state.updateIn(['boardList', action.boardIndex, 'taskList'],
                taskList => taskList.splice(action.taskId, 1));
            return state;

        default:
            return state
    }
}