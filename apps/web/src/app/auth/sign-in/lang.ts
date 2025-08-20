import { defineLang } from '@acme/localization';

export const lang = defineLang({
  title: { en: 'Welcome back', it: 'Bentornato' },
  subtitle: {
    en: 'Login with your Apple or Google account',
    it: 'Accedi con il tuo account Apple o Google'
  },
  appleLogin: { en: 'Login with Apple', it: 'Accedi con Apple' },
  googleLogin: { en: 'Login with Google', it: 'Accedi con Google' },
  orContinueWith: { en: 'Or continue with', it: 'Oppure continua con' },
  email: { en: 'Email', it: 'Email' },
  emailPlaceholder: { en: 'm@example.com', it: 'm@example.com' },
  emailRequired: { en: 'Email is required', it: 'Email richiesta' },
  emailInvalid: { en: 'Enter a valid email address', it: 'Inserisci un indirizzo email valido' },
  password: { en: 'Password', it: 'Password' },
  passwordPlaceholder: { en: 'password', it: 'password' },
  passwordRequired: { en: 'Password is required', it: 'Password richiesta' },
  passwordMinLength: { en: 'Minimum 6 characters', it: 'Minimo 6 caratteri' },
  forgotPassword: { en: 'Forgot your password?', it: 'Password dimenticata?' },
  rememberMe: { en: 'Remember me', it: 'Ricordami' },
  login: { en: 'Login', it: 'Accedi' },
  noAccount: { en: "Don't have an account?", it: 'Non hai un account?' },
  signUp: { en: 'Sign up', it: 'Registrati' },
  termsText: {
    en: 'By clicking continue, you agree to our',
    it: 'Cliccando continua, accetti i nostri'
  },
  termsLink: { en: 'Terms of Service', it: 'Termini di Servizio' },
  privacyLink: { en: 'Privacy Policy', it: 'Informativa sulla Privacy' }
});
