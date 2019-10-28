export const environment = {
    production: true,
    hmr: false,

    apiUrl: 'http://192.168.5.15:8080/gestao-api',
    // Verificar arquivo de proxy - proxy.config.json
    // apiUrl: '/api',

    tokenWhitelistedDomains: [new RegExp('http://192.168.5.15:8080/gestao-api')],
    tokenBlacklistedRoutes: [ new RegExp('\/oauth\/token') ],

    dataTable: {
        filterDelay: 500,
        rows: 5,
        rowsPerPageOptions: [5, 10, 20, 50, 100]
    },
    comboBox: {
        minCaracterParaPesquisa: 1,
        filtroDelay: 500,
        linhas: 100
    },
    imposto: {
        nfe: 9.13,
        cteos: 16.73
    }
};
