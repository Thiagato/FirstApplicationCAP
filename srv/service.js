const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
  const { pessoa } = this.entities;
  const db = await cds.connect.to('db');

  this.before('CREATE', 'pessoa', async (req) => {
    const { cpf, nome, idade } = req.data;

    if (!cpf || !/^\d{11}$/.test(cpf)) {
      return req.reject(400, 'CPF inválido. Deve conter 11 dígitos numéricos.');
    }

    if (!nome || nome.trim().length < 3) {
      return req.reject(400, 'Nome muito curto. Mínimo 3 caracteres.');
    }

    if (idade < 0 || idade > 120) {
      return req.reject(400, 'Idade inválida. Deve ser entre 0 e 120.');
    }

    //ve o cpf se ele ja n existe
    const existing = await db.run(
      SELECT.one.from(pessoa).where({ cpf })
    );

    if (existing) {
      return req.reject(400, `Já existe uma pessoa cadastrada com o CPF ${cpf}.`);
    }
  });

  this.on('READ', 'pessoa', async (req) => {
    const db = await cds.connect.to('db');
    return await db.run(req.query);
  });

  //
  // PRODUTO
  //

  this.before('CREATE', 'produto', async (req) => {
    const { nome, preco, categoria, pessoa_cpf } = req.data;

    if (!nome || nome.trim().length < 2) {
      return req.reject(400, 'Nome do produto é obrigatório e deve ter pelo menos 2 caracteres.');
    }

    if (preco <= 0) {
      return req.reject(400, 'Preço inválido. Deve ser maior que zero.');
    }

    if (!categoria || categoria.trim() === "") {
      return req.reject(400, 'Categoria é obrigatória.');
    }

    if (!pessoa_cpf || pessoa_cpf.length !== 11 || !/^\d+$/.test(pessoa_cpf)) {
      return req.reject(400, 'CPF inválido. Deve conter exatamente 11 números.');
    }

    //  Verifica se o CPF existe na tabela pessoa
    const cpfExiste = await db.run(SELECT.one.from(pessoa).where({ cpf: pessoa_cpf }));
    if (!cpfExiste) {
      return req.reject(400, `Pessoa com CPF ${pessoa_cpf} não encontrada.`);
    }
  });

  this.on('READ', 'produto', async (req) => {
    const db = await cds.connect.to('db');
    return await db.run(req.query);
  });

});
