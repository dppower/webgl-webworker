/// <reference path="../node_modules/typescript/lib/lib.webworker.d.ts"/>

import {platform, provide} from "angular2/core";
import {WORKER_APP_PLATFORM, WORKER_APP_APPLICATION} from "angular2/platform/worker_app";
import {GameEngine} from "./game-engine";

platform([WORKER_APP_PLATFORM])
    .application([WORKER_APP_APPLICATION])
    .bootstrap(GameEngine);