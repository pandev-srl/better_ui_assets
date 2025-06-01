import { Controller } from "@hotwired/stimulus";

export class DropdownController extends Controller {
  connect() {
    this.element.textContent = "Hello World!";
  }
}
