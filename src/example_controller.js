import { Controller } from "@hotwired/stimulus";

export class ExampleController extends Controller {
  connect() {
    this.element.textContent = "Hello World!";
  }
}
