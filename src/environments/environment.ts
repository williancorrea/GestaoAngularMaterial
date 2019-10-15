// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    hmr: false,


    apiUrl: 'http://192.168.5.11:8080',
    tokenWhitelistedDomains: [ new RegExp('192.168.5.11:8080') ],
    // apiUrl: 'http://localhost:8080',
    // tokenWhitelistedDomains: [ new RegExp('localhost:8080') ],


    tokenBlacklistedRoutes: [ new RegExp('\/oauth\/token') ],

    // ng serve --proxy-config proxy.config.json
    // apiUrl: 'api',

    dataTable: {
        filterDelay: 500,
        rows: 10,
        rowsPerPageOptions: [5, 10, 20, 100]
    },

    comboBox: {
        minCaracterParaPesquisa: 1,
        filtroDelay: 500,
        linhas: 50
    },
    imposto: {
        nfe: 9.13,
        cteos: 16.73
    }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


// disableHostCheck é igual a  Access-Control-Allow-Origin: *
// ng serve --port 4200 --host 192.168.5.11 --disableHostCheck
