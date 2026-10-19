import { useEffect, useMemo, useState } from 'react';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import atlas from 'world-atlas/countries-110m.json';
import history from './data/traffic-history.json';
// Unicode CLDR 48 alpha-2 -> M49 codes, used by world-atlas geometry IDs.
// https://github.com/unicode-org/cldr-json/blob/main/cldr-json/cldr-core/supplemental/codeMappings.json
import countryCodes from './data/country-numeric-codes.json';
import { getTrafficStats, type TrafficStats } from './firstPartyTraffic';
import SiteFooter from './SiteFooter';
import { t } from './i18n';
import type { Locale, SitePath } from './types';

interface CountryFeature { type: 'Feature'; id: string; properties: { name: string }; geometry: unknown }
const projection = geoNaturalEarth1().fitExtent([[8, 8], [1192, 592]], { type: 'Sphere' });
const path = geoPath(projection);
const world = feature(atlas, atlas.objects.countries) as { features: CountryFeature[] };
const numericCode = (code: string) => String(Number((countryCodes as Record<string, string>)[code] ?? -1));

export default function TrafficPage({ locale, onNavigate }: { locale: Locale; onNavigate: (path: SitePath) => void }) {
  const [live, setLive] = useState<TrafficStats | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [mode, setMode] = useState<'history' | 'live'>('history');
  const [selected, setSelected] = useState('');
  useEffect(() => {
    let active = true;
    const refresh = () => { if (!document.hidden) void getTrafficStats().then(value => { if (active) { setLive(value); setLoaded(true); } }); };
    refresh();
    const timer = window.setInterval(refresh, 60000);
    return () => { active = false; window.clearInterval(timer); };
  }, []);
  const rows = useMemo(() => {
    if (mode === 'history') return history.countries;
    const names = new Intl.DisplayNames([locale], { type: 'region' });
    return live?.countries.map(row => ({ country: ['ZZ', 'XX', 'T1'].includes(row.country) ? 'Unknown' : names.of(row.country) ?? row.country, code: row.country, count: row.count })) ?? [];
  }, [live, mode, locale]);
  const byCountry = new Map(rows.map(row => [numericCode(row.code), row.count]));
  const count = mode === 'history' ? history.count : live?.count;
  const countries = rows.filter(row => row.country !== 'Unknown').length;
  const number = (value: number) => new Intl.NumberFormat(locale).format(value);
  const first = mode === 'history' ? history.firstDay : live?.firstDay;
  const last = mode === 'history' ? history.lastDay : live?.lastDay;
  const days = mode === 'history' ? history.observedDays : live?.observedDays;
  const span = first && last ? Math.round((Date.parse(last) - Date.parse(first)) / 86400000) + 1 : 0;
  const activeRow = rows.find(row => numericCode(row.code) === selected);
  const historicalLabel = t(locale, 'Historical records', 'บันทึกย้อนหลัง', '历史记录', '과거 기록', '過去の記録');
  const liveLabel = t(locale, 'New sessions', 'เซสชันใหม่', '新会话', '새 세션', '新しいセッション');
  const unavailable = t(locale, 'New counter unavailable. Historical records remain available.', 'ตัวนับใหม่ไม่พร้อมใช้งาน ยังดูข้อมูลย้อนหลังได้', '新计数器暂不可用。历史记录仍可查看。', '새 집계에 연결할 수 없습니다. 과거 기록은 확인할 수 있습니다.', '新しい集計に接続できません。過去の記録は閲覧できます。');

  return <><main className="traffic-page section">
    <header className="traffic-heading">
      <p className="eyebrow">SLIC / {t(locale, 'WORLDWIDE REACH', 'การเข้าชมจากทั่วโลก', '全球访问', '전 세계 방문', '世界からのアクセス')}</p>
      <h1>{t(locale, 'Where the interest comes from.', 'ความสนใจมาจากที่ใด', '关注来自何处。', '관심은 어디에서 오는가.', '関心はどこから。')}</h1>
      <p>{t(locale, 'Recorded visits from around the world to explore the SLIC Index. Traffic indicates reach, not endorsement or unique people.', 'บันทึกการเข้าชมดัชนี SLIC จากทั่วโลก แสดงการเข้าถึง ไม่ใช่การรับรองหรือจำนวนบุคคลที่ไม่ซ้ำกัน', '来自世界各地的 SLIC 指数访问记录。流量代表触达，不代表认可或独立人数。', '전 세계에서 SLIC 지수를 살펴본 방문 기록입니다. 도달 범위를 나타내며 지지나 고유 방문자 수를 뜻하지 않습니다.', '世界各地からSLIC指数を閲覧した記録です。到達範囲を示し、支持や実人数を意味しません。')}</p>
    </header>
    <div className="traffic-controls" role="group" aria-label={t(locale, 'Traffic source', 'แหล่งข้อมูลการเข้าชม', '流量来源', '방문 자료 출처', 'アクセス記録の出典')}>
      <button type="button" aria-pressed={mode === 'history'} onClick={() => { setMode('history'); setSelected(''); }}>{historicalLabel}</button>
      <button type="button" aria-pressed={mode === 'live'} onClick={() => { setMode('live'); setSelected(''); }}>{liveLabel}</button>
    </div>
    <div className="traffic-summary" aria-live="polite">
      <strong>{count === undefined ? '—' : number(count)}</strong>
      <span>{mode === 'history' ? historicalLabel : liveLabel}<br />{t(locale, 'Countries / territories', 'ประเทศ / ดินแดน', '国家／地区', '국가 / 지역', '国・地域')}: {count === undefined ? '—' : number(countries)}</span>
      <p>{first && last ? `${first} – ${last} / ${number(span)} ${t(locale, 'calendar-day span', 'วันปฏิทิน', '个日历日', '일간', '暦日間')}` : count === undefined ? '—' : t(locale, 'No recorded dates yet', 'ยังไม่มีวันที่บันทึก', '尚无记录日期', '아직 기록된 날짜 없음', '記録された日付はまだありません')}<br />
        {days === undefined ? (loaded ? unavailable : t(locale, 'Loading counter…', 'กำลังโหลดตัวนับ…', '正在载入计数…', '집계 로딩 중…', '集計を読み込み中…')) : `${t(locale, 'Days with records', 'วันที่มีบันทึก', '有记录的天数', '기록이 있는 날', '記録のある日数')}: ${number(days)}`} / {mode === 'history' ? history.timezone : 'UTC'}</p>
    </div>
    {mode === 'live' && loaded && !live && <p role="status">{unavailable}</p>}
    <figure className="traffic-map">
      <svg viewBox="0 0 1200 600" role="img" aria-labelledby="traffic-map-title traffic-map-description">
        <title id="traffic-map-title">{t(locale, 'Recorded traffic by country', 'การเข้าชมที่บันทึกแยกตามประเทศ', '按国家显示的访问记录', '국가별 방문 기록', '国別アクセス記録')}</title>
        <desc id="traffic-map-description">{t(locale, 'Darker countries have more records. Exact counts are in the table below. Small territories may not appear at this map scale.', 'สีเข้มหมายถึงจำนวนบันทึกมากกว่า ดูจำนวนจริงในตารางด้านล่าง ดินแดนขนาดเล็กอาจไม่ปรากฏในมาตราส่วนนี้', '颜色越深，记录越多。确切数量见下表。小型地区可能不会显示。', '색이 짙을수록 기록이 많습니다. 정확한 수치는 아래 표를 참고하세요. 작은 지역은 표시되지 않을 수 있습니다.', '濃い色ほど記録が多くなります。正確な件数は下の表に記載。小さな地域は表示されない場合があります。')}</desc>
        {world.features.map(country => {
          const name = country.properties.name;
          const id = String(Number(country.id));
          const total = byCountry.get(id) ?? 0;
          return <path key={name} d={path(country) ?? ''} className={total ? 'traffic-country traffic-country--recorded' : 'traffic-country'}
            fill={total ? '#a04e20' : '#e6dfd4'} fillOpacity={total ? 0.25 + Math.min(0.75, Math.log1p(total) / 9) : 1}
            onMouseEnter={() => setSelected(id)} onMouseLeave={() => setSelected('')}>
            <title>{name}: {count === undefined ? '—' : number(total)}</title>
          </path>;
        })}
        {([['Singapore', '702', 103.82, 1.35], ['Hong Kong', '344', 114.17, 22.32]] as const).map(([name, id, longitude, latitude]) => {
          const total = byCountry.get(id);
          const point = projection([longitude, latitude]);
          return total && point ? <rect key={name} x={point[0] - 4} y={point[1] - 4} width={8} height={8} fill="#a04e20" stroke="#f8f5f0" strokeWidth={1} onMouseEnter={() => setSelected(id)} onMouseLeave={() => setSelected('')}><title>{name}: {number(total)}</title></rect> : null;
        })}
      </svg>
      <figcaption aria-live="polite">{activeRow ? `${activeRow.country}: ${number(activeRow.count)}` : t(locale, 'Country-level geography only. No individual visitor locations.', 'แสดงระดับประเทศเท่านั้น ไม่แสดงตำแหน่งผู้เข้าชมรายบุคคล', '仅显示国家级地理信息，不显示个人位置。', '국가 단위만 표시하며 개인 방문 위치는 공개하지 않습니다.', '国単位のみ表示し、個人の所在地は公開しません。')}
        {' '}{t(locale, 'Unknown locations are not placed on the map.', 'ตำแหน่งที่ไม่ทราบไม่ถูกวางบนแผนที่', '未知位置不在地图上标注。', '위치 미상 기록은 지도에 표시하지 않습니다.', '所在地不明の記録は地図に配置しません。')}</figcaption>
    </figure>
    <div className="traffic-detail">
      <section aria-labelledby="traffic-country-table">
        <h2 id="traffic-country-table">{t(locale, 'Countries & territories', 'ประเทศและดินแดน', '国家和地区', '국가 및 지역', '国・地域')}</h2>
        <table><caption>{mode === 'history' ? historicalLabel : liveLabel}</caption><thead><tr><th scope="col">{t(locale, 'Location', 'สถานที่', '地区', '지역', '地域')}</th><th scope="col">{t(locale, 'Records', 'บันทึก', '记录', '기록', '記録')}</th></tr></thead>
          <tbody>{rows.map(row => <tr key={row.country}><th scope="row">{row.country === 'Unknown' ? t(locale, 'Unknown', 'ไม่ทราบ', '未知', '미상', '不明') : row.country}</th><td>{number(row.count)}</td></tr>)}</tbody>
        </table>
      </section>
      <section className="traffic-notes" aria-labelledby="traffic-evidence">
        <h2 id="traffic-evidence">{t(locale, 'What these numbers mean', 'ตัวเลขเหล่านี้หมายถึงอะไร', '数字的含义', '수치의 의미', 'この数値の意味')}</h2>
        <p>{t(locale, 'Historical source: SLIC Index V1/V2 Visitors. Snapshot: 19 October 2026. Three explicitly labelled test records were excluded. Repeat visits and automated traffic may remain.', 'แหล่งข้อมูลย้อนหลัง: SLIC Index V1/V2 Visitors ภาพรวม ณ 19 ตุลาคม 2026 ตัดบันทึกทดสอบที่ระบุชัดเจน 3 รายการออก อาจยังมีการเข้าชมซ้ำและบอต', '历史来源：SLIC Index V1/V2 Visitors，快照日期为2026年10月19日。已排除3条明确标记的测试记录；仍可能包含重复访问和自动流量。', '과거 자료: SLIC Index V1/V2 Visitors. 2026년 10월 19일 스냅샷. 명시된 테스트 기록 3건을 제외했습니다. 반복 방문과 자동화 트래픽은 남아 있을 수 있습니다.', '過去の出典：SLIC Index V1/V2 Visitors。2026年10月19日のスナップショット。明示されたテスト3件を除外。再訪問や自動アクセスが含まれる可能性があります。')}</p>
        <p>{t(locale, 'Days without records are unobserved, not confirmed zero-traffic days. Missing traffic is not estimated or added. Historical records and new sessions are shown separately because their users may overlap.', 'วันที่ไม่มีบันทึกคือวันที่ไม่มีข้อมูล ไม่ใช่วันที่ยืนยันว่าไม่มีผู้เข้าชม เราไม่ประมาณหรือบวกข้อมูลที่ขาด แยกบันทึกเก่ากับเซสชันใหม่เพราะผู้ใช้อาจซ้ำกัน', '无记录日期表示未观测，并非已确认的零流量日。不估算或补加缺失流量。历史记录与新会话分开显示，因为用户可能重叠。', '기록 없는 날은 미관측일이며 방문이 없었다는 뜻이 아닙니다. 누락된 방문을 추산하거나 더하지 않습니다. 이용자가 중복될 수 있어 과거 기록과 새 세션을 분리합니다.', '記録のない日は未観測であり、アクセスゼロを確認した日ではありません。欠測分を推計・加算しません。利用者が重複し得るため過去と新規は分けて表示します。')}</p>
        <p>{t(locale, 'New counter started 19 October 2026: one acknowledged browser session per tab session, with network abuse limits. DNT and Global Privacy Control are respected. IP-based countries are approximate; VPNs may shift locations. No raw IPs, precise locations or browsing URLs are stored in the new counter.', 'ตัวนับใหม่เริ่ม 19 ตุลาคม 2026: นับเซสชันเบราว์เซอร์ที่รับสำเร็จต่อเซสชันแท็บ พร้อมจำกัดการใช้งานผิดปกติ เคารพ DNT และ Global Privacy Control ประเทศจาก IP เป็นค่าประมาณ VPN อาจเปลี่ยนตำแหน่ง ตัวนับใหม่ไม่เก็บ IP ดิบ ตำแหน่งละเอียด หรือ URL ที่เข้าชม', '新计数器于2026年10月19日启动：每个标签页会话计一次已确认的浏览器会话，并限制异常提交。尊重 DNT 和 Global Privacy Control。IP 推断国家仅为近似，VPN 可能改变位置。新计数器不存储原始 IP、精确位置或浏览网址。', '새 집계는 2026년 10월 19일 시작했습니다. 탭 세션당 확인된 브라우저 세션을 한 번 집계하고 네트워크 남용을 제한합니다. DNT와 Global Privacy Control을 존중합니다. IP 국가 정보는 근사치이며 VPN 영향을 받습니다. 원본 IP, 정밀 위치, 방문 URL은 저장하지 않습니다.', '新集計は2026年10月19日開始。タブのセッションごとに受付済みブラウザーセッションを1回数え、不正送信を制限します。DNTとGlobal Privacy Controlを尊重。IPによる国の推定は概算で、VPNの影響があります。生のIP、詳細な位置、閲覧URLは保存しません。')}</p>
        <p>{t(locale, 'Live source', 'แหล่งข้อมูลใหม่', '实时来源', '실시간 출처', '新集計の出典')}: /api/traffic<br />{t(locale, 'Snapshot time (up to five minutes old)', 'เวลาภาพรวม (อาจเก่าไม่เกินห้านาที)', '快照时间（最多延迟五分钟）', '스냅샷 시각 (최대 5분 지연)', 'スナップショット時刻（最大5分遅延）')}: {live?.updatedAt ?? (loaded ? '—' : '…')}</p>
      </section>
    </div>
  </main><SiteFooter locale={locale} onNavigate={onNavigate} /></>;
}
