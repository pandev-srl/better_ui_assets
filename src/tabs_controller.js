import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["tab", "panel"]
  static values = { activeIndex: Number }

  connect() {
    // Inizializza il tab attivo al primo caricamento
    this.setInitialActiveTab()
  }

  // Metodo principale per il cambio di tab (referenziato nei componenti Ruby)
  switchTab(event) {
    event.preventDefault()
    
    const clickedTab = event.currentTarget
    const targetId = clickedTab.dataset.target
    
    console.log('🔥 switchTab called for target:', targetId)
    
    if (!targetId) {
      console.warn('⚠️ No target ID found on tab')
      return
    }
    
    // Trova l'indice del tab cliccato
    const tabIndex = this.tabTargets.indexOf(clickedTab)
    console.log('🎯 Tab index:', tabIndex)
    
    if (tabIndex >= 0) {
      this.activateTab(tabIndex, targetId)
    }
  }

  // Gestione eventi tastiera per navigazione
  keydown(event) {
    const currentTab = event.currentTarget
    const currentIndex = this.tabTargets.indexOf(currentTab)
    
    switch(event.key) {
      case "ArrowLeft":
        event.preventDefault()
        this.navigateLeft(currentIndex)
        break
        
      case "ArrowRight":
        event.preventDefault()
        this.navigateRight(currentIndex)
        break
        
      case "Home":
        event.preventDefault()
        this.navigateToFirst()
        break
        
      case "End":
        event.preventDefault()
        this.navigateToLast()
        break
        
      case "Enter":
      case " ": // Space
        event.preventDefault()
        this.switchTab(event)
        break
    }
  }

  // Attiva un tab specifico per indice
  activateTab(index, targetId = null) {
    if (index < 0 || index >= this.tabTargets.length) return
    
    const targetTab = this.tabTargets[index]
    const actualTargetId = targetId || targetTab.dataset.target
    
    if (!actualTargetId) return
    
    // Aggiorna l'indice attivo
    this.activeIndexValue = index
    
    // Aggiorna stati di tutti i tab
    this.updateTabStates(index)
    
    // Aggiorna visibilità di tutti i panel
    this.updatePanelStates(actualTargetId)
    
    // Focus sul tab attivato
    targetTab.focus()
  }

  // Naviga al tab precedente (con wrap-around)
  navigateLeft(currentIndex) {
    const newIndex = currentIndex <= 0 
      ? this.tabTargets.length - 1 
      : currentIndex - 1
    
    const targetTab = this.tabTargets[newIndex]
    const targetId = targetTab.dataset.target
    
    this.activateTab(newIndex, targetId)
  }

  // Naviga al tab successivo (con wrap-around)  
  navigateRight(currentIndex) {
    const newIndex = (currentIndex + 1) % this.tabTargets.length
    
    const targetTab = this.tabTargets[newIndex]
    const targetId = targetTab.dataset.target
    
    this.activateTab(newIndex, targetId)
  }

  // Naviga al primo tab
  navigateToFirst() {
    const targetTab = this.tabTargets[0]
    const targetId = targetTab.dataset.target
    
    this.activateTab(0, targetId)
  }

  // Naviga all'ultimo tab
  navigateToLast() {
    const lastIndex = this.tabTargets.length - 1
    const targetTab = this.tabTargets[lastIndex]
    const targetId = targetTab.dataset.target
    
    this.activateTab(lastIndex, targetId)
  }

  // Imposta il tab attivo iniziale
  setInitialActiveTab() {
    // Cerca un tab che ha già aria-selected="true"
    const activeTab = this.tabTargets.find(tab => 
      tab.getAttribute('aria-selected') === 'true'
    )
    
    if (activeTab) {
      const index = this.tabTargets.indexOf(activeTab)
      this.activeIndexValue = index
    } else {
      // Se nessun tab è attivo, attiva il primo
      this.activeIndexValue = 0
      if (this.tabTargets.length > 0) {
        const firstTab = this.tabTargets[0]
        const targetId = firstTab.dataset.target
        this.activateTab(0, targetId)
      }
    }
  }

  // Aggiorna gli stati ARIA e le classi CSS di tutti i tab
  updateTabStates(activeIndex) {
    this.tabTargets.forEach((tab, index) => {
      const isActive = index === activeIndex
      
      // Aggiorna ARIA attributes
      tab.setAttribute('aria-selected', isActive.toString())
      tab.setAttribute('tabindex', isActive ? '0' : '-1')
      
      // Aggiorna classi CSS per stato attivo/inattivo
      this.updateTabClasses(tab, isActive)
    })
  }

  // Aggiorna le classi CSS di un singolo tab
  updateTabClasses(tab, isActive) {
    // Rimuove tutte le classi di tema esistenti
    this.removeThemeClasses(tab)
    
    // Ottiene il tema dal tab
    const theme = this.getTabTheme(tab)
    
    // Applica le classi appropriate
    if (isActive) {
      this.applyActiveClasses(tab, theme)
    } else {
      this.applyInactiveClasses(tab, theme)
    }
  }

  // Aggiorna la visibilità di tutti i panel
  updatePanelStates(activeTargetId) {
    console.log('🔄 Updating panel states for:', activeTargetId)
    console.log('📋 Available panels:', this.panelTargets.map(p => p.id))
    
    this.panelTargets.forEach(panel => {
      const isActive = panel.id === activeTargetId
      console.log(`🎯 Panel ${panel.id}: ${isActive ? 'ACTIVE' : 'INACTIVE'}`)
      
      if (isActive) {
        panel.classList.remove('hidden')
        panel.classList.add('block')
        console.log(`✅ Panel ${panel.id} shown`)
      } else {
        panel.classList.remove('block')
        panel.classList.add('hidden')
        console.log(`❌ Panel ${panel.id} hidden`)
      }
    })
  }

  // Utility: rimuove classi di tema esistenti
  removeThemeClasses(tab) {
    // Lista delle possibili classi di tema da rimuovere
    const themeClasses = [
      'bg-white', 'bg-blue-600', 'bg-red-600', 'bg-green-600', 'bg-yellow-600',
      'bg-violet-600', 'bg-orange-600', 'bg-rose-600',
      'text-gray-900', 'text-white', 'text-gray-500', 'text-gray-700',
      'text-blue-600', 'text-blue-700', 'text-red-600', 'text-red-700',
      'text-green-600', 'text-green-700', 'text-yellow-600', 'text-yellow-700',
      'text-violet-600', 'text-violet-700', 'text-orange-600', 'text-orange-700',
      'text-rose-600', 'text-rose-700', 'text-gray-600',
      'shadow-sm', 'hover:text-gray-700', 'hover:text-blue-700', 'hover:text-red-700',
      'hover:text-green-700', 'hover:text-yellow-700', 'hover:text-violet-700',
      'hover:text-orange-700', 'hover:text-rose-700'
    ]
    
    tab.classList.remove(...themeClasses)
  }

  // Utility: ottiene il tema dal tab (default se non specificato)
  getTabTheme(tab) {
    // Controlla le classi esistenti per determinare il tema
    if (tab.classList.contains('text-blue-600')) return 'blue'
    if (tab.classList.contains('text-red-600')) return 'red'
    if (tab.classList.contains('text-green-600')) return 'green'
    if (tab.classList.contains('text-yellow-600')) return 'yellow'
    if (tab.classList.contains('text-violet-600')) return 'violet'
    if (tab.classList.contains('text-orange-600')) return 'orange'
    if (tab.classList.contains('text-rose-600')) return 'rose'
    if (tab.classList.contains('text-white')) return 'white'
    
    return 'default'
  }

  // Utility: applica classi per stato attivo
  applyActiveClasses(tab, theme) {
    const activeClasses = {
      default: ['bg-white', 'text-gray-900', 'shadow-sm'],
      blue: ['bg-blue-600', 'text-white'],
      red: ['bg-red-600', 'text-white'],
      green: ['bg-green-600', 'text-white'],
      yellow: ['bg-yellow-600', 'text-white'],
      violet: ['bg-violet-600', 'text-white'],
      orange: ['bg-orange-600', 'text-white'],
      rose: ['bg-rose-600', 'text-white'],
      white: ['bg-white', 'text-gray-900']
    }
    
    const classes = activeClasses[theme] || activeClasses.default
    tab.classList.add(...classes)
  }

  // Utility: applica classi per stato inattivo
  applyInactiveClasses(tab, theme) {
    const inactiveClasses = {
      default: ['text-gray-500', 'hover:text-gray-700'],
      blue: ['text-blue-600', 'hover:text-blue-700'],
      red: ['text-red-600', 'hover:text-red-700'],
      green: ['text-green-600', 'hover:text-green-700'],
      yellow: ['text-yellow-600', 'hover:text-yellow-700'],
      violet: ['text-violet-600', 'hover:text-violet-700'],
      orange: ['text-orange-600', 'hover:text-orange-700'],
      rose: ['text-rose-600', 'hover:text-rose-700'],
      white: ['text-gray-600', 'hover:text-gray-700']
    }
    
    const classes = inactiveClasses[theme] || inactiveClasses.default
    tab.classList.add(...classes)
  }
}
