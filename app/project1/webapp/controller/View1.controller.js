sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, MessageBox, JSONModel) {
    "use strict";

    return Controller.extend("firstapp.project1.controller.View1", {

        _typingTimeoutId: null,

        onInit: function () {
            // Cria modelo JSON para o formulário
            const oFormModel = new JSONModel({
                cpf: "",
                nome: "",
                idade: ""
            });
            this.getView().setModel(oFormModel, "formModel");

            //modelo json para o produto
            const oProdutoModel = new JSONModel({
                nome: "",
                preco: "",
                categoria: "",
                pessoa_cpf: ""
            });
            this.getView().setModel(oProdutoModel, "formModelProduto");

            this.getOwnerComponent().getRouter()
            .getRoute("RouteView1")
            .attachPatternMatched(this._onRouteMatched, this);

        },
        //viajar entre telas
       

        onVerDetalhes: function (oEvent) {
            var oItem = oEvent.getSource().getParent(); // ColumnListItem
            var sCpf = oItem.getBindingContext().getProperty("cpf");
        
            this.getOwnerComponent().getRouter().navTo("View2", {
                cpf: sCpf
            });
        },

        _onRouteMatched: function () {
            // Atualiza tabela de pessoas
            const oPessoasTable = this.byId("pessoasTable");
            if (oPessoasTable) {
                const oBinding = oPessoasTable.getBinding("items");
                if (oBinding) {
                    oBinding.refresh();
                }
            }

            //a gente pode transformar isso numa função e dps só chamar caso tenha mt tabelas
        
            // Atualiza tabela de produtos
            const oProdutosTable = this.byId("produtosTable");
            if (oProdutosTable) {
                const oBinding = oProdutosTable.getBinding("items");
                if (oBinding) {
                    oBinding.refresh();
                }
            }
        },
        
        _atualizarStatusLabel: function (texto, cor) {
            const label = this.byId("statusLabel");
            if (label) {
                label.setText(texto);
                label.setColorScheme(cor); 
            }
        },

        onCampoDigitado: function () {
            const infoLabel = this.getView().byId("statusLabel");

            if (infoLabel) {
                infoLabel.setText("Escrevendo...");
                infoLabel.setColorScheme(6);
            }

            if (this._typingTimeoutId) {
                clearTimeout(this._typingTimeoutId);
            }

            this._typingTimeoutId = setTimeout(() => {
                if (infoLabel) {
                    infoLabel.setText("Aguardando preenchimento");
                    infoLabel.setColorScheme(1); // cinza claro
                }
            }, 500);
        },

        onSalvarPress: async function () {
            const self = this;
            try {
                const oView = this.getView();
                const oFormData = oView.getModel("formModel").getData();
                const oModel = oView.getModel(); // OData V4 model
        
                const cpf = oFormData.cpf?.trim();
                const nome = oFormData.nome?.trim();
                const idade = parseInt(oFormData.idade);

                // Validação básica no front-end
                if (!cpf || !nome || isNaN(idade)) {
                    MessageToast.show("Preencha todos os campos.");
                    this._atualizarStatusLabel("Campos incompletos", 9);
                    return;
                }
        
                if (!/^\d{11}$/.test(cpf)) {
                    MessageToast.show("CPF inválido. Deve conter exatamente 11 dígitos.");
                    this._atualizarStatusLabel("CPF inválido", 9);
                    return;
                }
        
                if (nome.length < 3) {
                    MessageToast.show("Nome muito curto. Mínimo 3 caracteres.");
                    this._atualizarStatusLabel("Nome muito curto", 9);
                    return;
                }
        
                if (idade < 0 || idade > 120) {
                    MessageToast.show("Idade inválida. Deve estar entre 0 e 120.");
                    this._atualizarStatusLabel("Idade inválida", 9);
                    return;
                }
        
                // Criação (CREATE)
                const oBinding = oModel.bindList("/pessoa");
                const oContext = oBinding.create({
                    cpf: oFormData.cpf,
                    nome: oFormData.nome,
                    idade: parseInt(oFormData.idade)
                });
        
                await oContext.created();
        
                MessageToast.show("Pessoa criada com sucesso!");
        
                // Limpa o formulário
                oView.getModel("formModel").setData({
                    cpf: "",
                    nome: "",
                    idade: ""
                });
        
                // Atualiza a tabela
                const table = this.byId("pessoasTable");
                if (table) {
                    table.getBinding("items").refresh();
                }
        
                const infoLabel = this.byId("statusLabel");
                infoLabel.setText("Salvo com sucesso");
                infoLabel.setColorScheme(3); 
        
            } catch (error) {
                sap.m.MessageBox.error("Erro ao salvar:\n" + error.message);
                self._atualizarStatusLabel("Erro ao salvar", 9);
            }
        },
        
             onDeletarPessoa: async function (oEvent) {
            // Pega o CPF do botão via CustomData
            const cpf = oEvent.getSource().getCustomData().find(d => d.getKey() === "cpf").getValue();
        
            const oModel = this.getView().getModel();
        
            const confirm = await new Promise((resolve) => {
                sap.m.MessageBox.confirm(
                    `Deseja realmente deletar o CPF ${cpf}?`,
                    {
                        title: "Confirmação",
                        actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                        onClose: (oAction) => resolve(oAction === sap.m.MessageBox.Action.YES)
                    }
                );
            });
        
            if (!confirm) return;
        
            try {
                // Remove a entidade pessoa com a key cpf
                await oModel.delete(`/pessoa(cpf='${cpf}')`);
        
                sap.m.MessageToast.show("Pessoa deletada com sucesso!");
        
                // Atualiza os dados da tabela
                const table = this.byId("pessoasTable");
                if (table) {
                    table.getBinding("items").refresh();
                }
                // Atualiza os dados da tabela produto tb
                const tableproduto = this.byId("produtosTable");
                if (tableproduto) {
                    tableproduto.getBinding("items").refresh();
                }
        
            } catch (error) {
                sap.m.MessageBox.error("Erro ao deletar:\n" + error.message);
            }
        },

        // 
        // PRODUTOS
        //
        onSalvarProduto: async function () {
            const oView = this.getView();
            const oFormData = oView.getModel("formModelProduto").getData();
            const oModel = oView.getModel(); // OData V4
        
            // Validações simples no front-end
            if (!oFormData.nome || !oFormData.preco || !oFormData.categoria || !oFormData.pessoa_cpf) {
                MessageToast.show("Preencha todos os campos.");
                return;
            }
        
            if (isNaN(oFormData.preco) || parseFloat(oFormData.preco) <= 0) {
                MessageToast.show("Preço inválido. Deve ser maior que zero.");
                return;
            }
        
            if (oFormData.pessoa_cpf.length !== 11 || !/^\d+$/.test(oFormData.pessoa_cpf)) {
                MessageToast.show("CPF inválido. Deve conter exatamente 11 números.");
                return;
            }
        
            try {
                const oBinding = oModel.bindList("/produto");
                const oContext = oBinding.create({
                    nome: oFormData.nome,
                    preco: parseFloat(oFormData.preco),
                    categoria: oFormData.categoria,
                    pessoa_cpf: oFormData.pessoa_cpf
                });
        
                await oContext.created();
        
                MessageToast.show("Produto criado com sucesso!");
        
                oView.getModel("formModelProduto").setData({
                    nome: "",
                    preco: "",
                    categoria: "",
                    pessoa_cpf: ""
                });
        
                const table = this.byId("produtosTable");
                if (table) {
                    table.getBinding("items").refresh();
                }

                
        
            } catch (error) {
                const mensagem = error.message || (error.responseText ? error.responseText : "Erro inesperado.");
                sap.m.MessageBox.error("Erro ao salvar produto:\n" + mensagem);
            }
        },
        
        onDeletarProduto: async function (oEvent) {
            const produtoId = oEvent.getSource().getCustomData().find(d => d.getKey() === "id").getValue();
            const oModel = this.getView().getModel();
        
            const confirm = await new Promise((resolve) => {
                sap.m.MessageBox.confirm(
                    `Deseja realmente deletar o produto com ID ${produtoId}?`,
                    {
                        title: "Confirmação",
                        actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                        onClose: (oAction) => resolve(oAction === sap.m.MessageBox.Action.YES)
                    }
                );
            });
        
            if (!confirm) return;
        
            try {
                await oModel.delete(`/produto(id=${produtoId})`);
                sap.m.MessageToast.show("Produto deletado com sucesso!");
        
                const table = this.byId("produtosTable");
                if (table) {
                    table.getBinding("items").refresh();
                }
            } catch (error) {
                sap.m.MessageBox.error("Erro ao deletar produto:\n" + error.message);
            }
        }
        
    });
});
