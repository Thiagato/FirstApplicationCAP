using { FirstApp as this } from '../db/src/schema';

@path: '/odata/v4/api/first'
service FirstAppSrv {
  @odata.draft.enabled: true

  entity pessoa as projection on this.pessoa {
    ID,
    cpf,
    nome,
    idade,
    produtos
    
  };

  entity produto as projection on this.produto;
};
