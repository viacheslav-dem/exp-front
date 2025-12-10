import {Component, OnInit, ViewChild} from "@angular/core";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "@app/services/auth.service";
import {SearchExpertComponent} from "../search/search-person/search-expert/search-expert.component";
import {PersonService} from "@app/services/person.service";
import {Role} from "@app/pipes/role.pipe";
import {ModalComponent} from "@app/components/common-components/modal/modal.component";
import {CryptoService} from "@app/crypto/crypto.service";
import {ProgressService} from "@app/components/common-components/progress/progress.service";
import {ProjectState} from "@app/pipes/project-state.pipe";
import {SearchGkntWorkerComponent} from "@app/components/search/search-person/search-gknt-worker.component";
import {anyMatch} from "@app/support/utils";
import {MeetingService} from "@app/services/meeting.service";
import {LifecycleGroupDto} from "@app/dto/LifecycleGroupDto";
import {ProjectLifecycleState} from "@app/pipes/lifecycle-state.pipe";
import {ExpertReviewState} from "@app/pipes/review-state.pipe";
import {IdDto} from "@app/dto/IdDto";
import {DialogService} from "@app/components/dialogs/dialog.service";
import {PersonFullNamePipe} from "@app/pipes/person-full-name.pipe";
import * as _ from "lodash";
import {ProjectDto} from "@app/dto/ProjectDto";
import {ConfirmDialogField} from "@app/components/dialogs/confirm-dialog/ConfirmDialogField";
import {DialogResult} from "@app/components/dialogs/dialog-result";
import {ProjectService} from "@app/services/project.service";
import {ExpertReviewService} from "@app/services/expert-review.service";
import {LifecycleGroupService} from "@app/services/lifecycle-group.service";
import {LifecycleService} from "@app/services/lifecycle.service";
import {AgendaService} from "@app/services/agenda.service";
import {ExpertReviewDto} from "@app/dto/ExpertReviewDto";
import {LifecycleGroupState} from "@app/pipes/lifecycle-group-state.pipe";
import {ProjectCopyDto} from "@app/dto/ProjectCopyDto";
import {SameProjectListComponent} from "@app/components/same-project-list/same-project-list.component";
import {ProjectLifecycleDto} from "@app/dto/ProjectLifecycleDto";
import {ReturnFromCouncilWithoutExpertiseFormContent} from "@app/components/document-form/form-model/ReturnFromCouncilWithoutExpertiseFormContent";
import {DocumentDto} from "@app/dto/DocumentDto";
import {DocumentService} from "@app/services/document.service";
import {ActionButtonMetadata} from "./action-button-metadata";

@Component({
    selector: 'app-project-info',
    templateUrl: 'project-info.component.html',
    standalone: false
})
export class ProjectInfoComponent implements OnInit {

  Role = Role; // enum for template

  agreement: boolean = false;

  currentUser: any;
  role: string;
  project: ProjectDto;
  editedProject: ProjectDto;
  copiedProject: ProjectCopyDto;
  listSameProjects: ProjectDto[] = [];
  lifecycleRemark: ProjectLifecycleDto = new ProjectLifecycleDto();

  // for assessors
  agenda: IdDto;
  sectionReports: any[];
  reviews: any[];

  // for bureau chairman
  lifecycleGroup: LifecycleGroupDto;

  // for section chairman
  lifecycle: any;

  // for gknt, customer and belisa
  lifecycleGroups: any[] = [];

  // for expert
  expertReview: ExpertReviewDto;
  visibleDocsForExpert: boolean = false;

  buttons: ActionButtonMetadata[] = [];

  @ViewChild(SearchExpertComponent, { static: false }) public searchExpertComponent: SearchExpertComponent;
  @ViewChild(SearchGkntWorkerComponent, { static: false }) searchGkntWorkerComponent: SearchGkntWorkerComponent;
  @ViewChild('editProjectModal', { static: false }) editProjectModal: ModalComponent;
  @ViewChild('returnFromCouncilWithoutExpertiseModal', { static: false }) returnFromCouncilWithoutExpertiseModal: ModalComponent;
  @ViewChild('copyProjectModal', { static: false }) copyProjectModal: ModalComponent;
  @ViewChild('expertRejectProject', { static: false }) expertRejectProject: ModalComponent;
  @ViewChild('expertAgreement', { static: false }) expertAgreement: ModalComponent;
  @ViewChild('listProjects', { static: false }) listProjects: ModalComponent;
  @ViewChild(SameProjectListComponent, { static: false }) sameProjectList: SameProjectListComponent;

  constructor(private route: ActivatedRoute,
              private _toasty: GlobalToastyService,
              private _projectService: ProjectService,
              private router: Router,
              private _authService: AuthService,
              private _personService: PersonService,
              private _service: PersonService,
              private _cryptoService: CryptoService,
              private _groupService: LifecycleGroupService,
              private _lifecycleService: LifecycleService,
              private _progress: ProgressService,
              private _agendaService: AgendaService,
              private _meetingService: MeetingService,
              private _reviewService: ExpertReviewService,
              private _dialogService: DialogService,
              private _personPipe: PersonFullNamePipe,
              private _documentService: DocumentService) {
  }

  ngOnInit() {
    this.role = this._authService.getCurrRole();
    this._personService.getCurrentPerson().subscribe(res => {
      this.currentUser = res;
    });
    this.route.params.subscribe(params => {
      this.agenda = params['agendaId'] ? new IdDto(params['agendaId']) : null;
      this.loadProject(new IdDto(params['id']), params['group']);

    });
  }

  loadLifecycle() {
    this._projectService.getLifecycle(this.project).subscribe(res => {
      this.lifecycle = res;
      this.initActionButtons();
    });
  }

  loadLifecycleGroups() {
    this._projectService.getLifecycleGroups(this.project).subscribe(res => {
      this.lifecycleGroups = res;
      this.initActionButtons();
    });
  }

  loadLifecycleGroup() {
    this._projectService.getLifecycleGroup(this.project).subscribe(res => {
      this.lifecycleGroup = res;
      this.initActionButtons();
    });
  }

  loadProject(idDto: IdDto, group: string) {
    this._projectService.getProject(idDto).subscribe(res => {
      this.project = res;
      if (group != null && group != 'null') {
        this._projectService.markViewed(this.project, group).subscribe();
      }
      this.initActionButtons();
      this.showProjectDocuments();
      if (this.role == Role.BUREAU_ASSESSOR) {
        this.loadAnonymousExpertReviews();
        this.loadSectionReports();
        this.loadLifecycleGroup();
      } else if (this.role == Role.SECTION_ASSESSOR) {
        this.loadAnonymousExpertReviews();
      } else if (this.role == Role.BUREAU_CHAIRMAN) {
        this.loadLifecycleGroup();
      } else if (this.role == Role.SECTION_CHAIRMAN) {
        this.loadLifecycle();
      } else if (anyMatch(this.role,
        Role.GKNT_WORKER, Role.GKNT_CHAIRMAN, Role.GKNT_DEPARTMENT_CHAIRMAN,
        Role.BELISA_READ, Role.BELISA_EDIT, Role.CUSTOMER)
      ) {
        this.loadLifecycleGroups();
        if (this.role == Role.CUSTOMER) {
          this.loadAnonymousExpertReviews();
        }
      } else if (this.role == Role.EXPERT) {
        this.loadExpertReview();
      }
    })
  }

  loadExpertReview() {
    this._projectService.getReview(this.project).subscribe(res => {
      this.expertReview = res;
      this.initActionButtons();
      this.showProjectDocuments();
    });
  }

  loadSectionReports() {
    this._agendaService.getSectionReportsByBureauAssessor(this.agenda).subscribe(res => this.sectionReports = res);
  }

  loadAnonymousExpertReviews() {
    this._projectService.getAnonymousReviews(this.project).subscribe(res => this.reviews = res);
  }

  checkVisibleForBureau(): boolean {
    return (anyMatch(this.role, Role.BUREAU_CHAIRMAN, Role.BUREAU_ASSESSOR) && this.lifecycleGroup != null
      && this.lifecycleGroup.state == ProjectLifecycleState.RETURNED) ||
      (anyMatch(this.role, Role.BUREAU_CHAIRMAN, Role.BUREAU_ASSESSOR) && this.lifecycleGroup == null);
  }

  checkVisibleForSection(): boolean {
    let notSection: boolean = !anyMatch(this.role, Role.SECTION_CHAIRMAN, Role.SECTION_ASSESSOR);
    let isLifecycleState: boolean = this.lifecycle != null && this.lifecycle.state != ProjectLifecycleState.RETURNED_WITHOUT_EXPERTISE;
    return notSection || isLifecycleState;
  }

  showProjectDocuments() {
    if ((this.role == Role.EXPERT && this.expertReview == null) || this.role == Role.EXPERT && (this.expertReview.state == ExpertReviewState.ON_EXPERT_CONFIRMATION ||
      this.expertReview.state == ExpertReviewState.REJECTED)) {
      this.visibleDocsForExpert = false;
    } else this.visibleDocsForExpert = true;
  }


  finishChoosingExperts() {
    this._dialogService.showConfirmDialog(
      'Утверждение экспертных заключений',
      `Утвердить текущий список экспертных заключений для объекта "${this.project.title}" и перейти к рассмотрению в секции?`
    ).subscribe(() => {
      this._lifecycleService.finishExpertExamination(this.lifecycle).subscribe(res => {
        this.lifecycle = res;
        this.loadProject(this.project, null);
        this._toasty.success("Эксперты утверждены.");
      });
    });
  }

  returnFromSectionToCouncil() {
    this._dialogService.showConfirmDialog(
        'Возврат в бюро ГЭС',
        `Вернуть обьект в бюро ГЭС?`,
        'Это действие будет необратимо')
      .subscribe(() => {
        let reason = "";
        this._lifecycleService.returnFromSectionToCouncil(this.lifecycle, reason)
          .subscribe((res) => {
            this._toasty.success("Вы вернули объект экспертизы.");
            this.lifecycle = res;
            // this.loadProject(this.project, null);
            this.router.navigateByUrl('/projects');
          });
      });
  }

  returnFromSectionToCouncilWithoutExamination() {
    this._dialogService.showConfirmDialog(
      'Возврат объекта экспертизы',
      `Вернуть объект экспертизы "${this.project.title}" в бюро ГЭС?`)
      .subscribe(() => {
        this._lifecycleService.returnFromSectionToCouncilWithoutExamination(this.lifecycle).subscribe((res) => {
          this._toasty.success('Вы вернули объект экспертизы');
          this.lifecycle = res;
          this.loadProject(this.project, null);
        })
      })
  }

  returnFromBureauToGKNTWithoutExamination() {
    this._dialogService.showConfirmDialog(
      'Возврат объекта экспертизы',
      `Вернуть объект экспертизы "${this.project.title}" в ГКНТ ?`)
      .subscribe(() => {
        this._groupService.returnFromBureauToGKNTlWithoutExamination(this.lifecycleGroup).subscribe((res) => {
          this._toasty.success('Вы вернули объект экспертизы');
          this.lifecycleGroup = res;
          this.loadProject(this.project, null);
        })
      })
  }

  sendBySections() {
    this._dialogService.showConfirmDialog('Утверждение секций',
      `Утвердить текущий список секций для объекта экспертизы "${this.project.title}"?`).subscribe(() => {
      this._groupService.sendBySections(this.lifecycleGroup).subscribe(res => {
        this.lifecycleGroup = res;
        this._toasty.success('Отправлен в секции.');
        this.initActionButtons();
      });
    });
  }

  acceptProject() {
    this._dialogService.showMethRecPDF(
      'Принятие объекта экспертизы',
      `Вы согласны провести экспертизу объекта "${this.project.title}"?`,
      'Вы соглашаетесь с методическими рекомендациями и будете обязаны завершить экспертизу в течение установленного нормативными актами срока.'
    ).subscribe(() => {
      this._reviewService.acceptProject(this.expertReview).subscribe(res => {
        this.expertReview = res;
        this._toasty.success("Вы приняли объект на экспертизу.");
        this.initActionButtons();
        this.showProjectDocuments();
      });
    });
  }

  rejectProject(reason: string) {
    this._reviewService.rejectProject(this.expertReview, reason).subscribe(res => {
      this.expertReview = res;
      this._toasty.success("Вы отклонили экспертизу объекта.");
      this.initActionButtons();
      this.router.navigateByUrl('projects');
    });
  }

  finishExpertExamination() {
    this._dialogService.showConfirmDialog(
      'Завершение экспертизы',
      `Завершить экспертизу объекта "${this.project.title}"?`
    ).subscribe(() => {
      this._reviewService.finishReview(this.expertReview).subscribe(res => {
        this.expertReview = res;
        this._toasty.success("Вы завершили экспертизу объекта.");
        this.initActionButtons();
      })
    });
  }

  sendOnExamination() {
    this._dialogService.showConfirmDialog(
      null,
      `Отправить на экспертизу объект "${this.project.title}"?`,
      'После выполнения операции редактировать данные станет невозможно.'
    ).subscribe(() => {
      this._projectService.sendOnExaminationToGknt(this.project).subscribe((res) => {
        this.project = res;
        this._toasty.success("Отправлен на экспертизу.");
        this.initActionButtons();
      });
    });
  }

  sendToSubCustomer() {
    this._dialogService.showConfirmDialogWithFields(
      [new ConfirmDialogField<string>('reason', 'Причина возврата')],
      'Возврат объекта экспертизы',
      `Вернуть объект экспертизы "${this.project.title}" инциатору экспертизы?`)
      .subscribe((dlgResult: DialogResult<any>) => {
        let reason = "";
        if (dlgResult != null && dlgResult.value != null) {
          reason = dlgResult.value.reason;
        }
        this._projectService.returnToSubCustomer(this.project, reason)
          .subscribe(() => {
            this._toasty.success("Вы вернули объект экспертизы.");
            this.router.navigateByUrl('/projects');
          });
      });
  }

  sendToHeadOrg() {
    this._dialogService.showConfirmDialog(null,
      `Отправить на утверждение объект "${this.project.title}"?`,
      'После выполнения операции редактировать данные станет невозможно.'
    ).subscribe(() => {
      this._projectService.sendForApproval(this.project).subscribe((res) => {
        this.project = res;
        this._toasty.success("Отправлен на утверждение.");
        this.initActionButtons();
      })
    })
  }

  sendOnDepartmentSigning() {
    if (this.project.decisionDocument && this.getActiveGroups().length > 0) {
      throw 'Пожалуйста, приведите документы и данные о ГЭСах в соответствие с принятым решением по объекту экспертизы.';
    }
    this._dialogService.showConfirmDialog(
      null,
      `Отправить документы по объекту экспертизы "${this.project.title}" на подпись начальнику подразделения?`,
      ''
    ).subscribe(() => {
      this._projectService.sendOnDepartmentSigning(this.project).subscribe(res => {
        this.project = res;
        this._toasty.success("Вы отправили документы начальнику подраделения.");
        this.initActionButtons();
      });
    });
  }

  returnOnChecking() {
    this._dialogService.showConfirmDialog(
      null,
      `Вернуть объект экспертизы "${this.project.title}" назначенному ответственному сотруднику подразделения 
      ГКНТ для дополнительного рассмотрения?`,
      ''
    ).subscribe(() => {
      this._projectService.returnOnChecking(this.project).subscribe(res => {
        this.project = res;
        this._toasty.success("Объект экспертизы возвращён на доработку.");
        this.initActionButtons();
      });
    });
  }

  returnOnDepartmentSigning() {
    this.returnOnDepartmentSigningConfirmDialog().subscribe(() => {
      this._projectService.returnOnDepartmentSigning(this.project).subscribe(res => {
        this.project = res;
        this._toasty.success("Объект экспертизы возвращён на доработку.");
        this.initActionButtons();
      });
    });
  }

  returnOnDepartmentFinalSigning() {
    this.returnOnDepartmentSigningConfirmDialog().subscribe(() => {
      this._projectService.returnOnDepartmentFinalSigning(this.project).subscribe(res => {
        this.project = res;
        this._toasty.success("Объект экспертизы возвращён на доработку.");
        this.initActionButtons();
      });
    });
  }

  private returnOnDepartmentSigningConfirmDialog() {
    return this._dialogService.showConfirmDialog(
      null,
      `Вернуть объект экспертизы "${this.project.title}" в подразделение ГКНТ для дополнительного рассмотрения?`,
      ''
    )
  }

  private finishProject() {
    this._projectService.finishProject(this.project).subscribe(res => {
      this.project = res;
      this._toasty.success("Вы завершили экспертизу объекта.");
      this.initActionButtons();
    });
  }

  private finishProjectConfirmDialog() {
    return this._dialogService.showConfirmDialog('Завершение экспертизы объекта',
      `Утвердить документы (письмо или письма заказчику) и завершить экспертизу объекта "${this.project.title}"?`);
  }

  finishProjectWithoutSign() {
    this.finishProjectConfirmDialog().subscribe(() => this.finishProject());
  }

  finishProjectWithSign() {
    this.finishProjectConfirmDialog().subscribe(() => {
      this._progress.show();
      this._cryptoService.signLifecycleGroupDecisions(this.project).subscribe(res => {
        console.log('complete sign decision');
        if (res) {
          this.finishProject();
        } else {
          this._toasty.error('Ошибка подписи.');
        }
        this._progress.hide();
      }, () => this._progress.hide());
    });
  }

  private returnProject() {
    this._projectService.returnProject(this.project).subscribe(res => {
      this.project = res;
      this._toasty.success("Вы вернули объект экспертизы заказчику без дальнейшего рассмотрения.");
      this.initActionButtons();
    });
  }

  private returnProjectConfirmDialog() {
    return this._dialogService.showConfirmDialog('Возврат объекта экспертизы',
      `Утвердить письмо заказчику и вернуть объект экспертизы "${this.project.title}" без дальнейшего рассмотрения?`);
  }

  returnProjectWithoutSign() {
    this.returnProjectConfirmDialog().subscribe(() => this.returnProject());
  }

  returnProjectWithSign() {
    this.returnProjectConfirmDialog().subscribe(() => {
      this._progress.show();
      this._cryptoService.signDoc(this.project.decisionDocument).subscribe(res => {
        console.log('complete sign decision');
        if (res) {
          this.returnProject();
        } else {
          this._toasty.error('Ошибка подписи.');
        }
        this._progress.hide();
      }, () => this._progress.hide());
    });
  }

  private sendOnSigning() {
    this._projectService.sendOnSigning(this.project).subscribe(res => {
      this.project = res;
      this._toasty.success("Вы отправили документы зам. Председателя ГКНТ.");
      this.initActionButtons();
    });
  }

  private sendOnSigningConfirmDialog() {
    if (this.project.decisionDocument && this.getActiveGroups().length > 0) {
      throw 'Пожалуйста, приведите документы и данные о ГЭСах в соответствие с принятым решением по объекту экспертизы.';
    }
    return this._dialogService.showConfirmDialog(
      null,
      `Отправить документы по объекту экспертизы "${this.project.title}" на подпись зам. Председателя ГКНТ?`,
      '');
  }

  sendOnSigningWithoutSign() {
    this.sendOnSigningConfirmDialog().subscribe(() => this.sendOnSigning());
  }

  sendOnSigningWithSignDecision() {
    this.sendOnSigningConfirmDialog().subscribe(() => {
      this._progress.show();
      this._cryptoService.signDoc(this.project.decisionDocument).subscribe(res => {
        console.log('complete sign decision');
        if (res) {
          this.sendOnSigning();
        } else {
          this._toasty.error('Ошибка подписи.');
        }
        this._progress.hide();
      }, () => this._progress.hide());
    });
  }

  sendOnSigningWithSignReferrals() {
    this.sendOnSigningConfirmDialog().subscribe(() => {
      this._progress.show();
      this._cryptoService.signReferrals(this.project).subscribe(res => {
        console.log('get sign result');
        if (res) {
          this.sendOnSigning();
        } else {
          this._toasty.error('Ошибка подписи.');
        }
        this._progress.hide();
      }, () => this._progress.hide());
    });
  }

  private sendOnFinalSigning() {
    this._projectService.sendOnFinalSigning(this.project).subscribe((dto) => {
      this.project = dto;
      this._toasty.success("Вы отправили документы зам. Председателя ГКНТ.");
      this.initActionButtons();
    });
  }

  sendOnFinalSigningWithoutSign() {
    this.sendOnSigningConfirmDialog().subscribe(() => this.sendOnFinalSigning());
  }

  sendOnFinalSigningWithSign() {
    this.sendOnSigningConfirmDialog().subscribe(() => {
      this._progress.show();
      this._cryptoService.signLifecycleGroupDecisions(this.project).subscribe(res => {
        console.log('get sign result');
        if (res) {
          this.sendOnFinalSigning();
        } else {
          this._toasty.error('Ошибка подписи.');
        }
        this._progress.hide();
      }, () => this._progress.hide());
    });
  }

  private sendOnExaminationToCouncils() {
    this._projectService.sendOnExaminationToCouncils(this.project).subscribe((res) => {
      this.project = res;
      this.loadLifecycleGroups();
      this._toasty.success("Отправлен на экспертизу в ГЭС.");
      this.initActionButtons();
    })
  }

  private sendOnExaminationToCouncilsConfirmDialog() {
    return this._dialogService.showConfirmDialog('Утверждение документов',
      `Утвердить направления и отправить на экспертизу в ГЭС объект "${this.project.title}"?`);
  }

  sendOnExaminationToCouncilsWithoutSign() {
    this.sendOnExaminationToCouncilsConfirmDialog().subscribe(() => this.sendOnExaminationToCouncils());
  }

  sendOnExaminationToCouncilsWithSign() {
    this.sendOnExaminationToCouncilsConfirmDialog().subscribe(() => {
      this._progress.show();
      this._cryptoService.signReferrals(this.project).subscribe(res => {
        console.log('get sign result');
        if (res) {
          this.sendOnExaminationToCouncils();
        } else {
          this._toasty.error('Ошибка подписи.');
        }
        this._progress.hide();
      }, () => this._progress.hide());
    });
  }

  onGwSelected(person) {
    this.searchGkntWorkerComponent.hide();
    this._dialogService.showConfirmDialog(
      'Назначение сотрудника на объект экспертизы',
      `Назначить сотрудника "${this._personPipe.transform(person)}" на объект экспертизы "${this.project.title}"?`
    ).subscribe(() => {
      this._projectService.attachWorker(this.project, person.id).subscribe((res) => {
        this.project = res;
        this._toasty.success(`На этот объект экспертизы назначен ${this._personPipe.transform(person)}.`);
        this.initActionButtons();
      });
    });
  }

  copyProject() {
    this.editedProject = _.cloneDeep(this.project);
    this.copyProjectModal.show();
  }

  findTheSameProjects(title: string) {
    this.sameProjectList.title = title;
    this._projectService.getTheSameProjectsByTitle(title).subscribe(value => {
      this.listSameProjects = value;
      this.listProjects.show();
    })
  }


  deleteProject() {
    this._dialogService.showConfirmDialog('Удаление объекта экспертизы')
      .subscribe(() => {
        this._projectService.deleteProject(this.project)
          .subscribe(() => {
            this._toasty.success("Объект экспертизы удален");
            this.router.navigateByUrl('/projects');
          });
      })
  }

  editProject() {
    this.editedProject = _.cloneDeep(this.project);
    this.editProjectModal.show();
  }

  canChooseExperts() {
    return this.project.state == ProjectState.ON_EXPERT_EXAMINATION &&
      anyMatch(this.role, Role.GKNT_DEPARTMENT_CHAIRMAN, Role.BUREAU_CHAIRMAN) ||
      this.lifecycle && this.lifecycle.state == ProjectLifecycleState.ON_EXPERT_EXAMINATION &&
      this.role == Role.SECTION_CHAIRMAN
  }

  finishLifecycleGroup() {
    this._dialogService.showConfirmDialog(
      'Утверждение заключения ГЭС',
      `Утвердить заключение ГЭС и завершить экспертизу объекта "${this.project.title}"?`
    ).subscribe(() => {
      this._groupService.finishLifecycleGroup(this.lifecycleGroup).subscribe(res => {
        this.lifecycleGroup = res;
        this.loadProject(this.project, null);
        this._toasty.success("Вы завершили экспертизу объекта.");
        this.initActionButtons();
      });
    });
  }

  showReturnFromCouncilModal() {
    this.returnFromCouncilWithoutExpertiseModal.show();
  }

  returnFromCouncil(formContent: ReturnFromCouncilWithoutExpertiseFormContent) {
      this._groupService.returnToGknt(this.lifecycleGroup, formContent)
        .subscribe(res => {
          this.lifecycleGroup = res;
          this.returnFromCouncilWithoutExpertiseModal.hide();
          this.loadProject(this.project, null);
          this._toasty.success("Вы отклонили экспертизу объекта.");
          this.initActionButtons();
        });
  }

  onUpdate(project) {
    this._projectService.updateProject(this.project, project)
      .subscribe(res => {
        this.project = res;
        this._toasty.success("Сохранено.");
        this.editProjectModal.hide();
      });
  }

  onCopy(project) {
    this.editedProject = project;
    this.editedProject.id = this.project.id;
    this.copiedProject = new ProjectCopyDto();
    this.copiedProject.title = this.editedProject.title;
    this.copiedProject.documents = this.editedProject.documents;
    this.copiedProject.id = this.editedProject.id;
    this._projectService.saveCopyProject(this.copiedProject)
      .subscribe(res => {
        this.copyProjectModal.hide();
        this.router.navigate(['/projects', res.id]);
      });
  }

  getAllReferrals() {
    return this.lifecycleGroups.map(group => group.referral).filter(doc => doc);
  }

  hasAllLifecycleGroupDecisions() {
    if (this.project.isSectionRemarksExpired || this.project.isBureauRemarksExpired) {
      return this.project.decisionDocument != null;
    } else
      return !this.getActiveGroups().find(group => !group.decisionDocument);
  }

  getActiveGroups() {
    return this.lifecycleGroups.filter(group => group.state != LifecycleGroupState.RETURNED_WITHOUT_EXPERTISE);
  }

  initActionButtons(review?: ExpertReviewDto) {
    if (!this.project)
      return;
    if (review != null) {
      this.expertReview = review;
    }
    this.buttons = [];
    if (this.role == Role.BELISA_EDIT || this.role == Role.BELISA_READ || this.role == Role.GKNT_CHAIRMAN
      || this.role == Role.GKNT_DEPARTMENT_CHAIRMAN || this.role == Role.GKNT_WORKER) {
      this.buttons.push(new ActionButtonMetadata('Схожие объекты', () => this.findTheSameProjects(this.project.title), 'btn-primary'))
    }
    if (this.role == Role.CUSTOMER || this.role == Role.SUB_CUSTOMER) {
      this.buttons.push(new ActionButtonMetadata(
        'Копировать', () => this.copyProject(), 'btn-primary'
      ));
    }
    if ((this.role == Role.CUSTOMER || this.role == Role.SUB_CUSTOMER) && this.project.state == ProjectState.ROUGH) {
      this.buttons.push(new ActionButtonMetadata(
        'Редактировать',
        () => this.editProject(), 'btn-primary'));
      if (this.project.documents.length != 0 && this.role == Role.CUSTOMER) {
        this.buttons.push(new ActionButtonMetadata(
          'На экспертизу',
          () => this.sendOnExamination(), 'btn-primary'));
      }
      if (this.project.documents.length != 0 && this.role == Role.SUB_CUSTOMER) {
        this.buttons.push(new ActionButtonMetadata(
          'На утверждение',
          () => this.sendToHeadOrg(), 'btn-primary'));
      }
      this.buttons.push(new ActionButtonMetadata(
        'Удалить', () => this.deleteProject(), 'btn-danger'
      ));
    }
    if (this.project.documents.length != 0 && this.role == Role.CUSTOMER && this.project.state == ProjectState.FOR_APPROVAL) {
      this.buttons.push(new ActionButtonMetadata(
        'На экспертизу',
        () => this.sendOnExamination(), 'btn-primary'));
      this.buttons.push(new ActionButtonMetadata(
        'Вернуть инициатору экспертизы',
        () => this.sendToSubCustomer(), 'btn-danger'));
    }
    if (this.lifecycleGroup && this.role == Role.BUREAU_CHAIRMAN) {
      if (this.lifecycleGroup.state == 'ON_CHECKING' && this.lifecycleGroup.lifecycles.length > 0) {
        this.buttons.push(new ActionButtonMetadata(
          'Отправить в секции',
          () => this.sendBySections(), 'btn-primary'));
      }
      if (this.lifecycleGroup.state == 'ON_CONCLUSION') {
        this.buttons.push(new ActionButtonMetadata(
          'Завершить экспертизу',
          () => this.finishLifecycleGroup(), 'btn-primary'));
      }
      if (this.project.state == ProjectState.ON_EXPERT_EXAMINATION && this.project.expertReviews.length == 0) {
        this.buttons.push(new ActionButtonMetadata(
          'Вернуть в ГКНТ',
          () => this.showReturnFromCouncilModal(), 'btn-secondary'));
      }
      if (this.checkPossibleToReturnToGKNT()) {
        this.buttons.push(new ActionButtonMetadata(
          'Вернуть в ГКНТ без рассмотрения',
          () => this.returnFromBureauToGKNTWithoutExamination(), 'btn-secondary'));
      }
    }
    if (this.role == Role.SECTION_CHAIRMAN && this.lifecycle && this.lifecycle.state == ProjectLifecycleState.ON_EXPERT_EXAMINATION
      // this.project.expertReviews.every(review => anyMatch(review.state,
      //   ExpertReviewState.PROJECT_ACCEPTED, ExpertReviewState.PROJECT_REJECTED, ExpertReviewState.REJECTED))
    ) {
      this.buttons.push(new ActionButtonMetadata(
        'Перейти к рассмотрению в секции',
        () => this.finishChoosingExperts(), 'btn-primary'));
      this.buttons.push(new ActionButtonMetadata(
        'Вернуть в бюро ГЭС',
        () => this.returnFromSectionToCouncil(), 'btn-secondary'));
    }
    if (this.role == Role.SECTION_CHAIRMAN && this.lifecycle
      && this.lifecycle.state == ProjectLifecycleState.ON_WAITING_RESPONSE
      && !this.lifecycle.isAnswerReceived && this.project.isRescheduleSection
      && this.project.isSectionRemarksExpired) {
      this.buttons.push(new ActionButtonMetadata(
        'Вернуть в бюро ГЭС без рассмотрения',
        () => this.returnFromSectionToCouncilWithoutExamination(), 'btn-secondary'));
    }
    if (this.expertReview && this.role == Role.EXPERT) {
      if (this.expertReview.state == 'ON_EXPERT_CONFIRMATION') {
          this.buttons.push(new ActionButtonMetadata(
              'Принять',
              () => this.acceptProject(), 'btn-primary'));
          this.buttons.push(new ActionButtonMetadata(
              'Отклонить',
              () => this.expertRejectProject.show(), 'btn-secondary'));
      }
      if (this.expertReview.state == 'ON_EXAMINATION' && this.expertReview.documents.length > 0) {
        this.buttons.push(new ActionButtonMetadata(
          'Завершить',
          () => this.finishExpertExamination(), 'btn-primary'));
      }
    }
    if (this.role == Role.GKNT_CHAIRMAN) {
      if (this.project.state == 'ON_SIGNING') {
        this.buttons.push(new ActionButtonMetadata(
          'Вернуть в подразделение',
          () => this.returnOnDepartmentSigning(), 'btn-primary'));

        if (this.project.decisionDocument) {
          this.buttons.push(new ActionButtonMetadata(
            'Подписать и отправить письмо заказчику',
            () => this.returnProjectWithSign(), 'btn-primary'));

          this.buttons.push(new ActionButtonMetadata(
            'Отправить письмо заказчику без ЭЦП',
            () => this.returnProjectWithoutSign(), 'btn-warning'));
        }
        if (this.getAllReferrals().length == this.lifecycleGroups.length && this.getActiveGroups().length > 0) {
          this.buttons.push(new ActionButtonMetadata(
            'Подписать и отправить в ГЭС',
            () => this.sendOnExaminationToCouncilsWithSign(), 'btn-primary'));

          this.buttons.push(new ActionButtonMetadata(
            'Отправить в ГЭС без ЭЦП',
            () => this.sendOnExaminationToCouncilsWithoutSign(), 'btn-warning'));
        }
      }
      if (this.project.state == 'ON_FINAL_SIGNING') {
        this.buttons.push(new ActionButtonMetadata(
          'Вернуть в подразделение',
          () => this.returnOnDepartmentFinalSigning(), 'btn-primary'));

        this.buttons.push(new ActionButtonMetadata(
          'Подписать и отправить письма заказчику',
          () => this.finishProjectWithSign(), 'btn-primary'));

        this.buttons.push(new ActionButtonMetadata(
          'Отправить письма заказчику без ЭЦП',
          () => this.finishProjectWithoutSign(), 'btn-warning'));
      }
    }
    if (this.role == Role.GKNT_DEPARTMENT_CHAIRMAN) {
      if (!anyMatch(this.project.state, ProjectState.ACCEPTED, ProjectState.REJECTED, ProjectState.RETURNED)) {
        this.buttons.push(new ActionButtonMetadata(
          'Назначить сотрудника',
          () => this.searchGkntWorkerComponent.show(), 'btn-primary'));
      }
      if (this.project.state == 'ON_DEPARTMENT_SIGNING') {
        this.buttons.push(new ActionButtonMetadata(
          'Вернуть назначенному сотруднику',
          () => this.returnOnChecking(), 'btn-primary'));

        if (this.getAllReferrals().length == this.lifecycleGroups.length && this.getActiveGroups().length > 0) {
          this.buttons.push(new ActionButtonMetadata(
            'Подписать направления в ГЭС',
            () => this.sendOnSigningWithSignReferrals(), 'btn-primary'));

          this.buttons.push(new ActionButtonMetadata(
            'Отправить направления в ГЭС без ЭЦП',
            () => this.sendOnSigningWithoutSign(), 'btn-warning'));
        }
        if (this.project.decisionDocument) {
          this.buttons.push(new ActionButtonMetadata(
            'Подписать письмо заказчику',
            () => this.sendOnSigningWithSignDecision(), 'btn-primary'));

          this.buttons.push(new ActionButtonMetadata(
            'Передать письмо на визирование без ЭЦП',
            () => this.sendOnSigningWithoutSign(), 'btn-warning'));
        }
      }
      if (this.project.state == 'ON_DEPARTMENT_FINAL_SIGNING' && this.hasAllLifecycleGroupDecisions()) {
        this.buttons.push(new ActionButtonMetadata(
          'Подписать письма заказчику',
          () => this.sendOnFinalSigningWithSign(), 'btn-primary'));

        this.buttons.push(new ActionButtonMetadata(
          'Передать письма на визирование без ЭЦП',
          () => this.sendOnFinalSigningWithoutSign(), 'btn-warning'));
      }
    }
    if (this.role == Role.GKNT_WORKER && this.project.state == 'ON_CHECKING') {
      if (this.getAllReferrals().length == this.lifecycleGroups.length && this.getActiveGroups().length > 0) {
        this.buttons.push(new ActionButtonMetadata(
          'Отправить на визирование направлений в ГЭС',
          () => this.sendOnDepartmentSigning(), 'btn-primary'));
      }
      if (this.project.decisionDocument) {
        this.buttons.push(new ActionButtonMetadata(
          'Вернуть без рассмотрения',
          () => this.sendOnDepartmentSigning(), 'btn-primary'));
      }
    }
  }

  reloadProject(project: ProjectDto) {
    this._projectService.getProject(project).subscribe(value => this.project = value);
    this.initActionButtons();
  }

  checkPossibleToReturnToGKNT(): boolean {
    let returnFromSection: boolean;
    for (const lc of this.lifecycleGroup.lifecycles) {
      if (lc.state == ProjectLifecycleState.RETURNED_WITHOUT_EXPERTISE) {
        returnFromSection = true;
      }
    }
    return (this.role == Role.BUREAU_CHAIRMAN && this.lifecycleGroup
      && this.lifecycleGroup.state == LifecycleGroupState.ON_WAITING_RESPONSE
      && !this.lifecycleGroup.isAnswerReceived && this.project.isRescheduleBureau
      && this.project.isBureauRemarksExpired)
      || (this.role == Role.BUREAU_CHAIRMAN && returnFromSection
        && this.lifecycleGroup.state != LifecycleGroupState.RETURNED_WITHOUT_EXPERTISE
        && this.lifecycleGroup.state != LifecycleGroupState.ACCEPTED);
  }

  viewDocument(doc: DocumentDto) {
    this._documentService.checkPdfView(doc).subscribe(res => {
      if (!res) {
        this._toasty.warn("Формат файла не поддерживается для предпросмотра. " +
            "Вместо этого, пожалуйста, скачайте его и откройте у себя на компьютере предустановленной программой");
      } else {
        this._dialogService.showPDFViewer("document", doc).subscribe();
        // this.selectedDocument = doc;
        // this.fileViewerModal.show();
      }
    });
  }

  private geAcquainted() {
    this.agreement = true;
    this.initActionButtons();
  }
}

// Re-export for backward compatibility
export {ActionButtonMetadata} from './action-button-metadata';
