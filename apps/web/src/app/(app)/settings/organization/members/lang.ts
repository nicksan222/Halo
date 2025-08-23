import { defineLang } from '@acme/localization';

export const lang = defineLang({
  title: { en: 'Members', it: 'Membri' },
  invitationSent: { en: 'Invitation sent', it: 'Invito inviato' },
  failedToFetchMembers: { en: 'Failed to fetch members', it: 'Impossibile recuperare i membri' },
  currentUserNotFound: {
    en: 'Current user not found in organization members',
    it: "Utente corrente non trovato nei membri dell'organizzazione"
  },
  failedToLoadMembers: {
    en: 'Failed to load organization members',
    it: "Impossibile caricare i membri dell'organizzazione"
  },
  inviteMember: {
    inviteMember: { en: 'Invite member', it: 'Invita membro' },
    title: { en: 'Invite member', it: 'Invita membro' },
    description: {
      en: 'Send an invitation to join this organization.',
      it: 'Invia un invito per unirsi a questa organizzazione.'
    },
    email: { en: 'Email', it: 'Email' },
    emailPlaceholder: { en: 'name@example.com', it: 'nome@esempio.com' },
    role: { en: 'Role', it: 'Ruolo' },
    selectRole: { en: 'Select role', it: 'Seleziona ruolo' },
    sendInvite: { en: 'Send invite', it: 'Invia invito' },
    sending: { en: 'Sending…', it: 'Invio…' },
    failedToSend: { en: 'Failed to send invitation', it: "Impossibile inviare l'invito" },
    unexpectedError: {
      en: 'An unexpected error occurred. Please try again.',
      it: 'Si è verificato un errore imprevisto. Riprova.'
    }
  },
  memberItem: {
    unknownUser: { en: 'Unknown User', it: 'Utente Sconosciuto' },
    you: { en: 'You', it: 'Tu' }
  },
  memberRole: {
    changeRole: { en: 'Change role', it: 'Cambia ruolo' },
    changeRoleFor: { en: 'Change role for', it: 'Cambia ruolo per' },
    selectRole: { en: 'Select role', it: 'Seleziona ruolo' },
    saveRole: { en: 'Save role', it: 'Salva ruolo' },
    saving: { en: 'Saving...', it: 'Salvataggio...' },
    failedToUpdate: { en: 'Failed to update role', it: 'Impossibile aggiornare il ruolo' },
    unexpectedError: {
      en: 'An unexpected error occurred. Please try again.',
      it: 'Si è verificato un errore imprevisto. Riprova.'
    }
  },
  removeMember: {
    removeMember: { en: 'Remove Member', it: 'Rimuovi Membro' },
    title: { en: 'Remove Member', it: 'Rimuovi Membro' },
    description: { en: 'Are you sure you want to remove', it: 'Sei sicuro di voler rimuovere' },
    descriptionEnd: {
      en: 'from the organization? This action cannot be undone.',
      it: "dall'organizzazione? Questa azione non può essere annullata."
    },
    cancel: { en: 'Cancel', it: 'Annulla' },
    remove: { en: 'Remove Member', it: 'Rimuovi Membro' },
    removing: { en: 'Removing...', it: 'Rimozione...' },
    failedToRemove: { en: 'Failed to remove member', it: 'Impossibile rimuovere il membro' },
    unexpectedError: {
      en: 'An unexpected error occurred. Please try again.',
      it: 'Si è verificato un errore imprevisto. Riprova.'
    }
  }
});
