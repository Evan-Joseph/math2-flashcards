export const dynamic = 'force-static';

/** 纯静态健康检查：本应用不依赖数据库或任何服务端状态 */
export async function GET() {
  return Response.json({ ok: true, app: 'kaoyan-math', storage: 'local-only' });
}
