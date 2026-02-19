import {Component, OnInit} from "@angular/core";
import {AuthService} from "@app/services/auth.service";
import {Router} from "@angular/router";
import {StorageService} from "@app/services/storage.service";

@Component({
    selector: 'app-info',
    templateUrl: 'info.component.html',
    standalone: false
})
export class InfoComponent implements OnInit {

    private signed_data_to_check_in_cp: string;

    constructor(private _authService: AuthService,
                private storageService: StorageService) {
    }

    ngOnInit(): void {
    }


    input() {
        this._authService.inputISEFUL().subscribe(res =>{
            console.log("Запрос выполнен");
            this._authService.inputCP(res.signed_data_to_check_in_cp).subscribe(res =>{
                console.log("Запрос выполнен");
                console.log(res);
                if(res['step 0'] === 'OK'){
                    // Создаём скрытую форму для GET-запроса на бэкенд
                    const form = document.createElement('form');
                    form.method = 'GET';
                    form.action = '/examination-api/data/redirect-to-esiful'; // убедитесь, что путь правильный
                    form.style.display = 'none';
                    document.body.appendChild(form);
                    form.submit();
                    // form.submit() сразу отправляет запрос, и браузер покидает текущую страницу.
                    // Дальнейший код после submit() может не выполниться, но это нормально.
                }
            })
        })
    }


}
