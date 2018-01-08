import { enableProdMode } from "@angular/core";
import { platformBrowser } from "@angular/platform-browser";
import { AppModuleNgFactory } from "./build-aot/app/app.module.ngfactory";

enableProdMode();
platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);