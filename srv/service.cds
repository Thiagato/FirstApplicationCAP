using { FirstApp as this } from '../db/src/schema';

@path: '/odata/v4/api/first'
service FirstAppSrv {

  entity pessoa as projection on this.pessoa;

  entity produto as projection on this.produto;

};