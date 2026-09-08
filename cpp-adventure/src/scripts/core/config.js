/* ---------------- 全局配置 config.js ----------------
 * 集中管理应用级配置，避免散落硬编码。
 *
 * 部署提示：
 * 1. Supabase URL / anon key 是设计为公开的 publishable 配置（前端页面里任何人都能读取），
 *    真正的数据安全边界在 Supabase 服务端的 RLS（行级安全）策略，
 *    绝对不要把 service_role key / 数据库密码写到这里。
 * 2. 如需按环境切换（开发/生产），可在构建脚本中用环境变量替换下面的值，
 *    例如：process.env.SUPABASE_URL || "默认值"。
 */
var APP_CONFIG = {
  name: "梓煜学习空间站",
  supabase: {
    url: "https://coqsxhwdnbjptnqelwld.supabase.co",
    anonKey: "sb_publishable_Vf2RzEmduPF6H2wCdPUTpg_EnF17J5I"
  }
};
