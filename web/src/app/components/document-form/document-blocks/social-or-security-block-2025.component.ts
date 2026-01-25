import {Component, input, output} from '@angular/core';
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";
import {ProjectDto} from "@app/dto/ProjectDto";

@Component({
    selector: 'app-social-or-security-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Объект государственной экспертизы является социально значимым или направленным на обеспечение национальной безопасности:
      </label>
      <input type="hidden" [ngModel]="_form().socialOrSecurity" name="socialOrSecurity" required>
      <div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form().socialOrSecurity === true}" (click)="stateButton(true)">
          Да (социально значимый / направлен на обеспечение национальной безопасности)
        </button>
        <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form().socialOrSecurity === false && _form().socialOrSecurity !== undefined}" (click)="stateButton(false)">
          Нет
        </button>
      </div>
      @if (full()) {
        <textarea
          [ngModel]="_form().socialOrSecurityText"
          (ngModelChange)="emitPatch({ socialOrSecurityText: $event })"
          name="socialOrSecurityText"
          required
          minlength="30"
          maxlength="5000"
          rows="3"
          class="form-control mt-05"
          placeholder="Обязательный текст (не менее 30 символов)"></textarea>
      }
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Решение об отнесении объекта государственной экспертизы к социально значимому или к направленному на обеспечение
            национальной безопасности принимается с учетом цели, задач и обоснования выполнения работ (приводится обоснование эксперта).
          </p>
          <p>
            Под социально значимыми объектами государственной экспертизы подразумеваются объекты,
            предусматривающие изменения в социальной, культурной, экологической, правовой и политической сферах,
            создающие условия для развития личности и повышения качества жизни (здоровье, уровень, образ и продолжительность жизни),
            обусловленные использованием результатов научной и научно-технической деятельности (в том числе при принятии государственными
            органами и организациями административно-управленческих мер и решений) (абзац тринадцатый пункта 2 Положения о коммерциализации
            результатов научной и научно-технической деятельности, созданных за счет государственных средств).
          </p>
          <p>
            Под национальной безопасностью понимается состояние защищенности национальных интересов Республики Беларусь от внутренних и
            внешних угроз, обеспечивающее ее устойчивое развитие (абзац второй пункта 4 Концепции национальной безопасности Республики Беларусь,
            утвержденной решением Всебелорусского народного собрания от 25 апреля 2024 г. № 5).
          </p>
          <p>
            Для решения задач обеспечения национальной безопасности создаются силы обеспечения национальной безопасности,
            в состав которых входят Вооруженные Силы, органы государственной безопасности, органы пограничной службы,
            внутренние войска Министерства внутренних дел, Служба безопасности Президента Республики Беларусь,
            Оперативно-аналитический центр при Президенте Республики Беларусь, другие войска и воинские формирования Республики Беларусь,
            Следственный комитет, Государственный комитет судебных экспертиз, органы внутренних дел, органы и подразделения по чрезвычайным ситуациям,
            органы финансовых расследований, таможенные органы, Государственная инспекция охраны животного и растительного мира
            при Президенте Республики Беларусь, орган финансового мониторинга, подразделения (службы) иных государственных органов,
            обеспечивающие безопасное ведение работ в промышленности, энергетике, на транспорте, безопасность связи, информации и
            другое (пункт 65 Концепции национальной безопасности Республики Беларусь).
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class SocialOrSecurityBlock2025Component {

    socialOrSecurityOptions: string[] = [
        'да (социально значимый / направлен на обеспечение национальной безопасности) ',
        'нет',
    ];

    readonly num = input<string>("10.3");

    readonly full = input<boolean>(true);

    readonly isTextRequired = input<boolean>(false);

    readonly _form = input<SocialOrSecurityBlock2025Form>(undefined);

    readonly project = input<ProjectPlainDto | ProjectDto>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<SocialOrSecurityBlock2025Form>>();

    emitPatch(patch: Partial<SocialOrSecurityBlock2025Form>) {
        // Иммутабельный путь: не мутируем input-форму, а просим контейнер применить patch.
        this.formPatch.emit(patch);
        // Оставляем событие для обратной совместимости (часть форм привязана к нему).
        this.onConditionsChanged.emit(true);
    }

    stateButton(flag: boolean) {
        this.emitPatch({ socialOrSecurity: flag });
    }

}

type SocialOrSecurityBlock2025Form = {
    socialOrSecurity: boolean;
    socialOrSecurityText: string;
};