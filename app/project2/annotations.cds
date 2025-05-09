using FirstAppSrv as service from '../../srv/service';

annotate service.pessoa with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'CPF', // Use labels mais amigáveis
                Value : cpf,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Nome',
                Value : nome,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Idade',
                Value : idade,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'Informações Pessoais',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'ProdutosFacet',
            Label : 'Produtos da Pessoa',
            // O target aqui ta certo, aponta para o LineItem da associação 'produtos'
            Target : 'produtos/@UI.LineItem'
        }
    ],
    // UI.LineItem para a lista de pessoas (na tela inicial, por exemplo)
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'CPF',
            Value : cpf,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Nome',
            Value : nome,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Idade',
            Value : idade,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Rascunho?',
            Value : IsActiveEntity 
        },

    ],
    UI.HeaderInfo : {
        Title : {
            $Type : 'UI.DataField',
            Value : nome,
        },
        TypeName : '',
        TypeNamePlural : '',
    },
    UI.SelectionPresentationVariant #table : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
            ],
        },
    },
);


annotate service.produto with @(
    // UI.LineItem para a lista de produtos (dentro do facet na página da pessoa)
    UI.LineItem : [
    {
        $Type : 'UI.DataField',
        Label : 'Nome do Produto',
        Value : nome
    },
    {
        $Type : 'UI.DataField',
        Label : 'Preço',
        Value : preco
    },
    {
        $Type : 'UI.DataField',
        Label : 'Categoria',
        Value : categoria
    }  
],
    // UI.Identification (geralmente aparece no cabecalho ou secão principal)
    UI.Identification : [
        {
            $Type : 'UI.DataField',
            Label : 'Nome do Produto',
            Value : nome
        },
        {
            $Type : 'UI.DataField',
            Label : 'Preço',
            Value : preco
        },
        {
            $Type : 'UI.DataField',
            Label : 'Categoria',
            Value : categoria
        }
    ],
    // Adicionando um FieldGroup para os detalhes do produto,
    // o que ajuda a estruturar a página de detalhes quando navegada.
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
             {
                $Type : 'UI.DataField',
                Label : 'Nome do Produto',
                Value : nome,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Preço',
                Value : preco,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Categoria',
                Value : categoria,
            }
        ],
    },
    // Adicionar um Facet para exibir o FieldGroup na página de detalhes do produto
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'ProdutoDetailsFacet',
            Label : 'Detalhes do Produto',
            Target : '@UI.FieldGroup#GeneratedGroup'
        }
    ]
);

annotate service.pessoa with @(
    Capabilities.Insertable : true,
    Capabilities.Updatable  : true,
    Capabilities.Deletable  : true
);

annotate service.produto with @(
    Capabilities.Insertable : true,
    Capabilities.Updatable  : true,
    Capabilities.Deletable  : true
);