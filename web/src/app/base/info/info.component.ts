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

    }



}
