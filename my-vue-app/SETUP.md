# Setup — Firebase + GitHub-fotoopslag

De site draait op **Vue + Vite**, gehost op **Netlify**, met:
- **Firestore** voor projectdata (gratis, pauzeert nooit)
- **Firebase Auth** voor de admin-login
- **Eigen beeldverwerking** (browser) + **GitHub-repo via jsDelivr-CDN** voor de foto's (gratis, geen credits)

## 1. Firebase project
1. Ga naar https://console.firebase.google.com → **Project toevoegen**.
2. **Build → Firestore Database → Database maken** (productiemodus).
3. **Build → Authentication → Get started → Sign-in method → E-mail/wachtwoord** aanzetten.
4. Maak onder **Authentication → Users** twee gebruikers aan:
   - `alexanderzoet@gmail.com`
   - `aidenderksen2007@gmail.com`
5. **Projectinstellingen (tandwiel) → Je apps → Web-app toevoegen (</>)** → kopieer de config-waarden.
6. Plak die in een nieuw bestand `.env` (zie `.env.example`).
7. Zet de inhoud van `firestore.rules` in **Firestore → Rules** en publiceer.

> Gebruik **NIET** Firebase Storage — dat vereist het betaalde Blaze-plan. Foto's gaan naar GitHub (stap 2).

## 2. GitHub-fotoopslag
1. Maak een nieuwe (publieke) repo, bv. `aiden-portfolio-images`.
2. Maak een **fine-grained personal access token**: GitHub → Settings → Developer settings →
   Fine-grained tokens → alleen deze repo, permissie **Contents: Read and write**.
3. Zet in **Netlify → Site settings → Environment variables**:
   - `GITHUB_TOKEN` = het token
   - `GITHUB_OWNER` = je GitHub-gebruikersnaam
   - `GITHUB_REPO` = `aiden-portfolio-images`
   - `GITHUB_BRANCH` = `main`

## 3. Lokaal draaien
```bash
npm install
npm run dev
```
De upload-/verwijder-functies draaien als Netlify Functions; gebruik daarvoor `netlify dev`
(met de GITHUB_* variabelen in een lokale `.env`) of test ze direct op een Netlify-deploy.

## 4. Bestaande projecten overzetten
De oude foto's stonden in Supabase. Het eenvoudigst: log in op `/admin` en voeg de projecten
opnieuw toe via het dashboard — de foto's worden dan automatisch verkleind en naar GitHub geüpload.
(De oude Supabase-omgeving kun je daarna opzeggen.)

## Datamodel (Firestore-collectie `projects`)
```
{
  title:       string,
  description: string,
  images:      [{ full: url, thumb: url }],
  cover:       url,            // thumbnail voor de homepage
  createdAt:   timestamp
}
```
