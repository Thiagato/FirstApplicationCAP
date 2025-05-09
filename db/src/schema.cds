namespace FirstApp;


using { cuid } from '@sap/cds/common';
@odata.draft.enabled
entity pessoa : cuid {
  cpf     : String(11);
  nome    : String(100);
  idade   : Integer;

  produtos : Composition of many produto on produtos.pessoa = $self;

  status_label : String(20);
}

entity produto : cuid {
    nome        : String(100);
    preco       : Decimal(10,2);
    categoria   : String(50);

    pessoa      : Association to pessoa;
}
