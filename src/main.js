import { ExampleController } from "./example_controller";
import DropdownController from "./dropdown_controller.js";
import TabsController from "./tabs_controller.js";
import ModalController from "./modal_controller.js";
import SidebarController from "./sidebar_controller.js";
import AccordionController from "./accordion_controller.js";

export { ExampleController, DropdownController, TabsController, ModalController, SidebarController, AccordionController };

export function registerBetterUiComponents(application) {
  application.register("example", ExampleController);
  application.register("bui-dropdown", DropdownController);
  application.register("bui-tabs", TabsController);
  application.register("bui-modal", ModalController);
  application.register("bui-sidebar", SidebarController);
  application.register("bui-accordion", AccordionController);
}

console.log("CIAO");
