# EmailJS セットアップガイド

メール認証機能を有効にするには、以下の手順でEmailJSを設定してください。

---

## 1. EmailJSアカウント作成

1. [https://www.emailjs.com/](https://www.emailjs.com/) にアクセス
2. 「Sign Up Free」で無料アカウントを作成（月200通まで無料）

---

## 2. Email Service（送信元メール）を設定

1. ダッシュボード左メニュー **「Email Services」** → **「Add New Service」**
2. **Gmail** を選択（他のメールサービスも可）
3. **「Connect Account」** でGmailアカウントを認証
4. サービス名を入力（例: `arcade_mail`）→ **「Create Service」**
5. 表示された **Service ID**（例: `service_abc1234`）をメモ

---

## 3. Email Template（メールテンプレート）を作成

1. ダッシュボード左メニュー **「Email Templates」** → **「Create New Template」**
2. 以下の内容を設定:

**Subject（件名）:**
```
ARCADE - 認証コード / Verification Code
```

**Content（本文）:**
```
{{to_name}} さん / Hello {{to_name}},

ARCADE アカウント登録の認証コードをお送りします。

認証コード: {{otp_code}}

このコードは {{expires_in}} 分間有効です。
コードを第三者と共有しないでください。

---

Your ARCADE account verification code:

Code: {{otp_code}}

This code expires in {{expires_in}} minutes.
Do not share this code with anyone.
```

**To Email:**
```
{{to_email}}
```

3. **「Save」** → 表示された **Template ID**（例: `template_xyz5678`）をメモ

---

## 4. Public Key を取得

1. ダッシュボード右上のアカウントメニュー → **「Account」**
2. **「General」** タブ → **「Public Key」** をコピー（例: `abcDEFghiJKL123`）

---

## 5. register.html に設定を記入

`register.html` の先頭付近にある以下の3行を編集してください:

```javascript
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // ← ここに Public Key
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // ← ここに Service ID
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // ← ここに Template ID
```

例:
```javascript
const EMAILJS_PUBLIC_KEY  = 'abcDEFghiJKL123';
const EMAILJS_SERVICE_ID  = 'service_abc1234';
const EMAILJS_TEMPLATE_ID = 'template_xyz5678';
```

---

## 完了後の動作

- ユーザーが登録フォームを送信すると、入力したメールアドレスに6桁の数字コードが届く
- 画面にはコードが表示されず、メールボックスを確認するよう案内される
- コードは10分間有効
- 60秒後に「再送信」ボタンが有効になる
