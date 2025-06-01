import { ExampleController } from "./example_controller";
import { DropdownController } from "./dropdown_controller";

export { ExampleController, DropdownController };

export function registerBetterUiComponents(application) {
  application.register("example", ExampleController);
  application.register("dropdown", DropdownController);
}

console.log("CIAO");
