export const environment = {
    production: true,
    hmr: false,

    apiUrl: 'https://gestao-api-wcorrea.herokuapp.com',
    // Verificar arquivo de proxy - proxy.config.json
    // apiUrl: '/api',

    tokebWhitelistedDomains: [/gestao-api-wcorrea.herokuapp.com/],
    tokenBlacklistedRoutes: [/\/oauth\/token/],

    dataTable: {
        filterDelay: 500,
        rows: 5,
        rowsPerPageOptions: [5, 10, 20, 50, 100]
    },
    comboBox: {
        minCaracterParaPesquisa: 1,
        filtroDelay: 500,
        linhas: 100
    }
};
