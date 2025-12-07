# Юнит-тесты, добавленные в проект

Этот файл описывает, какие юнит-тесты созданы в проекте и какую логику они проверяют.

## 1. GlobalToastyService

**Файл тестов:** `src/app/services/global-toasty.service.spec.ts`

Покрывает сервис глобальных уведомлений `GlobalToastyService`.

- **`should be created`**  
  Проверяет, что сервис успешно создаётся (корректный конструктор, зависимости не требуются).

- **`buildOptions should wrap string message into options object with title`**  
  Проверяет статический метод `buildOptions`:
  - вход: строка `msg` и заголовок `Title`;
  - ожидаемый результат: объект `{ title: 'Title', msg: 'msg' }`.

- **`should emit info event with correct type and data`**  
  Проверяет метод `info`:
  - подписка на `globalToastyHandled`;
  - вызов `service.info('test')`;
  - ожидается событие с:
    - `type === 'info'`;
    - `data.title === 'Информация'`;
    - `data.msg === 'test'`.

## 2. MeetingService (заседания секции и бюро)

**Файл тестов:** `src/app/services/meeting.service.spec.ts`

Покрывает HTTP‑логику сервиса заседаний `MeetingService`.

- **`should be created`**  
  Проверяет успешное создание сервиса с моками `HttpClientSecure`, `AuthService`, `DocumentService`.

- **`getPage should call http.post with role in url`**  
  Для `getPage(request)` проверяет:
  - вызов `http.post`;
  - URL содержит `/meeting/get/` и текущую роль `auth.role`;
  - тело запроса равно переданному `request`.

- **`finishMeeting should use postBlock with role in url`**  
  Для `finishMeeting({ id })`:
  - вызов `http.postBlock`;
  - URL: `${service.url}/finish/{id}/{role}`.

- **`createMeeting should call putBlock with correct url`**  
  Для `createMeeting(meeting)`:
  - вызов `http.putBlock`;
  - URL: `${service.url}/create/{role}`;
  - тело: объект `meeting`.

- **`editMeeting should call postBlock with correct url`**  
  Для `editMeeting(meeting)`:
  - вызов `http.postBlock`;
  - URL: `${service.url}/edit/{role}`;
  - тело: объект `meeting`.

- **`getRemarks should call postBlock with /get-remarks`**  
  Для `getRemarks(container)`:
  - вызов `http.postBlock`;
  - URL: `${service.url}/get-remarks`;
  - тело: контейнер замечаний `container`.

- **`generateCouncilMeetingProtocol should call documentService.generateDocument`**  
  Для `generateCouncilMeetingProtocol(id, form)`:
  - делегирование в `documentService.generateDocument`;
  - URL: `${service.url}/generate/{id}/protocol`;
  - форма `form` передаётся как есть.

- **`deleteMeetingProtocol should call documentService.deleteDocument with correct url`**  
  Для `deleteMeetingProtocol(doc, id, onDelete)`:
  - вызов `documentService.deleteDocument`;
  - URL: `${service.url}/delete/{id}/protocol`;
  - передаётся документ `doc`;
  - колбэк `onDelete` действительно вызывается.

- **`saveSectionRemarks should call postBlock with /save-section-remarks`**  
  Для `saveSectionRemarks(container)` (замечания секции):
  - `http.postBlock`;
  - URL: `${service.url}/save-section-remarks`;
  - тело: контейнер `container`.

- **`saveBureauRemarks should call postBlock with /save-bureau-remarks`**  
  Для `saveBureauRemarks(container)` (замечания бюро):
  - `http.postBlock`;
  - URL: `${service.url}/save-bureau-remarks`;
  - тело: контейнер `container`.

- **`rescheduleSectionMeeting should call postBlock with /reschedule-section`**  
  Для `rescheduleSectionMeeting(container)` (перенос заседания секции):
  - `http.postBlock`;
  - URL: `${service.url}/reschedule-section`;
  - тело: контейнер `container`.

## 3. ProjectService (проекты)

**Файл тестов:** `src/app/services/project.service.spec.ts`

Покрывает логику работы с проектами и документами в `ProjectService`.

- **`should be created`**  
  Сервис создаётся с моками `AuthService`, `HttpClientSecure`, `DocumentService`.

- **`getMessagesByRole should return ExpertReviewTermsMessages for EXPERT`**  
  Для роли `EXPERT` метод `getMessagesByRole()` возвращает ненулевой набор сообщений (термов) для экспертных заключений.

- **`prepareProject should delegate to base prepare with messages`**  
  Для `prepareProject(project)` проверяет, что вызывается унаследованный метод `prepare(project, messages)`.

- **`getPage should call http.post with /project/get`**  
  Для `getPage(request)`:
  - вызов `http.post`;
  - URL содержит `/project/get`;
  - тело: объект `request`.

- **`getProject should call getBlock with correct url`**  
  Для `getProject({ id })`:
  - вызов `http.getBlock`;
  - URL: `${service.url}/get/{id}`.

- **`createProject should call putBlock with /create`**  
  Для `createProject(project)`:
  - `http.putBlock`;
  - URL: `${service.url}/create`;
  - тело: объект `project`.

- **`updateProject should call postBlock with /update/{id}`**  
  Для `updateProject(id, project)`:
  - `http.postBlock`;
  - URL: `${service.url}/update/{id}`;
  - тело: объект `project`.

- **`deleteDocument should call documentService.deleteDocument with correct url`**  
  Для `deleteDocument(id, doc, onDelete)`:
  - вызов `documentService.deleteDocument`;
  - URL: `${service.url}/delete/{id}/document/{doc.id}`;
  - передаётся документ `doc`;
  - вызывается `onDelete`.

## 4. ExpertReviewService (экспертные заключения)

**Файл тестов:** `src/app/services/expert-review.service.spec.ts`

Покрывает логику работы с экспертными заключениями в `ExpertReviewService`.

- **`should be created`**  
  Сервис создаётся с моками `AuthService`, `HttpClientSecure`, `DocumentService`.

- **`prepareReview should delegate to base prepare with ExpertReviewTermsMessages`**  
  Для `prepareReview(review)` проверяет, что вызывается базовый метод `prepare(review, ExpertReviewTermsMessages)`.

- **`finishReview should call postBlock with /finish/{id}`**  
  Для `finishReview({ id })`:
  - `http.postBlock`;
  - URL: `${service.url}/finish/{id}`;
  - тело — `null`.

- **`rejectExpert should send reason in body`**  
  Для `rejectExpert({ id }, reason)`:
  - `http.postBlock`;
  - URL: `${service.url}/reject-expert/{id}`;
  - тело: `{ value: reason }`.

- **`generateReviewDocument should call documentService.generateDocument`**  
  Для `generateReviewDocument(id, form)`:
  - делегирование в `documentService.generateDocument`;
  - URL: `${service.url}/generate/{id}/review`;
  - передаётся форма `form`.

- **`deleteReviewDocument should call documentService.deleteDocument with correct url and invoke onDelete`**  
  Для `deleteReviewDocument(id, doc, onDelete)`:
  - `documentService.deleteDocument`;
  - URL: `${service.url}/delete/{id}/review`;
  - передаётся документ `doc`;
  - вызывается `onDelete`.

- **`getDraft should call http.getBlock with correct url`**  
  Для `getDraft({ id })`:
  - `http.getBlock`;
  - URL: `${service.url}/get-draft/{id}`.

- **`getExpertPayInfo should call postBlock with /get-expert-pay-info/{expertId}`**  
  Для `getExpertPayInfo(expertId, page)`:
  - `http.postBlock`;
  - URL: `${service.url}/get-expert-pay-info/{expertId}`;
  - тело: объект `PageRequest`.

## 5. DocumentService (документы)

**Файл тестов:** `src/app/services/document.service.spec.ts`

Покрывает работу с документами и шаблонами в `DocumentService`.

- **`should be created`**  
  Проверяет, что сервис успешно создаётся с моками HTTP, диалогов и тостов.

- **`downloadDocument should call downloadFile with correct url`**  
  Для `downloadDocument({ id })` проверяет, что приватный метод `downloadFile` вызывается с URL, содержащим:
  - путь `document`;
  - параметр `id={id}`;
  - строку токена `token=TEST_TOKEN`.

- **`saveTemplate should call postBlock with template data`**  
  Для `saveTemplate(template)`:
  - вызывается `http.postBlock`;
  - URL содержит `/document/template/data`;
  - тело: объект `template`.

- **`getTemplatesPage should call post with request`**  
  Для `getTemplatesPage(request)`:
  - вызывается `http.post`;
  - URL содержит `/document/template/`;
  - тело: объект `request`.

- **`deleteDocument should show confirm dialog, delete document and show success toast`**  
  Для `deleteDocument(doc, url, onDelete)`:
  - показывается диалог подтверждения через `DialogService.showConfirmDialog` (сообщение содержит имя документа);
  - после подтверждения вызывается `http.deleteBlock(url)`;
  - показывается тост `'Документ успешно удалён.'` через `GlobalToastyService`;
  - вызывается переданный колбэк `onDelete`.

- **`generateDocument should call postBlock and show success toast`**  
  Для `generateDocument(url, form)`:
  - вызывается `http.postBlock(url, form)` с последующим `pipe(map(...))`;
  - внутри маппера показывается тост `'Документ успешно создан.'`.

## 6. LifecycleGroupService (группы жизненного цикла)

**Файл тестов:** `src/app/services/lifecycle-group.service.spec.ts`

Покрывает логику сервиса `LifecycleGroupService`, работающего с группами жизненного цикла проекта и связанными документами.

- **`should be created`**  
  Сервис создаётся с моками `HttpClientSecure`, `AuthService`, `DocumentService`.

- **`prepareGroup should delegate to base prepare with LifecycleGroupTermsMessages`**  
  Для `prepareGroup(group)` проверяет, что вызывается базовый метод `prepare(group, LifecycleGroupTermsMessages)`.

- **`deleteLifecycleGroup should call deleteBlock with correct url`**  
  Для `deleteLifecycleGroup({ id })`:
  - вызывается `http.deleteBlock`;
  - URL: `${service.url}/delete/{id}`.

- **`attachSection should call postBlock with attach url`**  
  Для `attachSection(id, sectionId)`:
  - вызывается `http.postBlock`;
  - URL: `${service.url}/attach/{id}/section/{sectionId}`.

- **`generateLifecycleGroupDecisionDocument should call documentService.generateDocument`**  
  Для `generateLifecycleGroupDecisionDocument(id, form)`:
  - делегирует вызов в `documentService.generateDocument`;
  - URL: `${service.url}/generate/{id}/decision`;
  - форма `form` передаётся как есть.

- **`deleteLifecycleGroupDecisionDocument should call documentService.deleteDocument with correct url`**  
  Для `deleteLifecycleGroupDecisionDocument(doc, id, onDelete)`:
  - `documentService.deleteDocument` с URL `${service.url}/delete/{id}/decision`;
  - передаётся документ `doc`;
  - вызывается `onDelete`.

- **`returnToGknt should call postBlock with correct url and form content`**  
  Для `returnToGknt(id, form)`:
  - `http.postBlock` на `${service.url}/return/{id}`;
  - тело: объект формы `form`.

- **`saveAnswerForBureauRemarks should call postBlock with /save-answer-for-remark`**  
  Для `saveAnswerForBureauRemarks(group)`:
  - `http.postBlock` на `${service.url}/save-answer-for-remark`;
  - тело: объект `group`.

- **`replyForBureauRemark should call postBlock with /reply-for-remark`**  
  Для `replyForBureauRemark(group)`:
  - `http.postBlock` на `${service.url}/reply-for-remark`;
  - тело: объект `group`.

- **`getDraft should call getBlock with /get-conclusion-draft/{id}`**  
  Для `getDraft({ id })`:
  - `http.getBlock` на `${service.url}/get-conclusion-draft/{id}`.

- **`saveDraft should call post with /save-conclusion-draft/{id}`**  
  Для `saveDraft(id, draft)`:
  - `http.post` на `${service.url}/save-conclusion-draft/{id}`;
  - тело: объект `draft`.

## 7. AppComponent (корневой компонент)

**Файл тестов:** `src/app/app.component.spec.ts`

Покрывает базовую инициализацию корневого компонента приложения `AppComponent`.

- **`should create the app component`**  
  Проверяет, что компонент успешно создаётся при передаче моков `BsLocaleService` и `FaIconLibrary`.

- **`should set datepicker locale to ru on construction`**  
  Для конструктора `AppComponent` проверяет, что при создании компонента вызывается `localeService.use('ru')` и локаль `ru` действительно попадает в список использованных локалей в мок‑сервисе.

- **`should register fontawesome icons on construction`**  
  Проверяет, что при создании компонента вызывается `faIconLibrary.addIcons(...)`:
  - был хотя бы один вызов `addIcons`;
  - в первом вызове передан непустой список иконок.

## 8. HttpClientSecure (HTTP-клиент с обработкой ошибок и прогресса)

**Файл тестов:** `src/app/services/http.client.spec.ts`

Покрывает базовое поведение обёртки над `HttpClient` — класс `HttpClientSecure`.

- **`getTokenParamsString should use access token from storage`**  
  Проверяет, что метод `getTokenParamsString` формирует строку вида `token={accessToken}` на основе значения, возвращаемого `StorageService.getAccessToken()`.

- **`get should call underlying HttpClient.get with built headers`**  
  Для `get('/url')`:
  - вызывается `HttpClient.get` с переданным URL;
  - опции проходят через `buildHeaders`, и по умолчанию устанавливается `observe: 'body'`.

- **`postBlock should call post and toggle progress show/hide`**  
  Для `postBlock('/url', body)`:
  - вызывается `post('/url', JSON.stringify(body))` базового `HttpClient`;
  - метод обёрнут в `block`, который:
    - вызывает `ProgressService.show()` при старте;
    - вызывает `ProgressService.hide()` при завершении.

- **`handleError should hide progress and show toast message for 500 error`**  
  При ошибке HTTP со статусом `500`:
  - через `handleError` вызывается `progress.hide()`;
  - в `GlobalToastyService.err` попадает запись с кодом `500` и сообщением об ошибке.

---

## Как использовать этот README

- Чтобы понять, какие участки логики уже покрыты тестами, смотри соответствующий раздел сервиса.
- При добавлении новых тестов для сервисов или компонентов можно:
  - дописывать новые пункты сюда;
  - ориентироваться на существующие описания и стиль тестов как на шаблон.
