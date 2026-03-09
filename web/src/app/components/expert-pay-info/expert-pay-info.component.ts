import {Component, ChangeDetectionStrategy, signal, ChangeDetectorRef, effect, input, untracked} from "@angular/core";
import {ExpertReviewService} from "@app/services/expert-review.service";
import {ExpertPayInfoDto} from "@app/dto/ExpertPayInfoDto";
import {FilterAndPages} from "@app/components/common-components/page-and-filter/filter-and-pages";
import {SearchPageRequest} from "@app/components/common-components/page-and-filter/model/SearchPageRequest";
import {Pagination} from "@app/components/common-components/page-and-filter/model/Pagination";
import {Page} from "@app/components/common-components/page-and-filter/model/Page";

@Component({
    selector: 'app-expert-pay-info',
    templateUrl: './expert-pay-info.component.html',
    styleUrls: ['./expert-pay-info.component.scss'],
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

    readonly expert = input<number | undefined>(undefined);
    private readonly _expertEffect = effect(() => {
        const expert = this.expert();
        if (expert == null) {
            untracked(() => this._expertId.set(undefined));
            return;
        }
        // untracked: эффект должен отслеживать ТОЛЬКО input-сигнал expert().
        // Без untracked чтение _pagination/_expertId и запись _page/_pagination
        // (новые объекты каждый раз) создают бесконечный цикл перезапуска эффекта.
        untracked(() => {
            this.expertInfoDtos.set([]);
            this._page = new Page<ExpertPayInfoDto>();

            const nextPagination = new Pagination(this._pagination?.itemsPerPage);
            nextPagination.page = 1;
            this._pagination = nextPagination;

            this._searchRequest = new SearchPageRequest(nextPagination);
            this._expertId.set(expert);
            this.setLoading(true);
            this.loadPage();
        });
    });

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
                    this._page = value;
                    this.expertInfoDtos.set(value.content);
                    this.setLoading(false);
                    this.cdr.markForCheck();
                },
                error: () => {
                    this.setLoading(false);
                    this.cdr.markForCheck();
                }
            });
    }
}
