import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["input", "hiddenInput"]
  static values = { 
    length: Number,
    name: String,
    placeholder: String
  }

  connect() {
    this.initializeInputs()
    this.updateHiddenInput()
  }

  // Initialize input states and values
  initializeInputs() {
    this.inputTargets.forEach((input, index) => {
      // Set placeholder
      if (this.placeholderValue) {
        input.placeholder = this.placeholderValue
      }
      
      // Set input attributes
      input.setAttribute('maxlength', '1')
      input.setAttribute('autocomplete', 'off')
      input.setAttribute('inputmode', 'numeric')
      input.setAttribute('pattern', '[0-9]*')
      
      // Set data index for easier reference
      input.dataset.index = index
    })
  }

  // Handle input on each field
  inputChange(event) {
    const input = event.currentTarget
    const value = input.value
    const index = parseInt(input.dataset.index)
    
    // Only allow single digit and numeric
    if (value.length > 1 || !/^\d*$/.test(value)) {
      input.value = value.slice(-1).replace(/\D/g, '')
    }
    
    // Move to next input if digit entered
    if (input.value.length === 1 && index < this.lengthValue - 1) {
      this.focusInput(index + 1)
    }
    
    this.updateHiddenInput()
    this.checkCompletion()
  }

  // Handle keydown events (backspace, arrows, etc.)
  inputKeydown(event) {
    const input = event.currentTarget
    const index = parseInt(input.dataset.index)
    
    switch(event.key) {
      case 'Backspace':
        // If field is empty, move to previous field
        if (input.value === '' && index > 0) {
          event.preventDefault()
          this.focusInput(index - 1)
          this.inputTargets[index - 1].value = ''
          this.updateHiddenInput()
        }
        break
        
      case 'ArrowLeft':
        event.preventDefault()
        if (index > 0) {
          this.focusInput(index - 1)
        }
        break
        
      case 'ArrowRight':
        event.preventDefault()
        if (index < this.lengthValue - 1) {
          this.focusInput(index + 1)
        }
        break
        
      case 'ArrowUp':
      case 'ArrowDown':
        event.preventDefault()
        break
        
      case 'Delete':
        input.value = ''
        this.updateHiddenInput()
        break
        
      case 'Tab':
        // Allow normal tab behavior
        break
        
      default:
        // Only allow numeric keys
        if (!/^\d$/.test(event.key) && !['Backspace', 'Delete', 'Tab', 'Enter'].includes(event.key)) {
          event.preventDefault()
        }
    }
  }

  // Handle paste events
  inputPaste(event) {
    event.preventDefault()
    const paste = (event.clipboardData || window.clipboardData).getData('text')
    const digits = paste.replace(/\D/g, '').slice(0, this.lengthValue)
    
    if (digits.length > 0) {
      this.fillInputs(digits)
      this.updateHiddenInput()
      this.checkCompletion()
      
      // Focus on the next empty field or last field
      const nextIndex = Math.min(digits.length, this.lengthValue - 1)
      this.focusInput(nextIndex)
    }
  }

  // Fill inputs with provided digits
  fillInputs(digits) {
    this.inputTargets.forEach((input, index) => {
      input.value = digits[index] || ''
    })
  }

  // Focus specific input by index
  focusInput(index) {
    if (index >= 0 && index < this.inputTargets.length) {
      this.inputTargets[index].focus()
      this.inputTargets[index].select()
    }
  }

  // Update hidden input with combined value
  updateHiddenInput() {
    if (this.hasHiddenInputTarget) {
      const value = this.inputTargets.map(input => input.value).join('')
      this.hiddenInputTarget.value = value
    }
  }

  // Check if all fields are filled and dispatch completion event
  checkCompletion() {
    const value = this.inputTargets.map(input => input.value).join('')
    const isComplete = value.length === this.lengthValue
    
    // Add/remove completion styling
    this.element.classList.toggle('pin-complete', isComplete)
    
    // Dispatch completion event
    if (isComplete) {
      this.dispatch('complete', { 
        detail: { 
          value: value,
          element: this.element 
        } 
      })
    } else {
      this.dispatch('incomplete', { 
        detail: { 
          value: value,
          element: this.element 
        } 
      })
    }
  }

  // Public method to get current value
  getValue() {
    return this.inputTargets.map(input => input.value).join('')
  }

  // Public method to set value
  setValue(value) {
    const digits = value.toString().replace(/\D/g, '').slice(0, this.lengthValue)
    this.fillInputs(digits)
    this.updateHiddenInput()
    this.checkCompletion()
  }

  // Public method to clear all inputs
  clear() {
    this.inputTargets.forEach(input => {
      input.value = ''
    })
    this.updateHiddenInput()
    this.focusInput(0)
    this.element.classList.remove('pin-complete')
  }

  // Public method to focus first input
  focus() {
    this.focusInput(0)
  }

  // Handle form reset
  reset() {
    this.clear()
  }

  // Disable all inputs
  disable() {
    this.inputTargets.forEach(input => {
      input.disabled = true
    })
  }

  // Enable all inputs
  enable() {
    this.inputTargets.forEach(input => {
      input.disabled = false
    })
  }
}
