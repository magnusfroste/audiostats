# Meeting Analysis Dashboard

En Next.js-applikation för att analysera mötesinspelningar med hjälp av AI. Applikationen transkriberar möten och genererar detaljerade insikter om mötets innehåll, deltagarengagemang och nyckelresultat.

## Funktioner

- 🎙️ Stöd för olika ljudformat (mp3, mp4, wav, m4a)
- 📝 Transkribering av möten
- 📊 Detaljerad mötesanalys:
  - Taltidsfördelning
  - Deltagarengagemang
  - Emotionell analys
  - Nyckelämnen och beslut
  - Åtgärdspunkter
- 💡 AI-drivna insikter
- 🎨 Modern och användarvänlig UI

## Teknisk Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4 med audio
- **Deployment**: Vercel

## Komma igång

1. Klona repositoryt
2. Installera beroenden:
```bash
npm install
```

3. Skapa en `.env.local` fil med din OpenAI API-nyckel:
```
OPENAI_API_KEY=your_api_key_here
```

4. Starta utvecklingsservern:
```bash
npm run dev
```

5. Öppna [http://localhost:3000](http://localhost:3000)

## Begränsningar

- Maximal filstorlek: 25MB
- Optimal möteslängd: 30-60 minuter
- Maximal möteslängd: 2 timmar

## Deploy på Vercel

Projektet är optimerat för deployment på [Vercel Platform](https://vercel.com). Klicka på knappen nedan för att deploya:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/your-repo-name)

## Licens

MIT
# audiostats
