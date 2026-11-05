// SMASH ARCH 서비스 워커 — '앱으로 설치'용 최소 구성
// 항상 네트워크 먼저(새 버전 바로 반영). 오프라인일 때만 마지막으로 받은 첫 화면을 보여줌.
const C = 'smasharch-v1';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || r.mode !== 'navigate') return;   // 게임 파일·서버 요청은 건드리지 않음
  e.respondWith(fetch(r).then(res => {
    const cp = res.clone(); caches.open(C).then(c => c.put('./', cp)).catch(() => {});
    return res;
  }).catch(() => caches.match('./').then(m => m || new Response('오프라인이에요. 인터넷에 연결한 뒤 다시 열어주세요.', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }))));
});
