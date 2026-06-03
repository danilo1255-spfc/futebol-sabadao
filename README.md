# ⚽ Futebol de Sábado — Passo a Passo

Tempo estimado: **15 minutos**

---

## PASSO 1 — Criar conta no GitHub

1. Acesse **github.com**
2. Clique em **Sign up**
3. Crie sua conta (pode usar o email que quiser)

---

## PASSO 2 — Criar o banco de dados gratuito no Firebase

O Firebase é do Google e é 100% gratuito para o nosso uso.

1. Acesse **console.firebase.google.com**
2. Clique em **Criar um projeto**
3. Dê o nome: `futebol-sabado` → clique em Continuar
4. Desative o Google Analytics → clique em **Criar projeto**
5. Quando carregar, no menu esquerdo clique em **Realtime Database**
6. Clique em **Criar banco de dados**
7. Escolha o servidor **Estados Unidos** → clique em Avançar
8. Selecione **Iniciar no modo de teste** → clique em **Ativar**
9. No menu esquerdo clique em **Configurações do projeto** (ícone de engrenagem ⚙️)
10. Role a página até **Seus apps** → clique no ícone `</>`  (Web)
11. Dê o apelido `futebol-web` → clique em **Registrar app**
12. Vai aparecer um bloco de código com `firebaseConfig`. **Copie tudo isso**, vai precisar em breve.

---

## PASSO 3 — Subir o projeto no GitHub

1. Acesse **github.com** e clique em **New repository** (botão verde)
2. Nome: `futebol-sabado` → marque **Public** → clique em **Create repository**
3. Na página do repositório criado, clique em **uploading an existing file**
4. Arraste **todos os arquivos e pastas** desta pasta para a tela
5. Clique em **Commit changes**

---

## PASSO 4 — Colocar suas credenciais do Firebase

1. No GitHub, abra o arquivo `src/firebase.js`
2. Clique no ícone de lápis ✏️ para editar
3. Substitua os campos `"COLE_AQUI"` pelos valores que você copiou no Passo 2
4. Clique em **Commit changes**

---

## PASSO 5 — Publicar no Vercel

1. Acesse **vercel.com**
2. Clique em **Sign Up** → escolha **Continue with GitHub**
3. Autorize o Vercel a acessar seu GitHub
4. Clique em **Add New Project**
5. Encontre o repositório `futebol-sabado` → clique em **Import**
6. Não mude nada → clique em **Deploy**
7. Aguarde ~1 minuto...
8. 🎉 **Pronto! Seu link estará disponível**, algo como: `futebol-sabado.vercel.app`

---

## PASSO 6 — Mandar no grupo

Cole o link no WhatsApp e pronto!  
Todo mundo abre, toca no próprio nome, e você vê em tempo real quem pagou. ✅

---

## Dúvidas?

Qualquer erro que aparecer, tira um print e manda pro Claude — resolvo na hora! 🤙
