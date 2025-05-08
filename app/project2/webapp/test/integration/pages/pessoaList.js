sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'firstapp.fiorielements.project2',
            componentId: 'pessoaList',
            contextPath: '/pessoa'
        },
        CustomPageDefinitions
    );
});