import { ExampleController } from "./example_controller";
import DropdownController from "./dropdown_controller.js";
import TabsController from "./tabs_controller.js";
import ModalController from "./modal_controller.js";

export { ExampleController, DropdownController, TabsController, ModalController };

export function registerBetterUiComponents(application) {
  application.register("example", ExampleController);
  application.register("bui-dropdown", DropdownController);
  application.register("bui-tabs", TabsController);
  application.register("bui-modal", ModalController);
}

console.log("CIAO");
