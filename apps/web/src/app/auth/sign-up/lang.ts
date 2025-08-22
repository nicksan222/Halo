import { defineLang } from '@acme/localization';

export const lang = defineLang({
  title: { en: 'Create your account', it: 'Crea il tuo account' },
  subtitle: {
    en: 'Enter your information to get started',
    it: 'Inserisci le tue informazioni per iniziare'
  },
  firstName: { en: 'First name', it: 'Nome' },
  firstNameRequired: { en: 'First name is required', it: 'Nome richiesto' },
  firstNamePlaceholder: { en: 'Max', it: 'Max' },
  lastName: { en: 'Last name', it: 'Cognome' },
  lastNameRequired: { en: 'Last name is required', it: 'Cognome richiesto' },
  lastNamePlaceholder: { en: 'Robinson', it: 'Robinson' },
  email: { en: 'Email', it: 'Email' },
  emailRequired: { en: 'Email is required', it: 'Email richiesta' },
  emailInvalid: { en: 'Enter a valid email address', it: 'Inserisci un indirizzo email valido' },
  emailPlaceholder: { en: 'm@example.com', it: 'm@example.com' },
  password: { en: 'Password', it: 'Password' },
  passwordRequired: { en: 'Password is required', it: 'Password richiesta' },
  passwordMinLength: { en: 'Minimum 6 characters', it: 'Minimo 6 caratteri' },
  passwordPlaceholder: { en: 'Password', it: 'Password' },
  confirmPassword: { en: 'Confirm Password', it: 'Conferma Password' },
  confirmPasswordRequired: { en: 'Please confirm your password', it: 'Conferma la tua password' },
  confirmPasswordPlaceholder: { en: 'Confirm Password', it: 'Conferma Password' },
  passwordsDoNotMatch: { en: 'Passwords do not match', it: 'Le password non corrispondono' },
  profileImage: { en: 'Profile Image', it: 'Immagine Profilo' },
  optional: { en: 'Optional', it: 'Opzionale' },
  createAccount: { en: 'Create an account', it: 'Crea un account' },
  alreadyHaveAccount: { en: 'Already have an account?', it: 'Hai già un account?' },
  signIn: { en: 'Sign in', it: 'Accedi' },
  termsText: {
    en: 'By creating an account, you agree to our',
    it: 'Creando un account, accetti i nostri'
  },
  termsLink: { en: 'Terms of Service', it: 'Termini di Servizio' },
  privacyLink: { en: 'Privacy Policy', it: 'Informativa sulla Privacy' },
  orgSelectTitle: { en: 'Select your organization', it: 'Seleziona la tua organizzazione' },
  orgSelectSubtitle: {
    en: 'Choose which organization to use as your active workspace',
    it: 'Scegli quale organizzazione usare come spazio di lavoro attivo'
  },
  organization: { en: 'Organization', it: 'Organizzazione' },
  continue: { en: 'Continue', it: 'Continua' },
  loadingOrganizations: { en: 'Loading organizations…', it: 'Caricamento organizzazioni…' }
});
