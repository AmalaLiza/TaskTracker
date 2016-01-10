import {Component, Input} from "angular2/core";
import {TaskService} from "../task.service";

@Component({
    selector: 'task',
    styleUrls: ['./src/components/main/main.css'],
    template: `
    <div>
        <label class="task-body-list__item__label fleft">
            <input type="checkbox"/>

             <span class="task-body-list__item__label__text">
                {{task}}
             </span>
        </label>

        <a href="javascript:void(0)" class="play-ico fright display-none"></a>

        <span class="task-time-left fright">
            1:15:00
        </span>
    </div>`
})

export class TaskComponent {
    @Input() task;
}