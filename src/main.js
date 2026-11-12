import './style.css'

const menu = [
  {
    emoji: '🫘',
    name: 'اتحادیه اتیوپی',
    origin: 'ییرگاچف • ارتفاع ۱۹۰۰ متر',
    desc: 'عطر گل و یاس، طعم هل و لیموترش؛ پادشاه شناورها.',
    price: '۴۸۵',
    tag: 'پرفروش'
  },
  {
    emoji: '⛰️',
    name: 'کلمبیا هویلا',
    origin: 'پیندال • ارتفاع ۱۷۵۰ متر',
    desc: 'شکلات شیری، کارامل و آجیل؛ همه‌فن‌حریف اسپرسو.',
    price: '۴۲۰',
    tag: 'امتیاز ۸۶'
  },
  {
    emoji: '🌰',
    name: 'برزیل سانتوس',
    origin: 'میناس ژرایس • طبیعی‌خشک',
    desc: 'بادی غلیظ، مغز بادام و شکلات تلخ؛ عاشق شیر سویا.',
    price: '۳۶۵',
    tag: 'اقتصادی'
  },
  {
    emoji: '🌙',
    name: 'بلند شبانه',
    origin: 'ترکیب رُست تیره',
    desc: 'برای موکاپات و قهوه ترک؛ دودی و پرقدرت.',
    price: '۳۹۰',
    tag: 'رُست تیره'
  }
]

const cardsEl = document.getElementById('menuCards')
cardsEl.innerHTML = menu
  .map(
    (m) => `
  <article class="card reveal">
    <span class="card__emoji">${m.emoji}</span>
    <h3>${m.name}</h3>
    <div class="card__origin">${m.origin}</div>
    <p>${m.desc}</p>
    <div class="card__foot">
      <span class="card__price">${m.price} <small>هزار تومان / ۲۵۰ گرم</small></span>
      <span class="card__tag">${m.tag}</span>
    </div>
  </article>`
  )
  .join('')

const faDigits = (n) => String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d])

const observer = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible')
        observer.unobserve(e.target)
      }
    }
  },
  { threshold: 0.15 }
)
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))

const navbar = document.getElementById('navbar')
window.addEventListener(
  'scroll',
  () => navbar.classList.toggle('is-scrolled', window.scrollY > 20),
  { passive: true }
)

const hamburger = document.getElementById('hamburger')
const navLinks = document.getElementById('navLinks')
hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('is-open')
  hamburger.classList.toggle('is-open', open)
  hamburger.setAttribute('aria-expanded', String(open))
})
navLinks.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    navLinks.classList.remove('is-open')
    hamburger.classList.remove('is-open')
  }
})

const counters = document.querySelectorAll('[data-count]')
const counterObserver = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue
      counterObserver.unobserve(e.target)
      const target = Number(e.target.dataset.count)
      const start = performance.now()
      const tick = (now) => {
        const p = Math.min((now - start) / 1400, 1)
        e.target.textContent = faDigits(Math.round(target * (1 - Math.pow(1 - p, 3))))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }
  },
  { threshold: 0.6 }
)
counters.forEach((c) => counterObserver.observe(c))

const form = document.getElementById('orderForm')
const msg = document.getElementById('formMsg')
form.addEventListener('submit', (e) => {
  e.preventDefault()
  const email = document.getElementById('email').value.trim()
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  msg.textContent = ok
    ? '☕ ثبت شد! کد «فنجان اول» تا چند دقیقه‌ی دیگر به ایمیلت می‌رسد.'
    : 'ایمیل معتبر وارد کن تا کد تخفیف را بفرستیم 🙏'
  msg.style.color = ok ? 'var(--gold-2)' : '#e08a7a'
  if (ok) form.reset()
})
