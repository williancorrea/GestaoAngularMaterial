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
    displayedColumns = ['numero_contrato', 'image', 'name', 'category', 'price', 'quantity', 'buttons'];

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
        this.pesquisar();
    }


    paginadorEvento(event?: PageEvent): PageEvent {

        console.log('MUDOU A BAGAÇA', event.pageIndex * event.pageSize);

        this.pesquisar();

        // TODO: FAZER FUNCIONAR O PAGINADOR

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

    pesquisar(): void {
        this.fretamentoService.listarTodos(this.paginador, this.filtro).then(response => {

            this.fretamentoList = response['content'];
            this.paginador.length = response['totalElements'];

        }).catch(error => {
            // TODO: Colocar mensagem de erro para o usuario
            console.log('ERRO AO SALVAR: ', error);
            // this.errorHandler.handle(error);
        });
    }

    imprimirContrato(key: string): void {
        this.fretamentoService.gerarContrato(key).then(relatorio => {

            const a = document.createElement('a');
            a.style['display'] = 'none';
            const blob = new Blob([relatorio], {type: 'application/pdf'});
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = 'Contrato.pdf';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 100);

        }).catch(error => {
            // TODO: Colocar mensagem de erro para o usuario
            console.log('ERRO AO SALVAR: ', error);
            // this.errorHandler.handle(error);
        });
    }
}
