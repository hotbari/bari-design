// 더미 데이터: 매체, 편성표
const MEDIA_LIST = [
  { id: 'm1', name: '강남역 1번출구', spec: 'FHD · 세로형', status: 'online' },
  { id: 'm2', name: '삼성역 B2', spec: '4K · 가로형', status: 'online' },
  { id: 'm3', name: '코엑스 GF', spec: 'FHD · 기둥형', status: 'online' },
  { id: 'm4', name: '여의도 IFC몰', spec: 'FHD · 가로형', status: 'inactive' },
  { id: 'm5', name: '홍대입구역 광장', spec: 'FHD · 가로형', status: 'unlinked' },
];

const SCHEDULE_LIST = [
  {
    id: 's1', name: '4월 강남 편성', mediaId: 'm1', playlist: '갤럭시 S26 재생목록',
    start: '2026-04-01', end: '2026-04-30', status: 'active', priority: 1,
    syncStatus: 'fail', syncVersion: { player: 12, latest: 13 },
  },
  {
    id: 's2', name: '4월 삼성역 편성', mediaId: 'm2', playlist: '갤럭시 S26 재생목록',
    start: '2026-04-01', end: '2026-04-30', status: 'active', priority: 1,
    syncStatus: 'ok', syncVersion: { player: 13, latest: 13 },
  },
  {
    id: 's3', name: '5월 프로모션 편성', mediaId: 'm1', playlist: '봄 세일 재생목록',
    start: '2026-05-01', end: '2026-05-31', status: 'reserved', priority: 2,
    syncStatus: 'pending', syncVersion: null,
  },
  {
    id: 's4', name: '여의도 IFC 편성', mediaId: 'm4', playlist: '하우스 광고 목록',
    start: '2026-03-01', end: '2026-04-30', status: 'paused', priority: 3,
    syncStatus: 'none', syncVersion: null,
  },
  {
    id: 's5', name: '1분기 CU 편성', mediaId: 'm2', playlist: 'CU 프로모션 목록',
    start: '2026-01-15', end: '2026-03-31', status: 'ended', priority: 2,
    syncStatus: 'none', syncVersion: null,
  },
];

const PLAYLIST_SLOTS = [
  { order: 1, name: '갤럭시 S26 런칭 15s', type: '동영상', duration: '15초', status: 'normal' },
  { order: 2, name: '갤럭시 S26 기능소개 30s', type: '동영상', duration: '30초', status: 'normal' },
  { order: 3, name: '삭제된 소재', type: '—', duration: '—', status: 'deleted' },
  { order: 4, name: '현대백화점 세일 배너', type: '이미지', duration: '10초', status: 'replacing' },
  { order: 5, name: '네이버 Ad Server 구좌', type: '실시간', duration: '15초', status: 'ssp' },
];

const TODAY = '2026-04-07';

function getMediaById(id) { return MEDIA_LIST.find(m => m.id === id); }
function getSchedulesForMedia(mediaId) { return SCHEDULE_LIST.filter(s => s.mediaId === mediaId); }
