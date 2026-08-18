# 🍽️ Plato - Sistema Integrado de Gestão para Restaurantes

O **Plato** é um sistema completo e moderno desenvolvido para otimizar o atendimento, a gestão de pedidos, a administração do cardápio e o controle financeiro/operacional de estabelecimentos gastronômicos (restaurantes, bares e lanchonetes).

---

## 🚀 Funcionalidades do Sistema

### 📱 Módulos de Operação (Atendimento & Salão)
- **Painel Principal (Home):** Navegação rápida entre as principais operações do dia a dia da loja.
- **Lançamento e Criação de Pedidos (`fazer-pedido-page`):**
  - Seleção visual e dinâmica dos produtos do cardápio.
  - Modal de personalização com ajuste de quantidade e observações do produto (ex: "Sem cebola").
  - Painel lateral/aba com o **Resumo do Pedido** em tempo real.
  - Modal de confirmação do pedido vinculado à **Mesa** e ao **Garçom** (selecionado dinamicamente via integração com o banco).
- **Consulta e Gestão de Mesas (`consultar-mesas-page`):**
  - Exibição do status das mesas (Livre / Ocupada).
  - Modal de consulta de consumo para mesas ocupadas, exibindo horário de abertura, itens pedidos, quantidades, subtotais e valor acumulado.
- **Fechamento de Caixa / Comandas (`finalizar-pedido-page`):**
  - Interface otimizada com botão de finalização posicionado para rápida operação.
  - Modal de encerramento da nota fiscal com seleção do operador do caixa e forma de pagamento (Dinheiro, PIX, Cartão de Crédito/Débito).

### ⚙️ Módulos de Administração & Configurações (`configuracoes-page`)
- **Gestão do Cardápio (`cardapio-edit-page`):**
  - Listagem completa dos produtos cadastrados no banco de dados.
  - Modal para criação/edição de produtos com suporte ao upload/prévia de imagem (convertida para Base64/URL), nome, descrição e preço.
- **Gestão de Funcionários:** Tabela de listagem com contatos/telefones e formulário de cadastro de novos colaboradores/garçons.
- **Gestão de Fornecedores:** Cadastro e controle de parceiros comerciais (Nome, Telefone e CNPJ).
- **Notas Fiscais do Dia (`notas-do-dia-page`):** Painel focado no acompanhamento diário das notas fiscais emitidas, com resumos e métricas consolidadas do dia.
- **Notas de Fornecedores (`nota-fornecedor`):** Histórico de lançamentos das notas fiscais de entrada/compras com observações, valores e chave de acesso.
- **Configuração de Estrutura:** Gestão simplificada do número de mesas disponíveis no estabelecimento.

---

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **Framework:** [Angular](https://angular.dev/) (Versão recente com suporte a *Standalone Components* / Control Flow)
- **Linguagem:** TypeScript
- **Estilização:** SCSS / CSS3 (Design Responsivo, CSS Grid, Flexbox e Variáveis CSS para tokens visuais)
- **Formulários:** Reactive Forms do Angular com validações síncronas
- **UI Components:** Modais e Dialogs customizados com acessibilidade e reaproveitamento de componentes (`app-btn`, `app-item-home`, etc.)

### **Backend**
- **Framework:** [Spring Boot](https://spring.io/projects/spring-boot) (Java 17+)
- **Persistência:** Spring Data JPA / Hibernate
- **Mapeamento/Anotações:** Lombok, Jakarta Validation (`@NotNull`, etc.)
- **Banco de Dados:** PostgreSQL / MySQL

---

## 📂 Estrutura Arquitetural do Frontend

```text
src/
└── app/
    ├── components/         # Componentes genéricos e modais reaproveitáveis
    │   ├── modal-confirmar-pedido/
    │   ├── modal-detalhe-produto/
    │   ├── modal-detalhes-mesa/
    │   ├── modal-finalizar-nota/
    │   └── tela-config/
    ├── pages/              # Telas/Páginas principais da aplicação
    │   ├── cardapio-edit-page/
    │   ├── configuracoes-page/
    │   ├── consultar-mesas-page/
    │   ├── fazer-pedido-page/
    │   ├── finalizar-pedido-page/
    │   ├── home-page/
    │   └── notas-do-dia-page/
    ├── services/           # Serviços HTTP para comunicação com a API REST
    └── app.routes.ts       # Mapeamento e rotas da aplicação

```
