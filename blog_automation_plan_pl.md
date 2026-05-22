# Jak zautomatyzować publikację wpisów blogowych z rozmów głosowych (Gemini/Chat) — podejście GitHub-first

## Krótka odpowiedź na Twój pomysł
Tak — to **bardzo dobry pomysł**, żeby oprzeć cały proces o GitHub i traktować każdy wpis jako Pull Request.  
Daje Ci to: wersjonowanie, review, historię zmian, możliwość cofnięcia, automatyczne testy jakości i prosty workflow redakcyjny.

## Cel
Zbudować pipeline, który:
1. bierze transkrypt rozmowy (np. z Gemini),
2. generuje wpis blogowy + metadane,
3. proponuje grafikę hero,
4. tworzy Pull Request z nowym wpisem (HTML albo Markdown+HTML),
5. po merge publikuje wpis automatycznie.

---

## Architektura GitHub-first (MVP)

### 1) Repo jako CMS
Struktura przykładowa:

```txt
content/
  posts/
    2026-05-21-ai-infra-i-procesy.md
public/
  images/
    2026-05-21-ai-infra-i-procesy-hero.jpg
templates/
  post.html
.github/
  workflows/
    new-post-from-transcript.yml
    validate-content.yml
```

Każdy wpis ma:
- frontmatter (title, slug, date, tags, excerpt, hero_image, seo_*),
- treść Markdown,
- opcjonalnie wyrenderowany HTML (jeśli chcesz trzymać oba formaty).

### 2) Format wpisu: HTML czy HTML+Markdown?
Rekomendacja:
- **Źródło prawdy: Markdown + frontmatter**,
- **HTML: artefakt builda** (generowany automatycznie).

Dlaczego tak:
- Markdown jest łatwiejszy do review w PR,
- mniejsze ryzyko „brudnego” HTML z modelu,
- prostsze lintowanie i walidacja jakości.

Jeśli chcesz, możesz trzymać oba pliki:
- `post.md` (źródło),
- `post.html` (snapshot do publikacji/preview).

### 3) Źródło danych (rozmowy)
- Eksportuj rozmowy z Gemini/innego chatu do `inbox/` (txt/json).
- Jeden plik transkryptu = jeden draft wpisu.

### 4) Generator wpisu (LLM)
LLM zwraca **ustrukturyzowany JSON**:
- `title`
- `slug`
- `summary`
- `article_markdown`
- `tags`
- `seo_title`
- `seo_description`
- `hero_image_prompt`
- `alt_text`
- `risk_flags`

Potem skrypt repo:
1. buduje `.md` z frontmatter,
2. generuje/wybiera obrazek hero,
3. tworzy branch,
4. commit,
5. otwiera PR.

### 5) PR jako jednostka redakcyjna
Każdy PR powinien zawierać:
- nowy plik wpisu,
- obrazek hero,
- auto-opis PR (streszczenie, źródło transkryptu, checklista jakości),
- sekcję „co wymaga ręcznego fact-checku”.

Przykładowe status checks:
- markdownlint,
- walidacja frontmatter/schema,
- wykrywanie PII/sekretów,
- link checker,
- opcjonalnie AI style-check.

### 6) Publikacja po merge
Dwie opcje:
- **GitHub Pages / statyczny blog**: merge do `main` uruchamia build i deploy,
- **Zewnętrzny CMS**: merge triggeruje workflow, który pushuje treść przez API (Ghost/WordPress).

---

## Proponowany workflow operacyjny
1. Rozmowa w aucie (Gemini).  
2. Eksport/transkrypcja do `inbox/`.  
3. GitHub Action (manual lub cron) uruchamia generator.  
4. Powstaje branch `post/YYYY-MM-DD-slug`.  
5. Automatycznie otwiera się PR.  
6. Ty robisz szybki review (2–5 min), poprawiasz jeśli trzeba.  
7. Merge = publikacja.

## Dlaczego to podejście jest mocne
- „Draft-first” i review wymuszone przez PR,
- pełny audyt zmian i łatwe rollbacki,
- łatwe dodanie automatycznych bramek jakości,
- dobre pod SEO (kontrolujesz strukturę, metadata, linking).

---

## Minimalny stack (szybki start)
- Repo: GitHub.
- Orkiestracja: GitHub Actions (+ ewentualnie n8n jeśli chcesz integracje no-code).
- Silnik bloga: Astro / Next.js + MDX / Hugo (dowolny statyczny generator).
- LLM: model do pisania i streszczeń.
- Obrazki: model image generation albo stock API.

## Jakość i bezpieczeństwo
Automatyczne bramki w CI:
- PII/secrets scan,
- walidacja twierdzeń wysokiego ryzyka (manual checklist),
- minimalna/maksymalna długość,
- „no client names” rule,
- limit autopublikacji (np. max 1 merge/dzień z auto-generacji).

## KPI
- % PR-ów akceptowanych bez dużych poprawek,
- czas od rozmowy do merge,
- czas review na PR,
- ruch organiczny / engagement.

---

## Plan wdrożenia na 2 tygodnie (GitHub-first)

### Tydzień 1
- Ustalenie formatu wpisu (`md` + frontmatter).
- Dodanie workflow: transkrypt -> draft pliku -> branch -> PR.
- Dodanie walidacji schema/frontmatter.

### Tydzień 2
- Dodanie generacji obrazka + alt text.
- Dodanie PII checks i quality gates.
- Podpięcie deploya po merge.

## Co mogę przygotować dalej
W kolejnym kroku mogę dać Ci gotowce:
1. `new-post-from-transcript.yml` (GitHub Action),
2. JSON Schema dla frontmatter + payloadu LLM,
3. template PR description dla auto-wpisów,
4. przykładową strukturę wpisu `.md` i wynikowego `.html`.
