import {Component, Input} from "@angular/core";
import {ExpertReviewService} from "@app/services/expert-review.service";
import {ExpertPayInfoDto} from "@app/dto/ExpertPayInfoDto";
import {FilterAndPages} from "@app/components/common-components/page-and-filter/filter-and-pages";
import {SearchPageRequest} from "@app/components/common-components/page-and-filter/model/SearchPageRequest";
import {PageRequest} from "@app/components/common-components/page-and-filter/model/PageRequest";

@Component({
    selector: 'app-expert-pay-info',
    templateUrl: './expert-pay-info.component.html',
    standalone: false
})

export class ExpertPayInfoComponent extends FilterAndPages<ExpertPayInfoDto> {

    constructor(private _expertReviewService: ExpertReviewService) {
        super()
    }

    expertInfoDtos: ExpertPayInfoDto[] = [];
    expertId: number;

    @Input() set expert(expert: number) {
        this.expertInfoDtos = [];
        this._page.page = 0;
        this._pagination.page = 0;
        this._searchRequest.paging = new PageRequest();
        this._searchRequest = new SearchPageRequest(this._pagination);
        this.expertId = expert;
        this.loadPage();
    }

    protected loadPage() {
        if (this.expertId == null) {
            return;
        }
        this._expertReviewService.getExpertPayInfo(this.expertId, this._searchRequest.paging)
            .subscribe(value => {
                    console.log(value);
                    this._page = value;
                    this.expertInfoDtos = value.content;
                }
            );
    }
}
