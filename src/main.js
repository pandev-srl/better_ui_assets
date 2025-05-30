import { Application } from "@hotwired/stimulus";
import { ExampleController } from "./example_controller";

export { ExampleController };

export function registerBetterUiComponents(application) {
  application.register("example", ExampleController);
}

console.log("CIAO");
