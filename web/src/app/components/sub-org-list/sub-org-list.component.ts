import {Component, ChangeDetectionStrategy, signal, ChangeDetectorRef, OnInit} from "@angular/core";
import {PersonService} from "@app/services/person.service";
import {OrgDto} from "@app/dto/OrgDto";
import {PersonDto} from "@app/dto/PersonDto";
import {DataService} from "@app/services/data.service";

@Component({
    selector: 'app-sub-org-list',
    templateUrl: 'sub-org-list.component.html',
    styles: [`
      .card-body {
        font-size: 0.9rem;
      }
      
      h5 {
        font-size: 1rem;
      }
      
      h2 {
        font-size: 1.5rem;
      }
      
      .fst-italic {
        font-size: 0.875rem;
      }
    `],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SubOrgListComponent implements OnInit {

  person = signal<PersonDto | undefined>(undefined);
  orgs = signal<OrgDto[]>([]);

  constructor(
    private _personService: PersonService,
    private _dataService: DataService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this._personService.getCurrentPerson().subscribe({
      next: (personValue) => {
        if (personValue) {
          this.person.set(personValue);
          this._dataService.getSubOrgs(personValue.org).subscribe({
            next: (orgs) => {
              this.orgs.set(orgs);
              this.cdr.markForCheck();
            }
          });
        } else {
          this.orgs.set([]);
          this.cdr.markForCheck();
        }
      }
    });
  }
}