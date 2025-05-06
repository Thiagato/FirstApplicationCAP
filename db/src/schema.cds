namespace FirstApp;

entity pessoa{
    key cpf: String(11);
    nome: String(100);
    idade: Integer;

    produtos : Composition of many produto on produtos.pessoa = $self;

};

entity produto {
     key id      : UUID;
     nome        : String(100);
     preco       : Decimal(10,2);
     categoria   : String(50);
     pessoa      : Association to pessoa;

}; 