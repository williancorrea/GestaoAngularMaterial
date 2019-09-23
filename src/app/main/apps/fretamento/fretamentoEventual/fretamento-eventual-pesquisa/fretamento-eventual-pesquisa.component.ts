import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

import {fuseAnimations} from '@fuse/animations';
import {environment} from '../../../../../../environments/environment';
import {FretamentoService} from '../../fretamento.service';

@Component({
    selector: 'app-fretamento-eventual-pesquisa',
    templateUrl: './fretamento-eventual-pesquisa.component.html',
    styleUrls: ['./fretamento-eventual-pesquisa.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class FretamentoEventualPesquisaComponent implements OnInit, AfterViewInit {

    fretamentoList: null;
    // displayedColumns = ['id', 'image', 'name', 'category', 'price', 'quantity', 'active'];
    displayedColumns = ['image', 'name', 'category', 'price', 'quantity'];

    @ViewChild(MatPaginator, {static: true})
    paginador: MatPaginator;

    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild('filter', {static: true})
    filtro: ElementRef;

    env: any;

    constructor(private fretamentoService: FretamentoService) {
    }

    ngOnInit(): void {
        this.env = environment;
    }

    ngAfterViewInit(): void {
        this.fretamentoService.listarTodos(this.paginador, this.filtro).then(response => {

            this.fretamentoList = response['content'];
            this.paginador.length = response['totalElements'];

        }).catch(error => {
            // TODO: Colocar mensagem de erro para o usuario
            console.log('ERRO AO SALVAR: ', error);
            // this.errorHandler.handle(error);
        });
    }



    paginadorEvento(event?: PageEvent): PageEvent {

        console.log('MUDOU A BAGAÇA', event.pageIndex * event.pageSize);


        // this.fooService.getdata(event).subscribe(
        //     response =>{
        //         if(response.error) {
        //             // handle error
        //         } else {
        //             this.datasource = response.data;
        //             this.pageIndex = response.pageIndex;
        //             this.pageSize = response.pageSize;
        //             this.length = response.length;
        //         }
        //     },
        //     error =>{
        //         // handle error
        //     }
        // );
        return event;
    }
}
