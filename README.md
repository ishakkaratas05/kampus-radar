<div align="center">

<!-- GitHub: göreli SVG yolu bazen kırılır; raw + ASCII dosya adı kullanılıyor -->
<img src="https://raw.githubusercontent.com/ishakkaratas05/kampus-radar/main/web/public/readme-logo.svg" alt="KampüsRadar" width="480" />

# KampüsRadar

**Üniversite etkinliklerini ve kampüs yaşamını tek panelden yönetin.**  
Öğrenciler için etkinlikleri keşfedin; yöneticiler için üniversite, kullanıcı ve rol bazlı iş akışları sunar.

</div>

---

## Özellikler

| Alan | Açıklama |
|------|----------|
| **Kimlik** | E-posta / şifre ile giriş, JWT oturumu |
| **Roller** | Örn. sistem yöneticisi, organizatör, öğrenci (şemaya göre) |
| **Üniversiteler** | Listeleme; sistem yöneticisi için ekleme ve silme |
| **API** | REST (`/api/...`), Bearer token ile korumalı uçlar |

## Teknoloji

| Katman | Teknoloji |
|--------|-----------|
| **Backend** | Node.js, Express 5, Prisma, PostgreSQL (ör. Supabase), JWT, bcrypt |
| **Web** | Vite, React 19, React Router, Tailwind CSS |
| **Veri** | Prisma şeması: kullanıcı, üniversite, etkinlik, bilet modelleri |

## Proje yapısı

```text
kampus-radar/
├── backend/          # REST API
│   ├── prisma/       # Şema ve SQL yardımcıları
│   ├── scripts/      # hash-password, debug-login, set-password
│   └── src/
├── web/              # Yönetim / giriş arayüzü
│   ├── public/       # Logolar, statik dosyalar
│   └── src/
└── README.md
```

## Gereksinimler

- **Node.js** 18+
- **PostgreSQL** (yerel veya [Supabase](https://supabase.com/) vb.)

## Kurulum

### 1. Depoyu alın

```bash
git clone https://github.com/ishakkaratas05/kampus-radar.git
cd kampus-radar
```

### 2. Backend

```bash
cd backend
cp .env.example .env   # yoksa .env dosyasını oluşturup aşağıdaki değişkenleri doldurun
npm install
npx prisma generate
npx prisma db push     # veya migrate; DB bağlantınıza göre
npm run dev
```

Varsayılan API adresi: **http://localhost:4000** — sağlık kontrolü: `GET /api/health`

### 3. Web arayüzü

```bash
cd web
cp .env.example .env   # isteğe bağlı: VITE_API_URL=http://localhost:4000
npm install
npm run dev
```

Tarayıcıda Vite adresi (çoğunlukla **http://localhost:5173**). Giriş ve yönetim paneli bu adreste açılır.

## Ortam değişkenleri

### `backend/.env` (örnek alanlar)

| Değişken | Açıklama |
|----------|----------|
| `DATABASE_URL` | PostgreSQL bağlantı URL’si |
| `JWT_SECRET` | JWT imza anahtarı (güçlü ve gizli tutun) |
| `PORT` | İsteğe bağlı; varsayılan `4000` |

### `web/.env` (isteğe bağlı)

| Değişken | Açıklama |
|----------|----------|
| `VITE_API_URL` | API kök adresi; tanımlı değilse `http://localhost:4000` kullanılır |

## Faydalı komutlar

**Backend**

```bash
npm run dev              # geliştirme sunucusu
npm run hash-password -- <şifre>   # bcrypt hash üretir
npm run debug-login -- <email> <şifre>   # DB + şifre doğrulama tanısı
npm run prisma:studio  # Prisma Studio
```

**Web**

```bash
npm run dev      # geliştirme
npm run build    # üretim derlemesi
```

## Logo ve marka

GitHub’daki README görseli [`web/public/readme-logo.svg`](web/public/readme-logo.svg) dosyasından gelir (ASCII ad; `KampüsRadar1.svg` ile aynı içerik — logo güncellerken ikisini de yenileyin veya birini kopyalayın).

Web uygulamasında (giriş / panel / favicon) varsayılan olarak [`web/public/KampüsRadar.svg`](web/public/Kamp%C3%BCsRadar.svg) kullanılır; güncellemek için `web/src/lib/brand.js` ve `web/index.html` içindeki yolları düzenleyin.

---

*Bu depo geliştirme amaçlıdır; üretim dağıtımında güvenlik, yedekleme ve gizli anahtar yönetimini ayrıca ele alın.*
