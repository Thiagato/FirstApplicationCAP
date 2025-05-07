sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (Controller, MessageToast, MessageBox) {
    "use strict";

    return Controller.extend("firstapp.project1.controller.View2", {
        onInit: function () {
            this.getOwnerComponent().getRouter()
                .getRoute("View2")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            const sCpf = oEvent.getParameter("arguments").cpf;
            this._cpf = sCpf;

            const oModel = this.getView().getModel();
            const sPath = `/pessoa('${sCpf}')`;

            // Aq vinculamos a View inteira ao registro — permite edição direta
            this.getView().bindElement({
                path: sPath,
                model: undefined // modelo padrão
            });
        },

        onSalvarAlteracoes: async function () {
            const oView = this.getView();
            const oModel = oView.getModel();
            const oContext = oView.getBindingContext();
        
            const data = oContext.getObject();
        
            // Validações frontend
            const nome = data.nome?.trim();
            const idade = data.idade;
        
            if (!nome || nome.length < 3) {
                MessageToast.show("Nome muito curto. Mínimo 3 caracteres.");
                return;
            }
        
            if (idade < 0 || idade > 120) {
                MessageToast.show("Idade inválida. Deve ser entre 0 e 120.");
                return;
            }
        
            try {
                await oModel.submitBatch("$auto");
                MessageToast.show("Alterações salvas com sucesso!");
        
                // Atualiza os dados da view/tabela
                if (oContext) {
                    oContext.refresh(); // OData V4: atualiza os dados visíveis vinculados ao contexto
                }
        
            } catch (e) {
                console.error("Erro ao salvar alterações:", e);
                const msg = e?.message || "Erro desconhecido.";
                MessageBox.error("Erro ao salvar: " + msg);
            }
        },

        onSalvarProdutoAlterado: async function (oEvent) {
            const oModel = this.getView().getModel();
            const oContext = oEvent.getSource().getBindingContext();
            const data = oContext.getObject();
        
            // Validações
            if (!data.nome || data.nome.trim().length < 2) {
                sap.m.MessageToast.show("Nome do produto inválido.");
                return;
            }
        
            if (data.preco <= 0) {
                sap.m.MessageToast.show("Preço deve ser maior que zero.");
                return;
            }
        
            if (!data.categoria || data.categoria.trim() === "") {
                sap.m.MessageToast.show("Categoria obrigatória.");
                return;
            }
        
            try {
                await oModel.submitBatch("$auto");
                sap.m.MessageToast.show("Produto atualizado com sucesso!");
                oContext.refresh(); // Atualiza a linha editada
            } catch (e) {
                console.error("Erro ao salvar produto:", e);
                sap.m.MessageBox.error("Erro ao salvar: " + (e.message || "Erro desconhecido."));
            }
        },
        

        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteView1");
        }
        
    });
});
