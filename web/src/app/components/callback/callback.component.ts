import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-callback',
    templateUrl: './callback.component.html'
})
export class CallbackComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private http: HttpClient,
        private router: Router
    ) {}

    ngOnInit(): void {
        // Получаем параметр "data" из query-строки
        this.route.queryParams.subscribe(params => {
            const dataParam = params['data'];
            if (dataParam) {
                // Отправляем GET-запрос на бэкенд с этим параметром
                this.http.get('/examination-api/data/login-callback', {
                    params: { data: dataParam }
                }).subscribe({
                    next: (response: any) => {
                        // Здесь обрабатываем ответ от бэкенда (сохраняем токены, перенаправляем в приложение)
                        console.log('Успешный вход', response);
                        // Например, сохраняем токены и редиректим на главную
                        localStorage.setItem('access_token', response.access_token);
                        this.router.navigate(['/dashboard']);
                    },
                    error: (err) => {
                        console.error('Ошибка при обработке callback', err);
                        // Перенаправляем на страницу ошибки или показываем сообщение
                    }
                });
            } else {
                // Нет параметра data — что-то пошло не так
                console.error('Отсутствует параметр data');
                this.router.navigate(['/error']);
            }
        });
    }
}
