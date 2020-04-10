import {AsyncStorage} from "react-native"

/**
 * Loads a string from storage.
 *
 * @param key The key to fetch.
 */
export async function loadString(key) {
    try {
        return await AsyncStorage.getItem(key)
    } catch {
        // not sure why this would fail... even reading the RN docs I'm unclear
        return null
    }
}

/**
 * Saves a string to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export async function saveString(key, value) {
    try {
        await AsyncStorage.setItem(key, value)
        return true
    } catch {
        return false
    }
}

/**
 * Loads something from storage and runs it thru JSON.parse.
 *
 * @param key The key to fetch.
 */
export async function load(key) {
    try {
        const almostThere = await AsyncStorage.getItem(key)
        return JSON.parse(almostThere)
    } catch {
        return null
    }
}

/**
 * Saves an object to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export async function save(key, value) {
    try {
        if (typeof value === "object") {
            await AsyncStorage.setItem(key, JSON.stringify(value))
        } else {
            await AsyncStorage.setItem(key, value)
        }
        return true
    } catch {
        return false
    }
}

/**
 * Removes something from storage.
 *
 * @param key The key to kill.
 */
export async function remove(key) {
    try {
        await AsyncStorage.removeItem(key)
    } catch {
    }
}

/**
 * Burn it all to the ground.
 */
export async function clear() {
    try {
        await AsyncStorage.clear()
    } catch {
    }
}
