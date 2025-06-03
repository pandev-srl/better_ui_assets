import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["backdrop", "container", "closeButton"]
  static values = { 
    closeOnBackdrop: { type: Boolean, default: true },
    closeOnEscape: { type: Boolean, default: true },
    lockScroll: { type: Boolean, default: true }
  }

  connect() {
    console.log('🎭 Modal controller connected')
    
    // Inizializza solo il backdrop come nascosto (non tutto l'elemento)
    if (this.hasBackdropTarget) {
      this.backdropTarget.style.display = 'none'
    }
    
    // Bind dei metodi per mantenere il contesto
    this.handleKeydown = this.handleKeydown.bind(this)
    this.handleBackdropClick = this.handleBackdropClick.bind(this)
    
    // Imposta attributi ARIA per accessibilità
    this.setupAccessibility()
  }

  disconnect() {
    console.log('🎭 Modal controller disconnected')
    this.unlockBodyScroll()
    this.removeEventListeners()
  }

  // Apre il modal
  open() {
    console.log('🔓 Opening modal')
    
    // Mostra solo il backdrop (non tutto l'elemento wrapper)
    if (this.hasBackdropTarget) {
      this.backdropTarget.style.display = 'flex'
    }
    
    // Lock dello scroll del body se abilitato
    if (this.lockScrollValue) {
      this.lockBodyScroll()
    }
    
    // Aggiunge event listeners
    this.addEventListeners()
    
    // Focus management per accessibilità
    this.focusModal()
    
    // Aggiunge classe per animazione di entrata al backdrop
    if (this.hasBackdropTarget) {
      this.backdropTarget.classList.add('modal-entering')
      
      // Rimuove la classe dopo l'animazione
      setTimeout(() => {
        this.backdropTarget.classList.remove('modal-entering')
        this.backdropTarget.classList.add('modal-open')
      }, 10)
    }
  }

  // Chiude il modal
  close() {
    console.log('🔒 Closing modal')
    
    if (this.hasBackdropTarget) {
      // Aggiunge classe per animazione di uscita al backdrop
      this.backdropTarget.classList.add('modal-leaving')
      this.backdropTarget.classList.remove('modal-open')
      
      // Attende la fine dell'animazione prima di nascondere
      setTimeout(() => {
        this.backdropTarget.style.display = 'none'
        this.backdropTarget.classList.remove('modal-leaving')
        
        // Unlock dello scroll del body
        this.unlockBodyScroll()
        
        // Rimuove event listeners
        this.removeEventListeners()
        
        // Ripristina il focus
        this.restoreFocus()
      }, 200) // Durata animazione CSS
    }
  }

  // Toggle del modal
  toggle() {
    if (this.isOpen()) {
      this.close()
    } else {
      this.open()
    }
  }

  // Verifica se il modal è aperto
  isOpen() {
    if (this.hasBackdropTarget) {
      return this.backdropTarget.style.display !== 'none'
    }
    return false
  }

  // Gestisce click sul backdrop
  handleBackdropClick(event) {
    if (!this.closeOnBackdropValue) return
    
    // Chiude solo se il click è direttamente sul backdrop
    if (event.target === this.backdropTarget) {
      console.log('🎯 Backdrop clicked - closing modal')
      this.close()
    }
  }

  // Gestisce eventi tastiera
  handleKeydown(event) {
    switch(event.key) {
      case 'Escape':
        if (this.closeOnEscapeValue) {
          console.log('⎋ Escape pressed - closing modal')
          event.preventDefault()
          this.close()
        }
        break
        
      case 'Tab':
        this.handleTabNavigation(event)
        break
    }
  }

  // Gestisce la navigazione Tab per il focus trapping
  handleTabNavigation(event) {
    const focusableElements = this.getFocusableElements()
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]
    
    if (event.shiftKey) {
      // Shift + Tab (navigazione indietro)
      if (document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      }
    } else {
      // Tab (navigazione avanti)
      if (document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }
  }

  // Click sul pulsante close
  closeButtonClicked(event) {
    event.preventDefault()
    console.log('❌ Close button clicked')
    this.close()
  }

  // Setup attributi per accessibilità
  setupAccessibility() {
    this.element.setAttribute('role', 'dialog')
    this.element.setAttribute('aria-modal', 'true')
    
    // Trova e imposta aria-labelledby se esiste un titolo
    const titleElement = this.element.querySelector('#modal-title, [data-modal-title]')
    if (titleElement) {
      if (!titleElement.id) {
        titleElement.id = `modal-title-${Math.random().toString(36).substr(2, 9)}`
      }
      this.element.setAttribute('aria-labelledby', titleElement.id)
    }
  }

  // Lock dello scroll del body
  lockBodyScroll() {
    // Salva la posizione attuale dello scroll
    this.scrollPosition = window.pageYOffset
    
    // Applica gli stili per bloccare lo scroll
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${this.scrollPosition}px`
    document.body.style.width = '100%'
    
    console.log('🔒 Body scroll locked')
  }

  // Unlock dello scroll del body
  unlockBodyScroll() {
    if (typeof this.scrollPosition !== 'undefined') {
      // Ripristina gli stili originali
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      
      // Ripristina la posizione dello scroll
      window.scrollTo(0, this.scrollPosition)
      
      console.log('🔓 Body scroll unlocked')
    }
  }

  // Focus sul modal per accessibilità
  focusModal() {
    // Salva l'elemento attualmente focalizzato
    this.previouslyFocusedElement = document.activeElement
    
    // Trova il primo elemento focusabile nel modal
    const focusableElements = this.getFocusableElements()
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    } else {
      // Se non ci sono elementi focusabili, focalizza il container
      if (this.hasContainerTarget) {
        this.containerTarget.focus()
      }
    }
  }

  // Ripristina il focus all'elemento precedente
  restoreFocus() {
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus()
    }
  }

  // Ottiene tutti gli elementi focusabili nel modal
  getFocusableElements() {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ].join(',')
    
    return Array.from(this.element.querySelectorAll(focusableSelectors))
      .filter(element => element.offsetParent !== null) // Solo elementi visibili
  }

  // Aggiunge event listeners
  addEventListeners() {
    document.addEventListener('keydown', this.handleKeydown)
    
    if (this.hasBackdropTarget) {
      this.backdropTarget.addEventListener('click', this.handleBackdropClick)
    }
  }

  // Rimuove event listeners
  removeEventListeners() {
    document.removeEventListener('keydown', this.handleKeydown)
    
    if (this.hasBackdropTarget) {
      this.backdropTarget.removeEventListener('click', this.handleBackdropClick)
    }
  }
}
