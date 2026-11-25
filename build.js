/* Builds the Casa Azahar demo into /public (English at /, Spanish at /es/).
   Run: node build.js   (Node 18+, no packages needed) */
const fs = require('fs');
const path = require('path');
const L_ = require('./src/lib.js');
const C = require('./src/content.js');
const { split, pic, page, bookingBar, stickyBar, bookBody, writeOut, sitemap, HEADERS, UI } = L_;
const OUT = path.join(__dirname, 'public');

const site = {
  name: 'Casa Azahar', code: 'AZ', domain: 'https://casa-azahar.pages.dev', theme: '#2F4A3A', og: 'hero',
  address: 'Carrer de les Taronges 12, 46001 València', ota: 1.11, breakfastOta: 12, version: Date.now().toString(36),
  fonts: ['young-serif-latin-400-normal.woff2', 'figtree-latin-400-normal.woff2'],
  rooms: C.rooms, extras: C.extras, t: C.t,
  paths: { home: '/', rooms: '/rooms/', book: '/book/', privacy: '/privacy/', legal: '/legal/', accessibility: '/accessibility/' }
};
C.rooms.en.forEach(r => { site.paths['room-' + r.id] = `/rooms/${r.slug}/`; });
site.href = (L, k) => { const [key, hash] = k.split('#'); return (L === 'en' ? '' : '/es') + site.paths[key] + (hash ? '#' + hash : ''); };

/* ---------- brand mark: an orange with a leaf and a small blossom ---------- */
const mark = (cls = '') => `<svg class="${cls}" viewBox="0 0 48 48" aria-hidden="true"><circle cx="22" cy="28" r="15" fill="#B4501F"/><path d="M24 13c2-6 8-9 15-8-1 7-6 11-15 8z" fill="#2F4A3A"/><path d="M23 13.5c-.5-3-1.5-5-3.5-6.5" stroke="#2F4A3A" stroke-width="1.6" fill="none" stroke-linecap="round"/><g fill="#FBFAF6">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="17" cy="25" rx="1.8" ry="3.2" transform="rotate(${a} 17 28)"/>`).join('')}</g><circle cx="17" cy="28" r="1.4" fill="#E8B33C"/></svg>`;
const tileBg = `<svg class="tile-pat" aria-hidden="true" width="100%" height="100%"><defs><pattern id="tp" width="56" height="56" patternUnits="userSpaceOnUse"><path d="M28 4 52 28 28 52 4 28Z" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="28" cy="28" r="5" fill="none" stroke="currentColor"/><circle cx="0" cy="0" r="3" fill="currentColor"/><circle cx="56" cy="0" r="3" fill="currentColor"/><circle cx="0" cy="56" r="3" fill="currentColor"/><circle cx="56" cy="56" r="3" fill="currentColor"/></pattern></defs><rect width="100%" height="100%" fill="url(#tp)"/></svg>`;
const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const CHECK = '<svg class="tick" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
const PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';
const PERK_ICONS = [
  '<path d="M4 12h6l2-5 2 10 2-5h4"/>',
  '<path d="M5 10h12v4a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5zM17 11h1.5a2.5 2.5 0 0 1 0 5H17M9 4c0 1.5 1 1.5 1 3M13 4c0 1.5 1 1.5 1 3"/>',
  '<path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4"/>',
  '<path d="M5 18.5 6.5 15A7 7 0 1 1 9 17.5z"/>'
].map(p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`);

/* ---------- header and footer ---------- */
site.header = (L, key) => {
  const t = C.t[L];
  const altHref = (lang) => (lang === 'en' ? '' : '/es') + site.paths[key || 'home'];
  const nav = [[t.nav[0], 'rooms'], [t.nav[1], 'home#direct'], [t.nav[2], 'home#neighbourhood'], [t.nav[3], 'home#questions']];
  return `<p class="demo-strip">${t.demoTag}</p>
<header class="site-header"><div class="wrap hdr">
<a class="logo" href="${site.href(L, 'home')}" aria-label="Casa Azahar, ${L === 'es' ? 'inicio' : 'home'}">${mark('logo-mark')}<span>Casa Azahar</span></a>
<nav aria-label="Main"><ul role="list">${nav.map(([n, k]) => `<li><a href="${site.href(L, k)}"${key === k ? ' aria-current="page"' : ''}>${n}</a></li>`).join('')}</ul></nav>
<div class="hdr-r"><div class="lang" role="group" aria-label="${L === 'es' ? 'Idioma' : 'Language'}"><a href="${altHref('en')}" hreflang="en" lang="en" ${L === 'en' ? 'aria-current="true"' : ''}>EN</a><a href="${altHref('es')}" hreflang="es" lang="es" ${L === 'es' ? 'aria-current="true"' : ''}>ES</a></div>
<a class="btn btn-primary btn-sm" href="${site.href(L, 'book')}">${t.reserve}</a>
<button class="icon-btn" type="button" data-menu aria-expanded="false" aria-controls="menu" aria-label="${UI[L].menu}">${L_.ICON.menu}</button></div></div>
<nav id="menu" aria-label="Mobile">${nav.map(([n, k]) => `<a href="${site.href(L, k)}">${n}</a>`).join('')}<a class="btn btn-primary" href="${site.href(L, 'book')}">${t.checkAvail}</a></nav></header>`;
};
site.footer = (L) => {
  const t = C.t[L];
  return `<footer class="site-footer">${tileBg}<div class="wrap">
<div class="f-top"><div class="f-brand"><p class="f-name">${mark('f-mark')}Casa Azahar</p><p class="f-about">${t.footAbout}</p></div>
<div><h2 class="f-h">${t.contact}</h2><address>${site.address}<br><a href="https://wa.me/34960000000">WhatsApp +34 960 000 000</a><br><a href="mailto:hola@casaazahar.example">hola@casaazahar.example</a></address></div>
<div><h2 class="f-h">${t.thisDemo}</h2><ul role="list">${t.footLinks.map(([n, k]) => `<li><a href="${site.href(L, k)}">${n}</a></li>`).join('')}</ul></div></div>
<div class="f-bot"><p>${t.credit} · <a href="https://lizzymcruz.com">lizzymcruz.com</a></p><p>© <span data-year>2026</span> · ${t.demoTag}</p></div></div></footer>`;
};

/* ---------- structured data ---------- */
const hotelLD = (L) => ({
  '@context': 'https://schema.org', '@type': 'Hotel', '@id': site.domain + '/#hotel', name: site.name, url: site.domain + (L === 'es' ? '/es/' : '/'),
  description: C.t[L].metaHomeD, image: [`${site.domain}/assets/img/hero-1920.webp`, `${site.domain}/assets/img/breakfast-1920.webp`],
  telephone: '+34 960 000 000', email: 'hola@casaazahar.example', priceRange: '€€', numberOfRooms: 8, petsAllowed: true, checkinTime: '15:00', checkoutTime: '11:00',
  address: { '@type': 'PostalAddress', streetAddress: 'Carrer de les Taronges 12', postalCode: '46001', addressLocality: 'València', addressRegion: 'València', addressCountry: 'ES' },
  geo: { '@type': 'GeoCoordinates', latitude: 39.4737, longitude: -0.3786 },
  amenityFeature: ['Free Wi-Fi', 'Breakfast included', 'Courtyard', 'Air conditioning', 'Luggage storage', 'Pet-friendly room'].map(n => ({ '@type': 'LocationFeatureSpecification', name: n, value: true })),
  availableLanguage: ['en', 'es']
});
const faqLD = (L) => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: C.t[L].faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
const crumbs = (L, items) => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map(([n, k], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: site.domain + site.href(L, k) })) });

const roomCard = (L, r, t) => `<li class="room-card"><a href="${site.href(L, 'room-' + r.id)}"><div class="rc-img reveal-img">${pic(r.img, r.alt, { sizes: '(min-width: 900px) 30vw, 100vw', w: 1280, h: 1600 })}${r.tag ? `<span class="tag">${r.tag}</span>` : ''}</div>
<div class="rc-body"><p class="mono">${r.short}</p><h3>${r.name}</h3><p class="rc-meta">${r.meta}</p><ul class="chips-s" role="list">${r.chips.map(c => `<li>${c}</li>`).join('')}</ul>
<div class="rc-foot"><p class="price"><small>${t.from}</small> <b>€${r.price}</b> <small>${t.perNight}</small></p><span class="arrow-btn" aria-hidden="true">${ARROW}</span></div></div></a></li>`;

/* ---------- pages ---------- */
function home(L) {
  const t = C.t[L], R = C.rooms[L];
  const body = `
<section class="hero" data-hero>
<div class="hero-media"><div class="hero-img" data-hero-media>${pic('hero', t.heroAlt, { priority: true, w: 1920, h: 1280 })}</div><div class="hero-shade"></div></div>
<div class="wrap hero-copy"><p class="eyebrow on-dark" data-hero-fade>${t.heroEyebrow}</p>${split(t.heroH, 'h1', 'class="display"')}<p class="hero-p" data-hero-fade>${t.heroP}</p>
<p class="perk-pill" data-hero-fade><span>${t.perkTag}</span>${t.perkTxt}</p></div>
<div class="wrap hero-bar">${bookingBar(site, L)}</div>
</section>

<section class="rooms wrap" id="rooms" aria-labelledby="rm-h"><div class="sec-head"><div><p class="eyebrow">${t.roomsEyebrow}</p>${split(t.roomsH, 'h2', 'id="rm-h" class="display-m"')}</div><p class="sec-p" data-reveal>${t.roomsP}</p></div>
<ul class="room-grid" role="list" data-stagger>${R.map(r => roomCard(L, r, t)).join('')}</ul></section>

<section class="direct" id="direct" aria-labelledby="dr-h"><div class="wrap dr-grid"><div><p class="eyebrow on-dark">${t.directEyebrow}</p>${split(t.directH, 'h2', 'id="dr-h" class="display-m"')}<p class="dr-p" data-reveal>${t.directP}</p>
<ul class="perk-list" role="list" data-stagger>${t.perks.map(([h, p], i) => `<li><span class="perk-ic">${PERK_ICONS[i]}</span><div><h3>${h}</h3><p>${p}</p></div></li>`).join('')}</ul></div>
<div class="compare" data-compare data-reveal aria-live="polite"><h3>${t.cmpH}</h3><p class="mono" data-c-stay>—</p>
<dl><div><dt>${t.cmpOta}</dt><dd class="strike" data-c-ota>—</dd></div><div><dt>${t.cmpBf}</dt><dd class="strike" data-c-bf>—</dd></div><div class="us"><dt>${t.cmpUs}</dt><dd data-c-us>—</dd></div></dl>
<p class="save">${t.cmpSave} <b data-c-save>—</b></p><p class="cmp-note">${t.cmpNote}</p><a class="btn btn-primary btn-block" href="${site.href(L, 'book')}">${t.checkAvail}</a></div></div></section>

<section class="hood" id="neighbourhood" aria-labelledby="hd-h"><div class="wrap hd-grid"><div class="hd-img reveal-img" data-parallax="0.08">${pic('valencia', t.hoodAlt, { sizes: '(min-width: 900px) 50vw, 100vw', w: 1280, h: 1600 })}</div>
<div><p class="eyebrow">${t.hoodEyebrow}</p>${split(t.hoodH, 'h2', 'id="hd-h" class="display-m"')}<p class="sec-p" data-reveal>${t.hoodP}</p>
<ul class="walks" role="list" data-stagger>${t.walks.map(([n, d]) => `<li>${PIN}<span>${n}</span><b class="mono">${d}</b></li>`).join('')}</ul></div></div></section>

<section class="bf" aria-labelledby="bf-h"><div class="bf-img" data-open>${pic('breakfast', t.bfAlt, { w: 1920, h: 1280 })}</div>
<div class="wrap bf-in"><div class="bf-card" data-reveal><p class="eyebrow">${t.bfEyebrow}</p>${split(t.bfH, 'h2', 'id="bf-h" class="display-s"')}<p>${t.bfP}</p><a class="link" href="${site.href(L, 'book')}">${t.reserve}${ARROW}</a></div></div></section>

<section class="reviews wrap" aria-labelledby="rv-h"><p class="eyebrow center">${t.revEyebrow}</p>${split(t.revH, 'h2', 'id="rv-h" class="display-m center"')}
<div class="rv-box" data-reveal><p class="stars" aria-hidden="true">★★★★★</p><p>${t.revP}</p></div></section>

<section class="faq" id="questions" aria-labelledby="faq-h"><div class="wrap faq-grid"><div><p class="eyebrow">${t.faqEyebrow}</p>${split(t.faqH, 'h2', 'id="faq-h" class="display-m"')}</div>
<div>${t.faq.map(([q, a], i) => `<details class="qa"${i === 0 ? ' open' : ''}><summary>${q}</summary><p>${a}</p></details>`).join('')}</div></div></section>
${stickyBar(site, L, { label: t.from, value: '€95 ' + t.perNight, cta: t.reserve })}`;
  return page(site, { lang: L, key: 'home', title: t.metaHome, desc: t.metaHomeD, body, jsonld: [hotelLD(L), faqLD(L)] });
}

function roomsPage(L) {
  const t = C.t[L], R = C.rooms[L];
  const body = `<section class="page-head wrap"><p class="eyebrow">${t.roomsEyebrow}</p>${split(t.roomsPageH, 'h1', 'class="display"')}<p class="lead" data-reveal>${t.roomsPageP}</p></section>
<section class="wrap rooms-list">${R.map((r, i) => `<article class="rl${i % 2 ? ' rev' : ''}"><a class="reveal-img rl-img" href="${site.href(L, 'room-' + r.id)}" tabindex="-1" aria-hidden="true">${pic(r.img, r.alt, { sizes: '(min-width: 900px) 55vw, 100vw', w: 1280, h: 1600 })}</a>
<div class="rl-copy"><p class="mono">${r.short}</p>${split(r.name, 'h2', 'class="display-m"')}<p>${r.intro} ${r.body}</p><ul class="chips-s" role="list">${[r.size, r.bed, r.view].map(c => `<li>${c}</li>`).join('')}</ul>
<p class="price-l">${t.from} <b>€${r.price}</b> ${t.nightForTwo}</p><div class="btns"><a class="btn btn-primary" href="${site.href(L, 'room-' + r.id)}">${t.viewRoom}<span class="sr"> ${r.name}</span></a><a class="link" href="${site.href(L, 'book')}?room=${r.id}">${t.bookRoom}</a></div></div></article>`).join('')}</section>`;
  return page(site, { lang: L, key: 'rooms', title: t.metaRooms, desc: t.metaRoomsD, body, og: 'room-suite', jsonld: [crumbs(L, [['Casa Azahar', 'home'], [t.roomsPageH, 'rooms']])] });
}

function roomPage(L, r) {
  const t = C.t[L], R = C.rooms[L], others = R.filter(x => x.id !== r.id);
  const gal = [r.img, ...others.map(o => o.img), 'breakfast', 'hero'];
  const body = `<section class="wrap room-head"><p class="crumbs"><a href="${site.href(L, 'rooms')}">${L_.ICON.arrowL}${t.allRoomsBack}</a></p><p class="mono">${r.access}</p>${split(r.name, 'h1', 'class="display"')}<p class="lead" data-reveal>${r.intro}</p></section>
<section class="wrap"><div class="gallery" data-gallery tabindex="0" aria-roledescription="carousel" aria-label="${r.name}, ${gal.length} ${t.photos}"><div class="g-track">${gal.map((g, i) => `<div class="g-slide${i === 0 ? ' is-on' : ''}" role="group" aria-roledescription="slide" aria-label="${i + 1} / ${gal.length}">${pic(g, i === 0 ? r.alt : '', { sizes: '100vw', w: 1920, h: 1080, priority: i === 0, lazy: i > 0 })}</div>`).join('')}</div>
<div class="g-ui"><span data-g-count aria-live="polite">1 / ${gal.length}</span><button type="button" data-g="-1" aria-label="${L === 'es' ? 'Foto anterior' : 'Previous photo'}">${L_.ICON.chevL}</button><button type="button" data-g="1" aria-label="${L === 'es' ? 'Foto siguiente' : 'Next photo'}">${L_.ICON.chevR}</button></div></div></section>
<section class="wrap room-main"><div class="room-copy"><p class="eyebrow">${t.theRoom}</p><p class="room-body" data-reveal>${r.body}</p>
<dl class="facts-grid" data-stagger><div><dt>${t.bedL}</dt><dd>${r.bed}</dd></div><div><dt>${t.sizeL}</dt><dd>${r.size}</dd></div><div><dt>${t.viewL}</dt><dd>${r.view}</dd></div><div><dt>${t.accessL}</dt><dd>${r.access}</dd></div></dl>
<h2 class="eyebrow">${t.inRoom}</h2><ul class="amen" role="list">${t.amenities.map(a => `<li>${CHECK}${a}</li>`).join('')}</ul>
<h2 class="eyebrow">${t.goodToKnow}</h2><ul class="gtk" role="list">${t.gtk.map(([h, p]) => `<li><b>${h}</b><p>${p}</p></li>`).join('')}</ul></div>
<aside class="room-card-book" aria-label="${t.bookRoom}"><p class="rb-price">€${r.price} <small>${t.nightForTwo}</small></p><p class="rb-inc">${t.breakfastIncl}</p>
${bookingBar(site, L, { room: r.id, price: r.price, watch: true })}<ul role="list" class="rb-perks">${t.bookBetter.map(b => `<li>${CHECK}${b}</li>`).join('')}</ul></aside></section>
<section class="others"><div class="wrap">${split(t.otherRooms, 'h2', 'class="display-m"')}<ul class="room-grid two-up" role="list" data-stagger>${others.map(o => roomCard(L, o, t)).join('')}</ul></div></section>
${stickyBar(site, L, { label: r.name, value: '€' + r.price + ' ' + t.perNight, cta: t.reserve })}`;
  const roomLD = { '@context': 'https://schema.org', '@type': 'HotelRoom', name: r.name, description: r.intro, image: `${site.domain}/assets/img/${r.img}-1280.webp`, floorSize: { '@type': 'QuantitativeValue', value: parseInt(r.size), unitCode: 'MTK' }, occupancy: { '@type': 'QuantitativeValue', maxValue: r.max }, bed: r.bed, containedInPlace: { '@id': site.domain + '/#hotel' },
    offers: { '@type': 'Offer', price: r.price, priceCurrency: 'EUR', availability: 'https://schema.org/InStock', url: site.domain + site.href(L, 'book') + '?room=' + r.id } };
  return page(site, { lang: L, key: 'room-' + r.id, title: `${r.name} · Casa Azahar, Valencia`, desc: `${r.intro} ${t.from} €${r.price} ${t.nightForTwo}.`, body, og: r.img, jsonld: [roomLD, crumbs(L, [['Casa Azahar', 'home'], [t.roomsPageH, 'rooms'], [r.name, 'room-' + r.id]])] });
}

function bookPage(L) {
  const t = C.t[L];
  return page(site, { lang: L, key: 'book', title: t.metaBook, desc: t.metaBookD, body: bookBody(site, L), bodyClass: 'is-book' });
}

const TEXT = {
  privacy: {
    en: ['Privacy policy', ['This is a demonstration website for a fictional guest house. No booking, contact or form data is sent or stored on a server.', 'Your accessibility choices and the dates you search are saved only in your own browser (localStorage) so the site remembers them. You can clear them at any time by clearing your browser data.', 'We do not use cookies, analytics or advertising trackers. Fonts and images are served from this website, with no requests to third parties.', 'On a real guest house website this page would name the data controller, explain the legal basis for processing booking data under the GDPR, how long it is kept, and how to exercise your rights with the Spanish data protection agency (AEPD).']],
    es: ['Política de privacidad', ['Esta es una web de demostración de una casa de huéspedes ficticia. Los datos de reservas, contacto o formularios no se envían ni se guardan en ningún servidor.', 'Tus preferencias de accesibilidad y las fechas que buscas se guardan solo en tu navegador (localStorage) para que la web las recuerde. Puedes borrarlas en cualquier momento borrando los datos del navegador.', 'No usamos cookies, analítica ni rastreadores publicitarios. Las fuentes y las imágenes se sirven desde esta web, sin peticiones a terceros.', 'En la web de un alojamiento real, esta página indicaría el responsable del tratamiento, la base legal para tratar los datos de reserva según el RGPD, el plazo de conservación y cómo ejercer tus derechos ante la AEPD.']]
  },
  legal: {
    en: ['Legal notice', ['Casa Azahar is a fictional guest house created as a design and development demonstration by Lizzy Cruz (lizzymcruz.com).', 'All names, addresses, phone numbers and prices on this site are invented. Photographs are from Unsplash and are used under the Unsplash License.', 'On a real website this page would include the company name, tax ID (NIF/CIF), registered address and tourism registration number, as required by Spanish law (LSSI-CE).']],
    es: ['Aviso legal', ['Casa Azahar es una casa de huéspedes ficticia creada como demostración de diseño y desarrollo por Lizzy Cruz (lizzymcruz.com).', 'Todos los nombres, direcciones, teléfonos y precios de esta web son inventados. Las fotografías son de Unsplash y se usan bajo la licencia de Unsplash.', 'En una web real, esta página incluiría la razón social, el NIF/CIF, el domicilio social y el número de registro turístico, como exige la LSSI-CE.']]
  },
  accessibility: {
    en: ['Accessibility statement', ['We want everyone to be able to find and book a room on this website, whatever device, browser or assistive technology they use.', 'The site aims to meet WCAG 2.2 level AA. Text and buttons meet contrast requirements, every control can be used with a keyboard and shows a visible focus ring, form fields have labels and clear error messages, and images have text alternatives.', 'Use the accessibility button in the bottom-left corner to make text up to 50% larger, switch to high contrast, stop animations, underline links, add spacing between letters and lines, or use a simpler font. Your choices are remembered on this device.', 'The site also follows your device settings: if you have reduced motion turned on, animations are switched off automatically. Browser zoom up to 400% is supported.', 'Found a problem? Tell us at hola@casaazahar.example and we will reply within two working days.']],
    es: ['Declaración de accesibilidad', ['Queremos que cualquier persona pueda encontrar y reservar una habitación en esta web, sea cual sea su dispositivo, navegador o tecnología de apoyo.', 'La web busca cumplir las WCAG 2.2 nivel AA. Los textos y botones cumplen los requisitos de contraste, todos los controles se pueden usar con teclado y muestran un foco visible, los campos de formulario tienen etiquetas y mensajes de error claros, y las imágenes tienen texto alternativo.', 'Usa el botón de accesibilidad de la esquina inferior izquierda para aumentar el texto hasta un 50%, activar el alto contraste, detener las animaciones, subrayar los enlaces, añadir espacio entre letras y líneas o usar una fuente más sencilla. Tus preferencias se recuerdan en este dispositivo.', 'La web también respeta los ajustes de tu dispositivo: si tienes activada la reducción de movimiento, las animaciones se desactivan automáticamente. Admite zoom del navegador hasta el 400%.', '¿Has encontrado un problema? Escríbenos a hola@casaazahar.example y te responderemos en dos días laborables.']]
  }
};
function textPage(L, key) {
  const [h, ps] = TEXT[key][L];
  return page(site, { lang: L, key, title: `${h} · Casa Azahar`, desc: ps[0], body: `<section class="wrap text-page"><h1 class="display-m">${h}</h1>${ps.map(p => `<p>${p}</p>`).join('')}</section>` });
}

/* ---------- write everything ---------- */
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.cpSync(path.join(__dirname, 'assets'), path.join(OUT, 'assets'), { recursive: true });
for (const L of ['en', 'es']) {
  const pre = L === 'en' ? '' : '/es';
  writeOut(OUT, pre + '/', home(L));
  writeOut(OUT, pre + '/rooms/', roomsPage(L));
  C.rooms[L].forEach(r => writeOut(OUT, pre + `/rooms/${r.slug}/`, roomPage(L, r)));
  writeOut(OUT, pre + '/book/', bookPage(L));
  ['privacy', 'legal', 'accessibility'].forEach(k => writeOut(OUT, pre + `/${k}/`, textPage(L, k)));
}
const t = C.t.en;
fs.writeFileSync(path.join(OUT, '404.html'), page(site, { lang: 'en', key: 'home', title: 'Page not found · Casa Azahar', desc: t.notFoundP, noindex: true, body: `<section class="wrap text-page center">${mark('nf-mark')}<h1 class="display-m">${t.notFoundH}</h1><p>${t.notFoundP}</p><p class="btns" style="justify-content:center"><a class="btn btn-primary" href="/rooms/">${t.roomsPageH}</a><a class="btn btn-ghost" href="/">${t.backHome}</a></p></section>` }));
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), sitemap(site, Object.keys(site.paths)));
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.domain}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, '_headers'), HEADERS);
fs.writeFileSync(path.join(OUT, 'favicon.svg'), mark().replace('<svg class="" viewBox', '<svg xmlns="http://www.w3.org/2000/svg" viewBox').replace(' aria-hidden="true"', ''));
fs.writeFileSync(path.join(OUT, 'site.webmanifest'), JSON.stringify({ name: site.name, short_name: 'Azahar', start_url: '/', display: 'standalone', background_color: '#FBFAF6', theme_color: site.theme, icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }] }, null, 1));
console.log('Built', fs.readdirSync(OUT).length, 'entries into public/');
