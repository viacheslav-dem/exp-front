import {Component, Input, ChangeDetectionStrategy, signal, ChangeDetectorRef} from "@angular/core";
import {ExpertReviewService} from "@app/services/expert-review.service";
import {ExpertPayInfoDto} from "@app/dto/ExpertPayInfoDto";
import {FilterAndPages} from "@app/components/common-components/page-and-filter/filter-and-pages";
import {SearchPageRequest} from "@app/components/common-components/page-and-filter/model/SearchPageRequest";
import {PageRequest} from "@app/components/common-components/page-and-filter/model/PageRequest";

@Component({
    selector: 'app-expert-pay-info',
    templateUrl: './expert-pay-info.component.html',
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ExpertPayInfoComponent extends FilterAndPages<ExpertPayInfoDto> {

    constructor(private _expertReviewService: ExpertReviewService,
                private cdr: ChangeDetectorRef) {
        super()
    }

    expertInfoDtos = signal<ExpertPayInfoDto[]>([]);
    private _expertId = signal<number | undefined>(undefined);

    @Input() set expert(expert: number) {
        this.expertInfoDtos.set([]);
        this._page.page = 0;
        this._pagination.page = 0;
        this._searchRequest.paging = new PageRequest();
        this._searchRequest = new SearchPageRequest(this._pagination);
        this._expertId.set(expert);
        this.loadPage();
    }

    get expertId(): number | undefined {
        return this._expertId();
    }

    protected loadPage() {
        const expertIdValue = this._expertId();
        if (expertIdValue == null) {
            return;
        }
        this._expertReviewService.getExpertPayInfo(expertIdValue, this._searchRequest.paging)
            .subscribe({
                next: (value) => {
                    console.log(value);
                    this._page = value;
                    this.expertInfoDtos.set(value.content);
                    this.cdr.markForCheck();
                }
            });
    }
}
