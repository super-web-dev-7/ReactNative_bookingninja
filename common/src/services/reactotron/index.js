import Tron from "reactotron-react-native";
import REACTOTRON_CONFIG from "./reactotron-config";
import {onSnapshot} from "mobx-state-tree";
import {mst} from "reactotron-mst";

/** Do Nothing. */
const noop = () => undefined;

// in dev, we attach Reactotron, in prod we attach a interface-compatible mock.
if (__DEV__) {
    console.tron = Tron // attach reactotron to `console.tron`
} else {
    // attach a mock so if things sneaky by our __DEV__ guards, we won't crash.
    console.tron = {
        benchmark: noop,
        clear: noop,
        close: noop,
        configure: noop,
        connect: noop,
        display: noop,
        error: noop,
        image: noop,
        log: noop,
        logImportant: noop,
        reportError: noop,
        use: noop,
        useReactNative: noop,
        warn: noop,
        overlay: noop
    }
}

/**
 * Hook into the root store for doing awesome state-related things.
 *
 * @param rootStore The root store
 * @param initialData Init Store data
 */
export function setRootStore(rootStore, initialData) {
    if (__DEV__) {
        const {initial, snapshots} = REACTOTRON_CONFIG.state
        const name = "ROOT STORE"

        // logging features
        if (initial) {
            console.tron.display({name, value: initialData, preview: "Initial State"})
        }
        // log state changes?
        if (snapshots) {
            onSnapshot(rootStore, snapshot => {
                console.tron.display({name, value: snapshot, preview: "New State"})
            })
        }

        console.tron.trackMstNode(rootStore)
    }
}


export default async function setupReactotron() {
    if (!__DEV__) return;

    Tron.configure({
        name: REACTOTRON_CONFIG.name || require("../../../../package.json").name,
        host: REACTOTRON_CONFIG.host,
    });

    // hookup middleware
    Tron.useReactNative({
        asyncStorage: REACTOTRON_CONFIG.useAsyncStorage ? undefined : false,
    });


    // ignore some chatty `mobx-state-tree` actions
    const RX = /postProcessSnapshot|@APPLY_SNAPSHOT/

    // hookup mobx-state-tree middleware
    Tron.use(
        mst({
            filter: event => RX.test(event.name) === false,
        }),
    )

    // connect to the app
    Tron.connect();

    // clear if we should
    if (REACTOTRON_CONFIG.clearOnLoad) {
        Tron.clear();
    }
}
