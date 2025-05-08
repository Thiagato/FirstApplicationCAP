sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'firstapp/fiorielements/project2/test/integration/FirstJourney',
		'firstapp/fiorielements/project2/test/integration/pages/pessoaList',
		'firstapp/fiorielements/project2/test/integration/pages/pessoaObjectPage',
		'firstapp/fiorielements/project2/test/integration/pages/produtoObjectPage'
    ],
    function(JourneyRunner, opaJourney, pessoaList, pessoaObjectPage, produtoObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('firstapp/fiorielements/project2') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onThepessoaList: pessoaList,
					onThepessoaObjectPage: pessoaObjectPage,
					onTheprodutoObjectPage: produtoObjectPage
                }
            },
            opaJourney.run
        );
    }
);