import {Component, OnInit} from "@angular/core";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {Router} from "@angular/router";
import {ProjectService} from "@app/services/project.service";

@Component({
    selector: 'app-project-new',
    templateUrl: 'project-new.component.html',
    standalone: false
})
export class ProjectNewComponent implements OnInit {

  constructor(private router: Router,
              private _projectService: ProjectService,
              private _toasty: GlobalToastyService) {
  }

  ngOnInit() {
  }

  onCreate(project) {
    console.log(project);
    this._projectService.createProject(project).subscribe(res => {
      this._toasty.success('Объект экспертизы сохранен.');
      this.router.navigate(['/projects', res.id]);
    })
  }

  onCancel() {
    this.router.navigateByUrl('/projects');
  }
}
