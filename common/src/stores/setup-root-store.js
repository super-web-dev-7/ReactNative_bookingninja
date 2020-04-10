import {load, save} from "../lib/storage";
import {setRootStore} from "../services/reactotron";
import {onSnapshot} from "mobx-state-tree";
import SalesforceApi from "../services/api/salesforce";
import WaveApi from "../services/api/wave";
import RootStore from "./root";


/**
 * The key we'll be saving our state as within async storage.
 */
const ROOT_STATE_STORAGE_KEY = "root"

/**
 * Setup the root state.
 */
export async function setupRootStore(selectedOrg = 'production') {
    let rootStore
    let data

    // prepare the environment that will be associated with the RootStore.
    const env = await createEnvironment();
    try {
        // load data from storage
        data = (await load(ROOT_STATE_STORAGE_KEY)) || {}
        rootStore = RootStore.create(data, env)
    } catch (e) {
        // if there's any problems loading, then let's at least fallback to an empty state
        // instead of crashing.
        rootStore = RootStore.create({}, env)

        await rootStore.userStore.selectOrg(selectedOrg)

        // but please inform us what happened
        __DEV__ && console.error(e.message, null)
    }

    // reactotron logging
    __DEV__ && setRootStore(rootStore, data)

    //Put here stores, which don't save onSnapshot
    const unsaveStores = {}

    // track changes & save to storage
    onSnapshot(rootStore, snapshot => {
        save(ROOT_STATE_STORAGE_KEY, {...snapshot, ...unsaveStores})
    })

    return rootStore
}

/**
 * Setup the environment that all the models will be sharing.
 *
 * The environment includes other functions that will be picked from some
 * of the models that get created later. This is how we loosly couple things
 * like events between models.
 */
export async function createEnvironment() {
    const env = {
        salesforceApi: new SalesforceApi(),
        waveApi: new WaveApi(),
    }

    return env
}