# AGENTS.md — Masterplik / źródło prawdy dla bloga AI (GitHub-first)

Ten plik jest **główną specyfikacją** budowy i utrzymania bloga opartego o rozmowy głosowe z AI.
Każdy agent, skrypt i contributor powinien traktować ten dokument jako **single source of truth**.

---

## 1) Cel produktu

Budujemy system, który zamienia rozmowy (np. Gemini w samochodzie) w wartościowe wpisy blogowe publikowane przez workflow GitHub.

System ma:
1. pobierać transkrypty rozmów,
2. generować draft wpisu i metadane,
3. dobierać/generować grafikę hero,
4. tworzyć Pull Request z wpisem,
5. publikować po review i merge.

**Zasada nadrzędna:** jakość i wiarygodność > szybkość publikacji.

---

## 2) Zasady architektoniczne (GitHub-first)

1. **Repo jest CMS-em i źródłem prawdy** dla treści.
2. **Każdy nowy wpis powstaje jako Pull Request**.
3. **Markdown + frontmatter to źródło prawdy**; HTML jest artefaktem builda (opcjonalnie wersjonowanym).
4. **Merge do `main`** uruchamia publikację/deploy.
5. Workflow musi wspierać tryb **draft-first** (domyślnie) i dopiero potem publikację.

---

## 3) Struktura repo (kontrakt)

Minimalna, rekomendowana struktura:

```txt
inbox/                      # surowe transkrypty (txt/json)
content/
  posts/                    # wpisy źródłowe .md
public/
  images/                   # obrazy hero i assety wpisów
templates/                  # szablony treści / html
schemas/                    # JSON Schema (frontmatter i payload LLM)
.github/
  workflows/
    new-post-from-transcript.yml
    validate-content.yml
```

Każdy wpis powinien mieć 1 główny plik `.md` w `content/posts/`.

---

## 4) Konwencja wpisu (wymagane pola)

Każdy wpis MUSI zawierać frontmatter z co najmniej:
- `title`
- `slug`
- `date` (ISO 8601)
- `status` (`draft` lub `ready`)
- `tags` (lista)
- `excerpt`
- `hero_image`
- `hero_alt`
- `seo_title`
- `seo_description`
- `source_type` (np. `voice_chat`)
- `source_ref` (identyfikator pliku/rozmowy)

Treść wpisu:
- praktyczna,
- biznesowo-techniczno-ludzka,
- bez ujawniania danych poufnych,
- z sekcjami i jasnymi wnioskami.

---

## 5) Standard jakości treści

Każdy wpis powinien zawierać:
1. kontekst problemu,
2. analizę opcji / trade-offów,
3. rekomendacje wdrożeniowe,
4. ryzyka,
5. checklistę „co zrobić jutro”.

### Styl
- konkretnie, bez lania wody,
- krótkie akapity,
- język zrozumiały dla CTO/Head of Eng/foundera,
- zero clickbaitu.

---

## 6) Bezpieczeństwo i prywatność (must-have)

Przed merge każdy PR przechodzi walidacje:
1. brak PII i sekretów,
2. brak nazw klientów i informacji poufnych,
3. oznaczenie twierdzeń wymagających fact-checku,
4. kontrola ryzyk prawnych/wizerunkowych.

Jeśli wpis narusza polityki — PR nie może zostać zmergowany.

---

## 7) Pipeline: transkrypt → PR

### Krok A — wejście
- `inbox/*.txt|json` jako źródło.

### Krok B — generacja LLM
Model powinien zwrócić strukturalny payload (JSON) z polami:
- `title`, `slug`, `summary`, `article_markdown`,
- `tags`, `seo_title`, `seo_description`,
- `hero_image_prompt`, `alt_text`, `risk_flags`.

### Krok C — materializacja wpisu
Skrypt:
1. waliduje JSON schema,
2. tworzy plik wpisu `.md` z frontmatter,
3. generuje/pobiera hero image,
4. uruchamia local checks/linty,
5. tworzy branch i commit,
6. otwiera PR z checklistą.

### Krok D — review i merge
- człowiek robi szybkie review,
- po merge: build + deploy.

---

## 8) Zasady Pull Request dla wpisów

Każdy PR z nowym wpisem MUSI zawierać:
1. plik wpisu,
2. obrazek hero + alt text,
3. auto-streszczenie,
4. listę `risk_flags`,
5. checklistę review.

Minimalna checklista review:
- [ ] Brak danych poufnych/PII.
- [ ] Tytuł i SEO są sensowne.
- [ ] Tezy są adekwatne i nieprzesadzone.
- [ ] Wpis ma konkretne rekomendacje.
- [ ] Linki i formatowanie działają.

---

## 9) CI/CD i quality gates

`validate-content.yml` powinien uruchamiać co najmniej:
- lint Markdown,
- walidację frontmatter/schema,
- link checker,
- secrets/PII scan,
- (opcjonalnie) style/language checks.

`new-post-from-transcript.yml` powinien wspierać:
- uruchamianie ręczne (`workflow_dispatch`),
- uruchamianie cykliczne (`schedule`),
- wskazanie konkretnego pliku z `inbox/`.

---

## 10) Publikacja

Dopuszczalne modele:
1. **Static + GitHub Pages** (preferowane na start),
2. **External CMS sync** (Ghost/WordPress) po merge.

Niezależnie od modelu, warunkiem publikacji jest merge PR.

---

## 11) KPI i iteracja

Mierzymy:
- czas: transkrypt → PR,
- czas: PR → merge,
- % wpisów publikowanych bez dużych poprawek,
- ruch organiczny i zaangażowanie,
- liczba wpisów/msc utrzymanych jakościowo.

Raz na 2 tygodnie: przegląd promptów, quality gates i procesu review.

---

## 12) Definicja „Done” dla MVP

MVP jest gotowe, gdy:
1. da się z jednego transkryptu automatycznie wygenerować PR z kompletnym wpisem,
2. PR przechodzi walidacje jakości i bezpieczeństwa,
3. merge powoduje publikację,
4. redakcja człowieka trwa średnio ≤ 5 minut na wpis.

---

## 13) Instrukcje dla agentów (operacyjne)

1. Traktuj ten plik jako najwyższy kontekst projektowy.
2. Przy tworzeniu nowych workflowów i plików zawsze sprawdzaj zgodność z sekcjami 2–12.
3. Domyślnie preferuj rozwiązania proste, audytowalne i możliwe do utrzymania przez 1 osobę.
4. Jeśli pojawia się konflikt między automatyzacją a bezpieczeństwem treści, wybieraj bezpieczeństwo.
5. Nie publikuj automatycznie bez etapu PR/review (chyba że właściciel repo jawnie zmieni tę zasadę).

---

## 14) Kolejność implementacji (rekomendowana)

1. Schemat frontmatter + walidator.
2. Generator wpisu `.md` z payloadu LLM.
3. Workflow tworzący branch/commit/PR.
4. Quality gates w CI.
5. Generacja obrazków i alt text.
6. Deploy po merge.

To jest oficjalny plan bazowy. Każda większa zmiana procesu powinna zaczynać się od aktualizacji tego pliku.
