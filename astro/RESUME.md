# RWG Astro Conversion - Resume Guide

## Quick Start Prompt

```
Continue RWG (RandomWordGenerator) Astro conversion.

Locations:
- Astro project: /home/nate/rwg/astro
- Laravel API: /home/nate/rwg (API-only backend)
- Source content (React pages): /home/nate/rwg/resources/js/Pages/
- Production (Yii2): ssh rwg -> /var/www/randomwordgenerator/html/
- Staging: ssh rwg -> /var/www/staging/

Status: 14/50 pages converted (index, noun, verb, adjective, phrase, sentence, paragraph, letter, number, password, question, fact, synonym)

To convert a page:
1. Check PRODUCTION site (https://randomwordgenerator.com/[page].php) for exact form inputs and wording
2. Create /home/nate/rwg/astro/src/components/generators/[Name]Generator.tsx
3. Create /home/nate/rwg/astro/src/pages/[name].astro

IMPORTANT: Production site is the source of truth for form fields, radio buttons, checkboxes,
dropdowns, and their exact wording. The Laravel/React code may differ from production.
Always verify against https://randomwordgenerator.com/[page].php

Use FactsGenerator.tsx as simple template, NounGenerator.tsx for word-filtering pages.

Dev servers:
- Laravel: ./vendor/bin/sail up -d (API on :80)
- Astro: cd astro && npm run dev (frontend on :4321, proxies /api to Laravel)

Build: cd /home/nate/rwg/astro && npm run build
Deploy: rsync -avz --delete astro/dist/ rwg:/var/www/staging/ --exclude api
```

## File Mapping

| Astro Page | Production URL | Generator Component |
|------------|----------------|---------------------|
| name.astro | randomwordgenerator.com/name.php | NameGenerator.tsx |
| bible-verse.astro | randomwordgenerator.com/bible-verse.php | BibleVerseGenerator.tsx |
| charades.astro | randomwordgenerator.com/charades.php | CharadesGenerator.tsx |
| coin-flip.astro | randomwordgenerator.com/coin-flip.php | CoinFlipGenerator.tsx |
| etc... | etc... | etc... |

Note: Laravel/React files in /home/nate/rwg/resources/js/Pages/ can be referenced for
component structure, but form inputs MUST match production site exactly.

## Remaining Pages (~36)

From /home/nate/rwg/resources/js/Pages/:
- ActsOfKindness.tsx, BibleVerses.tsx, BooksEveryoneShouldRead.tsx
- BreakfastIdeas.tsx, Charades.tsx, CoinFlip.tsx, ColoringPages.tsx
- Colors.tsx, ComputerCode.tsx, CursiveLetters.tsx, Decision.tsx
- DiceRoll.tsx, DinnerIdeas.tsx, DrawingIdeas.tsx, FakeWords.tsx
- GiftIdeas.tsx, Hangman.tsx, InterviewQuestions.tsx, LetterSequence.tsx
- List.tsx, MakeMoney.tsx, MotivationalQuotes.tsx, Names.tsx
- Pictionary.tsx, Pictures.tsx, PrivacyPolicy.tsx, TongueTwisters.tsx
- Vocabulary.tsx, WeddingHashtags.tsx, WeirdWords.tsx, WritingPrompts.tsx
- YesNo.tsx, AllGenerators.tsx (more page)
- QuestionNeverHaveIEver.tsx, QuestionTruthOrDare.tsx, QuestionWouldYouRather.tsx

## Server Access

```bash
# RWG server
ssh rwg "command"

# Check staging
ssh rwg "ls /var/www/staging/"

# Deploy build
cd /home/nate/rwg/astro && npm run build
rsync -avz --delete dist/ rwg:/var/www/staging/ --exclude api
```

## Pattern Examples

### Simple Generator (no filters)
See: src/components/generators/FactsGenerator.tsx

### Word Generator (with letter/size filters)
See: src/components/generators/NounGenerator.tsx

### Page File
See: src/pages/noun.astro (just imports layout + generator)
