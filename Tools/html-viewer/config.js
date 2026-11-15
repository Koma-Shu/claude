// クラウド同期の接続先（Supabase）。
// ここに書かなくても、アプリの ⚙︎ →「アカウントと同期」から端末ごとに入力できる。
// anon / publishable キーは公開されても問題ない（データは Row Level Security で本人だけに制限される）。
window.HV_CONFIG = {
  supabaseUrl: 'https://meopqyyqgpjswewaablm.supabase.co',
  supabaseAnonKey: 'sb_publishable_XQ8PxGgFVqeQnUWKw-Df-A_fo70sMuU'
};
