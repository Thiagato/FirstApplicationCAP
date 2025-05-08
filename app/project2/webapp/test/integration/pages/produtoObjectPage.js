sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'firstapp.fiorielements.project2',
            componentId: 'produtoObjectPage',
            contextPath: '/pessoa/produtos'
        },
        CustomPageDefinitions
    );
});