import { GlobalToastyService } from './global-toasty.service';

describe('GlobalToastyService', () => {
  let service: GlobalToastyService;

  beforeEach(() => {
    service = new GlobalToastyService();
  });

  // проверяет, что сервис успешно создаётся
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // проверяет, что buildOptions оборачивает строку в объект с title и msg
  it('buildOptions should wrap string message into options object with title', () => {
    const result: any = (GlobalToastyService as any).buildOptions('msg', 'Title');

    expect(result).toEqual({
      title: 'Title',
      msg: 'msg'
    });
  });

  // проверяет, что метод info генерирует событие с типом info и корректными данными
  it('should emit info event with correct type and data', (done) => {
    service.globalToastyHandled.subscribe((payload: any) => {
      try {
        expect(payload.type).toBe('info');
        expect(payload.data.title).toBe('Информация');
        expect(payload.data.msg).toBe('test');
        done();
      } catch (e) {
        done.fail(e);
      }
    });

    service.info('test');
  });
});
