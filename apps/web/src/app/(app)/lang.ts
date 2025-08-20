import { defineLang } from '@acme/localization';

export const lang = defineLang({
  header: {
    appName: { en: 'Halo Todos', it: 'Halo Todos' },
    new: { en: 'New', it: 'Nuovo' },
    signOut: { en: 'Sign out', it: 'Esci' }
  },
  sidebar: {
    application: { en: 'Application', it: 'Applicazione' },
    todos: { en: 'Todos', it: 'Attività' },
    newTodo: { en: 'New Todo', it: 'Nuova Attività' },
    teamNamePrompt: { en: 'Team name', it: 'Nome del team' },
    freePlan: { en: 'Free', it: 'Gratis' }
  },
  home: {
    title: { en: 'Your Todos', it: 'Le tue attività' },
    description: { en: 'Stay on top of your tasks.', it: 'Rimani al passo con i tuoi compiti.' },
    actionNew: { en: 'New', it: 'Nuovo' }
  },
  todos: {
    failedToLoad: { en: 'Failed to load todos', it: 'Impossibile caricare le attività' },
    noTodosYet: { en: 'No todos yet', it: 'Nessuna attività ancora' },
    getStarted: {
      en: 'Get started by creating your first todo.',
      it: 'Inizia creando la tua prima attività.'
    },
    createTodo: { en: 'Create a todo', it: "Crea un'attività" },
    completed: { en: 'Completed', it: 'Completata' },
    pending: { en: 'Pending', it: 'In attesa' },
    noDescription: { en: 'No description', it: 'Nessuna descrizione' }
  },
  editTodo: {
    loading: { en: 'Loading…', it: 'Caricamento…' },
    failedToLoad: { en: 'Failed to load todo', it: "Impossibile caricare l'attività" },
    back: { en: 'Back', it: 'Indietro' },
    title: { en: 'Edit todo', it: 'Modifica attività' },
    details: { en: 'Details', it: 'Dettagli' },
    titleLabel: { en: 'Title', it: 'Titolo' },
    titleRequired: { en: 'Title is required', it: 'Titolo richiesto' },
    descriptionLabel: { en: 'Description', it: 'Descrizione' },
    completedLabel: { en: 'Completed', it: 'Completata' },
    save: { en: 'Save', it: 'Salva' },
    cancel: { en: 'Cancel', it: 'Annulla' }
  },
  signUp: {
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
    privacyLink: { en: 'Privacy Policy', it: 'Informativa sulla Privacy' }
  },
  error: {
    title: { en: 'Something went wrong', it: 'Qualcosa è andato storto' },
    error: { en: 'Error', it: 'Errore' },
    unexpectedError: {
      en: 'An unexpected error occurred.',
      it: 'Si è verificato un errore imprevisto.'
    },
    tryAgain: { en: 'Try again', it: 'Riprova' },
    goHome: { en: 'Go home', it: 'Vai alla home' }
  },
  common: {
    back: { en: 'Back', it: 'Indietro' }
  }
});
